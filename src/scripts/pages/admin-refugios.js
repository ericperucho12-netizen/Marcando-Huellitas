// =========================================
// ADMINISTRACIÓN DE SOLICITUDES DE REFUGIOS
// =========================================

const REFUGIOS_SOLICITUDES_STORAGE =
    "huellitas_solicitudes_refugios";


let filtroActual = "TODAS";


// -----------------------------------------
// Obtener solicitudes
// -----------------------------------------
let solicitudesRefugiosCache = [];

async function obtenerSolicitudesRefugiosAPI() {
    try {
        const response = await fetch('http://localhost:8080/api/refugios');
        if (response.ok) {
            solicitudesRefugiosCache = await response.json();
            // Adaptar el campo 'estatus' a 'estadoSolicitud' que usa el frontend
            solicitudesRefugiosCache = solicitudesRefugiosCache.map(s => ({
                ...s,
                estadoSolicitud: s.estatus || 'PENDIENTE'
            }));
            renderizarSolicitudes();
        }
    } catch (error) {
        console.error("Error al obtener refugios de la API:", error);
    }
}

function obtenerSolicitudesRefugios() {
    return solicitudesRefugiosCache;
}

// -----------------------------------------
// Guardar solicitudes (Obsoleto en API)
// -----------------------------------------
function guardarSolicitudesRefugios(solicitudes) {
    // No-op, la base de datos se encarga
}


// -----------------------------------------
// Estado visual
// -----------------------------------------

function obtenerClaseEstado(estado) {

    switch (estado) {

        case "APROBADA":
            return "admin-status--aprobada";

        case "RECHAZADA":
            return "admin-status--rechazada";

        default:
            return "admin-status--pendiente";

    }

}


// -----------------------------------------
// Pintar solicitudes
// -----------------------------------------

function renderizarSolicitudes() {

    const contenedor =
        document.getElementById(
            "contenedorSolicitudes"
        );

    const estadoVacio =
        document.getElementById(
            "estadoVacioSolicitudes"
        );


    if (!contenedor || !estadoVacio) return;


    const solicitudes =
        obtenerSolicitudesRefugios();


    const filtradas =
        filtroActual === "TODAS"
            ? solicitudes
            : solicitudes.filter(
                solicitud =>
                    solicitud.estadoSolicitud === filtroActual
            );


    contenedor.innerHTML = "";


    if (filtradas.length === 0) {

        estadoVacio.classList.remove("d-none");

    } else {

        estadoVacio.classList.add("d-none");

    }


    filtradas.forEach(solicitud => {

        const card =
            document.createElement("article");

        card.className =
            "admin-solicitud-card";


        card.innerHTML = `

            <div class="admin-solicitud-top">

                <div>

                    <h3>
                        ${solicitud.nombre}
                    </h3>

                    <span class="admin-solicitud-tipo">
                        ${solicitud.tipo}
                    </span>

                </div>


                <span class="
                    admin-status
                    ${obtenerClaseEstado(
                        solicitud.estadoSolicitud
                    )}
                ">

                    ${solicitud.estadoSolicitud}

                </span>

            </div>


            <p class="admin-solicitud-dato">

                <i class="bi bi-person-fill"></i>

                ${solicitud.responsable}

            </p>


            <p class="admin-solicitud-dato">

                <i class="bi bi-geo-alt-fill"></i>

                ${solicitud.estado}

            </p>


            <p class="admin-solicitud-dato">

                <i class="bi bi-envelope-fill"></i>

                ${solicitud.correo}

            </p>


            <p class="admin-solicitud-descripcion">

                ${solicitud.descripcion}

            </p>


            <div class="mt-3 d-flex gap-2 justify-content-center align-items-center border-top pt-3 w-100">
                <button class="btn btn-sm btn-info" onclick='verRefugio(${JSON.stringify(solicitud).replace(/'/g, "&#39;")})' title="Ver Detalle">
                    <i class="bi bi-eye text-white"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="cambiarEstadoSolicitud('${solicitud.id}', 'APROBADA')" title="Aprobar" ${solicitud.estadoSolicitud === 'APROBADA' ? 'disabled' : ''}>
                    <i class="bi bi-check-lg"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="cambiarEstadoSolicitud('${solicitud.id}', 'RECHAZADA')" title="Rechazar" ${solicitud.estadoSolicitud === 'RECHAZADA' ? 'disabled' : ''}>
                    <i class="bi bi-x-lg"></i>
                </button>
                <button class="btn btn-sm btn-secondary" onclick="eliminarRefugio('${solicitud.id}')" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>

        `;


        contenedor.appendChild(card);

    });


    actualizarContadores();

}


// -----------------------------------------
// Contadores
// -----------------------------------------

