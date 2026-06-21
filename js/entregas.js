let entregaEditandoId = null;

async function cargarEntregas() {
    const tbody = document.querySelector('#tabla-entregas tbody');
    tbody.innerHTML = '<tr><td colspan="7">Cargando...</td></tr>';
    try {
        const data = await apiGet('/entregas');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Sin registros</td></tr>';
            return;
        }
        data.forEach(e => {
            tbody.innerHTML += `
            <tr>
                <td>${e.id}</td>
                <td>${e.fechaEntrega}</td>
                <td>${e.nombreBeneficiario}</td>
                <td>${e.nivelVulnerabilidad}</td>
                <td>${e.nombreTrabajador}</td>
                <td>${e.observaciones || '-'}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-1" onclick="editarEntrega(${e.id}, '${e.observaciones || ''}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarEntrega(${e.id})">Eliminar</button>
                </td>
            </tr>`;
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7">Error al cargar</td></tr>';
    }
}

async function cargarSelectsBeneficiariosTrabajadores() {
    const selB = document.getElementById('e-beneficiario');
    const selT = document.getElementById('e-trabajador');
    selB.innerHTML = '<option value="">Seleccione beneficiario</option>';
    selT.innerHTML = '<option value="">Seleccione trabajador</option>';

    const [beneficiarios, trabajadores] = await Promise.all([
        apiGet('/beneficiarios'),
        apiGet('/trabajadores')
    ]);

    beneficiarios.forEach(b => {
        selB.innerHTML += `<option value="${b.id}">${b.nombre} ${b.apellido}</option>`;
    });
    trabajadores.forEach(t => {
        selT.innerHTML += `<option value="${t.id}">${t.nombre}</option>`;
    });
}

function editarEntrega(id, observaciones) {
    entregaEditandoId = id;
    document.getElementById('e-observaciones').value = observaciones;
    document.getElementById('e-beneficiario').disabled = true;
    document.getElementById('e-trabajador').disabled = true;
    document.getElementById('btn-entrega').textContent = 'Actualizar';
    document.getElementById('btn-cancelar-entrega').classList.remove('d-none');
    document.getElementById('e-observaciones').scrollIntoView({ behavior: 'smooth' });
}

function cancelarEntrega() {
    entregaEditandoId = null;
    document.getElementById('form-entrega').reset();
    document.getElementById('e-beneficiario').disabled = false;
    document.getElementById('e-trabajador').disabled = false;
    document.getElementById('btn-entrega').textContent = 'Registrar';
    document.getElementById('btn-cancelar-entrega').classList.add('d-none');
}

async function eliminarEntrega(id) {
    if (!confirm('¿Eliminar entrega?')) return;
    try {
        await apiDelete(`/entregas/${id}`);
        showToast('Entrega eliminada');
        cargarEntregas();
    } catch (e) {
        showToast('Error al eliminar', 'error');
    }
}

document.getElementById('form-entrega').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        if (entregaEditandoId) {
            await apiPut(`/entregas/${entregaEditandoId}`, {
                observaciones: document.getElementById('e-observaciones').value
            });
            showToast('Entrega actualizada');
            cancelarEntrega();
        } else {
            await apiPost('/entregas', {
                beneficiarioId: parseInt(document.getElementById('e-beneficiario').value),
                trabajadorId: parseInt(document.getElementById('e-trabajador').value),
                observaciones: document.getElementById('e-observaciones').value,
            });
            showToast('Entrega registrada');
            e.target.reset();
        }
        cargarEntregas();
    } catch (err) {
        showToast('Error al guardar', 'error');
    }
});
