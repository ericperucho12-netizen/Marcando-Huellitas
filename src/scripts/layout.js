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
