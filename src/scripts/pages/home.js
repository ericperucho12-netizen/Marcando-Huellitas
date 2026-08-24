document.addEventListener('DOMContentLoaded', () => {
    
    // Contenedores
    const petCarouselContainer = document.getElementById('petCarouselContainer');
    const productCarouselContainer = document.getElementById('productCarouselContainer');

    // Cargar Mascotas
    async function cargarMascotas() {
        try {
            const response = await fetch('http://localhost:8080/api/mascotas');
            if (!response.ok) throw new Error('Error al obtener mascotas');
            
            const mascotas = await response.json();
            renderMascotas(mascotas);
        } catch (error) {
            console.error('Error fetching mascotas:', error);
            if (petCarouselContainer) {
                petCarouselContainer.innerHTML = `<p class="text-danger text-center w-100 mt-4">No se pudieron cargar las mascotas. Intenta de nuevo más tarde.</p>`;
            }
        }
    }

    // Cargar Productos
    async function cargarProductos() {
        try {
            const response = await fetch('http://localhost:8080/api/productos');
            if (!response.ok) throw new Error('Error al obtener productos');
            
            const productos = await response.json();
            renderProductos(productos);
        } catch (error) {
            console.error('Error fetching productos:', error);
            if (productCarouselContainer) {
                productCarouselContainer.innerHTML = `<p class="text-danger text-center w-100 mt-4">No se pudieron cargar los productos. Intenta de nuevo más tarde.</p>`;
            }
        }
    }

    function renderMascotas(mascotas) {
        if (!petCarouselContainer) return;
        
        petCarouselContainer.innerHTML = "";
        
        if (mascotas.length === 0) {
            petCarouselContainer.innerHTML = `<p class="text-muted text-center w-100 mt-4">No hay mascotas disponibles en este momento.</p>`;
            return;
        }

        mascotas.forEach(mascota => {
            const imgSrc = mascota.imagenUrl || "src/assets/footer/Huellita-footer.png";
            
            let badgeHtml = '';
            if (mascota.estado) {
                if (mascota.estado.toLowerCase() === 'disponible') {
                    badgeHtml = `<span class="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill" style="background-color: #bce9cc; color: #1f6b3d; font-size: 0.75rem; z-index: 10;">${mascota.estado}</span>`;
                } else if (mascota.estado.toLowerCase() === 'en proceso') {
                    badgeHtml = `<span class="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill" style="background-color: #ffc4a3; color: #d35400; font-size: 0.75rem; z-index: 10;">${mascota.estado}</span>`;
                } else if (mascota.estado.toLowerCase() === 'urgente') {
                    badgeHtml = `<span class="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill" style="background-color: #f1c0e8; color: #a13d96; font-size: 0.75rem; z-index: 10;">${mascota.estado}</span>`;
                } else {
                    badgeHtml = `<span class="badge bg-secondary position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill" style="font-size: 0.75rem; z-index: 10;">${mascota.estado}</span>`;
                }
            }

            const cardHTML = `
                <div style="scroll-snap-align: start; min-width: 280px; width: 300px; flex-shrink: 0;" class="pet-item" data-category="${mascota.especie ? mascota.especie.toLowerCase() : 'perro'}">
                    <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden team-card position-relative">
                        ${badgeHtml}
                        <button class="position-absolute top-0 end-0 m-2 shadow-sm btn-like-heart"
                            style="width: 28px; height: 28px; min-width: 28px; background: white; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;">
                            <i class="bi bi-heart text-secondary" style="font-size: 0.75rem;"></i>
                        </button>
                        <img src="${imgSrc}" class="card-img-top" alt="${mascota.nombre}" style="height: 220px; object-fit: cover;" onerror="this.src='src/assets/footer/Huellita-footer.png'">
                        <div class="card-body bg-white d-flex flex-column">
                            <h3 class="h5 fw-bold text-dark mb-1" style="font-family: var(--font-titles);">${mascota.nombre}</h3>
                            <p class="text-muted small mb-3">${mascota.raza || 'Mestizo'} · ${mascota.edad || 'Desconocida'}</p>

                            <div class="d-flex flex-wrap gap-1 mb-3">
                                <span class="badge bg-pastel-green text-dark px-2 py-1 small">Vacunado ✓</span>
                            </div>

                            <a href="/src/pages/community/adpciones.html"
                                class="btn btn-hero w-100 mt-auto btn-conoce-mas text-white text-decoration-none"
                                style="border-radius: 20px; background-color: #ff8e6a; border: none;">
                                Conocer más
                            </a>
                        </div>
                    </div>
                </div>
            `;
            petCarouselContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    function renderProductos(productos) {
        if (!productCarouselContainer) return;
        
        productCarouselContainer.innerHTML = "";
        
        if (productos.length === 0) {
            productCarouselContainer.innerHTML = `<p class="text-muted text-center w-100 mt-4">No hay productos disponibles en este momento.</p>`;
            return;
        }

        productos.forEach(producto => {
            const imgSrc = producto.imagenUrl || "src/assets/footer/Huellita-footer.png";
            
            let catColor = "#e04b7b"; // default color
            if (producto.categoria && producto.categoria.toLowerCase() === 'ropa') catColor = "#4fc08d";
            if (producto.categoria && producto.categoria.toLowerCase() === 'alimentos') catColor = "#f39c12";

            const cardHTML = `
                <div style="scroll-snap-align: start; min-width: 280px; width: 300px; flex-shrink: 0;">
                    <div class="card h-100 border-0"
                        style="border-radius:16px;overflow:hidden;transition:transform .2s; background-color:#fff; box-shadow: 0 4px 15px rgba(0,0,0,0.05);"
                        onmouseover="this.style.transform='translateY(-4px)'"
                        onmouseout="this.style.transform='translateY(0)'">
                        <div class="position-relative"
                            style="background-color: #f8f9fa; border-bottom: 1px solid #f0f0f0;">
                            <img src="${imgSrc}" class="card-img-top"
                                style="height:250px; object-fit:cover;" alt="${producto.nombre}" onerror="this.src='src/assets/footer/Huellita-footer.png'">
                            <span
                                class="position-absolute rounded-circle d-flex align-items-center justify-content-center btn-like-heart"
                                style="background:rgba(255,255,255,0.7); width:32px; height:32px; top:12px; right:12px; cursor:pointer;">
                                <i class="bi bi-heart text-secondary"></i>
                            </span>
                        </div>
                        <div class="card-body p-4 d-flex flex-column">
                            <p class="mb-2 fw-bold text-uppercase"
                                style="font-size:.75rem; color:${catColor}; letter-spacing: 0.5px;">${producto.categoria || 'Producto'}</p>
                            <h6 class="title fw-bold mb-3 flex-grow-1"
                                style="font-size:1.1rem; color:#2b2b2b; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; line-height:1.4;">
                                ${producto.nombre}</h6>
                            <div class="mb-3 d-flex align-items-center" style="color:#ffb800;font-size:.9rem;">
                                <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i
                                    class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i
                                    class="bi bi-star-fill"></i>
                                <small class="text-muted ms-2" style="font-size: 0.8rem;">(5.0)</small>
                            </div>
                            <div class="d-flex align-items-end justify-content-between mt-auto">
                                <span class="fw-bold" style="font-size:1.3rem;color:#1f6b3d;">$${parseFloat(producto.precio).toFixed(2)} MXN</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productCarouselContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    function initInteractivity() {
        const heartButtons = document.querySelectorAll('.btn-like-heart');
        heartButtons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const icon = this.querySelector('i');
                if (icon.classList.contains('bi-heart')) {
                    icon.classList.remove('bi-heart', 'text-secondary');
                    icon.classList.add('bi-heart-fill', 'text-danger');
                    icon.style.color = '';
                } else {
                    icon.classList.remove('bi-heart-fill', 'text-danger');
                    icon.classList.add('bi-heart', 'text-secondary');
                    icon.style.color = '';
                }
            });
        });
        
        const carousels = [ petCarouselContainer, productCarouselContainer ];

        carousels.forEach(carousel => {
            if (!carousel) return;

            let isHovered = false;

            carousel.addEventListener('mouseenter', () => isHovered = true);
            carousel.addEventListener('mouseleave', () => isHovered = false);
            
            carousel.addEventListener('touchstart', () => isHovered = true);
            carousel.addEventListener('touchend', () => {
                setTimeout(() => isHovered = false, 2000);
            });

            const autoScroll = () => {
                if (!isHovered) {
                    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
                    if (carousel.scrollLeft >= maxScrollLeft - 10) {
                        carousel.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        carousel.scrollBy({ left: 324, behavior: 'smooth' });
                    }
                }
            };

            setInterval(autoScroll, 3000);
        });
    }

    // Inicializar todo
    Promise.all([cargarMascotas(), cargarProductos()]).then(() => {
        initInteractivity();
    });

});
