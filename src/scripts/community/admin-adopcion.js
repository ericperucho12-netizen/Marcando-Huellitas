document.addEventListener("DOMContentLoaded", async function () {
    const form = document.getElementById("adopcion-form");
    const pageTitle = document.getElementById("pageTitle");
    
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get("id");

    if (editId) {
        // MODO EDICIÓN
        pageTitle.textContent = "Editar Mascota";
        
        try {
            const response = await fetch(`http://localhost:8080/api/mascotas/${editId}`);
            if (!response.ok) throw new Error("Mascota no encontrada");
            const mascota = await response.json();
            
            document.getElementById("id-mascota").value = mascota.id;
            document.getElementById("nombre-mascota").value = mascota.nombre || "";
            document.getElementById("especie").value = mascota.especie ? mascota.especie.toLowerCase() : "perro";
            document.getElementById("raza").value = mascota.raza || "";
            document.getElementById("sexo").value = mascota.sexo ? mascota.sexo.toLowerCase() : "macho";
            document.getElementById("tamano").value = mascota.tamano || "Mediano";
            document.getElementById("edad").value = mascota.edad || "";
            document.getElementById("estado").value = mascota.estado || "Disponible";
            document.getElementById("imagen-mascota").value = mascota.imagenUrl || "";
            document.getElementById("descripcion-mascota").value = mascota.descripcion || "";
            document.getElementById("caracteristicas").value = mascota.caracteristicas || "";

        } catch (error) {
            console.error("Error al cargar mascota:", error);
            alert("No se pudo cargar la información de la mascota.");
        }
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Validaciones básicas de Bootstrap (si tiene)
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add("was-validated");
            return;
        }

        // Recopilar datos
        const mascotaPayload = {
            nombre: document.getElementById("nombre-mascota").value.trim(),
            especie: document.getElementById("especie").value,
            raza: document.getElementById("raza").value.trim(),
            sexo: document.getElementById("sexo").value,
            tamano: document.getElementById("tamano").value,
            edad: document.getElementById("edad").value.trim(),
            estado: document.getElementById("estado").value,
            imagenUrl: document.getElementById("imagen-mascota").value.trim(),
            descripcion: document.getElementById("descripcion-mascota").value.trim(),
            caracteristicas: document.getElementById("caracteristicas").value.trim()
        };

        try {
            let response;
            if (editId) {
                // PUT /api/mascotas/{id}
                response = await fetch(`http://localhost:8080/api/mascotas/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(mascotaPayload)
                });
            } else {
                // POST /api/mascotas
                response = await fetch(`http://localhost:8080/api/mascotas`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(mascotaPayload)
                });
            }

            if (!response.ok) throw new Error("Error al guardar en base de datos");

            // Mostrar toast de éxito
            const toastEl = document.getElementById("toastExito");
            if (toastEl && typeof bootstrap !== 'undefined') {
                const toast = new bootstrap.Toast(toastEl);
                toast.show();
            }

            // Redirigir de regreso
            setTimeout(() => {
                window.location.href = "adpciones.html";
            }, 1500);
        } catch (error) {
            console.error("Error al guardar mascota:", error);
            alert("Ocurrió un error al intentar guardar la mascota.");
        }
    });
});
