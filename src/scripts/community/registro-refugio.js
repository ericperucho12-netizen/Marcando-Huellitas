document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registroRefugioForm");
    
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Leer los datos del formulario
            const nombre = document.getElementById("refugioNombre").value.trim();
            const responsable = document.getElementById("refugioResponsable").value.trim();
            const email = document.getElementById("refugioEmail").value.trim();
            const telefono = document.getElementById("refugioTelefono").value.trim();
            const direccion = document.getElementById("refugioDireccion").value.trim();
            const estado = document.getElementById("refugioEstado").value.trim();
            const tipo = document.getElementById("refugioTipo").value;
            const descripcion = document.getElementById("refugioDescripcion").value.trim();
            const sitioWeb = document.getElementById("refugioSitioWeb").value.trim();
            const instagram = document.getElementById("refugioInstagram").value.trim();
            const facebook = document.getElementById("refugioFacebook").value.trim();

            // Manejo básico de la imagen (simulado)
            const fileInput = document.getElementById("fileUpload");
            let imagen = "../../assets/refugios/default_refugio.png"; // Imagen por defecto
            if (fileInput.files && fileInput.files[0]) {
                imagen = "../../assets/refugios/refugio_1.png"; // Placeholder
            }

            // Construir el objeto
            const nuevaSolicitud = {
                id: "refugio-req-" + Date.now(),
                nombre,
                responsable,
                email,
                telefono,
                direccion,
                estado,
                tipo,
                descripcion,
                sitioWeb,
                instagram,
                facebook,
                imagen,
                fechaSolicitud: new Date().toISOString()
            };

            // Leer almacenamiento de pendientes
            let pendientes = JSON.parse(localStorage.getItem("refugiosPendientes")) || [];
            pendientes.push(nuevaSolicitud);
            localStorage.setItem("refugiosPendientes", JSON.stringify(pendientes));

            // Mostrar mensaje de éxito y redirigir
            if (typeof Swal !== "undefined") {
                Swal.fire({
                    title: '¡Solicitud Enviada!',
                    text: 'Hemos recibido la información de tu refugio o asociación. Nuestro equipo la revisará y pronto la verás en la plataforma.',
                    icon: 'success',
                    confirmButtonColor: '#e04b7b',
                    confirmButtonText: 'Entendido'
                }).then(() => {
                    window.location.href = "Refugios.html";
                });
            } else {
                alert('¡Solicitud Enviada! Hemos recibido la información de tu refugio. Nuestro equipo la revisará.');
                window.location.href = "Refugios.html";
            }
        });
    }
});
