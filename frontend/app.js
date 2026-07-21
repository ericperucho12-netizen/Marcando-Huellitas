
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

            // PREPARADO PARA TU PROPIO BACKEND:
            // Extraer datos en formato JSON (muy común para backends propios)
            const formData = new FormData(contactForm);
            const dataObj = Object.fromEntries(formData.entries());

            fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dataObj)
            })
            .then(async response => {
                // Si el backend devuelve status 200/201, se asume exito
                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.message || 'Error en el servidor');
                }
                return response.json();
            })
            .then(data => {
                // Restaura el botón
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;

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
            })
            .catch(error => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                Swal.fire({
                    title: '¡Ups!',
                    text: 'Hubo un problema al enviar tu mensaje. Asegúrate de que el servidor (backend) esté corriendo.',
                    icon: 'error',
                    confirmButtonColor: '#e04b7b'
                });
                console.error("Error al enviar el formulario:", error);
            });
        });
    }
});
