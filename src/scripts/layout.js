// Inyectar el loader inmediatamente
(function() {
    // 1. Inyectar CSS del loader
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    // Determinar la ruta base según donde estamos
    const depth = window.location.pathname.split('/').length - 2;
    const prefix = depth > 0 && !window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' ? '../'.repeat(depth) : './';
    
    // Si estamos en src/pages/, el root es ../../
    let rootPath = '.';
    if (window.location.pathname.includes('/src/pages/')) {
        rootPath = '../..';
    }
    
    cssLink.href = `${rootPath}/src/styles/loader.css`;
    document.head.appendChild(cssLink);

    // 2. Inyectar HTML del loader
    const loader = document.createElement('div');
    loader.id = 'page-loader-overlay';
    loader.innerHTML = `
        <div class="loader-main">
            <div class="loader-dog">
                <div class="loader-dog__paws">
                    <div class="loader-dog__bl-leg loader-leg">
                        <div class="loader-dog__bl-paw loader-paw"></div>
                        <div class="loader-dog__bl-top loader-top"></div>
                    </div>
                    <div class="loader-dog__fl-leg loader-leg">
                        <div class="loader-dog__fl-paw loader-paw"></div>
                        <div class="loader-dog__fl-top loader-top"></div>
                    </div>
                    <div class="loader-dog__fr-leg loader-leg">
                        <div class="loader-dog__fr-paw loader-paw"></div>
                        <div class="loader-dog__fr-top loader-top"></div>
                    </div>
                </div>
                <div class="loader-dog__body">
                    <div class="loader-dog__tail"></div>
                </div>
                <div class="loader-dog__head">
                    <div class="loader-dog__snout">
                        <div class="loader-dog__eyes">
                            <div class="loader-dog__eye-l"></div>
                            <div class="loader-dog__eye-r"></div>
                        </div>
                    </div>
                </div>
                <div class="loader-dog__head-c">
                    <div class="loader-dog__ear-r"></div>
                    <div class="loader-dog__ear-l"></div>
                </div>
            </div>
        </div>
    `;
    
    // Intentar añadirlo lo más pronto posible
    if (document.body) {
        document.body.appendChild(loader);
    } else {
        document.documentElement.appendChild(loader);
    }

    // 3. Remover el loader cuando cargue la página completa
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 600);
        }, 500); // Pequeño delay para asegurar que todo el render se sienta suave
    });
})();

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
