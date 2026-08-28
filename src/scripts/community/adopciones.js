document.addEventListener("DOMContentLoaded", function () {
    const petGrid = document.getElementById("pet-grid");

    // Obtener usuario autenticado de la sesión
    const usuarioActual = JSON.parse(sessionStorage.getItem("usuarioActual"));
    const isAdmin = usuarioActual && (usuarioActual.rol && usuarioActual.rol.toUpperCase() === "ADMIN");

    const adminAdopcionToggleContainer = document.getElementById("adminAdopcionToggleContainer");
    if (isAdmin && adminAdopcionToggleContainer) {
        adminAdopcionToggleContainer.style.display = "block";
    }

    let mascotas = [];
    let currentPage = 1;
    const itemsPerPage = 12;
    let currentFilter = 'all';

    async function cargarMascotasDesdeBackend() {
        try {
            const response = await fetch('/api/mascotas');
            if (!response.ok) throw new Error('Error al obtener mascotas');
            
            mascotas = await response.json();
            renderMascotas();
        } catch (error) {
            console.error('Error fetching mascotas:', error);
            if (petGrid) {
                petGrid.innerHTML = `<p class="text-danger text-center w-100 mt-4">No se pudieron cargar las mascotas. Intenta de nuevo más tarde.</p>`;
            }
        }
    }

    function renderMascotas() {
        if (!petGrid) return;
        
        petGrid.innerHTML = "";
        
        // Aplicar Filtro
        let filteredMascotas = mascotas;
        if (currentFilter !== 'all') {
            filteredMascotas = mascotas.filter(m => {
                const category = m.especie ? m.especie.toLowerCase() : 'perro';
                return category === currentFilter;
            });
        }

        if (filteredMascotas.length === 0) {
            petGrid.innerHTML = `<p class="text-muted text-center w-100 mt-4">No hay mascotas disponibles en este momento para esta categoría.</p>`;
            renderPagination(0);
            return;
        }

        // Paginación
        const totalPages = Math.ceil(filteredMascotas.length / itemsPerPage);
        if (currentPage > totalPages) currentPage = totalPages;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = filteredMascotas.slice(startIndex, endIndex);

        pageItems.forEach(mascota => {
            const imgSrc = mascota.imagenUrl || "../../assets/footer/Huellita-footer.png";
            let adminButtons = '';
            
            if (isAdmin) {
                adminButtons = `
                    <div class="admin-actions position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 mb-3" style="z-index: 10;">
                        <a href="admin-adopcion.html?id=${mascota.id}" class="btn btn-light shadow-sm rounded-circle d-flex align-items-center justify-content-center btn-edit-pet p-0" style="width: 40px; height: 40px;" data-id="${mascota.id}">
                            <i class="bi bi-pencil-fill text-success"></i>
                        </a>
                        <button class="btn btn-light shadow-sm rounded-circle d-flex align-items-center justify-content-center btn-delete-pet p-0" style="width: 40px; height: 40px;" data-id="${mascota.id}">
                            <i class="bi bi-trash-fill text-danger"></i>
                        </button>
                    </div>
                `;
            }

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
                <div class="col-12 col-sm-6 col-lg-3 pet-item" data-category="${mascota.especie ? mascota.especie.toLowerCase() : 'perro'}">
                    <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden team-card position-relative" data-id="${mascota.id}">
                        ${badgeHtml}
                        <button class="position-absolute top-0 end-0 m-2 shadow-sm btn-like-heart" style="width: 28px; height: 28px; min-width: 28px; background: white; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;">
                            <i class="bi bi-heart text-secondary" style="font-size: 0.75rem;"></i>
                        </button>
                        <div class="position-relative">
                            ${adminButtons}
                            <img src="${imgSrc}" class="card-img-top w-100" alt="${mascota.nombre}" style="height: 220px; object-fit: cover;" onerror="this.src='../../assets/footer/Huellita-footer.png'">
                        </div>
                        <div class="card-body bg-white d-flex flex-column">
                            <h3 class="h5 fw-bold text-dark mb-1">${mascota.nombre}</h3>
                            <p class="text-muted small mb-3">${mascota.raza || 'Mestizo'} · ${mascota.edad || 'Desconocida'}</p>

                            <!-- Etiquetas informativas -->
                            <div class="d-flex flex-wrap gap-1 mb-3">
                                <span class="badge bg-pastel-green text-dark px-2 py-1 small">${mascota.tamano || 'Mediano'}</span>
                                <span class="badge bg-pastel-blue text-dark px-2 py-1 small">${mascota.sexo || 'Desconocido'}</span>
                            </div>

                            <button class="btn btn-hero w-100 mt-auto btn-conoce-mas" data-bs-toggle="modal"
                                data-bs-target="#petModal" 
                                data-name="${mascota.nombre}" 
                                data-age="${mascota.edad || 'Desconocida'}" 
                                data-breed="${mascota.raza || 'Mestizo'}"
                                data-img="${imgSrc}"
                                data-desc="${mascota.descripcion || 'Sin descripción'}"
                                data-species="${mascota.especie || 'Desconocido'}"
                                data-vacunas="${mascota.caracteristicas || ''}">
                                Conoce más
                            </button>
                        </div>
                    </div>
                </div>
            `;
            petGrid.innerHTML += cardHTML;
        });

        renderPagination(totalPages);
        adjuntarEventosAdmin();
    }

    function renderPagination(totalPages) {
        const paginationContainer = document.getElementById("paginationContainer");
        if (!paginationContainer) return;
        paginationContainer.innerHTML = "";

        if (totalPages <= 1) return; // Ocultar si solo hay 1 página

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
            }
            if (isDisabled) {
                btn.disabled = true;
                btn.style.opacity = "0.5";
                btn.style.cursor = "not-allowed";
            } else if (!isActive) {
                btn.onmouseover = () => {
                    btn.style.backgroundColor = "#f8f9fa";
                    btn.style.borderColor = "#4fb34a";
                    btn.style.color = "#4fb34a";
                };
                btn.onmouseout = () => {
                    btn.style.backgroundColor = "white";
                    btn.style.borderColor = "#dee2e6";
                    btn.style.color = "#6c757d";
                };
            }

            btn.addEventListener("click", () => {
                if (!isDisabled && !isActive) {
                    currentPage = page;
                    renderMascotas();
                    // Scroll suave hacia arriba
                    const target = document.querySelector('.hero-about');
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
            return btn;
        };

        // Botón Anterior
        paginationContainer.appendChild(createBtn("<i class='bi bi-chevron-left'></i>", currentPage - 1, false, currentPage === 1));

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

    function adjuntarEventosAdmin() {
        document.querySelectorAll(".btn-delete-pet").forEach(boton => {
            boton.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");
                if (confirm("¿Estás seguro de que deseas eliminar esta mascota?")) {
                    try {
                        const response = await fetch(`/api/mascotas/${id}`, {
                            method: "DELETE"
                        });
                        if (!response.ok) throw new Error("Error al eliminar la mascota");
                        
                        await cargarMascotasDesdeBackend();
                    } catch (error) {
                        console.error(error);
                        alert("Hubo un error al eliminar la mascota.");
                    }
                }
            });
        });
    }

    function adjuntarEventosFiltros() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                currentFilter = button.getAttribute('data-filter');
                currentPage = 1; // Volver a la primera página al filtrar
                renderMascotas();
            });
        });
    }

    // Modal
    const petModal = document.getElementById('petModal');
    if (petModal) {
        petModal.classList.add('modal-dialog-scrollable');

        petModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;

            const name = button.getAttribute('data-name');
            const age = button.getAttribute('data-age');
            const species = button.getAttribute('data-species') ? button.getAttribute('data-species').split('(')[0].trim() : '';
            const img = button.getAttribute('data-img');
            const desc = button.getAttribute('data-desc');
            const vacunas = button.getAttribute('data-vacunas') || '';

            document.getElementById('modal-pet-img').src = img;
            if (document.getElementById('modal-pet-name')) document.getElementById('modal-pet-name').textContent = name;
            if (document.getElementById('modal-pet-species')) document.getElementById('modal-pet-species').textContent = "Especie: " + species;
            if (document.getElementById('modal-pet-age')) document.getElementById('modal-pet-age').textContent = age;
            if (document.getElementById('modal-pet-desc')) document.getElementById('modal-pet-desc').textContent = desc;

            const tagsContainer = document.getElementById('modal-pet-tags');
            if (tagsContainer && vacunas) {
                tagsContainer.innerHTML = `
                <span class="badge bg-success-subtle text-success px-2 py-1">${vacunas}</span>
                `;
            } else if (tagsContainer) {
                tagsContainer.innerHTML = '';
            }
        });
    }

    // Iniciar carga
    adjuntarEventosFiltros();
    cargarMascotasDesdeBackend();
});
