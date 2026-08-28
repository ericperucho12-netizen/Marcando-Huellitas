document.addEventListener('DOMContentLoaded', () => {
    // Verificar que el usuario sea administrador
    const usuarioString = sessionStorage.getItem('usuarioActual');
    if (!usuarioString) {
        return;
    }
    try {
        const usuarioActual = JSON.parse(usuarioString);
        if (usuarioActual.rol && usuarioActual.rol.toUpperCase() === 'ADMIN') {
            const container = document.getElementById('tablaContactosBody');
            if (container) {
                cargarMensajesContacto();
            }
        }
    } catch(e) {
        console.error("Error al validar rol en contactos", e);
    }
});

async function cargarMensajesContacto() {
    const tbody = document.getElementById('tablaContactosBody');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">Cargando mensajes...</td></tr>';

    try {
        const token = sessionStorage.getItem('jwtToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const response = await fetch('/api/contacto', { headers });
        
        if (!response.ok) {
            throw new Error('Error al cargar los mensajes');
        }
        
        const mensajes = await response.json();
        
        if (mensajes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No hay mensajes de contacto.</td></tr>';
            return;
        }

        // Ordenar los más recientes primero
        mensajes.sort((a, b) => b.id - a.id);

        tbody.innerHTML = '';
        mensajes.forEach(msg => {
            const isLeido = msg.estado === 'LEIDO';
            const badgeClass = isLeido ? 'bg-success' : 'bg-warning text-dark';
            
            const fila = document.createElement('tr');
            // Resaltar la fila si no ha sido leída
            if (!isLeido) fila.classList.add('table-light', 'fw-medium');
            
            fila.innerHTML = `
                <td>#${msg.id}</td>
                <td>${msg.nombre}</td>
                <td><a href="mailto:${msg.email}">${msg.email}</a></td>
                <td>${msg.telefono}</td>
                <td><span class="badge ${badgeClass} rounded-pill">${msg.estado || 'NO_LEIDO'}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-info rounded-circle shadow-sm" onclick='verMensajeContacto(${JSON.stringify(msg).replace(/'/g, "&#39;")})' title="Ver Mensaje">
                        <i class="bi bi-eye text-white"></i>
                    </button>
                    <button class="btn btn-sm btn-success rounded-circle shadow-sm ms-2" onclick="marcarContactoLeido(${msg.id})" title="Marcar como Leído" ${isLeido ? 'disabled' : ''}>
                        <i class="bi bi-check2-all"></i>
                    </button>
                    <button class="btn btn-sm btn-danger rounded-circle shadow-sm ms-2" onclick="eliminarContacto(${msg.id})" title="Eliminar Mensaje">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(fila);
        });

    } catch (error) {
        console.error('Error:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4"><i class="bi bi-exclamation-triangle me-2"></i>Error de conexión.</td></tr>';
    }
}

function verMensajeContacto(msg) {
    const modalContent = document.getElementById('modalContenidoContacto');
    
    // Formatear la fecha si existe
    let fecha = 'Desconocida';
    if (msg.creadoEn) {
        fecha = new Date(msg.creadoEn).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' });
    }

    modalContent.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label text-muted small fw-bold text-uppercase">Remitente</label>
                <p class="mb-0 fs-5">${msg.nombre}</p>
            </div>
            <div class="col-md-6">
                <label class="form-label text-muted small fw-bold text-uppercase">Fecha de envío</label>
                <p class="mb-0">${fecha}</p>
            </div>
            <div class="col-md-6">
                <label class="form-label text-muted small fw-bold text-uppercase">Correo</label>
                <p class="mb-0"><a href="mailto:${msg.email}">${msg.email}</a></p>
            </div>
            <div class="col-md-6">
                <label class="form-label text-muted small fw-bold text-uppercase">Teléfono</label>
                <p class="mb-0">${msg.telefono}</p>
            </div>
            <div class="col-12 mt-4">
                <label class="form-label text-muted small fw-bold text-uppercase">Mensaje</label>
                <div class="p-3 bg-light rounded-3 shadow-sm border border-secondary border-opacity-10" style="white-space: pre-wrap; font-size: 1.05rem;">${msg.mensaje}</div>
            </div>
        </div>
        <div class="d-flex justify-content-end mt-4 pt-3 border-top">
            <a href="mailto:${msg.email}?subject=Respuesta%20a%20tu%20mensaje%20en%20Marcando%20Huellitas" class="btn btn-primary rounded-pill px-4">
                <i class="bi bi-reply-fill me-2"></i>Responder por Correo
            </a>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('verContactoModal'));
    modal.show();

    // Si no está leído, lo marcamos automáticamente al abrirlo
    if (msg.estado !== 'LEIDO') {
        marcarContactoLeido(msg.id, false); // false para no mostrar alerta
    }
}

async function marcarContactoLeido(id, showAlert = true) {
    try {
        const token = sessionStorage.getItem('jwtToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const response = await fetch(`/api/contacto/${id}/estado`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ estado: 'LEIDO' })
        });

        if (response.ok) {
            if (showAlert) {
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'El mensaje ha sido marcado como leído.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
            cargarMensajesContacto();
        } else {
            throw new Error('Error al actualizar');
        }
    } catch (error) {
        if (showAlert) {
            Swal.fire('Error', 'No se pudo actualizar el estado del mensaje.', 'error');
        }
    }
}

async function eliminarContacto(id) {
        const resultado = await Swal.fire({
        title: '¿Estás seguro de que deseas eliminar este mensaje?',
        text: 'Este mensaje se eliminará de forma permanente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#0d6efd',
        reverseButtons: true,

        customClass: {
            icon: 'icono-negro'
        }
    });
    if (!resultado.isConfirmed) return;

    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        const usuarioActual = JSON.parse(sessionStorage.getItem("usuarioActual"));
        const token = usuarioActual ? usuarioActual.token : null;
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const response = await fetch('/api/contacto/' + id, {
            method: 'DELETE',
            headers: headers
        });

        if (response.ok) {
            Swal.fire({
                title: '¡Eliminado!',
                text: 'El mensaje ha sido eliminado con éxito.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            cargarMensajesContacto();
        } else {
            throw new Error('Error al eliminar');
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar el mensaje.', 'error');
    }
}
