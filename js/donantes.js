async function cargarDonantes() {
    const tbody = document.querySelector('#tabla-donantes tbody');
    tbody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';
    try {
        const data = await apiGet('/donantes');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">Sin registros</td></tr>';
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
                    <button class="btn btn-danger btn-sm" onclick="eliminarDonante(${d.id})">Eliminar</button>
                </td>
            </tr>`;
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="5">Error al cargar</td></tr>';
    }
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
        await apiPost('/donantes', body);
        showToast('Donante registrado');
        e.target.reset();
        cargarDonantes();
    } catch (err) {
        showToast('Error al registrar', 'error');
    }
});
