document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const alertContainer = document.getElementById("alertContainer"); // registro
    const loginAlertContainer = document.getElementById("loginAlertContainer"); // login

    // Mostrar alerta reutilizable
    function mostrarAlerta(container, tipo, mensaje) {
        if (!container) return;
        container.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
        `;
    }

    // Toggle mostrar/ocultar contraseña con .toggle-password
    function initTogglePassword() {
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
                    if (icon) { icon.classList.remove("bi-eye"); icon.classList.add("bi-eye-slash"); }
                } else {
                    passwordInput.type = "password";
                    if (icon) { icon.classList.remove("bi-eye-slash"); icon.classList.add("bi-eye"); }
                }
            });
        });
    }

    // Validaciones
    function validarCampoVacio(valor) { return valor !== ""; }
    function validarNombre(valor) { const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/; return regex.test(valor); }
    function validarTelefono(valor) { const regex = /^[0-9]{10}$/; return regex.test(valor); }
    function validarEmail(valor) { const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return regex.test(valor); }
    function validarPassword(valor) { const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; return regex.test(valor); }
    function validarConfirmPassword(password, confirm) { return password === confirm; }

    function marcarError(campo, mensaje) {
        if (!campo) return;
        campo.classList.add("is-invalid");
        campo.classList.remove("is-valid");
        const mensajeError = campo.parentElement.querySelector(".invalid-feedback");
        if (mensajeError) mensajeError.textContent = mensaje;
    }

    function marcarCorrecto(campo) {
        if (!campo) return;
        campo.classList.add("is-valid");
        campo.classList.remove("is-invalid");
    }

    function limpiarValidaciones(campos) {
        if (!campos || !campos.length) return;
        campos.forEach(function (campo) {
            if (!campo) return;
            campo.classList.remove("is-valid");
            campo.classList.remove("is-invalid");
        });
    }

    // Manejo de registro (si existe el formulario)
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const nombre = document.getElementById("nombre");
            const telefono = document.getElementById("telefono");
            const email = document.getElementById("email");
            const password = document.getElementById("password");
            const confirmPassword = document.getElementById("confirmPassword");

            limpiarValidaciones([nombre, telefono, email, password, confirmPassword]);
            if (alertContainer) alertContainer.innerHTML = "";

            const nombreValor = nombre ? nombre.value.trim() : "";
            const telefonoValor = telefono ? telefono.value.trim() : "";
            const emailValor = email ? email.value.trim() : "";
            const passwordValor = password ? password.value : "";
            const confirmPasswordValor = confirmPassword ? confirmPassword.value : "";

            let formularioValido = true;

            if (!validarCampoVacio(nombreValor)) { marcarError(nombre, "El nombre es obligatorio"); formularioValido = false; }
            if (!validarCampoVacio(telefonoValor)) { marcarError(telefono, "El teléfono es obligatorio"); formularioValido = false; }
            if (!validarCampoVacio(emailValor)) { marcarError(email, "El correo es obligatorio"); formularioValido = false; }
            if (!validarCampoVacio(passwordValor)) { marcarError(password, "La contraseña es obligatoria"); formularioValido = false; }
            if (!validarCampoVacio(confirmPasswordValor)) { marcarError(confirmPassword, "Confirma tu contraseña"); formularioValido = false; }
            if (!formularioValido) return;

            if (!validarNombre(nombreValor)) { marcarError(nombre, "El nombre solo debe contener letras"); formularioValido = false; } else marcarCorrecto(nombre);
            if (!validarTelefono(telefonoValor)) { marcarError(telefono, "El teléfono debe contener 10 números"); formularioValido = false; } else marcarCorrecto(telefono);
            if (!validarEmail(emailValor)) { marcarError(email, "Ingresa un correo válido"); formularioValido = false; } else marcarCorrecto(email);
            if (!validarPassword(passwordValor)) { marcarError(password, "Mínimo 8 caracteres, una mayúscula, una minúscula y un número"); formularioValido = false; } else marcarCorrecto(password);
            if (!validarConfirmPassword(passwordValor, confirmPasswordValor)) { marcarError(confirmPassword, "Las contraseñas no coinciden"); formularioValido = false; } else marcarCorrecto(confirmPassword);
            if (!formularioValido) return;

            const usuarioRegistro = JSON.parse(localStorage.getItem("usuarios")) || [];
            const existeUsuario = usuarioRegistro.some(function (usuario) { return usuario.email === emailValor; });
            if (existeUsuario) { marcarError(email, "Este correo ya está registrado"); return; }

            const usuario = { nombre: nombreValor, telefono: telefonoValor, email: emailValor, password: passwordValor };
            usuarioRegistro.push(usuario);
            localStorage.setItem("usuarios", JSON.stringify(usuarioRegistro));

            mostrarAlerta(alertContainer, 'success', '¡Usuario registrado correctamente!');
            registerForm.reset();
            limpiarValidaciones([nombre, telefono, email, password, confirmPassword]);
        });
    }

    // login
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const userOrEmail = document.getElementById("userOrEmail");
            const passwordLogin = document.getElementById("passwordLogin");

            limpiarValidaciones([userOrEmail, passwordLogin]);
            if (loginAlertContainer) loginAlertContainer.innerHTML = "";

            const userOrEmailVal = userOrEmail ? userOrEmail.value.trim() : "";
            const passwordVal = passwordLogin ? passwordLogin.value : "";

            let valido = true;
            if (!validarCampoVacio(userOrEmailVal)) { marcarError(userOrEmail, "Ingresa usuario o correo"); valido = false; }
            if (!validarCampoVacio(passwordVal)) { marcarError(passwordLogin, "Ingresa contraseña"); valido = false; }
            if (!valido) return;

            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const usuarioEncontrado = usuarios.find(function (u) {
                return (u.email === userOrEmailVal || u.nombre === userOrEmailVal) && u.password === passwordVal;
            });

            if (usuarioEncontrado) {
                mostrarAlerta(loginAlertContainer, 'success', 'Sesión iniciada correctamente');
                loginForm.reset();
                limpiarValidaciones([userOrEmail, passwordLogin]);
            } else {
                mostrarAlerta(loginAlertContainer, 'danger', 'Usuario o contraseña inválidos');
            }
        });
    }

    // Vista entre login y registro
    const showRegisterBtn = document.getElementById("showRegisterBtn");
    const showLoginBtn = document.getElementById("showLoginBtn");
    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");

    // botón inactivo por defecto
    if (showRegisterBtn) showRegisterBtn.classList.remove('active');
    if (showLoginBtn) showLoginBtn.classList.remove('active');

    if (showRegisterBtn && loginSection && registerSection) {
        showRegisterBtn.addEventListener("click", function () {
            loginSection.classList.add("d-none");
            registerSection.classList.remove("d-none");
            initTogglePassword();
            // un botón activo y el otro no activo
            showRegisterBtn.classList.add('active');
            if (showLoginBtn) showLoginBtn.classList.remove('active');
        });
    }

    if (showLoginBtn && loginSection && registerSection) {
        showLoginBtn.addEventListener("click", function () {
            registerSection.classList.add("d-none");
            loginSection.classList.remove("d-none");
            initTogglePassword();
            // un botón activo y el otro no activo
            showLoginBtn.classList.add('active');
            if (showRegisterBtn) showRegisterBtn.classList.remove('active');
        });
    }

    initTogglePassword();

});
