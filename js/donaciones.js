async function cargarDonaciones() {
    const tbody = document.querySelector('#tabla-donaciones tbody');
    tbody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';
    try {
        const data = await apiGet('/donaciones');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">Sin registros</td></tr>';
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
                <td><button class="btn btn-danger btn-sm" onclick="eliminarDonacion(${d.id})">Eliminar</button></td>
            </tr>`;
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="5">Error al cargar</td></tr>';
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
    const body = {
        donanteId: parseInt(document.getElementById('don-donante').value),
        totalItems: parseInt(document.getElementById('don-items').value),
    };
    try {
        await apiPost('/donaciones', body);
        showToast('Donación registrada');
        e.target.reset();
        cargarDonaciones();
    } catch (err) {
        showToast('Error al registrar', 'error');
    }
});
