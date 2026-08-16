// Inyectar el loader inmediatamente
(function() {
    // 1. Inyectar CSS del loader
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    // Determinar la ruta base según donde estamos
    const rootPath = window.location.pathname.includes('/src/pages/') ? '../..' : '.';
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
    
    // Añadir el loader
    document.documentElement.appendChild(loader);

    // 3. Remover el loader cuando cargue la página completa
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 600);
        }, 300); // Pequeño delay para asegurar transición suave
    });
})();
