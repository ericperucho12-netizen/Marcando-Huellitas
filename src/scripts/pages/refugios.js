// =========================================
// PÁGINA DE REFUGIOS
// Galería + registro de organizaciones
// =========================================


// =========================================
// CONFIGURACIÓN LOCAL STORAGE
// =========================================

const REFUGIOS_SOLICITUDES_STORAGE =
    "huellitas_solicitudes_refugios";



// =========================================
// GALERÍA DE IMÁGENES
// =========================================

function inicializarGaleriasRefugios() {

    const refugios =
        document.querySelectorAll(
            ".refugio-card"
        );


    refugios.forEach(refugio => {

        const imagenPrincipal =
            refugio.querySelector(
                ".refugio-photo-main img"
            );


        const miniaturas =
            refugio.querySelectorAll(
                ".refugio-gallery img"
            );


        if (!imagenPrincipal) {
            return;
        }


        miniaturas.forEach(miniatura => {


            // Cursor visual

            miniatura.style.cursor =
                "pointer";


            miniatura.addEventListener(
                "click",
                () => {


                    // Guardamos los datos
                    // de la imagen principal

                    const srcPrincipal =
                        imagenPrincipal.src;


                    const altPrincipal =
                        imagenPrincipal.alt;



                    // La miniatura pasa
                    // a ser imagen principal

                    imagenPrincipal.src =
                        miniatura.src;


                    imagenPrincipal.alt =
                        miniatura.alt;



                    // La imagen anterior
                    // pasa a la miniatura

                    miniatura.src =
                        srcPrincipal;


                    miniatura.alt =
                        altPrincipal;


                }
            );

        });

    });

}



// =========================================
// FORMULARIO DE REGISTRO
// =========================================

function inicializarFormularioRefugio() {


    const form =
        document.getElementById(
            "formRegistroRefugio"
        );


    if (!form) {
        return;
    }



    const descripcion =
        document.getElementById(
            "descripcionRefugio"
        );


    const contador =
        document.getElementById(
            "contadorDescripcion"
        );



    // =====================================
    // CONTADOR DE DESCRIPCIÓN
    // =====================================

    if (
        descripcion &&
        contador
    ) {


        descripcion.addEventListener(
            "input",
            () => {


                contador.textContent =
                    `${descripcion.value.length} / 300`;


            }
        );

    }



    // =====================================
    // ENVÍO DEL FORMULARIO
    // =====================================

    form.addEventListener(
        "submit",
        event => {


            event.preventDefault();



            // =================================
            // VALIDAR FORMULARIO
            // =================================

            if (!form.checkValidity()) {


                form.classList.add(
                    "was-validated"
                );


                return;

            }



            // =================================
            // CREAR OBJETO DE SOLICITUD
            // =================================

            const solicitud = {


                id:
                    Date.now(),


                nombre:
                    document
                        .getElementById(
                            "nombreRefugio"
                        )
                        .value
                        .trim(),


                responsable:
                    document
                        .getElementById(
                            "responsableRefugio"
                        )
                        .value
                        .trim(),


                correo:
                    document
                        .getElementById(
                            "correoRefugio"
                        )
                        .value
                        .trim(),


                telefono:
                    document
                        .getElementById(
                            "telefonoRefugio"
                        )
                        .value
                        .trim(),


                direccion:
                    document
                        .getElementById(
                            "direccionRefugio"
                        )
                        .value
                        .trim(),


                estado:
                    document
                        .getElementById(
                            "estadoRefugio"
                        )
                        .value
                        .trim(),


                tipo:
                    document
                        .getElementById(
                            "tipoRefugio"
                        )
                        .value,


                descripcion:
                    descripcion
                        .value
                        .trim(),


                sitio:
                    document
                        .getElementById(
                            "sitioRefugio"
                        )
                        .value
                        .trim(),


                instagram:
                    document
                        .getElementById(
                            "instagramRefugio"
                        )
                        .value
                        .trim(),


                facebook:
                    document
                        .getElementById(
                            "facebookRefugio"
                        )
                        .value
                        .trim(),


                // Toda solicitud nueva
                // empieza pendiente

                estadoSolicitud:
                    "PENDIENTE",


                fechaSolicitud:
                    new Date()
                        .toISOString()


            };



            // =================================
            // RECUPERAR SOLICITUDES EXISTENTES
            // =================================

            let solicitudesGuardadas = [];


            try {


                solicitudesGuardadas =
                    JSON.parse(

                        localStorage.getItem(
                            REFUGIOS_SOLICITUDES_STORAGE
                        )

                    ) || [];


            } catch (error) {


                console.error(
                    "Error leyendo las solicitudes:",
                    error
                );


                solicitudesGuardadas = [];

            }



            // =================================
            // AGREGAR NUEVA SOLICITUD
            // =================================

            solicitudesGuardadas.push(
                solicitud
            );



            // =================================
            // GUARDAR EN LOCAL STORAGE
            // =================================

            localStorage.setItem(

                REFUGIOS_SOLICITUDES_STORAGE,

                JSON.stringify(
                    solicitudesGuardadas
                )

            );



            // =================================
            // LIMPIAR FORMULARIO
            // =================================

            form.reset();


            form.classList.remove(
                "was-validated"
            );


            if (contador) {

                contador.textContent =
                    "0 / 300";

            }



            // =================================
            // CERRAR MODAL
            // =================================

            const modalElement =
                document.getElementById(
                    "modalRegistroRefugio"
                );


            if (modalElement) {


                const modal =
                    bootstrap.Modal
                        .getInstance(
                            modalElement
                        );


                if (modal) {

                    modal.hide();

                }

            }



            // =================================
            // MOSTRAR TOAST
            // =================================

            const toastElement =
                document.getElementById(
                    "toastRegistroRefugio"
                );


            if (toastElement) {


                const toast =
                    bootstrap.Toast
                        .getOrCreateInstance(
                            toastElement
                        );


                toast.show();

            }



            // =================================
            // DEBUG
            // =================================

            console.log(
                "Solicitud registrada:",
                solicitud
            );


        }
    );

}



// =========================================
// LIMPIAR VALIDACIÓN AL CERRAR MODAL
// =========================================

function inicializarLimpiezaModal() {


    const modal =
        document.getElementById(
            "modalRegistroRefugio"
        );


    const form =
        document.getElementById(
            "formRegistroRefugio"
        );


    const contador =
        document.getElementById(
            "contadorDescripcion"
        );


    if (
        !modal ||
        !form
    ) {
        return;
    }



    modal.addEventListener(
        "hidden.bs.modal",
        () => {


            form.classList.remove(
                "was-validated"
            );


            if (contador) {

                contador.textContent =
                    `${
                        document
                            .getElementById(
                                "descripcionRefugio"
                            )
                            ?.value.length || 0
                    } / 300`;

            }


        }
    );

}



// =========================================
// INICIALIZACIÓN
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        // Galería de las casitas

        inicializarGaleriasRefugios();



        // Formulario de registro

        inicializarFormularioRefugio();



        // Limpieza visual del modal

        inicializarLimpiezaModal();


    }
);
