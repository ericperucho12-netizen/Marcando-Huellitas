// =========================================
// ADMINISTRACIÓN DE SOLICITUDES DE REFUGIOS
// =========================================

const REFUGIOS_SOLICITUDES_STORAGE =
    "huellitas_solicitudes_refugios";


let filtroActual = "TODAS";


// -----------------------------------------
// Obtener solicitudes
// -----------------------------------------

function obtenerSolicitudesRefugios() {

    try {

        return JSON.parse(
            localStorage.getItem(
                REFUGIOS_SOLICITUDES_STORAGE
            )
        ) || [];

    } catch (error) {

        console.error(
            "No se pudieron leer las solicitudes:",
            error
        );

        return [];

    }

}


// -----------------------------------------
// Guardar solicitudes
// -----------------------------------------

function guardarSolicitudesRefugios(solicitudes) {

    localStorage.setItem(
        REFUGIOS_SOLICITUDES_STORAGE,
        JSON.stringify(solicitudes)
    );

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


            <div class="admin-solicitud-actions">

                <button
                    class="admin-btn admin-btn-detalle"
                    data-action="detalle"
                    data-id="${solicitud.id}">

                    <i class="bi bi-eye-fill"></i>

                    Ver detalles

                </button>


                ${
                    solicitud.estadoSolicitud === "PENDIENTE"
                        ? `

                        <button
                            class="admin-btn admin-btn-aprobar"
                            data-action="aprobar"
                            data-id="${solicitud.id}">

                            <i class="bi bi-check-lg"></i>

                            Aprobar

                        </button>


                        <button
                            class="admin-btn admin-btn-rechazar"
                            data-action="rechazar"
                            data-id="${solicitud.id}">

                            <i class="bi bi-x-lg"></i>

                            Rechazar

                        </button>

                        `
                        : ""
                }

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

function cambiarEstadoSolicitud(
    id,
    nuevoEstado
) {

    const solicitudes =
        obtenerSolicitudesRefugios();


    const solicitud =
        solicitudes.find(
            item =>
                Number(item.id) === Number(id)
        );


    if (!solicitud) return;


    solicitud.estadoSolicitud =
        nuevoEstado;


    solicitud.fechaRevision =
        new Date().toISOString();


    guardarSolicitudesRefugios(
        solicitudes
    );


    renderizarSolicitudes();


    const mensaje =
        nuevoEstado === "APROBADA"
            ? "Solicitud aprobada correctamente."
            : "Solicitud rechazada.";


    mostrarToastAdmin(mensaje);

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


// -----------------------------------------
// Filtros
// -----------------------------------------

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

        renderizarSolicitudes();

        inicializarAccionesSolicitudes();

        inicializarFiltros();

    }
);