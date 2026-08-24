document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registroRefugioForm");
    
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (window.requireAuth && !window.requireAuth('registrar un refugio')) return;

            // Leer usuario de localStorage para el usuarioId
            const usuarioStr = localStorage.getItem('usuarioActual');
            let usuarioId = null;
            if (usuarioStr) {
                try {
                    const usuario = JSON.parse(usuarioStr);
                    usuarioId = usuario.id;
                } catch(e) {}
            }

            // Leer los datos del formulario
            const nombre = document.getElementById("refugioNombre").value.trim();
            const responsable = document.getElementById("refugioResponsable").value.trim();
            const correo = document.getElementById("refugioEmail").value.trim();
            const telefono = document.getElementById("refugioTelefono").value.trim();
            const direccion = document.getElementById("refugioDireccion").value.trim();
            const estadoEntidad = document.getElementById("refugioEstado").value.trim();
            const tipoOrganizacion = document.getElementById("refugioTipo").value;
            const descripcion = document.getElementById("refugioDescripcion").value.trim();
            const sitioWeb = document.getElementById("refugioSitioWeb").value.trim();
            const instagram = document.getElementById("refugioInstagram").value.trim();
            const facebook = document.getElementById("refugioFacebook").value.trim();

            // Manejo básico de la imagen (simulado)
            const fileInput = document.getElementById("fileUpload");
            let imagenUrl = "../../assets/refugios/LaCasitadeCrispin.jpg"; // Imagen por defecto
            if (fileInput.files && fileInput.files[0]) {
                imagenUrl = "../../assets/refugios/Chespi.png"; // Placeholder
            }

            // Construir el objeto
            const nuevaSolicitud = {
                usuarioId,
                nombre,
                responsable,
                correo,
                telefono,
                direccion,
                estadoEntidad,
                tipoOrganizacion,
                descripcion,
                sitioWeb,
                instagram,
                facebook,
                imagenUrl,
                estatus: "PENDIENTE"
            };

            try {
                const response = await fetch('http://localhost:8080/api/refugios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevaSolicitud)
                });

                if (response.ok) {
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
                } else {
                    alert('Error al enviar la solicitud al servidor.');
                }
            } catch (err) {
                console.error(err);
                alert('Error de conexión con el servidor.');
            }
        });
    }
});
