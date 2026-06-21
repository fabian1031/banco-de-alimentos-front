let trabajadorEditandoId = null;

async function cargarTrabajadores() {
    const tbody = document.querySelector('#tabla-trabajadores tbody');
    tbody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';
    try {
        const data = await apiGet('/trabajadores');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">Sin registros</td></tr>';
            return;
        }
        data.forEach(t => {
            tbody.innerHTML += `
            <tr>
                <td>${t.id}</td>
                <td>${t.nombre}</td>
                <td>${t.cargo}</td>
                <td>${t.correo}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-1" onclick="editarTrabajador(${t.id}, '${t.nombre}', '${t.cargo}', '${t.correo}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarTrabajador(${t.id})">Eliminar</button>
                </td>
            </tr>`;
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="5">Error al cargar</td></tr>';
    }
}

function editarTrabajador(id, nombre, cargo, correo) {
    trabajadorEditandoId = id;
    document.getElementById('t-nombre').value = nombre;
    document.getElementById('t-cargo').value = cargo;
    document.getElementById('t-correo').value = correo;
    document.getElementById('btn-trabajador').textContent = 'Actualizar';
    document.getElementById('btn-cancelar-trabajador').classList.remove('d-none');
    document.getElementById('t-nombre').scrollIntoView({ behavior: 'smooth' });
}

function cancelarTrabajador() {
    trabajadorEditandoId = null;
    document.getElementById('form-trabajador').reset();
    document.getElementById('btn-trabajador').textContent = 'Registrar';
    document.getElementById('btn-cancelar-trabajador').classList.add('d-none');
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
        if (trabajadorEditandoId) {
            await apiPut(`/trabajadores/${trabajadorEditandoId}`, body);
            showToast('Trabajador actualizado');
            cancelarTrabajador();
        } else {
            await apiPost('/trabajadores', body);
            showToast('Trabajador registrado');
            e.target.reset();
        }
        cargarTrabajadores();
    } catch (err) {
        showToast('Error al guardar', 'error');
    }
});
