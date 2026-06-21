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
                <td><button class="btn btn-danger btn-sm" onclick="eliminarBeneficiario(${b.id})">Eliminar</button></td>
            </tr>`;
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="7">Error al cargar</td></tr>';
    }
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
    };
    try {
        await apiPost('/beneficiarios', body);
        showToast('Beneficiario registrado');
        e.target.reset();
        cargarBeneficiarios();
    } catch (err) {
        showToast('Error al registrar', 'error');
    }
});
