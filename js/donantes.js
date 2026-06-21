let donanteEditandoId = null;

async function cargarDonantes() {
    const tbody = document.querySelector('#tabla-donantes tbody');
    tbody.innerHTML = '<tr><td colspan="6">Cargando...</td></tr>';
    try {
        const data = await apiGet('/donantes');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Sin registros</td></tr>';
            return;
        }
        data.forEach(d => {
            tbody.innerHTML += `
            <tr>
                <td>${d.id}</td>
                <td>${d.nombreDonante}</td>
                <td>${d.tipoDonante}</td>
                <td>${d.nitDocumento || '-'}</td>
                <td>${d.telefono || '-'}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-1" onclick="editarDonante(${d.id}, '${d.nombreDonante}', '${d.tipoDonante}', '${d.nitDocumento || ''}', '${d.telefono || ''}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarDonante(${d.id})">Eliminar</button>
                </td>
            </tr>`;
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="6">Error al cargar</td></tr>';
    }
}

function editarDonante(id, nombre, tipo, nit, telefono) {
    donanteEditandoId = id;
    document.getElementById('d-nombre').value = nombre;
    document.getElementById('d-tipo').value = tipo;
    document.getElementById('d-nit').value = nit;
    document.getElementById('d-telefono').value = telefono;
    document.getElementById('btn-donante').textContent = 'Actualizar';
    document.getElementById('btn-cancelar-donante').classList.remove('d-none');
    document.getElementById('d-nombre').scrollIntoView({ behavior: 'smooth' });
}

function cancelarDonante() {
    donanteEditandoId = null;
    document.getElementById('form-donante').reset();
    document.getElementById('btn-donante').textContent = 'Registrar';
    document.getElementById('btn-cancelar-donante').classList.add('d-none');
}

async function eliminarDonante(id) {
    if (!confirm('¿Eliminar donante?')) return;
    try {
        await apiDelete(`/donantes/${id}`);
        showToast('Donante eliminado');
        cargarDonantes();
    } catch (e) {
        showToast('Error al eliminar', 'error');
    }
}

document.getElementById('form-donante').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        nombreDonante: document.getElementById('d-nombre').value,
        tipoDonante: document.getElementById('d-tipo').value,
        nitDocumento: document.getElementById('d-nit').value,
        telefono: document.getElementById('d-telefono').value,
    };
    try {
        if (donanteEditandoId) {
            await apiPut(`/donantes/${donanteEditandoId}`, body);
            showToast('Donante actualizado');
            cancelarDonante();
        } else {
            await apiPost('/donantes', body);
            showToast('Donante registrado');
            e.target.reset();
        }
        cargarDonantes();
    } catch (err) {
        showToast('Error al guardar', 'error');
    }
});
