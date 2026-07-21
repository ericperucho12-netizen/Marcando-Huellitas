
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita que la página se recargue inmediatamente
            
            // Validamos que los campos requeridos tengan datos
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }

            // Cambiar el texto del botón a "Enviando..."
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            submitBtn.disabled = true;

            // Enviar datos usando fetch a la URL del form (formsubmit.co)
            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                // Restaura el botón
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;

                if (data.success || data.success === "true") {
                    // Muestra mensaje de éxito con SweetAlert2
                    Swal.fire({
                        title: '¡Mensaje Enviado!',
                        text: 'Tu mensaje ha sido enviado correctamente. Te contactaremos pronto 🐾',
                        icon: 'success',
                        confirmButtonColor: '#e04b7b',
                        confirmButtonText: 'Genial'
                    }).then(() => {
                        // Limpia el formulario
                        contactForm.reset();
                        contactForm.classList.remove('was-validated');
                    });
                } else {
                    throw new Error('Error en el servidor');
                }
            })
            .catch(error => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                Swal.fire({
                    title: '¡Ups!',
                    text: 'Hubo un problema al enviar tu mensaje. ¿Puedes intentarlo de nuevo?',
                    icon: 'error',
                    confirmButtonColor: '#e04b7b'
                });
            });
        });
    }
});
