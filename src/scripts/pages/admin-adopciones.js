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
                    
                    ${solicitud.estado === "Pendiente" ? `
                        <div class="mt-3 d-flex gap-2 justify-content-end border-top pt-3">
                            <button class="btn btn-outline-danger" onclick="cambiarEstadoAdopcion(${solicitud.id}, 'Rechazada')">Rechazar</button>
                            <button class="btn btn-success" onclick="cambiarEstadoAdopcion(${solicitud.id}, 'Aprobada')">Aprobar</button>
                        </div>
                    ` : ''}
                </article>
            `;
            container.innerHTML += cardHtml;
        });
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
