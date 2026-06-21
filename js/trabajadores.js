async function cargarTrabajadores() {
    const tbody = document.querySelector('#tabla-trabajadores tbody');
    tbody.innerHTML = '<tr><td colspan="4">Cargando...</td></tr>';
    try {
        const data = await apiGet('/trabajadores');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">Sin registros</td></tr>';
            return;
        }
        data.forEach(t => {
            tbody.innerHTML += `
            <tr>
                <td>${t.id}</td>
                <td>${t.nombre}</td>
                <td>${t.cargo}</td>
                <td>${t.correo}</td>
                <td><button class="btn btn-danger btn-sm" onclick="eliminarTrabajador(${t.id})">Eliminar</button></td>
            </tr>`;
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="4">Error al cargar</td></tr>';
    }
}

async function eliminarTrabajador(id) {
    if (!confirm('¿Eliminar trabajador?')) return;
    try {
        await apiDelete(`/trabajadores/${id}`);
        showToast('Trabajador eliminado');
        cargarTrabajadores();
    } catch (e) {
        showToast('Error al eliminar', 'error');
    }
}

document.getElementById('form-trabajador').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        nombre: document.getElementById('t-nombre').value,
        cargo: document.getElementById('t-cargo').value,
        correo: document.getElementById('t-correo').value,
    };
    try {
        await apiPost('/trabajadores', body);
        showToast('Trabajador registrado');
        e.target.reset();
        cargarTrabajadores();
    } catch (err) {
        showToast('Error al registrar', 'error');
    }
});
