async function cargarEntregas() {
    const tbody = document.querySelector('#tabla-entregas tbody');
    tbody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';
    try {
        const data = await apiGet('/entregas');
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">Sin registros</td></tr>';
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
                <td><button class="btn btn-danger btn-sm" onclick="eliminarEntrega(${e.id})">Eliminar</button></td>
            </tr>`;
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5">Error al cargar</td></tr>';
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
    const body = {
        beneficiarioId: parseInt(document.getElementById('e-beneficiario').value),
        trabajadorId: parseInt(document.getElementById('e-trabajador').value),
        observaciones: document.getElementById('e-observaciones').value,
    };
    try {
        await apiPost('/entregas', body);
        showToast('Entrega registrada');
        e.target.reset();
        cargarEntregas();
    } catch (err) {
        showToast('Error al registrar', 'error');
    }
});