function actualizarContadores() {

    const solicitudes =
        obtenerSolicitudesRefugios();


    const pendientes =
        solicitudes.filter(
            item =>
                item.estadoSolicitud === "PENDIENTE"
        ).length;


    const aprobadas =
        solicitudes.filter(
            item =>
                item.estadoSolicitud === "APROBADA"
        ).length;


    const rechazadas =
        solicitudes.filter(
            item =>
                item.estadoSolicitud === "RECHAZADA"
        ).length;


    document.getElementById(
        "contadorPendientes"
    ).textContent = pendientes;


    document.getElementById(
        "contadorAprobadas"
    ).textContent = aprobadas;


    document.getElementById(
        "contadorRechazadas"
    ).textContent = rechazadas;

}


// -----------------------------------------
// Cambiar estado
// -----------------------------------------

async function cambiarEstadoSolicitud(
    id,
    nuevoEstado
) {

    const solicitudes =
        obtenerSolicitudesRefugios();

    const solicitud =
        solicitudes.find(
            item =>
                String(item.id) === String(id)
        );

    if (!solicitud) return;

    try {
        const payload = { ...solicitud, estatus: nuevoEstado };
        const response = await fetch(`http://localhost:8080/api/refugios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            mostrarToastAdmin(`Estado cambiado a ${nuevoEstado}`);
            obtenerSolicitudesRefugiosAPI();
        } else {
            alert('Error al cambiar el estado en el servidor.');
        }
    } catch(e) {
        alert('Error de conexión con el servidor.');
    }
}


// -----------------------------------------
// Modal detalles
// -----------------------------------------

function mostrarDetalleSolicitud(id) {

    const solicitudes =
        obtenerSolicitudesRefugios();


    const solicitud =
        solicitudes.find(
            item =>
                Number(item.id) === Number(id)
        );


    if (!solicitud) return;


    const estado =
        document.getElementById(
            "modalDetalleEstado"
        );


    const titulo =
        document.getElementById(
            "modalDetalleTitulo"
        );


    const contenido =
        document.getElementById(
            "modalDetalleContenido"
        );


    estado.textContent =
        solicitud.estadoSolicitud;


    estado.className =
        `admin-status ${obtenerClaseEstado(
            solicitud.estadoSolicitud
        )}`;


    titulo.textContent =
        solicitud.nombre;


    contenido.innerHTML = `

        <div class="admin-detalle-grid">


            <div class="admin-detalle-item">

                <strong>
                    Tipo
                </strong>

                <span>
                    ${solicitud.tipo}
                </span>

            </div>


            <div class="admin-detalle-item">

                <strong>
                    Responsable
                </strong>

                <span>
                    ${solicitud.responsable}
                </span>

            </div>


            <div class="admin-detalle-item">

                <strong>
                    Correo
                </strong>

                <span>
                    ${solicitud.correo}
                </span>

            </div>


            <div class="admin-detalle-item">

                <strong>
                    Teléfono
                </strong>

                <span>
                    ${solicitud.telefono}
                </span>

            </div>


            <div class="admin-detalle-item admin-detalle-full">

                <strong>
                    Dirección
                </strong>

                <span>
                    ${solicitud.direccion},
                    ${solicitud.estado}
                </span>

            </div>


            <div class="admin-detalle-item admin-detalle-full">

                <strong>
                    Descripción
                </strong>

                <p>
                    ${solicitud.descripcion}
                </p>

            </div>


            <div class="admin-detalle-item">

                <strong>
                    Sitio web
                </strong>

                <span>
                    ${solicitud.sitio || "No proporcionado"}
                </span>

            </div>


            <div class="admin-detalle-item">

                <strong>
                    Instagram
                </strong>

                <span>
                    ${solicitud.instagram || "No proporcionado"}
                </span>

            </div>


            <div class="admin-detalle-item admin-detalle-full">

                <strong>
                    Facebook
                </strong>

                <span>
                    ${solicitud.facebook || "No proporcionado"}
                </span>

            </div>


        </div>

    `;


    const modalElement =
        document.getElementById(
            "modalDetalleRefugio"
        );


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}


// -----------------------------------------
// Toast
// -----------------------------------------

function mostrarToastAdmin(mensaje) {

    const toastElement =
        document.getElementById(
            "toastAdminRefugio"
        );


    const mensajeElement =
        document.getElementById(
            "toastAdminMensaje"
        );


    if (!toastElement || !mensajeElement) {
        return;
    }


    mensajeElement.textContent =
        mensaje;


    const toast =
        bootstrap.Toast.getOrCreateInstance(
            toastElement
        );


    toast.show();

}


// -----------------------------------------
// Eventos de tarjetas
// -----------------------------------------

function inicializarAccionesSolicitudes() {

    const contenedor =
        document.getElementById(
            "contenedorSolicitudes"
        );


    if (!contenedor) return;


    contenedor.addEventListener(
        "click",
        event => {

            const boton =
                event.target.closest(
                    "[data-action]"
                );


            if (!boton) return;


            const accion =
                boton.dataset.action;


            const id =
                boton.dataset.id;


            if (accion === "detalle") {

                mostrarDetalleSolicitud(id);

            }


            if (accion === "aprobar") {

                cambiarEstadoSolicitud(
                    id,
                    "APROBADA"
                );

            }


            if (accion === "rechazar") {

                cambiarEstadoSolicitud(
                    id,
                    "RECHAZADA"
                );

            }

        }
    );

}


// =========================================
// NUEVAS FUNCIONES PARA REFUGIOS
// =========================================

function verRefugio(solicitud) {
    document.getElementById('modalContenidoRefugio').innerHTML = `
        <form>
            <div class="text-center mb-4">
                <img src="${solicitud.imagenUrl || '../../assets/refugios/LaCasitadeCrispin.jpg'}" alt="Foto del Refugio" class="img-fluid rounded" style="max-height: 200px; object-fit: cover;">
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Nombre del Refugio</label>
                    <input type="text" class="form-control" value="${solicitud.nombre || ''}" readonly>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Responsable</label>
                    <input type="text" class="form-control" value="${solicitud.responsable || ''}" readonly>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Correo electrónico</label>
                    <input type="email" class="form-control" value="${solicitud.correo || ''}" readonly>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Teléfono</label>
                    <input type="text" class="form-control" value="${solicitud.telefono || ''}" readonly>
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label">Dirección</label>
                <input type="text" class="form-control" value="${solicitud.direccion || ''}" readonly>
            </div>
            <div class="mb-3">
                <label class="form-label">Estado / Municipio</label>
                <input type="text" class="form-control" value="${solicitud.estado || ''}" readonly>
            </div>
            <div class="mb-3">
                <label class="form-label">Tipo de Refugio</label>
                <input type="text" class="form-control" value="${solicitud.tipo || ''}" readonly>
            </div>
            <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea class="form-control" rows="4" readonly>${solicitud.descripcion || ''}</textarea>
            </div>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label">Sitio Web</label>
                    <input type="text" class="form-control" value="${solicitud.sitio || 'N/A'}" readonly>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Instagram</label>
                    <input type="text" class="form-control" value="${solicitud.instagram || 'N/A'}" readonly>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Facebook</label>
                    <input type="text" class="form-control" value="${solicitud.facebook || 'N/A'}" readonly>
                </div>
            </div>
        </form>
    `;
    const modal = new bootstrap.Modal(document.getElementById('verRefugioModal'));
    modal.show();
}

function editarRefugio(solicitud) {
    // Guardar datos temporales para que registro-refugio los pre-llene
    sessionStorage.setItem('editarRefugio', JSON.stringify(solicitud));
    window.location.href = '../community/registro-refugio.html?editId=' + solicitud.id;
}

function guardarEdicionRefugio() {
    const id = document.getElementById('editRefugioId').value;
    const nombre = document.getElementById('editRefugioNombre').value;
    const descripcion = document.getElementById('editRefugioDescripcion').value;
    const telefono = document.getElementById('editRefugioTelefono').value;
    const direccion = document.getElementById('editRefugioDireccion').value;
    
    const solicitudes = obtenerSolicitudesRefugios();
    const index = solicitudes.findIndex(item => String(item.id) === String(id));
    if (index === -1) return;
    
    solicitudes[index].nombre = nombre;
    solicitudes[index].descripcion = descripcion;
    solicitudes[index].telefono = telefono;
    solicitudes[index].direccion = direccion;
    
    guardarSolicitudesRefugios(solicitudes);
    renderizarSolicitudes();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('editarRefugioModal'));
    modal.hide();
    Swal.fire('¡Actualizado!', 'El refugio ha sido modificado exitosamente.', 'success');
}

async function eliminarRefugio(id) {
    const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Se eliminará esta solicitud permanentemente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
        try {
            const response = await fetch(`http://localhost:8080/api/refugios/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                obtenerSolicitudesRefugiosAPI();
                Swal.fire('¡Eliminada!', 'La solicitud ha sido eliminada.', 'success');
            } else {
                Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
            }
        } catch (e) {
            Swal.fire('Error', 'Error de conexión con el servidor.', 'error');
        }
    }
}

// Inicializar Filtros
function inicializarFiltros() {

    const botones =
        document.querySelectorAll(
            ".admin-filter-btn"
        );


    botones.forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                botones.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                boton.classList.add(
                    "active"
                );


                filtroActual =
                    boton.dataset.filtro;


                renderizarSolicitudes();

            }
        );

    });

}


// =========================================
// INICIO
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        obtenerSolicitudesRefugiosAPI();

        inicializarAccionesSolicitudes();

        inicializarFiltros();

    }
);