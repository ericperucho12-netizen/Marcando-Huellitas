document.addEventListener("DOMContentLoaded", () => {
    const layoutContainers = document.querySelectorAll("[data-template]");

    layoutContainers.forEach(container => {
        const templatePath = container.getAttribute("data-template");
        const rootPath = container.getAttribute("data-root") || container.getAttribute("data-base");
        const srcPath = container.getAttribute("data-src") || container.getAttribute("data-base");

        fetch(templatePath, { cache: 'no-cache' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${templatePath}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                let replacedHtml = html.replace(/\{\{root\}\}/g, rootPath);
                replacedHtml = replacedHtml.replace(/\{\{src\}\}/g, srcPath);
                replacedHtml = replacedHtml.replace(/\{\{base\}\}/g, rootPath);
                container.innerHTML = replacedHtml;

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

                // Leer sesion de forma segura
                let usuarioActual = null;
                try {
                    const raw = sessionStorage.getItem("usuarioActual");
                    if (raw && raw !== "[object Object]") {
                        usuarioActual = JSON.parse(raw);
                    } else if (raw === "[object Object]") {
                        sessionStorage.removeItem("usuarioActual");
                    }
                } catch (e) {
                    sessionStorage.removeItem("usuarioActual");
                }

                console.log("[Layout] rol:", usuarioActual ? usuarioActual.rol : "SIN SESION");

                const navLoginBtn = container.querySelector("#navLoginBtn");
                const navUserDropdown = container.querySelector("#navUserDropdown");
                const navUserName = container.querySelector("#navUserName");
                const navUserHeader = container.querySelector("#navUserHeader");
                const navLogoutBtn = container.querySelector("#navLogoutBtn");

                if (usuarioActual) {
                    if (navLoginBtn) navLoginBtn.classList.add("d-none");
                    if (navUserDropdown) {
                        navUserDropdown.classList.remove("d-none");
                        if (navUserName) navUserName.textContent = usuarioActual.nombre.split(" ")[0];
                        if (navUserHeader) navUserHeader.textContent = "Hola, " + usuarioActual.nombre;

                        if (usuarioActual.rol && usuarioActual.rol.toUpperCase() === "ADMIN") {
                            console.log("[Layout] Admin detectado - mostrando opciones");
                            const adminItems = container.querySelectorAll(".nav-admin-item");
                            const adminDividers = container.querySelectorAll(".nav-admin-divider");
                            console.log("[Layout] Items admin:", adminItems.length);
                            adminItems.forEach(item => item.classList.remove("d-none"));
                            adminDividers.forEach(item => item.classList.remove("d-none"));
                        }
                    }
                    if (navLogoutBtn) {
                        navLogoutBtn.addEventListener("click", function (e) {
                            e.preventDefault();
                            sessionStorage.removeItem("usuarioActual");
                            sessionStorage.removeItem("jwtToken");
                            localStorage.removeItem("marcandoHuellitasCart");
                            localStorage.removeItem("marcandoHuellitasMiniCartOpen");
                            window.location.reload();
                        });
                    }
                } else {
                    if (navLoginBtn) navLoginBtn.classList.remove("d-none");
                    if (navUserDropdown) navUserDropdown.classList.add("d-none");
                }

                container.querySelectorAll('a[href]').forEach(link => {
                    const href = link.getAttribute('href');
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
