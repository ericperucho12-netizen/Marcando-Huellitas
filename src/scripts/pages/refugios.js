// ================================
// PÁGINA DE REFUGIOS
// Carrusel de casitas + zona para
// vincular un video de YouTube por casita
// ================================

const REFUGIOS_STORAGE_PREFIX = "huellitas_refugio_video_";

/**
 * Extrae el ID de un video de YouTube a partir de distintos
 * formatos de enlace (watch?v=, youtu.be/, /embed/, shorts/).
 */
function extraerIdYouTube(url) {
    if (!url) return null;

    try {
        const link = new URL(url.trim());
        const host = link.hostname.replace("www.", "");

        if (host === "youtu.be") {
            return link.pathname.slice(1).split("/")[0] || null;
        }

        if (host === "youtube.com" || host === "m.youtube.com") {
            if (link.pathname === "/watch") {
                return link.searchParams.get("v");
            }
            if (link.pathname.startsWith("/embed/")) {
                return link.pathname.split("/embed/")[1].split("/")[0];
            }
            if (link.pathname.startsWith("/shorts/")) {
                return link.pathname.split("/shorts/")[1].split("/")[0];
            }
        }

        return null;
    } catch (error) {
        return null;
    }
}

/**
 * Muestra el reproductor embebido dentro de la zona de video
 * correspondiente a un refugio.
 */
function mostrarVideoRefugio(videoZone, videoId) {
    const wrapper = videoZone.querySelector(".video-embed-wrapper");
    const iframe = videoZone.querySelector(".video-embed-frame");
    const form = videoZone.querySelector(".video-link-form");

    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    wrapper.classList.remove("d-none");
    form.classList.add("d-none");
}

/**
 * Oculta el reproductor y vuelve a mostrar el formulario
 * para vincular otro video.
 */
function ocultarVideoRefugio(videoZone) {
    const wrapper = videoZone.querySelector(".video-embed-wrapper");
    const iframe = videoZone.querySelector(".video-embed-frame");
    const form = videoZone.querySelector(".video-link-form");
    const feedback = videoZone.querySelector(".video-link-feedback");

    iframe.src = "";
    wrapper.classList.add("d-none");
    form.classList.remove("d-none");
    form.reset();
    feedback.textContent = "";
    feedback.className = "video-link-feedback";
}

function inicializarZonasDeVideo() {
    const videoZones = document.querySelectorAll("[data-refugio-video]");

    videoZones.forEach(videoZone => {
        const refugioId = videoZone.getAttribute("data-refugio-video");
        const storageKey = REFUGIOS_STORAGE_PREFIX + refugioId;
        const form = videoZone.querySelector(".video-link-form");
        const input = videoZone.querySelector(".video-link-input");
        const feedback = videoZone.querySelector(".video-link-feedback");
        const removeBtn = videoZone.querySelector(".btn-video-remove");

        // Si ya había un video guardado para este refugio, se muestra al cargar
        const videoGuardado = localStorage.getItem(storageKey);
        if (videoGuardado) {
            mostrarVideoRefugio(videoZone, videoGuardado);
        }

        form.addEventListener("submit", event => {
            event.preventDefault();

            const videoId = extraerIdYouTube(input.value);

            if (!videoId) {
                feedback.textContent = "Ese enlace no parece ser un video válido de YouTube. Verifícalo e inténtalo de nuevo.";
                feedback.className = "video-link-feedback is-error";
                return;
            }

            localStorage.setItem(storageKey, videoId);
            feedback.textContent = "";
            feedback.className = "video-link-feedback";
            mostrarVideoRefugio(videoZone, videoId);
        });

        removeBtn.addEventListener("click", () => {
            localStorage.removeItem(storageKey);
            ocultarVideoRefugio(videoZone);
        });
    });
}

/**
 * Al cambiar de slide, se detiene la reproducción del video
 * de la casita anterior quitando el src del iframe.
 */
function inicializarPausaAlCambiarSlide() {
    const refugiosCarousel = document.getElementById("refugiosCarousel");
    if (!refugiosCarousel) return;

    refugiosCarousel.addEventListener("slide.bs.carousel", () => {
        const slidesActivos = refugiosCarousel.querySelectorAll(".carousel-item.active .video-embed-frame");
        slidesActivos.forEach(iframe => {
            const src = iframe.getAttribute("src");
            if (src) {
                iframe.setAttribute("data-paused-src", src);
                iframe.setAttribute("src", "");
            }
        });
    });

    refugiosCarousel.addEventListener("slid.bs.carousel", event => {
        const iframeEntrante = event.relatedTarget
            ? event.relatedTarget.querySelector(".video-embed-frame")
            : null;

        if (iframeEntrante) {
            const srcPausado = iframeEntrante.getAttribute("data-paused-src");
            if (srcPausado) {
                iframeEntrante.setAttribute("src", srcPausado);
            }
        }
    });
}

