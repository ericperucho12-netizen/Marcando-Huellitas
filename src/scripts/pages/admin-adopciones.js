// =========================================
// ADMINISTRACIÓN DE SOLICITUDES DE ADOPCIÓN
// =========================================

let solicitudesAdopcion = [];
let filtroAdopcionesActual = "TODAS";

document.addEventListener("DOMContentLoaded", () => {
    // Solo inicializar si estamos en la vista de adopciones
    const container = document.getElementById("contenedorSolicitudesAdopcion");
    if (!container) return;

    inicializarFiltrosAdopcion();
    cargarSolicitudesAdopcion();
});

// -----------------------------------------
// Inicializar Filtros
// -----------------------------------------
function inicializarFiltrosAdopcion() {
    const botones = document.querySelectorAll("#filtrosAdminAdopciones .admin-filter-btn");
    botones.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Quitar clase active a todos
            botones.forEach(b => b.classList.remove("active"));
            // Agregar active al clickeado
            e.target.classList.add("active");
            // Cambiar filtro actual
            filtroAdopcionesActual = e.target.getAttribute("data-filtro");
            // Renderizar
            renderizarSolicitudesAdopcion();
        });
    });
}

// -----------------------------------------
// Cargar desde Backend
// -----------------------------------------
async function cargarSolicitudesAdopcion() {
    try {
        const res = await fetch("http://localhost:8080/api/solicitudes_adopcion");
        if (!res.ok) throw new Error("Error al obtener solicitudes de adopción");
        solicitudesAdopcion = await res.json();
    } catch (error) {
        console.error(error);
        solicitudesAdopcion = [];
    }
    actualizarContadoresAdopcion();
    renderizarSolicitudesAdopcion();
}

// -----------------------------------------
// Actualizar Contadores
// -----------------------------------------
function actualizarContadoresAdopcion() {
    const pendientes = solicitudesAdopcion.filter(s => s.estado === "Pendiente").length;
    const aprobadas = solicitudesAdopcion.filter(s => s.estado === "Aprobada").length;
    const rechazadas = solicitudesAdopcion.filter(s => s.estado === "Rechazada").length;

    const elPendientes = document.getElementById("contadorAdopcionesPendientes");
    const elAprobadas = document.getElementById("contadorAdopcionesAprobadas");
    const elRechazadas = document.getElementById("contadorAdopcionesRechazadas");

    if (elPendientes) elPendientes.textContent = pendientes;
    if (elAprobadas) elAprobadas.textContent = aprobadas;
    if (elRechazadas) elRechazadas.textContent = rechazadas;
}

// -----------------------------------------
// Renderizar
// -----------------------------------------
function renderizarSolicitudesAdopcion() {
    const container = document.getElementById("contenedorSolicitudesAdopcion");
    const emptyState = document.getElementById("estadoVacioAdopciones");

    if (!container || !emptyState) return;
    container.innerHTML = "";

    // Filtrar array
    const filtradas = solicitudesAdopcion.filter(s => {
        if (filtroAdopcionesActual === "TODAS") return true;
        return s.estado === filtroAdopcionesActual;
    });

    if (filtradas.length === 0) {
        emptyState.classList.remove("d-none");
    } else {
        emptyState.classList.add("d-none");
        
        filtradas.forEach(solicitud => {
            const fechaFormateada = solicitud.creadoEn ? new Date(solicitud.creadoEn).toLocaleDateString() : "Desconocida";
            
            let colorEstado = "bg-warning text-dark"; // Pendiente
            if (solicitud.estado === "Aprobada") colorEstado = "bg-success text-white";
            if (solicitud.estado === "Rechazada") colorEstado = "bg-danger text-white";

            const cardHtml = `
                <article class="admin-solicitud-card p-4 mb-3 border rounded shadow-sm bg-white">
                    <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                        <h4 class="mb-0 fw-bold">Solicitud #${solicitud.id}</h4>
                        <span class="badge ${colorEstado}">${solicitud.estado}</span>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <strong>Mascota ID:</strong> ${solicitud.mascotaId} <br>
                            <strong>Usuario ID:</strong> ${solicitud.usuarioId} <br>
                            <strong>Teléfono:</strong> ${solicitud.telefono}
                        </div>
                        <div class="col-md-6 mb-2">
                            <strong>Fecha de Cita:</strong> ${fechaFormateada} <br>
                            <strong>Espacio:</strong> ${solicitud.direccion} <br>
                            <strong>Razones:</strong> ${solicitud.experiencia}
                        </div>
                    </div>
                    
                    <div class="mt-3 d-flex gap-2 justify-content-center align-items-center border-top pt-3">
                        <button class="btn btn-sm btn-info" onclick='verAdopcion(${JSON.stringify(solicitud).replace(/'/g, "&#39;")})' title="Ver Detalle">
                            <i class="bi bi-eye text-white"></i>
                        </button>
                        <button class="btn btn-sm btn-success" onclick="cambiarEstadoAdopcion(${solicitud.id}, 'Aprobada')" title="Aprobar" ${solicitud.estado === 'Aprobada' ? 'disabled' : ''}>
                            <i class="bi bi-check-lg"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="cambiarEstadoAdopcion(${solicitud.id}, 'Rechazada')" title="Rechazar" ${solicitud.estado === 'Rechazada' ? 'disabled' : ''}>
                            <i class="bi bi-x-lg"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="eliminarAdopcion(${solicitud.id})" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </article>
            `;
            container.innerHTML += cardHtml;
        });
    }
}

