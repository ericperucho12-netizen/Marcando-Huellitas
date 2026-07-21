
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita que la página se recargue
            
            // Aquí validamos rápidamente que los campos requeridos tengan algo
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }

            // Muestra mensaje de éxito con SweetAlert2
            Swal.fire({
                title: '¡Mensaje Enviado!',
                text: 'Gracias por contactarnos. Te responderemos lo más pronto posible 🐾',
                icon: 'success',
                confirmButtonColor: '#e04b7b',
                confirmButtonText: 'Genial'
            }).then(() => {
                // Limpia el formulario
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            });
        });
    }
});
