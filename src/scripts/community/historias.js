let allHistorias = [];
let currentPage = 1;
const itemsPerPage = 6; // Mostrar hasta 6 por página

document.addEventListener('DOMContentLoaded', () => {
    cargarHistorias();
    configurarFormulario();
});

async function cargarHistorias() {
    const container = document.getElementById('historiasContainer');
    try {
        const response = await fetch('/api/historias_exito');
        if (!response.ok) throw new Error('Error de red');
        
        allHistorias = await response.json();
        
        if (allHistorias.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="fs-1 text-muted mb-3"><i class="fa-solid fa-book-open"></i></div>
                    <h3 class="text-muted">Aún no hay historias</h3>
                    <p class="text-muted">¡Sé el primero en compartir la historia de tu mascota!</p>
                </div>`;
            return;
        }

        renderHistoriasPage();
        
    } catch (error) {
        console.error('Error al cargar historias:', error);
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-danger"><i class="fa-solid fa-triangle-exclamation me-2"></i>No se pudieron cargar las historias en este momento.</p>
            </div>`;
    }
}

function renderHistoriasPage() {
    const container = document.getElementById('historiasContainer');
    container.innerHTML = '';
    
    const totalPages = Math.ceil(allHistorias.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageItems = allHistorias.slice(startIndex, startIndex + itemsPerPage);

    pageItems.forEach(historia => {
        // Imagen por defecto si no se proporcionó
        let imgUrl = historia.imagenUrl || '../../assets/historias/Bruno.jpg';
        if (imgUrl.includes('default_historia.png')) {
            imgUrl = '../../assets/historias/Bruno.jpg';
        }
        
        const card = document.createElement('div');
        card.className = 'col-md-6';
        card.innerHTML = `
            <div class="card h-100 border rounded-4 overflow-hidden shadow-sm" style="min-width: 100%;">
                <div class="row g-0 h-100">
                    <div class="col-4">
                        <img src="${imgUrl}" class="img-fluid h-100 w-100 object-fit-cover rounded-start-4" alt="${historia.titulo}" onerror="this.src='../../assets/historias/Bruno.jpg'" style="cursor: pointer;" onclick="abrirModalImagen(this.src)">
                    </div>
                    <div class="col-8">
                        <div class="card-body p-4 d-flex flex-column h-100">
                            <h3 class="h5 card-title fw-bold text-dark mb-1">${historia.titulo}</h3>
                            <div class="mb-2 text-warning small">
                                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                            </div>
                            <p class="card-text text-muted small flex-grow-1" style="line-height: 1.5; font-size: 0.9rem;">"${historia.historia}"</p>
                            <div class="mt-2">
                                <div class="badge rounded-pill shadow-sm" style="width: 120px; height: 16px; background-color: #fff; border: 1px solid #fce4e4;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    renderPagination(totalPages);
}

window.abrirModalImagen = function(src) {
    const modalImg = document.getElementById('imageModalSrc');
    if (modalImg) {
        modalImg.src = src;
        const modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
    }
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById("paginationContainer");
    if (!paginationContainer) return;
    paginationContainer.innerHTML = "";

    // Si solo hay una página y las historias no superan el límite (o si no queremos paginador para 1 página), se oculta
    // "agregalo cuando pase de 5" -> Si tenemos 6 historias, totalPages es 1 (porque el límite es 6), pero tal vez queramos un paginador si pasa de 5. 
    // Usaremos el estándar: ocultar si hay 1 página.
    if (totalPages <= 1) return;

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
                renderHistoriasPage();
                document.getElementById('historiasContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        return btn;
    };

    // Botón Anterior
    paginationContainer.appendChild(createBtn("<i class='bi bi-chevron-left'></i>", currentPage - 1, false, currentPage === 1));

    // Números
    let maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationContainer.appendChild(createBtn("1", 1));
        if (startPage > 2) {
            const dots = document.createElement("span");
            dots.innerHTML = "...";
            dots.className = "d-flex align-items-end pb-2 text-muted fw-bold";
            paginationContainer.appendChild(dots);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationContainer.appendChild(createBtn(i, i, i === currentPage));
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement("span");
            dots.innerHTML = "...";
            dots.className = "d-flex align-items-end pb-2 text-muted fw-bold";
            paginationContainer.appendChild(dots);
        }
        paginationContainer.appendChild(createBtn(totalPages, totalPages));
    }

    // Botón Siguiente
    paginationContainer.appendChild(createBtn("<i class='bi bi-chevron-right'></i>", currentPage + 1, false, currentPage === totalPages));
}

function configurarFormulario() {
    const form = document.getElementById('formHistoria');
    if (!form) return;

    // Actualizar el nombre del archivo seleccionado
    const fileInputVisual = document.getElementById('imagenMascota');
    if (fileInputVisual) {
        fileInputVisual.addEventListener('change', (e) => {
            const labelSpan = fileInputVisual.previousElementSibling.querySelector('span');
            if (e.target.files && e.target.files[0] && labelSpan) {
                labelSpan.textContent = e.target.files[0].name;
            } else if (labelSpan) {
                labelSpan.textContent = "Agregar Imagen";
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const nombreUsuario = document.getElementById('nombreUsuario').value;
        const nombreMascota = document.getElementById('nombreMascota').value;
        const relato = document.getElementById('relato').value;
        let imagenUrl = document.getElementById('imagenUrl').value;

        const fileInput = document.getElementById('imagenMascota');
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            if (!file.type.startsWith('image/')) {
                Swal.fire('Error', 'Por favor, selecciona un archivo de imagen válido (JPG, PNG, etc).', 'error');
                form.querySelector('button[type="submit"]').innerHTML = 'Compartir Historia';
                form.querySelector('button[type="submit"]').disabled = false;
                return;
            }
            const uploadData = new FormData();
            uploadData.append("file", file);
            try {
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData
                });
                if (uploadRes.ok) {
                    const jsonRes = await uploadRes.json();
                    imagenUrl = jsonRes.url;
                } else {
                    Swal.fire('Error', 'Error al subir la imagen.', 'error');
                    return;
                }
            } catch (e) {
                console.error(e);
                Swal.fire('Error', 'Error de conexión al subir la imagen.', 'error');
                return;
            }
        }

        // Intentamos obtener el ID del usuario actual si está logueado
        let usuarioId = 0; // 0 significa anónimo
        const usuarioString = sessionStorage.getItem('usuarioActual');
        if (usuarioString) {
            try {
                const usuarioActual = JSON.parse(usuarioString);
                usuarioId = usuarioActual.id || 0;
            } catch(e) {}
        }

        const nuevaHistoria = {
            usuarioId: usuarioId,
            titulo: nombreMascota + " y " + nombreUsuario,
            historia: relato,
            imagenUrl: imagenUrl || null
        };

        try {
            const btnSubmit = form.querySelector('button[type="submit"]');
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            btnSubmit.disabled = true;

            const response = await fetch('/api/historias_exito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaHistoria)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Historia Enviada!',
                    text: 'Muchas gracias por compartir tu historia. Un administrador la revisará pronto antes de publicarla.',
                    confirmButtonColor: '#28a745'
                });
                form.reset();
                form.classList.remove('was-validated');
            } else {
                throw new Error('Error del servidor al guardar');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al enviar tu historia. Por favor intenta más tarde.',
                confirmButtonColor: '#dc3545'
            });
        } finally {
            const btnSubmit = form.querySelector('button[type="submit"]');
            if (btnSubmit) {
                btnSubmit.innerHTML = 'Compartir Historia';
                btnSubmit.disabled = false;
            }
        }
    });
}
