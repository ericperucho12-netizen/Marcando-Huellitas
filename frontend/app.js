document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");

    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const telefono = document.getElementById("telefono");
    const mensaje = document.getElementById("mensaje");
    const formStatus = document.getElementById("formStatus");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        limpiarValidaciones();
        limpiarEstado();

        const formularioValido = validarFormulario();

        if (!formularioValido) {
            mostrarEstado("Por favor corrige los campos marcados.", "error");
            return;
        }

        mostrarEstado("Enviando mensaje...", "info");

        try {
            const formData = new FormData(form);

            const respuesta = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (respuesta.ok) {
                form.reset();
                limpiarValidaciones();
                mostrarEstado("Mensaje enviado correctamente. ¡Gracias por contactarnos!", "success");
            } else {
                mostrarEstado("No se pudo enviar el mensaje. Intenta nuevamente.", "error");
            }

        } catch (error) {
            mostrarEstado("Error de conexión. Revisa tu internet e intenta otra vez.", "error");
        }
    });

    function validarFormulario() {
        let valido = true;

        const nombreValor = nombre.value.trim();
        const emailValor = email.value.trim();
        const telefonoValor = telefono.value.trim();
        const mensajeValor = mensaje.value.trim();

        const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/;
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telefonoSoloNumeros = telefonoValor.replace(/\D/g, "");

        if (!regexNombre.test(nombreValor)) {
            marcarInvalido(nombre);
            valido = false;
        } else {
            marcarValido(nombre);
        }

        if (!regexEmail.test(emailValor)) {
            marcarInvalido(email);
            valido = false;
        } else {
            marcarValido(email);
        }

        if (telefonoSoloNumeros.length !== 10) {
            marcarInvalido(telefono);
            valido = false;
        } else {
            telefono.value = telefonoSoloNumeros;
            marcarValido(telefono);
        }

        if (mensajeValor.length < 10) {
            marcarInvalido(mensaje);
            valido = false;
        } else {
            marcarValido(mensaje);
        }

        return valido;
    }

    function marcarInvalido(input) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
    }

    function marcarValido(input) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
    }

    function limpiarValidaciones() {
        const campos = [nombre, email, telefono, mensaje];

        campos.forEach(function (campo) {
            campo.classList.remove("is-invalid");
            campo.classList.remove("is-valid");
        });
    }

    function limpiarEstado() {
        if (formStatus) {
            formStatus.textContent = "";
            formStatus.className = "mt-3 text-center fw-bold";
        }
    }

    function mostrarEstado(texto, tipo) {
        formStatus.textContent = texto;

        if (tipo === "success") {
            formStatus.className = "mt-3 text-center fw-bold text-success";
        } else if (tipo === "info") {
            formStatus.className = "mt-3 text-center fw-bold text-primary";
        } else {
            formStatus.className = "mt-3 text-center fw-bold text-danger";
        }
    }
});