document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("loginForm");

    const userOrEmail = document.getElementById("userOrEmail");
    const password = document.getElementById("password");

    const alertContainer = document.getElementById("alertContainer");

    formulario.addEventListener("submit", function (event) {

        event.preventDefault();

        limpiarValidaciones();
        limpiarAlerta();

        const userOrEmailValor = userOrEmail.value.trim();
        const passwordValor = password.value;

        let formularioValido = true;

        // validar que los campos no estén vacíos

        if (!validarCampoVacio(userOrEmailValor)) {
            marcarError(userOrEmail, "Ingresa tu usuario o correo electrónico");
            formularioValido = false;
        }

        if (!validarCampoVacio(passwordValor)) {
            marcarError(password, "La contraseña es obligatoria");
            formularioValido = false;
        }

        if (!formularioValido) {
            return;
        }

        // validar formato

        if (userOrEmailValor.includes("@")) {
            if (!validarEmail(userOrEmailValor)) {
                marcarError(userOrEmail, "Ingresa un correo electrónico válido");
                formularioValido = false;
            } else {
                marcarCorrecto(userOrEmail);
            }
        } else {
            if (!validarNombre(userOrEmailValor)) {
                marcarError(userOrEmail, "Ingresa un nombre de usuario válido");
                formularioValido = false;
            } else {
                marcarCorrecto(userOrEmail);
            }
        }

        if (passwordValor.length < 1) {
            marcarError(password, "La contraseña es obligatoria");
            formularioValido = false;
        } else {
            marcarCorrecto(password);
        }

        if (!formularioValido) {
            return;
        }

        // validar credenciales contra los usuarios guardados en localStorage
        // (mismos usuarios que se registran en registro.js)

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuarioEncontrado = usuarios.find(function (usuario) {
            const coincideIdentificador =
                usuario.email === userOrEmailValor ||
                usuario.nombre === userOrEmailValor;

            return coincideIdentificador && usuario.password === passwordValor;
        });

        if (!usuarioEncontrado) {
            mostrarAlertaError("Usuario o contraseña incorrectos");
            marcarError(userOrEmail, "Verifica tu usuario o correo");
            marcarError(password, "Verifica tu contraseña");
            return;
        }

        // guardar sesión del usuario actual
        sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));

        mostrarAlertaExito("¡Bienvenido/a de nuevo, " + usuarioEncontrado.nombre + "!");

        formulario.reset();
        limpiarValidaciones();

        setTimeout(function () {
            window.location.href = "../../../index.html";
        }, 1200);

    });

    // funciones para validar

    function validarCampoVacio(valor) {
        return valor !== "";
    }

    function validarEmail(valor) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(valor);
    }

    function validarNombre(valor) {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9._\s-]{3,50}$/;
        return regex.test(valor);
    }

    function marcarError(campo, mensaje) {
        campo.classList.add("is-invalid");
        campo.classList.remove("is-valid");
        let mensajeError = campo.parentElement.querySelector(".invalid-feedback");
        if (mensajeError) {
            mensajeError.textContent = mensaje;
        }
    }

    function marcarCorrecto(campo) {
        campo.classList.add("is-valid");
        campo.classList.remove("is-invalid");
    }

    function limpiarValidaciones() {
        const campos = [userOrEmail, password];

        campos.forEach(function (campo) {
            campo.classList.remove("is-valid");
            campo.classList.remove("is-invalid");
        });
    }

    function mostrarAlertaExito(mensaje) {
        alertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
        ${mensaje}
            <button 
            type="button" 
            class="btn-close" 
            data-bs-dismiss="alert">
            </button>
        </div>
        `;
    }

    function mostrarAlertaError(mensaje) {
        alertContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
        ${mensaje}
            <button 
            type="button" 
            class="btn-close" 
            data-bs-dismiss="alert">
            </button>
        </div>
        `;
    }

    function limpiarAlerta() {
        if (alertContainer) {
            alertContainer.innerHTML = "";
        }
    }

    /* Mostrar y ocultar contraseña en formulario de login */
    const toggleButtons = document.querySelectorAll(".toggle-password");

    toggleButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const targetId = button.getAttribute("data-target");
            const passwordInput = document.getElementById(targetId);
            const icon = button.querySelector("i");

            if (!passwordInput) return;

            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                icon.classList.remove("bi-eye");
                icon.classList.add("bi-eye-slash");
            } else {
                passwordInput.type = "password";
                icon.classList.remove("bi-eye-slash");
                icon.classList.add("bi-eye");
            }
        });
    });

});
