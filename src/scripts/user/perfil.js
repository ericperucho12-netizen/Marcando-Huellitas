document.addEventListener("DOMContentLoaded", () => {
    // Referencias al DOM
    const profileNavLinks = document.querySelectorAll('.profile-nav .nav-link');
    const profileSections = document.querySelectorAll('.profile-section');
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarUserRole = document.getElementById('sidebarUserRole');
    const avatarLetra = document.getElementById('avatarLetra');
    const adminMenu = document.getElementById('adminMenu');
    const btnCerrarSesionPerfil = document.getElementById('btnCerrarSesionPerfil');

    // Inputs de perfil
    const perfilNombre = document.getElementById('perfilNombre');
    const perfilCorreo = document.getElementById('perfilCorreo');

    // 1. Cargar Datos del Usuario desde sessionStorage
    const usuarioActual = JSON.parse(sessionStorage.getItem("usuarioActual"));

    if (!usuarioActual) {
        // Redirigir al login si no está autenticado
        window.location.href = "../../pages/auth/login.html";
        return;
    }

    const userName = usuarioActual.nombre || "Usuario";
    const userRole = usuarioActual.rol || "user";
    const userEmail = usuarioActual.email || "correo@ejemplo.com";

    // Llenar Sidebar
    sidebarUserName.textContent = userName || "Usuario";
    sidebarUserRole.textContent = userRole === "admin" ? "Administrador" : "Miembro";
    sidebarUserRole.className = userRole === "admin" ? "badge bg-danger rounded-pill px-3 py-2" : "badge bg-success rounded-pill px-3 py-2";
    
    if (userName) {
        avatarLetra.innerHTML = userName.charAt(0).toUpperCase();
    }

    // Llenar Formulario
    if (perfilNombre) perfilNombre.value = userName;
    if (perfilCorreo) perfilCorreo.value = userEmail;

    // Mostrar menú de Admin si corresponde
    if (userRole === "admin" && adminMenu) {
        adminMenu.classList.remove('d-none');
    }

    // 2. Navegación por pestañas (Hashes y Clicks)
    
    // Función para mostrar una sección por su ID
    function showSection(targetId) {
        // Remover active de todos
        profileSections.forEach(section => section.classList.remove('active-section'));
        profileNavLinks.forEach(link => link.classList.remove('active'));

        // Agregar active al seleccionado
        const targetSection = document.getElementById(targetId);
        const targetLink = document.querySelector(`.profile-nav .nav-link[data-target="${targetId}"]`);
        
        if (targetSection) targetSection.classList.add('active-section');
        if (targetLink) targetLink.classList.add('active');
    }

    // Manejar clics en los enlaces
    profileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Ignorar el botón de cerrar sesión
            if (link.id === "btnCerrarSesionPerfil") return;

            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            
            // Actualizar URL sin recargar
            const hash = link.getAttribute('href');
            if (hash && hash !== "#") {
                history.pushState(null, null, hash);
            }

            showSection(targetId);
        });
    });

    // Leer el Hash de la URL al cargar (ej: perfil.html#pagos)
    const hashMap = {
        '#datos': 'section-datos',
        '#favoritos': 'section-favoritos',
        '#pagos': 'section-pagos',
        '#direcciones': 'section-direcciones',
        '#admin-adopciones': 'section-admin-adopciones',
        '#admin-refugios': 'section-admin-refugios',
        '#admin-productos': 'section-admin-productos'
    };

    const currentHash = window.location.hash;
    if (currentHash && hashMap[currentHash]) {
        // Solo permitir a admin ver pestañas de admin
        if (currentHash.startsWith('#admin-') && userRole !== "admin") {
            showSection('section-datos');
            history.replaceState(null, null, '#datos');
        } else {
            showSection(hashMap[currentHash]);
        }
    }

    // Modal de Contraseña (Simulación)
    const modalConfirmEmail = document.getElementById('modalConfirmEmail');
    if (modalConfirmEmail) {
        // Enmascarar un poco el correo para que se vea más real
        const partesCorreo = userEmail.split('@');
        let correoEnmascarado = userEmail;
        if (partesCorreo.length === 2) {
            const nombreCorreo = partesCorreo[0];
            const dominio = partesCorreo[1];
            correoEnmascarado = nombreCorreo.substring(0, 2) + '***@' + dominio;
        }
        modalConfirmEmail.textContent = correoEnmascarado;
    }

    const btnEnviarCorreoPassword = document.getElementById('btnEnviarCorreoPassword');
    if (btnEnviarCorreoPassword) {
        btnEnviarCorreoPassword.addEventListener('click', () => {
            // Simular carga
            const textOriginal = btnEnviarCorreoPassword.textContent;
            btnEnviarCorreoPassword.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';
            btnEnviarCorreoPassword.disabled = true;

            setTimeout(() => {
                alert(`Se ha enviado un enlace seguro al correo ${userEmail} para que puedas cambiar tu contraseña.`);
                btnEnviarCorreoPassword.innerHTML = textOriginal;
                btnEnviarCorreoPassword.disabled = false;
                
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalPassword'));
                if (modal) modal.hide();
            }, 1500);
        });
    }

    // 3. Cerrar Sesión desde el Perfil
    if (btnCerrarSesionPerfil) {
        btnCerrarSesionPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = "../../index.html";
        });
    }

    // 4. Guardar Cambios (Simulado)
    const formPerfil = document.getElementById('formPerfil');
    if (formPerfil) {
        formPerfil.addEventListener('submit', (e) => {
            e.preventDefault();
            const nuevoNombre = perfilNombre.value.trim();
            if (nuevoNombre && usuarioActual) {
                usuarioActual.nombre = nuevoNombre;
                sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
                sidebarUserName.textContent = nuevoNombre;
                avatarLetra.innerHTML = nuevoNombre.charAt(0).toUpperCase();
                alert("¡Datos actualizados con éxito!");
                
                // Disparar evento para actualizar el navbar si es necesario
                window.dispatchEvent(new Event('storage'));
            }
        });
    }

    // 5. Renderizar Favoritos
    function renderizarFavoritos() {
        const contenedorMascotas = document.getElementById('contenedorFavoritosMascotas');
        const contenedorProductos = document.getElementById('contenedorFavoritosProductos');
        
        const favMascotas = JSON.parse(localStorage.getItem('favoritosMascotas')) || [];
        const favProductos = JSON.parse(localStorage.getItem('favoritosProductos')) || [];
        
        if (contenedorMascotas) {
            contenedorMascotas.innerHTML = '';
            if (favMascotas.length === 0) {
                contenedorMascotas.innerHTML = '<div class="col-12 text-center py-5 text-muted"><i class="bi bi-heart-break display-4 mb-3 d-block"></i><p>Aún no tienes mascotas favoritas guardadas.</p></div>';
            } else {
                favMascotas.forEach(mascota => {
                    const col = document.createElement('div');
                    col.className = 'col-md-6 col-lg-4';
                    col.innerHTML = `
                        <div class="favorite-card">
                            <div class="fav-img-wrapper">
                                <img src="${mascota.img || '../../assets/footer/Huellita-footer.png'}" style="width:100%; height:180px; object-fit:cover;">
                                <button class="btn btn-light rounded-circle fav-heart active" style="border:none;">
                                    <i class="bi bi-heart-fill text-danger"></i>
                                </button>
                            </div>
                            <div class="fav-card-body">
                                <h5 class="fw-bold mb-1">${mascota.title}</h5>
                                <p class="text-muted small mb-0">${mascota.desc}</p>
                            </div>
                        </div>
                    `;
                    contenedorMascotas.appendChild(col);
                });
            }
        }

        if (contenedorProductos) {
            contenedorProductos.innerHTML = '';
            if (favProductos.length === 0) {
                contenedorProductos.innerHTML = '<div class="col-12 text-center py-5 text-muted"><i class="bi bi-box2 display-4 mb-3 d-block"></i><p>Aún no tienes productos guardados.</p></div>';
            } else {
                favProductos.forEach(prod => {
                    const col = document.createElement('div');
                    col.className = 'col-md-6 col-lg-4';
                    col.innerHTML = `
                        <div class="favorite-card">
                            <div class="fav-img-wrapper">
                                <img src="${prod.img || '../../assets/footer/Huellita-footer.png'}" style="width:100%; height:180px; object-fit:contain; background:#f8f9fa; padding:10px;">
                                <button class="btn btn-light rounded-circle fav-heart active" style="border:none;">
                                    <i class="bi bi-heart-fill text-danger"></i>
                                </button>
                            </div>
                            <div class="fav-card-body">
                                <h5 class="fw-bold mb-1" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${prod.title}</h5>
                                <p class="text-e04b7b fw-bold mb-0">${prod.desc}</p>
                            </div>
                        </div>
                    `;
                    contenedorProductos.appendChild(col);
                });
            }
        }
    }
    
    // Llamar a renderizar al cargar
    renderizarFavoritos();

    // ============================================
    // LÓGICA DE ADMINISTRADOR: GESTIÓN DE REFUGIOS
    // ============================================
    function renderizarRefugiosPendientes() {
        const contenedor = document.getElementById('contenedorRefugiosPendientes');
        if (!contenedor) return;

        const pendientes = JSON.parse(localStorage.getItem('refugiosPendientes')) || [];
        contenedor.innerHTML = '';

        if (pendientes.length === 0) {
            contenedor.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">No hay solicitudes de refugios pendientes por aprobar.</p></div>';
            return;
        }

        pendientes.forEach(refugio => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';
            col.innerHTML = `
                <div class="card h-100 shadow-sm" style="border-radius: 15px; overflow: hidden;">
                    <img src="${refugio.imagen}" class="card-img-top" alt="${refugio.nombre}" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold text-info">${refugio.nombre}</h5>
                        <p class="card-text text-muted small mb-2"><strong>Representante:</strong> ${refugio.responsable}</p>
                        <p class="card-text text-muted small mb-2"><strong>Ubicación:</strong> ${refugio.estado}</p>
                        <p class="card-text small mb-3 flex-grow-1" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${refugio.descripcion}</p>
                        <div class="d-flex justify-content-between mt-auto pt-3 border-top">
                            <button class="btn btn-success btn-sm px-3 rounded-pill fw-bold w-100 me-2" onclick="gestionarRefugio('${refugio.id}', 'aceptar')">Aceptar</button>
                            <button class="btn btn-outline-danger btn-sm px-3 rounded-pill fw-bold w-100" onclick="gestionarRefugio('${refugio.id}', 'rechazar')">Rechazar</button>
                        </div>
                    </div>
                </div>
            `;
            contenedor.appendChild(col);
        });
    }

    // Hacer global la función para que la puedan llamar los botones
    window.gestionarRefugio = function(id, accion) {
        let pendientes = JSON.parse(localStorage.getItem('refugiosPendientes')) || [];
        const refugioIndex = pendientes.findIndex(r => r.id === id);
        
        if (refugioIndex !== -1) {
            const refugio = pendientes[refugioIndex];
            pendientes.splice(refugioIndex, 1);
            localStorage.setItem('refugiosPendientes', JSON.stringify(pendientes));

            if (accion === 'aceptar') {
                let aprobados = JSON.parse(localStorage.getItem('refugiosAprobados')) || [];
                // Se asegura de que no se duplique
                if (!aprobados.find(r => r.id === id)) {
                    aprobados.push(refugio);
                    localStorage.setItem('refugiosAprobados', JSON.stringify(aprobados));
                }
                
                if(typeof Swal !== 'undefined') {
                    Swal.fire('¡Aprobado!', 'El refugio ha sido aceptado y ahora es visible en la plataforma.', 'success');
                } else {
                    alert('¡Aprobado!');
                }
            } else {
                if(typeof Swal !== 'undefined') {
                    Swal.fire('Rechazado', 'La solicitud ha sido rechazada.', 'info');
                } else {
                    alert('Rechazado');
                }
            }
            renderizarRefugiosPendientes();
        }
    };

    if(userRole === 'admin' || userEmail === 'admin@marcandohuellitas.com') {
        renderizarRefugiosPendientes();
    }
});
