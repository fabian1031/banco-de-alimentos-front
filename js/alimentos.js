let alimentoEditandoId = null;

async function cargarAlimentos() {
    const tbody = document.querySelector('#tabla-alimentos tbody');
    tbody.innerHTML = '<tr><td colspan="7">Cargando...</td></tr>';
    try {
        const data = await apiGet('/alimentos');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Sin registros</td></tr>';
            return;
        }
        data.forEach(a => {
            const badge = a.estadoApto === 'SI'
                ? '<span class="badge bg-success">SI</span>'
                : '<span class="badge bg-danger">NO</span>';
            tbody.innerHTML += `
            <tr>
                <td>${a.id}</td>
                <td>${a.nombreAlimento}</td>
                <td>${a.tipo}</td>
                <td>${a.fechaVencimiento}</td>
                <td>${a.unidadMedida}</td>
                <td>${badge}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-1" onclick="editarAlimento(${a.id}, '${a.nombreAlimento}', '${a.tipo}', '${a.fechaVencimiento}', '${a.unidadMedida}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarAlimento(${a.id})">Eliminar</button>
                </td>
            </tr>`;
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="7">Error al cargar</td></tr>';
    }
}

function editarAlimento(id, nombre, tipo, vencimiento, unidad) {
    alimentoEditandoId = id;
    document.getElementById('a-nombre').value = nombre;
    document.getElementById('a-tipo').value = tipo;
    document.getElementById('a-vencimiento').value = vencimiento;
    document.getElementById('a-unidad').value = unidad;
    document.getElementById('btn-alimento').textContent = 'Actualizar';
    document.getElementById('btn-cancelar-alimento').classList.remove('d-none');
    document.getElementById('a-nombre').scrollIntoView({ behavior: 'smooth' });
}

function cancelarAlimento() {
    alimentoEditandoId = null;
    document.getElementById('form-alimento').reset();
    document.getElementById('btn-alimento').textContent = 'Registrar';
    document.getElementById('btn-cancelar-alimento').classList.add('d-none');
}

async function eliminarAlimento(id) {
    if (!confirm('¿Eliminar alimento?')) return;
    try {
        await apiDelete(`/alimentos/${id}`);
        showToast('Alimento eliminado');
        cargarAlimentos();
    } catch (e) {
        showToast('Error al eliminar', 'error');
    }
}

document.getElementById('form-alimento').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        nombreAlimento: document.getElementById('a-nombre').value,
        tipo: document.getElementById('a-tipo').value,
        fechaVencimiento: document.getElementById('a-vencimiento').value,
        unidadMedida: document.getElementById('a-unidad').value,
    };
    try {
        if (alimentoEditandoId) {
            await apiPut(`/alimentos/${alimentoEditandoId}`, body);
            showToast('Alimento actualizado');
            cancelarAlimento();
        } else {
            await apiPost('/alimentos', body);
            showToast('Alimento registrado');
            e.target.reset();
        }
        cargarAlimentos();
    } catch (err) {
        showToast('Error al guardar', 'error');
    }
});
