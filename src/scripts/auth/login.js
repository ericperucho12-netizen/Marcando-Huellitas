document.addEventListener("DOMContentLoaded", () => {

    const layoutContainers =
        document.querySelectorAll("[data-template]");


    layoutContainers.forEach(container => {

        const templatePath =
            container.getAttribute("data-template");

        const rootPath =
            container.getAttribute("data-root") ||
            container.getAttribute("data-base");

        const srcPath =
            container.getAttribute("data-src") ||
            container.getAttribute("data-base");


        fetch(templatePath)

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        `Failed to load ${templatePath}: ${response.statusText}`
                    );

                }

                return response.text();

            })

            .then(html => {

                // =========================================
                // REEMPLAZAR VARIABLES DE RUTA
                // =========================================

                let replacedHtml =
                    html.replace(
                        /\{\{root\}\}/g,
                        rootPath
                    );

                replacedHtml =
                    replacedHtml.replace(
                        /\{\{src\}\}/g,
                        srcPath
                    );

                replacedHtml =
                    replacedHtml.replace(
                        /\{\{base\}\}/g,
                        rootPath
                    );


                container.innerHTML =
                    replacedHtml;



                // =========================================
                // MARCAR ENLACE ACTIVO
                // =========================================

                const currentPage =
                    window.location.pathname;

                const currentFile =
                    currentPage
                        .split("/")
                        .pop()
                        .replace(".html", "") ||
                    "index";


                const navLinks =
                    container.querySelectorAll(
                        "[data-nav-page]"
                    );


                navLinks.forEach(link => {

                    const linkPage =
                        link.getAttribute(
                            "data-nav-page"
                        );


                    link.classList.remove(
                        "active-link",
                        "text-secondary"
                    );


                    if (
                        linkPage === currentFile ||
                        (
                            currentFile === "" &&
                            linkPage === "index"
                        )
                    ) {

                        link.classList.add(
                            "active-link"
                        );

                    } else {

                        link.classList.add(
                            "text-secondary"
                        );

                    }

                });



                // =========================================
                // AUTENTICACIÓN DEL NAVBAR
                // =========================================

                let usuarioActual = null;


                try {

                    const usuarioGuardado =
                        sessionStorage.getItem(
                            "usuarioActual"
                        );


                    if (usuarioGuardado) {

                        usuarioActual =
                            JSON.parse(
                                usuarioGuardado
                            );

                    }

                } catch (error) {

                    console.error(
                        "Error al leer usuarioActual:",
                        error
                    );

                }



                // Elementos de autenticación

                const navLoginBtn =
                    container.querySelector(
                        "#navLoginBtn"
                    );


                const navUserDropdown =
                    container.querySelector(
                        "#navUserDropdown"
                    );


                const navUserName =
                    container.querySelector(
                        "#navUserName"
                    );


                const navUserHeader =
                    container.querySelector(
                        "#navUserHeader"
                    );


                const navLogoutBtn =
                    container.querySelector(
                        "#navLogoutBtn"
                    );



                // =========================================
                // ELEMENTOS EXCLUSIVOS DE ADMIN
                // =========================================

                const adminItems =
                    container.querySelectorAll(
                        ".nav-admin-item"
                    );


                const adminDividers =
                    container.querySelectorAll(
                        ".nav-admin-divider"
                    );



                // =========================================
                // USUARIO LOGUEADO
                // =========================================

                if (usuarioActual) {


                    // Ocultar "Iniciar sesión"

                    if (navLoginBtn) {

                        navLoginBtn.classList.add(
                            "d-none"
                        );

                    }



                    // Mostrar dropdown del usuario

                    if (navUserDropdown) {

                        navUserDropdown.classList.remove(
                            "d-none"
                        );

                    }



                    // Mostrar primer nombre

                    if (
                        navUserName &&
                        usuarioActual.nombre
                    ) {

                        navUserName.textContent =
                            usuarioActual.nombre
                                .split(" ")[0];

                    }



                    // Encabezado del dropdown

                    if (
                        navUserHeader &&
                        usuarioActual.nombre
                    ) {

                        navUserHeader.textContent =
                            "Hola, " +
                            usuarioActual.nombre;

                    }



                    // =========================================
                    // USUARIO ADMINISTRADOR
                    // =========================================

                    if (
                        usuarioActual.rol ===
                        "admin"
                    ) {


                        adminItems.forEach(
                            item => {

                                item.classList.remove(
                                    "d-none"
                                );

                            }
                        );


                        adminDividers.forEach(
                            divider => {

                                divider.classList.remove(
                                    "d-none"
                                );

                            }
                        );


                    } else {


                        // Usuario normal:
                        // esconder opciones admin

                        adminItems.forEach(
                            item => {

                                item.classList.add(
                                    "d-none"
                                );

                            }
                        );


                        adminDividers.forEach(
                            divider => {

                                divider.classList.add(
                                    "d-none"
                                );

                            }
                        );

                    }



                    // =========================================
                    // CERRAR SESIÓN
                    // =========================================

                    if (navLogoutBtn) {

                        navLogoutBtn.addEventListener(
                            "click",
                            function (event) {

                                event.preventDefault();


                                sessionStorage.removeItem(
                                    "usuarioActual"
                                );


                                // Mandar al inicio

                                window.location.href =
                                    rootPath +
                                    "/index.html";

                            }
                        );

                    }


                } else {


                    // =========================================
                    // NO HAY USUARIO LOGUEADO
                    // =========================================


                    if (navLoginBtn) {

                        navLoginBtn.classList.remove(
                            "d-none"
                        );

                    }


                    if (navUserDropdown) {

                        navUserDropdown.classList.add(
                            "d-none"
                        );

                    }


                    // Asegurar que opciones admin
                    // no sean visibles

                    adminItems.forEach(
                        item => {

                            item.classList.add(
                                "d-none"
                            );

                        }
                    );


                    adminDividers.forEach(
                        divider => {

                            divider.classList.add(
                                "d-none"
                            );

                        }
                    );

                }



                // =========================================
                // ANIMACIÓN DE SALIDA
                // =========================================

                container
                    .querySelectorAll(
                        "a[href]"
                    )
                    .forEach(link => {


                        const href =
                            link.getAttribute(
                                "href"
                            );


                        // No interceptar:
                        // - #
                        // - enlaces externos
                        // - mailto
                        // - javascript

                        if (
                            href &&
                            !href.startsWith("#") &&
                            !href.startsWith("http") &&
                            !href.startsWith("mailto") &&
                            !href.startsWith("javascript")
                        ) {


                            link.addEventListener(
                                "click",
                                function (event) {


                                    event.preventDefault();


                                    const destination =
                                        this.getAttribute(
                                            "href"
                                        );


                                    document.body.classList.add(
                                        "page-leaving"
                                    );


                                    setTimeout(
                                        () => {

                                            window.location.href =
                                                destination;

                                        },
                                        260
                                    );

                                }
                            );

                        }

                    });

            })


            // =========================================
            // ERROR AL CARGAR TEMPLATE
            // =========================================

            .catch(error => {

                console.error(
                    "Error loading layout:",
                    error
                );


                container.innerHTML = `
                    <p class="text-danger text-center">
                        Error cargando el componente:
                        ${templatePath}
                    </p>
                `;

            });

    });

});