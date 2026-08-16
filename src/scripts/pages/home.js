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
        });
