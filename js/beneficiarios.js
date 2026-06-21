let beneficiarioEditandoId = null;

async function cargarBeneficiarios() {
    const tbody = document.querySelector('#tabla-beneficiarios tbody');
    tbody.innerHTML = '<tr><td colspan="7">Cargando...</td></tr>';
    try {
        const data = await apiGet('/beneficiarios');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Sin registros</td></tr>';
            return;
        }
        data.forEach(b => {
            const badge = b.estado === 'ACTIVO'
                ? '<span class="badge bg-success">ACTIVO</span>'
                : '<span class="badge bg-secondary">INACTIVO</span>';
            tbody.innerHTML += `
            <tr>
                <td>${b.id}</td>
                <td>${b.nombre} ${b.apellido}</td>
                <td>${b.numeroDocumento}</td>
                <td>${b.nivelVulnerabilidad}</td>
                <td>${b.numeroIntegrantes}</td>
                <td>${badge}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-1" onclick="editarBeneficiario(${b.id}, '${b.nombre}', '${b.apellido}', '${b.nivelVulnerabilidad}', ${b.numeroIntegrantes}, '${b.estado}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarBeneficiario(${b.id})">Eliminar</button>
                </td>
            </tr>`;
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="7">Error al cargar</td></tr>';
    }
}

function editarBeneficiario(id, nombre, apellido, vulnerabilidad, integrantes, estado) {
    beneficiarioEditandoId = id;
    document.getElementById('b-nombre').value = nombre;
    document.getElementById('b-apellido').value = apellido;
    document.getElementById('b-vulnerabilidad').value = vulnerabilidad;
    document.getElementById('b-integrantes').value = integrantes;
    document.getElementById('b-estado').value = estado;
    document.getElementById('b-estado').classList.remove('d-none');
    document.getElementById('label-estado').classList.remove('d-none');
    document.getElementById('btn-beneficiario').textContent = 'Actualizar';
    document.getElementById('btn-cancelar-beneficiario').classList.remove('d-none');
    document.getElementById('b-nombre').scrollIntoView({ behavior: 'smooth' });
}

function cancelarBeneficiario() {
    beneficiarioEditandoId = null;
    document.getElementById('form-beneficiario').reset();
    document.getElementById('b-estado').classList.add('d-none');
    document.getElementById('label-estado').classList.add('d-none');
    document.getElementById('btn-beneficiario').textContent = 'Registrar';
    document.getElementById('btn-cancelar-beneficiario').classList.add('d-none');
}

async function eliminarBeneficiario(id) {
    if (!confirm('¿Eliminar beneficiario?')) return;
    try {
        await apiDelete(`/beneficiarios/${id}`);
        showToast('Beneficiario eliminado');
        cargarBeneficiarios();
    } catch (e) {
        showToast('Error al eliminar', 'error');
    }
}

document.getElementById('form-beneficiario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        nombre: document.getElementById('b-nombre').value,
        apellido: document.getElementById('b-apellido').value,
        numeroDocumento: document.getElementById('b-documento').value,
        nivelVulnerabilidad: document.getElementById('b-vulnerabilidad').value,
        numeroIntegrantes: parseInt(document.getElementById('b-integrantes').value),
        estado: beneficiarioEditandoId ? document.getElementById('b-estado').value : 'ACTIVO',
    };
    try {
        if (beneficiarioEditandoId) {
            await apiPut(`/beneficiarios/${beneficiarioEditandoId}`, body);
            showToast('Beneficiario actualizado');
            cancelarBeneficiario();
        } else {
            await apiPost('/beneficiarios', body);
            showToast('Beneficiario registrado');
            e.target.reset();
        }
        cargarBeneficiarios();
    } catch (err) {
        showToast('Error al guardar', 'error');
    }
});
