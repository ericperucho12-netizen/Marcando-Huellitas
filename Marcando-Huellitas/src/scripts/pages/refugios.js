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

document.addEventListener("DOMContentLoaded", () => {
    inicializarZonasDeVideo();
    inicializarPausaAlCambiarSlide();
});
