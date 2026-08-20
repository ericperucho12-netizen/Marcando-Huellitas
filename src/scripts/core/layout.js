document.addEventListener("DOMContentLoaded", () => {
    const layoutContainers = document.querySelectorAll("[data-template]");

    layoutContainers.forEach(container => {
        const templatePath = container.getAttribute("data-template");
        const rootPath = container.getAttribute("data-root") || container.getAttribute("data-base");
        const srcPath = container.getAttribute("data-src") || container.getAttribute("data-base");

        fetch(templatePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${templatePath}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                // Reemplazar variables de ruta
                let replacedHtml = html.replace(/\{\{root\}\}/g, rootPath);
                replacedHtml = replacedHtml.replace(/\{\{src\}\}/g, srcPath);
                replacedHtml = replacedHtml.replace(/\{\{base\}\}/g, rootPath);
                container.innerHTML = replacedHtml;

                // Marcar el enlace activo según la página actual
                const currentPage = window.location.pathname;
                const currentFile = currentPage.split('/').pop().replace('.html', '') || 'index';

                const navLinks = container.querySelectorAll('[data-nav-page]');
                navLinks.forEach(link => {
                    const linkPage = link.getAttribute('data-nav-page');
                    link.classList.remove('active-link', 'text-secondary');

                    if (linkPage === currentFile || (currentFile === '' && linkPage === 'index')) {
                        link.classList.add('active-link');
                    } else {
                        link.classList.add('text-secondary');
                    }
                });

                // Lógica de Autenticación en la Barra de Navegación
                const usuarioActual = JSON.parse(sessionStorage.getItem("usuarioActual"));
                const navLoginBtn = container.querySelector("#navLoginBtn");
                const navUserDropdown = container.querySelector("#navUserDropdown");
                const navUserName = container.querySelector("#navUserName");
                const navUserHeader = container.querySelector("#navUserHeader");
                const navLogoutBtn = container.querySelector("#navLogoutBtn");

                if (usuarioActual) {
                    if (navLoginBtn) navLoginBtn.classList.add("d-none");
                    if (navUserDropdown) {
                        navUserDropdown.classList.remove("d-none");
                        if (navUserName) navUserName.textContent = usuarioActual.nombre.split(" ")[0]; // Mostrar solo el primer nombre
                        if (navUserHeader) navUserHeader.textContent = "Hola, " + usuarioActual.nombre;
                        
                        // Si es administrador, revelar las opciones extra
                        if (usuarioActual.rol === "admin") {
                            console.log("👑 Rol admin detectado en layout.js");
                            const adminItems = container.querySelectorAll(".nav-admin-item");
                            const adminDividers = container.querySelectorAll(".nav-admin-divider");
                            console.log("🔍 Encontrados items admin:", adminItems.length);
                            adminItems.forEach(item => item.classList.remove("d-none"));
                            adminDividers.forEach(item => item.classList.remove("d-none"));
                        }
                    }
                    if (navLogoutBtn) {
                        navLogoutBtn.addEventListener("click", function(e) {
                            e.preventDefault();
                            sessionStorage.removeItem("usuarioActual");
                            window.location.reload();
                        });
                    }
                } else {
                    if (navLoginBtn) navLoginBtn.classList.remove("d-none");
                    if (navUserDropdown) navUserDropdown.classList.add("d-none");
                }

                // Animación de salida al hacer clic en cualquier enlace interno
                container.querySelectorAll('a[href]').forEach(link => {
                    const href = link.getAttribute('href');
                    // Solo interceptar enlaces a páginas del mismo sitio (no anclas ni externos)
                    if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
                        link.addEventListener('click', function (e) {
                            e.preventDefault();
                            const destination = this.getAttribute('href');
                            document.body.classList.add('page-leaving');
                            setTimeout(() => {
                                window.location.href = destination;
                            }, 260);
                        });
                    }
                });
            })
            .catch(error => {
                console.error("Error loading layout:", error);
                container.innerHTML = `<p class="text-danger text-center">Error cargando el componente: ${templatePath}</p>`;
            });
    });
});
