document.addEventListener('DOMContentLoaded', () => {
    // Verificar que el usuario sea administrador
    const usuarioString = sessionStorage.getItem('usuarioActual');
    if (!usuarioString) {
        return;
    }
    try {
        const usuarioActual = JSON.parse(usuarioString);
        if (usuarioActual.rol && usuarioActual.rol.toUpperCase() === 'ADMIN') {
            const container = document.getElementById('tablaHistoriasBody');
            if (container) {
                cargarHistorias();
            }
        }
    } catch(e) {
        console.error("Error al validar rol en historias", e);
    }
});

async function cargarHistorias() {
    const tbody = document.getElementById('tablaHistoriasBody');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">Cargando historias...</td></tr>';

    try {
        const response = await fetch('/api/historias_exito/admin');
        if (!response.ok) {
            throw new Error('Error al cargar las historias');
        }
        const historias = await response.json();
        
        if (historias.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No hay historias registradas.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        historias.forEach(historia => {
            let badgeClass = 'bg-warning text-dark';
            if (historia.estado === 'APROBADO') badgeClass = 'bg-success';
            if (historia.estado === 'RECHAZADO') badgeClass = 'bg-danger';

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>#${historia.id}</td>
                <td>${historia.usuarioId || 'Anónimo'}</td>
                <td><strong>${historia.titulo}</strong></td>
                <td>${historia.historia.substring(0, 50)}...</td>
                <td><span class="badge ${badgeClass}">${historia.estado || 'PENDIENTE'}</span></td>
                <td class="text-center">
                    <div class="d-flex gap-2 justify-content-center align-items-center">
                        <button class="btn btn-sm btn-info" onclick='verHistoria(${JSON.stringify(historia).replace(/'/g, "&#39;")})' title="Ver Historia">
                            <i class="bi bi-eye text-white"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick='abrirModalEditar(${JSON.stringify(historia).replace(/'/g, "&#39;")})' title="Editar">
                            <i class="bi bi-pencil-square text-dark"></i>
                        </button>
                        <button class="btn btn-sm btn-success" onclick="cambiarEstado(${historia.id}, 'APROBADO')" title="Aprobar" ${historia.estado === 'APROBADO' ? 'disabled' : ''}>
                            <i class="bi bi-check-lg"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="cambiarEstado(${historia.id}, 'RECHAZADO')" title="Rechazar" ${historia.estado === 'RECHAZADO' ? 'disabled' : ''}>
                            <i class="bi bi-x-lg"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="eliminarHistoria(${historia.id})" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(fila);
        });

    } catch (error) {
        console.error('Error:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4"><i class="bi bi-exclamation-triangle me-2"></i>Error de conexión al cargar las historias.</td></tr>';
    }
}

function verHistoria(historia) {
    document.getElementById('modalTituloHistoria').textContent = historia.titulo;
    document.getElementById('modalContenidoHistoria').textContent = historia.historia;
    
    const img = document.getElementById('modalImagenHistoria');
    if (historia.imagenUrl) {
        // Si la URL es la de la imagen rota que no existe, la reemplazamos
        if (historia.imagenUrl.includes('default_historia.png')) {
            img.src = '../../assets/historias/Bruno.jpg';
        } else {
            img.src = historia.imagenUrl;
        }
        img.classList.remove('d-none');
    } else {
        // Fallback por defecto si no tiene imagen
        img.src = '../../assets/historias/Bruno.jpg';
        img.classList.remove('d-none');
    }

    const modal = new bootstrap.Modal(document.getElementById('verHistoriaModal'));
    modal.show();
}

async function cambiarEstado(id, nuevoEstado) {
    const confirmacion = await Swal.fire({
        title: `¿Marcar como ${nuevoEstado}?`,
        text: "La historia cambiará su estado de visibilidad.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: nuevoEstado === 'APROBADO' ? '#28a745' : '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
        try {
            const token = sessionStorage.getItem('jwtToken');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = 'Bearer ' + token;

            const response = await fetch(`/api/historias_exito/${id}/estado`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Actualizado!',
                    text: `La historia ahora está ${nuevoEstado}.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                cargarHistorias();
            } else {
                throw new Error('Error al actualizar');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el estado de la historia.', 'error');
        }
    }
}


let modalEdicion;

function abrirModalEditar(historia) {
    document.getElementById('editHistoriaId').value = historia.id;
    document.getElementById('editTitulo').value = historia.titulo;
    document.getElementById('editContenido').value = historia.historia;
    document.getElementById('editImagen').value = historia.imagenUrl || '';
    
    // Limpiar file input
    const fileInput = document.getElementById('editImagenFile');
    if (fileInput) fileInput.value = '';

    // Mostrar imagen actual si existe
    const preview = document.getElementById('editImagenPreview');
    const previewContainer = document.getElementById('editImagenPreviewContainer');
    if (historia.imagenUrl && preview && previewContainer) {
        preview.src = historia.imagenUrl;
        previewContainer.style.display = 'block';
    } else if (previewContainer) {
        previewContainer.style.display = 'none';
    }

    // Previsualizar imagen seleccionada antes de guardar
    if (fileInput) {
        fileInput.onchange = function() {
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    previewContainer.style.display = 'block';
                };
                reader.readAsDataURL(fileInput.files[0]);
            }
        };
    }
    
    if(!modalEdicion) {
        modalEdicion = new bootstrap.Modal(document.getElementById('editarHistoriaModal'));
    }
    modalEdicion.show();
}

async function guardarEdicion() {
    const id = document.getElementById('editHistoriaId').value;
    const titulo = document.getElementById('editTitulo').value;
    const contenido = document.getElementById('editContenido').value;
    let imagenUrl = document.getElementById('editImagen').value;
    
    if(!titulo || !contenido) {
        Swal.fire('Error', 'El título y la historia son obligatorios.', 'error');
        return;
    }

    // Si seleccionó un archivo nuevo, subirlo primero
    const fileInput = document.getElementById('editImagenFile');
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        try {
            const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
            if (uploadRes.ok) {
                const json = await uploadRes.json();
                imagenUrl = json.url;
            } else {
                Swal.fire('Error', 'No se pudo subir la imagen.', 'error');
                return;
            }
        } catch (e) {
            Swal.fire('Error', 'Error de conexión al subir la imagen.', 'error');
            return;
        }
    }

    try {
        const token = sessionStorage.getItem('jwtToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const response = await fetch(`/api/historias_exito/${id}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ 
                titulo: titulo, 
                historia: contenido, 
                imagenUrl: imagenUrl || null 
            })
        });

        if (response.ok) {
            Swal.fire({
                title: '¡Guardado!',
                text: 'La historia ha sido editada exitosamente.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            modalEdicion.hide();
            cargarHistorias();
        } else {
            throw new Error('Error al guardar edición');
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo editar la historia.', 'error');
    }
}

async function eliminarHistoria(id) {
    const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto! La historia se eliminará permanentemente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
        try {
            const token = sessionStorage.getItem('jwtToken');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = 'Bearer ' + token;

            const response = await fetch(`/api/historias_exito/${id}`, {
                method: 'DELETE',
                headers: headers
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Eliminada!',
                    text: 'La historia ha sido eliminada.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                cargarHistorias();
            } else {
                throw new Error('Error al eliminar');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo eliminar la historia.', 'error');
        }
    }
}
