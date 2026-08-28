document.addEventListener("DOMContentLoaded", function () {
    const dynamicProductsSection = document.getElementById("dynamicProductsSection");
    const productsList = document.getElementById("productsList");
    const emptyStateMsg = document.getElementById("emptyStateMsg");
    const productoForm = document.getElementById("producto-form");
    const adminToggleContainer = document.getElementById("adminToggleContainer");

    // Obtener usuario autenticado de la sesión
    const usuarioActual = JSON.parse(sessionStorage.getItem("usuarioActual"));
    
    // Validar si es administrador (por su rol o su email)
    const isAdmin = usuarioActual && (usuarioActual.rol && usuarioActual.rol.toUpperCase() === "ADMIN");

    if (isAdmin && adminToggleContainer) {
        adminToggleContainer.style.display = "block";
    }

        let productos = [];
    let currentFilter = "todos";
    let currentCategories = [];
    let filterOffers = false;
    let currentSpecies = [];
    let maxPrice = 2000;
    let currentBrands = [];
    let currentRating = 0;
    let currentSort = "popular";
    
    let currentPage = 1;
    const itemsPerPage = 32;

    function normalizarTexto(texto) {
        return String(texto || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }


    function obtenerMarcaProducto(producto) {
        const texto = normalizarTexto(`${producto.nombre || ""} ${producto.imagen || ""} ${producto.marca || ""}`);
        if (texto.includes("royal") || texto.includes("canin")) {
            return "royal canin";
        }
        if (texto.includes("purina") || texto.includes("proplan") || texto.includes("pro plan")) {
            return "purina";
        }
        if (texto.includes("hills") || texto.includes("hill")) {
            return "hills";
        }
        if (texto.includes("pedigree") || texto.includes("dentastix")) {
            return "pedigree";
        }
        return normalizarTexto(producto.marca || "otra");
    }

    function obtenerRatingProducto(producto) {
        if (producto.rating) return Number(producto.rating);
        const marca = obtenerMarcaProducto(producto);
        if (marca === "royal canin" || marca === "hills") return 5;
        if (marca === "purina" || marca === "pedigree" || producto.oferta === "si") return 4;
        return 3;
    }

    function crearEstrellas(rating) {
        let estrellas = "";
        for (let i = 1; i <= 5; i++) {
            estrellas += i <= rating ? `<i class="bi bi-star-fill"></i>` : `<i class="bi bi-star"></i>`;
        }
        return estrellas;
    }

    async function cargarProductosDesdeBackend() {
        try {
            const response = await fetch('/api/productos');
            if (!response.ok) throw new Error('Error al obtener productos');
            
            const data = await response.json();
            
            productos = data.map(producto => {
                let desc = producto.descripcion || "";
                
                let especieMatch = desc.match(/\[ESPECIE:(.*?)\]/);
                let ofertaMatch = desc.match(/\[OFERTA:(.*?)\]/);
                
                let especieProducto = especieMatch ? especieMatch[1] : "todos";
                if (!especieMatch) {
                   const texto = (producto.nombre + " " + desc).toLowerCase();
                   if (texto.includes("gato") || texto.includes("felin") || texto.includes("minino")) {
                       especieProducto = "gato";
                   } else {
                       especieProducto = "perro";
                   }
                }
                
                const esOferta = ofertaMatch ? ofertaMatch[1] : ((producto.id % 4 === 0) ? "si" : "no");
                
                desc = desc.replace(/\[ESPECIE:.*?\]/g, '').replace(/\[OFERTA:.*?\]/g, '').trim();

                return {
                    id: producto.id,
                    nombre: producto.nombre,
                    categoria: producto.categoria || "Sin categoría",
                    especie: especieProducto,
                    marca: "otra",
                    precio: producto.precio,
                    oferta: esOferta,
                    imagen: producto.imagenUrl || "../../assets/footer/Huellita-footer.png",
                    descripcion: desc
                };
            });

            productos = productos.map(producto => ({
                ...producto,
                marca: obtenerMarcaProducto(producto),
                rating: obtenerRatingProducto(producto)
            }));

            renderizarProductos();
        } catch (error) {
            console.error("No se pudieron cargar los productos:", error);
            if (emptyStateMsg) {
                emptyStateMsg.classList.remove("d-none");
                emptyStateMsg.innerHTML = `<h4>Error al cargar productos</h4><p class="text-muted">Asegúrate de que el backend esté encendido en http://localhost:8080.</p>`;
            }
        }
    }

    cargarProductosDesdeBackend();

    // ── Filtros Categoría (Sidebar) ──
    document.querySelectorAll(".category-check").forEach(chk => {
        chk.addEventListener("change", function() {
            currentCategories = [];
            document.querySelectorAll(".category-check:checked").forEach(cb => {
                currentCategories.push(cb.value.toLowerCase());
            });
            currentPage = 1;
            renderizarProductos();
        });
    });

    // ── Filtro Ofertas ──
    const filterOffersCheckbox = document.getElementById("filterOffers");
    if (filterOffersCheckbox) {
        filterOffersCheckbox.addEventListener("change", function() {
            filterOffers = this.checked;
            currentPage = 1;
            renderizarProductos();
        });
    }

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

    const FAVORITES_KEY = "marcandoHuellitasFavoritosProductos";

    function getFavorites() {
        try {
            const favoritos = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
            return Array.isArray(favoritos) ? favoritos : [];
        } catch (error) {
            return [];
        }
    }

    function saveFavorites(favoritos) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritos));
    }

    function isFavoriteProduct(productId) {
        return getFavorites().some(item => String(item.id) === String(productId));
    }

    function toggleFavoriteProduct(producto) {
        const favoritos = getFavorites();
        const exists = favoritos.find(item => String(item.id) === String(producto.id));

        if (exists) {
            const updatedFavorites = favoritos.filter(item => String(item.id) !== String(producto.id));
            saveFavorites(updatedFavorites);
            return false;
        }

        favoritos.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            categoria: producto.categoria,
            marca: obtenerMarcaProducto(producto),
            rating: obtenerRatingProducto(producto)
        });

        saveFavorites(favoritos);
        return true;
    }

    function renderizarProductos() {
        if (!productsList) return;
        productsList.innerHTML = "";

        // Filtrar productos con los nuevos controles
        let productosFiltrados = productos;

        // Filtro por categoría (Sidebar)
        if (currentCategories.length > 0) {
            productosFiltrados = productosFiltrados.filter(p =>
                currentCategories.includes((p.categoria || "").toLowerCase())
            );
        }

        // Filtro por Ofertas
        if (filterOffers) {
            productosFiltrados = productosFiltrados.filter(p => p.oferta === "si");
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
                currentBrands.includes(obtenerMarcaProducto(p))
            );
        }

        // Filtro por calificación (Simulado para frontend)
       if (currentRating > 0) {
            productosFiltrados = productosFiltrados.filter(p => {
                const rating = obtenerRatingProducto(p);
                return rating === currentRating;
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
            col.className = "col-12 col-sm-6 col-lg-4 mb-4";// 4 cards per row on extra large screens

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

            const isFavorite = isFavoriteProduct(producto.id);
            const heartClass = isFavorite ? "bi-heart-fill text-danger" : "bi-heart text-secondary";
            const heartTitle = isFavorite ? "Quitar de favoritos" : "Agregar a favoritos";

            col.innerHTML = `
                <div class="card h-100 border-0 product-item-card"
                    data-product-id="${escaparAtributo(producto.id)}"
                    data-product-name="${escaparAtributo(producto.nombre)}"
                    data-product-price="${escaparAtributo(producto.precio)}"
                    data-product-image="${escaparAtributo(producto.imagen)}"
                    style="border-radius:22px;overflow:hidden;transition:transform .2s; background-color:#fff; box-shadow: 0 8px 24px rgba(0,0,0,0.08);"
                    onmouseover="this.style.transform='translateY(-5px)'"
                    onmouseout="this.style.transform='translateY(0)'">

                    <div class="position-relative" style="background-color: #f8f9fa; border-bottom: 1px solid #f0f0f0;">
                        <img src="${escaparAtributo(producto.imagen)}"
                            onerror="this.src='../../assets/footer/Huellita-footer.png'; this.style.objectFit='contain'; this.style.padding='20px';"
                            class="card-img-top product-card-img"
                            style="height:300px; object-fit:cover;"
                            alt="${escaparAtributo(producto.nombre)}">

                        ${ofertaBadge}

                        <button type="button"
                            class="position-absolute rounded-circle d-flex align-items-center justify-content-center btn-like-heart"
                            data-favorite-product="${escaparAtributo(producto.id)}"
                            title="${heartTitle}"
                            style="background:rgba(255,255,255,0.85); border:none; width:42px; height:42px; top:14px; right:14px; cursor:pointer; z-index:20;">
                            <i class="bi ${heartClass}" style="font-size:1.25rem;"></i>
                        </button>

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
                        <p class="mb-2 fw-bold text-uppercase" style="font-size:.78rem; color:${catColor}; letter-spacing: 0.5px;">
                            ${escaparHTML(producto.categoria || 'Sin categoría')}
                        </p>

                        <h6 class="title fw-bold mb-3 flex-grow-1" style="font-size:1.22rem; color:#2b2b2b; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; line-height:1.4;">
                            ${escaparHTML(producto.nombre)}
                        </h6>

                        <div class="mb-3 d-flex align-items-center" style="color:#ffb800;font-size:1rem;">
                            ${crearEstrellas(obtenerRatingProducto(producto))}
                            <small class="text-muted ms-2" style="font-size: 0.85rem;">
                                (${obtenerRatingProducto(producto)}.0)
                            </small>
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
        document.querySelectorAll(".btn-like-heart").forEach((boton) => {
            boton.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                const id = this.getAttribute("data-favorite-product");
                const producto = productos.find(item => String(item.id) === String(id));

                if (!producto) {
                    return;
                }

                const isFavorite = toggleFavoriteProduct(producto);
                const icon = this.querySelector("i");

                if (icon) {
                    icon.className = isFavorite
                        ? "bi bi-heart-fill text-danger"
                        : "bi bi-heart text-secondary";
                }

                this.setAttribute(
                    "title",
                    isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
                );
            });
        });
        document.querySelectorAll(".btn-delete").forEach((boton) => {
            boton.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");
                if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
                    try {
                        const response = await fetch(`/api/productos/${id}`, {
                            method: "DELETE"
                        });
                        if (!response.ok) throw new Error("Error al eliminar el producto");
                        
                        // Recargar la lista después de eliminar
                        await cargarProductosDesdeBackend();
                    } catch (error) {
                        console.error(error);
                        alert("Hubo un error al eliminar el producto.");
                    }
                }
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