// -----------------------------------------
// Nuevas funciones para Adopciones
// -----------------------------------------

function verAdopcion(solicitud) {
    const fecha = solicitud.creadoEn
        ? new Date(solicitud.creadoEn).toLocaleString('es-MX', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })
        : 'No disponible';
    document.getElementById('modalContenidoAdopcion').innerHTML = `
        <form>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Usuario ID</label>
                    <input type="text" class="form-control" value="${solicitud.usuarioId || 'N/A'}" readonly>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Mascota solicitada (ID)</label>
                    <input type="text" class="form-control" value="${solicitud.mascotaId || 'N/A'}" readonly>
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label">Teléfono</label>
                <input type="tel" class="form-control" value="${solicitud.telefono || ''}" readonly>
            </div>
            <div class="mb-3">
                <label class="form-label">¿Cuenta con espacio adecuado?</label>
                <input type="text" class="form-control" value="${solicitud.direccion || ''}" readonly>
            </div>
            <div class="mb-3">
                <label class="form-label">¿Por qué deseas adoptar?</label>
                <textarea class="form-control" rows="3" readonly>${solicitud.experiencia || ''}</textarea>
            </div>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label">Estado</label>
                    <input type="text" class="form-control" value="${solicitud.estado || 'Pendiente'}" readonly>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Fecha de cita</label>
                    <input type="text" class="form-control" value="${solicitud.fechaCita ? new Date(solicitud.fechaCita).toLocaleString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'N/A'}" readonly>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Fecha de registro</label>
                    <input type="text" class="form-control" value="${fecha}" readonly>
                </div>
            </div>
        </form>
    `;
    const modal = new bootstrap.Modal(document.getElementById('verAdopcionModal'));
    modal.show();
}

function editarAdopcion(solicitud) {
    // Guardar datos temporales en sessionStorage para que el formulario los pre-llene
    sessionStorage.setItem('editarAdopcion', JSON.stringify(solicitud));
    window.location.href = '../community/RegistroAdopcion.html?editId=' + solicitud.id;
}

async function guardarEdicionAdopcion() {
    const id = document.getElementById('editAdopcionId').value;
    const direccion = document.getElementById('editAdopcionDireccion').value;
    const experiencia = document.getElementById('editAdopcionExperiencia').value;
    const telefono = document.getElementById('editAdopcionTelefono').value;
    
    // Obtenemos la solicitud actual para no perder el estado, la fecha, ni ids.
    const solicitudOriginal = solicitudesAdopcion.find(s => s.id == id);
    if (!solicitudOriginal) return;
    
    const payload = {
        ...solicitudOriginal,
        direccion,
        experiencia,
        telefono
    };
    
    try {
        const response = await fetch(`http://localhost:8080/api/solicitudes_adopcion/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editarAdopcionModal'));
            modal.hide();
            Swal.fire('¡Actualizado!', 'La solicitud de adopción ha sido modificada.', 'success');
            await cargarSolicitudesAdopcion();
            renderizarSolicitudesAdopcion();
            actualizarContadoresAdopcion();
        } else {
            throw new Error("Error en servidor");
        }
    } catch(err) {
        Swal.fire('Error', 'No se pudo guardar la adopción.', 'error');
    }
}

async function eliminarAdopcion(id) {
    const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Se eliminará la solicitud de adopción de forma permanente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
        try {
            const response = await fetch(`http://localhost:8080/api/solicitudes_adopcion/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('¡Eliminada!', 'La solicitud ha sido eliminada.', 'success');
                await cargarSolicitudesAdopcion();
                renderizarSolicitudesAdopcion();
                actualizarContadoresAdopcion();
            } else {
                throw new Error("No se pudo eliminar");
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al eliminar la solicitud.', 'error');
        }
    }
}

// -----------------------------------------
// Acciones (Aprobar/Rechazar)
// -----------------------------------------
async function cambiarEstadoAdopcion(id, nuevoEstado) {
    if (!confirm(`¿Estás seguro que deseas marcar esta solicitud como ${nuevoEstado}?`)) return;

    // Buscar la solicitud actual
    const solicitud = solicitudesAdopcion.find(s => s.id === id);
    if (!solicitud) return;

    // Actualizar objeto
    const payload = {
        ...solicitud,
        estado: nuevoEstado
    };

    try {
        const response = await fetch(`http://localhost:8080/api/solicitudes_adopcion/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Error al actualizar la solicitud");

        // Recargar datos
        await cargarSolicitudesAdopcion();

    } catch (error) {
        console.error(error);
        alert("Hubo un error al actualizar el estado.");
    }
}
