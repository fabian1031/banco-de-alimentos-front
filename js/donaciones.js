let donacionEditandoId = null;

async function cargarDonaciones() {
    const tbody = document.querySelector('#tabla-donaciones tbody');
    tbody.innerHTML = '<tr><td colspan="6">Cargando...</td></tr>';
    try {
        const data = await apiGet('/donaciones');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Sin registros</td></tr>';
            return;
        }
        data.forEach(d => {
            tbody.innerHTML += `
            <tr>
                <td>${d.id}</td>
                <td>${d.fechaDonacion}</td>
                <td>${d.nombreDonante}</td>
                <td>${d.tipoDonante}</td>
                <td>${d.totalItems}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-1" onclick="editarDonacion(${d.id}, ${d.totalItems})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarDonacion(${d.id})">Eliminar</button>
                </td>
            </tr>`;
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="6">Error al cargar</td></tr>';
    }
}

async function cargarSelectDonantes() {
    const sel = document.getElementById('don-donante');
    sel.innerHTML = '<option value="">Seleccione donante</option>';
    const data = await apiGet('/donantes');
    data.forEach(d => {
        sel.innerHTML += `<option value="${d.id}">${d.nombreDonante}</option>`;
    });
}

function editarDonacion(id, totalItems) {
    donacionEditandoId = id;
    document.getElementById('don-items').value = totalItems;
    document.getElementById('don-donante').disabled = true;
    document.getElementById('btn-donacion').textContent = 'Actualizar';
    document.getElementById('btn-cancelar-donacion').classList.remove('d-none');
    document.getElementById('don-items').scrollIntoView({ behavior: 'smooth' });
}

function cancelarDonacion() {
    donacionEditandoId = null;
    document.getElementById('form-donacion').reset();
    document.getElementById('don-donante').disabled = false;
    document.getElementById('btn-donacion').textContent = 'Registrar';
    document.getElementById('btn-cancelar-donacion').classList.add('d-none');
}

async function eliminarDonacion(id) {
    if (!confirm('¿Eliminar donación?')) return;
    try {
        await apiDelete(`/donaciones/${id}`);
        showToast('Donación eliminada');
        cargarDonaciones();
    } catch (e) {
        showToast('Error al eliminar', 'error');
    }
}

document.getElementById('form-donacion').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        if (donacionEditandoId) {
            await apiPut(`/donaciones/${donacionEditandoId}`, {
                totalItems: parseInt(document.getElementById('don-items').value)
            });
            showToast('Donación actualizada');
            cancelarDonacion();
        } else {
            await apiPost('/donaciones', {
                donanteId: parseInt(document.getElementById('don-donante').value),
                totalItems: parseInt(document.getElementById('don-items').value),
            });
            showToast('Donación registrada');
            e.target.reset();
        }
        cargarDonaciones();
    } catch (err) {
        showToast('Error al guardar', 'error');
    }
});
