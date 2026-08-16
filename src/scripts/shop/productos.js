document.addEventListener("DOMContentLoaded", function () {
    const dynamicProductsSection = document.getElementById("dynamicProductsSection");
    const productsList = document.getElementById("productsList");
    const emptyStateMsg = document.getElementById("emptyStateMsg");
    const productoForm = document.getElementById("producto-form");
    const adminToggleContainer = document.getElementById("adminToggleContainer");

    // Obtener usuario autenticado de la sesión
    const usuarioActual = JSON.parse(sessionStorage.getItem("usuarioActual"));
    
    // Validar si es administrador (por su rol o su email)
    const isAdmin = usuarioActual && (usuarioActual.rol === "admin" || usuarioActual.email === "admin@marcandohuellitas.com");

    if (isAdmin && adminToggleContainer) {
        adminToggleContainer.style.display = "block";
    }

    let productos = JSON.parse(localStorage.getItem("productosAdmin")) || [];
    
    // Si no hay productos, cargamos los de prueba para que no se vea vacío
    if (productos.length === 0) {
        productos = [
            {
                id: "prod-1",
                nombre: "Collar ajustable para gato",
                categoria: "Accesorios",
                especie: "gato",
                marca: "otra",
                precio: "180",
                oferta: "no",
                imagen: "../../assets/productos/Imagenes_Gato_Productos/Gato_Collar.jpg",
                descripcion: "Elegante collar con cascabel para tu mascota."
            },
            {
                id: "prod-2",
                nombre: "Cama suave redonda para gato",
                categoria: "Descanso",
                especie: "gato",
                marca: "otra",
                precio: "349",
                oferta: "no",
                imagen: "../../assets/productos/Imagenes_Gato_Productos/Gato_Cama.jpg",
                descripcion: "Cama de felpa ultra suave y cómoda."
            },
            {
                id: "prod-3",
                nombre: "Hills Science Diet Gato Adulto",
                categoria: "Alimento",
                especie: "gato",
                marca: "hills",
                precio: "450",
                oferta: "si",
                imagen: "../../assets/productos/comida gato/Hills Croqueta.png",
                descripcion: "Nutrición premium para tu gato adulto."
            },
            {
                id: "prod-4",
                nombre: "Ratón de peluche para gato",
                categoria: "Juguetes",
                especie: "gato",
                marca: "otra",
                precio: "85",
                oferta: "no",
                imagen: "../../assets/productos/juguetes-gato/Juguete-Gato-1-Ratonpeluche.jpg",
                descripcion: "Juguete clásico y divertido para horas de juego."
            },
            {
                id: "prod-5",
                nombre: "Pro Plan Croqueta Gato Adulto",
                categoria: "Alimento",
                especie: "gato",
                marca: "purina",
                precio: "280",
                oferta: "si",
                imagen: "../../assets/productos/comida gato/Proplan Croqueta.png",
                descripcion: "Alimento balanceado Pro Plan."
            },
            {
                id: "prod-6",
                nombre: "Túnel plegable para gato",
                categoria: "Juguetes",
                especie: "gato",
                marca: "otra",
                precio: "220",
                oferta: "no",
                imagen: "../../assets/productos/juguetes-gato/Juguete-Gato-2-TunelPlegable.jpg",
                descripcion: "Túnel interactivo con varias salidas."
            },
            {
                id: "prod-7",
                nombre: "Correa retráctil para perro",
                categoria: "Accesorios",
                especie: "perro",
                marca: "flexi",
                precio: "350",
                oferta: "no",
                imagen: "../../assets/productos/accesorios_perro/producto-correa-perro.png",
                descripcion: "Correa retráctil de 5 metros de largo."
            },
            {
                id: "prod-8",
                nombre: "Hueso de carnaza grande",
                categoria: "Juguetes",
                especie: "perro",
                marca: "otra",
                precio: "120",
                oferta: "si",
                imagen: "../../assets/productos/juguetes-perro/hueso_mordedor.png",
                descripcion: "Hueso ideal para morder y limpiar dientes."
            }
        ];
        localStorage.setItem("productosAdmin", JSON.stringify(productos));
    } else {
        // Fix broken image paths and append new items to existing localStorage if needed
        let changed = false;
        productos = productos.map(p => {
            if (p.imagen && p.imagen.startsWith("../assets/")) {
                p.imagen = p.imagen.replace("../assets/", "../../assets/");
                changed = true;
            }
            if (p.imagen && p.imagen.includes("Accesorios/Correa1.jpg")) {
                p.imagen = "../../assets/productos/accesorios_perro/producto-correa-perro.png";
                changed = true;
            }
            if (p.imagen && p.imagen.includes("Juguetes Perro/Juguete2.jpg")) {
                p.imagen = "../../assets/productos/juguetes-perro/hueso_mordedor.png";
                changed = true;
            }
            return p;
        });
        if (productos.length === 6 && productos[0].id === "prod-1") {
            productos.push(
                {
                    id: "prod-7",
                    nombre: "Correa retráctil para perro",
                    categoria: "Accesorios",
                    especie: "perro",
                    marca: "flexi",
                    precio: "350",
                    oferta: "no",
                    imagen: "../../assets/productos/accesorios_perro/producto-correa-perro.png",
                    descripcion: "Correa retráctil de 5 metros de largo."
                },
                {
                    id: "prod-8",
                    nombre: "Hueso de carnaza grande",
                    categoria: "Juguetes",
                    especie: "perro",
                    marca: "otra",
                    precio: "120",
                    oferta: "si",
                    imagen: "../../assets/productos/juguetes-perro/hueso_mordedor.png",
                    descripcion: "Hueso ideal para morder y limpiar dientes."
                }
            );
            changed = true;
        }
        if (changed) {
            localStorage.setItem("productosAdmin", JSON.stringify(productos));
        }
    }
    
    let currentFilter = "todos"; // todos, perro, gato

    let currentCat = "todos";
    let currentSpecies = []; // [] means all
    let maxPrice = 2000;
    let currentBrands = []; // [] means all
    let currentRating = 0; // 0 means all
    let currentSort = "popular";
    
    // Auto-generate more products if we don't have enough to test pagination
    if (productos.length < 33) {
        const base = [...productos];
        while (productos.length < 40) {
            base.forEach(p => {
                productos.push({
                    ...p,
                    id: p.id + "-" + Math.random().toString(36).substr(2, 5),
                    nombre: p.nombre + " (Copia)"
                });
            });
        }
        localStorage.setItem("productosAdmin", JSON.stringify(productos));
    }

    // Pagination state
    let currentPage = 1;
    const itemsPerPage = 32; // 4 columns x 8 rows

    renderizarProductos();

    // ── Categoría Pills ─────────────────────────────────────
    document.querySelectorAll(".cat-pill").forEach(pill => {
        pill.addEventListener("click", function(e) {
            document.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
            this.classList.add("active");
            currentCat = this.getAttribute("data-cat");
            currentPage = 1; // Reset page
            renderizarProductos();
        });
    });

    // ── Rango de Precio ─────────────────────────────────────
    const priceRange = document.getElementById("priceRange");
    const priceRangeValue = document.getElementById("priceRangeValue");
    const clearPriceFilter = document.getElementById("clearPriceFilter");

    if (priceRange) {
        priceRange.addEventListener("input", function() {
            maxPrice = Number(this.value);
            if (priceRangeValue) priceRangeValue.textContent = "$" + maxPrice.toLocaleString("es-MX");
            currentPage = 1;
            renderizarProductos();
        });
    }
    if (clearPriceFilter) {
        clearPriceFilter.addEventListener("click", function() {
            if (priceRange) { priceRange.value = 2000; }
            maxPrice = 2000;
            if (priceRangeValue) priceRangeValue.textContent = "$2,000";
            currentPage = 1;
            renderizarProductos();
        });
    }

    // ── Especie Checkboxes ───────────────────────────────────
    document.querySelectorAll(".species-check").forEach(chk => {
        chk.addEventListener("change", function() {
            currentSpecies = [];
            document.querySelectorAll(".species-check:checked").forEach(cb => {
                if (cb.checked) currentSpecies.push(cb.value);
            });

            currentPage = 1; // Reset page
            renderizarProductos();
        });
    });

    // ── Marcas Checkboxes ─────────────────────────────────────
    document.querySelectorAll(".brand-check").forEach(chk => {
        chk.addEventListener("change", function() {
            currentBrands = [];
            document.querySelectorAll(".brand-check:checked").forEach(cb => {
                currentBrands.push(cb.value.toLowerCase());
            });
            currentPage = 1;
            renderizarProductos();
        });
    });

    // ── Calificación Radio ────────────────────────────────────
    document.querySelectorAll(".rating-check").forEach(chk => {
        chk.addEventListener("change", function() {
            const checked = document.querySelector(".rating-check:checked");
            currentRating = checked ? Number(checked.value) : 0;
            currentPage = 1;
            renderizarProductos();
        });
    });

    // ── Ordenamiento ──────────────────────────────────────────
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
        sortSelect.addEventListener("change", function() {
            currentSort = this.value;
            currentPage = 1;
            renderizarProductos();
        });
    }

    // ── Botón Aplicar Filtros ─────────────────────────────────
    const applyFiltersBtn = document.getElementById("applyFiltersBtn");
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener("click", function() {
            currentPage = 1;
            renderizarProductos();
            document.getElementById("productsList").scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Escuchar el click en el botón de "Agregar Nuevo Producto"
    const btnAgregarProducto = document.getElementById("btnAgregarProducto");
    if (btnAgregarProducto) {
        btnAgregarProducto.addEventListener("click", function() {
            if (productoForm) productoForm.reset();
            document.getElementById("id-producto").value = ""; // Limpiar ID explícitamente
            const imagePreview = document.getElementById("imagen-preview");
            if (imagePreview) {
                imagePreview.innerHTML = "Sin imagen";
                imagePreview.style.backgroundImage = "";
            }
        });
    }

    function renderizarProductos() {
        if (!productsList) return;
        productsList.innerHTML = "";

        // Filtrar productos con los nuevos controles
        let productosFiltrados = productos;

        // Filtro por categoría (cat-pill)
        if (currentCat && currentCat !== "todos") {
            productosFiltrados = productosFiltrados.filter(p =>
                (p.categoria || "").toLowerCase().includes(currentCat)
            );
        }

        // Filtro por especie (checkboxes Perros / Gatos)
        if (currentSpecies.length > 0) {
            productosFiltrados = productosFiltrados.filter(p =>
                currentSpecies.includes((p.especie || "").toLowerCase())
            );
        }

        // Filtro por precio máximo
        productosFiltrados = productosFiltrados.filter(p => Number(p.precio) <= maxPrice);

        // Filtro por marca
        if (currentBrands.length > 0) {
            productosFiltrados = productosFiltrados.filter(p =>
                currentBrands.includes((p.marca || "otra").toLowerCase())
            );
        }

        // Filtro por calificación (Simulado para frontend)
        if (currentRating > 0) {
            productosFiltrados = productosFiltrados.filter(p => {
                // Simular calificación: los en oferta son 4, los demás 5
                const rating = p.oferta === "si" ? 4 : 5;
                return rating >= currentRating;
            });
        }

        // ── Ordenamiento ──
        if (currentSort === "precio_asc") {
            productosFiltrados.sort((a, b) => Number(a.precio) - Number(b.precio));
        } else if (currentSort === "precio_desc") {
            productosFiltrados.sort((a, b) => Number(b.precio) - Number(a.precio));
        } else if (currentSort === "nombre") {
            productosFiltrados.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
        } else if (currentSort === "popular") {
            productosFiltrados.sort((a, b) => (a.oferta === "si" ? -1 : 1));
        }

        if (productosFiltrados.length === 0) {
            if (emptyStateMsg) emptyStateMsg.style.display = "block";
            renderPagination(0);
            return;
        }

        if (emptyStateMsg) emptyStateMsg.style.display = "none";

        // --- Paginación ---
        const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedProductos = productosFiltrados.slice(startIndex, startIndex + itemsPerPage);

        paginatedProductos.forEach((producto) => {
            const col = document.createElement("div");
            col.className = "col-12 col-sm-6 col-lg-4 col-xl-3 mb-4"; // 4 cards per row on extra large screens

            let catColor = "#4fb34a"; // matches the green in the reference image text

            // Lógica de oferta
            const esOferta = producto.oferta === "si";
            let precioHtml = `<div class="d-flex flex-column"><span class="fw-bold price" style="color:#2f8f30;font-size:1.6rem;line-height:1;">${formatearPrecio(producto.precio)}</span></div>`;
            let ofertaBadge = "";
            if (esOferta) {
                const precioNormal = Number(producto.precio) * 1.2;
                precioHtml = `<div class="d-flex flex-column"><span class="fw-bold price" style="color:#2f8f30;font-size:1.6rem;line-height:1;margin-bottom:4px;">${formatearPrecio(producto.precio)}</span> <small class="text-muted text-decoration-line-through" style="font-size:0.85rem;">${formatearPrecio(precioNormal)}</small></div>`;
                ofertaBadge = `<span class="position-absolute m-2 px-2 py-1 rounded-pill fw-bold text-white shadow-sm" style="background:#ff4d4f;font-size:.75rem;top:8px;left:8px;">-20%</span>`;
            }

            col.innerHTML = `
                <div class="card h-100 border-0 product-item-card" data-product-id="${escaparAtributo(producto.id)}" style="border-radius:16px;overflow:hidden;transition:transform .2s; background-color:#fff; box-shadow: 0 4px 15px rgba(0,0,0,0.05);" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div class="position-relative" style="background-color: #f8f9fa; border-bottom: 1px solid #f0f0f0;">
                        <img src="${escaparAtributo(producto.imagen)}" onerror="this.src='../../assets/footer/Huellita-footer.png'; this.style.objectFit='contain'; this.style.padding='20px';" class="card-img-top" style="height:250px; object-fit:cover;" alt="${escaparAtributo(producto.nombre)}">
                        ${ofertaBadge}
                        <span class="position-absolute rounded-circle d-flex align-items-center justify-content-center" style="background:rgba(255,255,255,0.7); width:32px; height:32px; top:12px; right:12px; cursor:pointer;">
                            <i class="bi bi-heart text-secondary"></i>
                        </span>
                        <div class="admin-actions gap-2 p-2" style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 10; display: ${isAdmin ? 'flex' : 'none'} !important;">
                            <button type="button" class="btn btn-light btn-edit shadow-sm rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; padding: 0;" data-id="${escaparAtributo(producto.id)}" aria-label="Editar producto" title="Editar">
                                <i class="bi bi-pencil" style="color: #0aa738; font-size: 1.1rem;"></i>
                            </button>
                            <button type="button" class="btn btn-light btn-delete shadow-sm rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; padding: 0;" data-id="${escaparAtributo(producto.id)}" aria-label="Eliminar producto" title="Eliminar">
                                <i class="bi bi-trash" style="color: red; font-size: 1.1rem;"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body p-4 d-flex flex-column">
                        <p class="mb-2 fw-bold text-uppercase" style="font-size:.75rem; color:${catColor}; letter-spacing: 0.5px;">${escaparHTML(producto.categoria || 'Sin categoría')}</p>
                        <h6 class="title fw-bold mb-3 flex-grow-1" style="font-size:1.1rem; color:#2b2b2b; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; line-height:1.4;">${escaparHTML(producto.nombre)}</h6>
                        <div class="mb-3 d-flex align-items-center" style="color:#ffb800;font-size:.9rem;">
                            <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i> 
                            <small class="text-muted ms-2" style="font-size: 0.8rem;">(128)</small>
                        </div>
                        <div class="d-flex align-items-end justify-content-between mt-auto">
                            ${precioHtml}
                        </div>
                    </div>
                </div>
            `;

            productsList.appendChild(col);
        });
        
        renderPagination(totalPages);
        agregarEventosAcciones();
    }

    function renderPagination(totalPages) {
        const paginationContainer = document.getElementById("paginationContainer");
        if (!paginationContainer) return;
        paginationContainer.innerHTML = "";

        if (totalPages <= 1) return; // Hide pagination if only 1 page

        // Helper para crear botones
        const createBtn = (text, page, isActive = false, isDisabled = false) => {
            const btn = document.createElement("button");
            btn.innerHTML = text;
            btn.className = `btn fw-bold ${isActive ? 'btn-success' : 'btn-outline-secondary bg-white text-secondary'}`;
            btn.style.width = "40px";
            btn.style.height = "40px";
            btn.style.display = "flex";
            btn.style.alignItems = "center";
            btn.style.justifyContent = "center";
            btn.style.borderRadius = "8px";
            btn.style.transition = "all 0.2s";
            if (isActive) {
                btn.style.backgroundColor = "#4fb34a";
                btn.style.borderColor = "#4fb34a";
                btn.style.color = "white";
            } else {
                btn.style.borderColor = "#eaeaea";
            }
            if (isDisabled) {
                btn.disabled = true;
                btn.style.opacity = "0.5";
            }
            
            if (!isDisabled && !isActive) {
                btn.addEventListener("click", () => {
                    currentPage = page;
                    renderizarProductos();
                    // Scroll back to top of products list
                    document.getElementById("productsList").scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            }
            return btn;
        };

        // Botón Anterior
        paginationContainer.appendChild(createBtn("<i class='bi bi-chevron-left'></i>", currentPage - 1, false, currentPage === 1));

        // Páginas (Lógica simplificada para mostrar máximo 5 números)
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        if (startPage > 1) {
            paginationContainer.appendChild(createBtn("1", 1));
            if (startPage > 2) {
                const dots = document.createElement("span");
                dots.className = "d-flex align-items-end pb-2 text-muted fw-bold";
                dots.innerHTML = "...";
                paginationContainer.appendChild(dots);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationContainer.appendChild(createBtn(i, i, i === currentPage));
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = document.createElement("span");
                dots.className = "d-flex align-items-end pb-2 text-muted fw-bold";
                dots.innerHTML = "...";
                paginationContainer.appendChild(dots);
            }
            paginationContainer.appendChild(createBtn(totalPages, totalPages));
        }

        // Botón Siguiente
        paginationContainer.appendChild(createBtn("<i class='bi bi-chevron-right'></i>", currentPage + 1, false, currentPage === totalPages));
    }

    function formatearPrecio(precio) {
        return Number(precio).toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN"
        });
    }

    function agregarEventosAcciones() {
        document.querySelectorAll(".btn-delete").forEach((boton) => {
            boton.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                productos = productos.filter(producto => String(producto.id) !== String(id));
                localStorage.setItem("productosAdmin", JSON.stringify(productos));
                renderizarProductos();
            });
        });

        document.querySelectorAll(".btn-edit").forEach((boton) => {
            boton.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                window.location.href = `admin-producto.html?id=${id}`;
            });
        });
    }

    function escaparHTML(texto) {
        if (texto == null) return "";
        const elemento = document.createElement("div");
        elemento.textContent = String(texto);
        return elemento.innerHTML;
    }

    function escaparAtributo(texto) {
        if (texto == null) return "";
        return String(texto)
            .replaceAll("&", "&amp;")
            .replaceAll('"', "&quot;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
    }
});