/**
 * Lee los refugios aprobados de localStorage y los inyecta en el carrusel
 */
function renderizarRefugiosAprobados() {
    const carouselInner = document.querySelector("#refugiosCarousel .carousel-inner");
    if (!carouselInner) return;

    const aprobados = JSON.parse(localStorage.getItem('refugiosAprobados')) || [];

    aprobados.forEach(refugio => {
        const itemHtml = `
            <div class="carousel-item" data-refugio-id="${refugio.id}">
                <div class="refugio-card">
                    <div class="row g-4 g-lg-5 align-items-start">

                        <!-- Galería de fotos (Simulada para refugios dinámicos) -->
                        <div class="col-lg-6">
                            <div class="refugio-photo-main">
                                <img src="${refugio.imagen}"
                                    class="img-fluid w-100" alt="Fachada de ${refugio.nombre}" style="height: 400px; object-fit: cover;">
                            </div>
                            <div class="row g-2 refugio-gallery mt-2">
                                <div class="col-4">
                                    <img src="https://picsum.photos/seed/${refugio.id}-1/300/220"
                                        class="img-fluid w-100" alt="Área de descanso">
                                </div>
                                <div class="col-4">
                                    <img src="https://picsum.photos/seed/${refugio.id}-2/300/220"
                                        class="img-fluid w-100" alt="Patio de juegos">
                                </div>
                                <div class="col-4">
                                    <img src="https://picsum.photos/seed/${refugio.id}-3/300/220"
                                        class="img-fluid w-100" alt="Huellitas">
                                </div>
                            </div>
                        </div>

                        <!-- Información -->
                        <div class="col-lg-6">
                            <h2 class="refugio-name">${refugio.nombre}</h2>
                            <p class="refugio-location"><i class="bi bi-geo-alt-fill"></i> ${refugio.direccion}, ${refugio.estado}</p>

                            <p class="refugio-desc">${refugio.descripcion}</p>

                            <ul class="refugio-features list-unstyled">
                                <li><i class="bi bi-person-fill text-e04b7b"></i> <strong>Representante:</strong> ${refugio.responsable}</li>
                                <li><i class="bi bi-telephone-fill text-e04b7b"></i> <strong>Contacto:</strong> ${refugio.telefono} / ${refugio.email}</li>
                                <li><i class="bi bi-building-fill text-e04b7b"></i> <strong>Tipo:</strong> <span class="text-capitalize">${refugio.tipo}</span></li>
                            </ul>

                            <div class="refugio-social d-flex gap-3 mt-4">
                                ${refugio.facebook ? `<a href="#" class="social-link facebook"><i class="bi bi-facebook"></i> ${refugio.facebook}</a>` : ''}
                                ${refugio.instagram ? `<a href="#" class="social-link instagram"><i class="bi bi-instagram"></i> ${refugio.instagram}</a>` : ''}
                                ${refugio.sitioWeb ? `<a href="${refugio.sitioWeb}" target="_blank" class="social-link web"><i class="bi bi-globe"></i> Sitio Web</a>` : ''}
                            </div>
                            
                            <hr class="my-4">
                            
                            <!-- Video Subida -->
                            <div class="refugio-video-zone" data-refugio-id="${refugio.id}">
                                <div class="video-input-group d-flex gap-2 mb-2">
                                    <input type="text" class="form-control input-video-link" placeholder="Pega el enlace de YouTube aquí...">
                                    <button class="btn btn-primary rounded-pill px-4 fw-bold btn-video-save">Guardar Video</button>
                                </div>
                                <div class="video-link-feedback mt-1 mb-2" style="font-size: 0.85rem;"></div>

                                <div class="video-embed-container" style="display: none;">
                                    <div class="ratio ratio-16x9">
                                        <iframe class="video-embed-frame" src="" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                                    </div>
                                    <button class="btn btn-outline-danger btn-sm mt-2 btn-video-remove"><i class="bi bi-trash3"></i> Quitar Video</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        carouselInner.insertAdjacentHTML('beforeend', itemHtml);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarRefugiosAprobados();
    inicializarZonasDeVideo();
    inicializarPausaAlCambiarSlide();
});
