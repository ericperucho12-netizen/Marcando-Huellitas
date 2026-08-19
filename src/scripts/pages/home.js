        document.addEventListener('DOMContentLoaded', () => {
            const heartButtons = document.querySelectorAll('.btn-like-heart');
            heartButtons.forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    const icon = this.querySelector('i');
                    if (icon.classList.contains('bi-heart')) {
                        // Activar favorito: corazón relleno
                        icon.classList.remove('bi-heart', 'text-secondary');
                        icon.classList.add('bi-heart-fill', 'text-danger');
                        icon.style.color = '';
                    } else {
                        // Desactivar favorito: corazón vacío
                        icon.classList.remove('bi-heart-fill', 'text-danger');
                        icon.classList.add('bi-heart', 'text-secondary');
                        icon.style.color = '';
                    }
                });
            });
            
            // Auto-scroll para los carruseles (Productos y Mascotas)
            const carousels = [
                document.getElementById('productCarouselContainer'),
                document.getElementById('petCarouselContainer')
            ];

            carousels.forEach(carousel => {
                if (!carousel) return;

                let isHovered = false;

                // Pausar al poner el ratón encima
                carousel.addEventListener('mouseenter', () => isHovered = true);
                
                // Reanudar al quitar el ratón
                carousel.addEventListener('mouseleave', () => isHovered = false);
                
                // Para soporte táctil en móviles
                carousel.addEventListener('touchstart', () => isHovered = true);
                carousel.addEventListener('touchend', () => {
                    setTimeout(() => isHovered = false, 2000);
                });

                // Función de autoscroll por tarjeta
                const autoScroll = () => {
                    if (!isHovered) {
                        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
                        
                        // Si ya casi llega al final, regresamos al principio
                        if (carousel.scrollLeft >= maxScrollLeft - 10) {
                            carousel.scrollTo({ left: 0, behavior: 'smooth' });
                        } else {
                            // Avanza una tarjeta (300px + 24px de gap aprox = 324px)
                            carousel.scrollBy({ left: 324, behavior: 'smooth' });
                        }
                    }
                };

                // Deslizar una tarjeta cada 3 segundos
                setInterval(autoScroll, 3000);
            });
        });
