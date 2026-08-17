document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const alertContainer = document.getElementById("alertContainer"); // registro
    const loginAlertContainer = document.getElementById("loginAlertContainer"); // login

    // Mostrar alerta reutilizable
    function mostrarAlerta(container, tipo, mensaje) {
        if (!container) return;
        // Estilo especial para errores de login: icono y borde destacado
        if (container === loginAlertContainer && tipo === 'danger') {
            container.innerHTML = `
        <div class="alert auth-alert-danger alert-dismissible fade show" role="alert">
            <div class="d-flex align-items-start">
                <i class="bi bi-exclamation-circle-fill fs-4 me-2" aria-hidden="true"></i>
                <div class="flex-grow-1">${mensaje}</div>
                <button type="button" class="btn-close ms-3" data-bs-dismiss="alert" aria-label="Cerrar"></button>
            </div>
        </div>
        `;
            return;
        }

        // Comportamiento por defecto
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

    // Validación en tiempo real para campos de login (misma lógica/estilos que registro)
    function initLoginFieldValidation() {
        const userOrEmailEl = document.getElementById("userOrEmail");
        const passwordLoginEl = document.getElementById("passwordLogin");

        if (userOrEmailEl) {
            // marcar como válido si cumple mientras escribe
            userOrEmailEl.addEventListener('input', function () {
                const val = userOrEmailEl.value.trim();
                if (val === '') { userOrEmailEl.classList.remove('is-valid'); userOrEmailEl.classList.remove('is-invalid'); return; }
                if (val.includes('@')) {
                    if (validarEmail(val)) marcarCorrecto(userOrEmailEl); else { userOrEmailEl.classList.remove('is-valid'); userOrEmailEl.classList.remove('is-invalid'); }
                } else {
                    if (validarNombre(val)) marcarCorrecto(userOrEmailEl); else { userOrEmailEl.classList.remove('is-valid'); userOrEmailEl.classList.remove('is-invalid'); }
                }
            });

            // al perder foco, mostrar error si no es válido
            userOrEmailEl.addEventListener('blur', function () {
                const val = userOrEmailEl.value.trim();
                if (val === '') { userOrEmailEl.classList.remove('is-valid'); userOrEmailEl.classList.remove('is-invalid'); return; }
                if (val.includes('@')) {
                    if (!validarEmail(val)) marcarError(userOrEmailEl, 'Ingresa un correo válido'); else marcarCorrecto(userOrEmailEl);
                } else {
                    if (!validarNombre(val)) marcarError(userOrEmailEl, 'Ingresa un nombre/usuario válido (mín 3 letras)'); else marcarCorrecto(userOrEmailEl);
                }
            });
        }

        if (passwordLoginEl) {
            passwordLoginEl.addEventListener('input', function () {
                const val = passwordLoginEl.value;
                if (val === '') { passwordLoginEl.classList.remove('is-valid'); passwordLoginEl.classList.remove('is-invalid'); return; }
                if (validarPassword(val)) marcarCorrecto(passwordLoginEl); else { passwordLoginEl.classList.remove('is-valid'); passwordLoginEl.classList.remove('is-invalid'); }
            });

            passwordLoginEl.addEventListener('blur', function () {
                const val = passwordLoginEl.value;
                if (val === '') { passwordLoginEl.classList.remove('is-valid'); passwordLoginEl.classList.remove('is-invalid'); return; }
                if (!validarPassword(val)) marcarError(passwordLoginEl, 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número'); else marcarCorrecto(passwordLoginEl);
            });
        }
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

        const userOrEmail =
            document.getElementById("userOrEmail");

        const passwordLogin =
            document.getElementById("passwordLogin");

        limpiarValidaciones([
            userOrEmail,
            passwordLogin
        ]);

        if (loginAlertContainer) {
            loginAlertContainer.innerHTML = "";
        }

        const userOrEmailVal =
            userOrEmail
                ? userOrEmail.value.trim()
                : "";

        const passwordVal =
            passwordLogin
                ? passwordLogin.value
                : "";

        let valido = true;

        if (!validarCampoVacio(userOrEmailVal)) {
            marcarError(
                userOrEmail,
                "Ingresa usuario o correo"
            );
            valido = false;
        }

        if (!validarCampoVacio(passwordVal)) {
            marcarError(
                passwordLogin,
                "Ingresa contraseña"
            );
            valido = false;
        }

        if (!valido) {
            return;
        }

        const usuariosLogin =
            JSON.parse(
                localStorage.getItem("usuarios")
            ) || [];

        const usuarioEncontrado =
            usuariosLogin.find(function (usuario) {
                const coincideUsuario =
                    usuario.email === userOrEmailVal ||
                    usuario.nombre === userOrEmailVal;

                const coincidePassword =
                    usuario.password === passwordVal;

                return (
                    coincideUsuario &&
                    coincidePassword
                );
            });

        if (usuarioEncontrado) {

            sessionStorage.setItem(
                "usuarioActual",
                JSON.stringify(
                    usuarioEncontrado
                )
            );

            mostrarAlerta(
                loginAlertContainer,
                "success",
                "¡Bienvenido/a, " +
                    usuarioEncontrado.nombre +
                    "!"
            );

            loginForm.reset();

            limpiarValidaciones([
                userOrEmail,
                passwordLogin
            ]);

            setTimeout(function () {
                window.location.href =
                    "../../../index.html";
            }, 1200);

        } else {

            mostrarAlerta(
                loginAlertContainer,
                "danger",
                "Usuario o contraseña inválidos"
            );
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
            // limpiar validaciones de login al mostrar registro
            const userOrEmailEl = document.getElementById("userOrEmail");
            const passwordLoginEl = document.getElementById("passwordLogin");
            limpiarValidaciones([userOrEmailEl, passwordLoginEl]);
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
            // limpiar validaciones de registro al mostrar login
            const nombre = document.getElementById("nombre");
            const telefono = document.getElementById("telefono");
            const email = document.getElementById("email");
            const password = document.getElementById("password");
            const confirmPassword = document.getElementById("confirmPassword");
            limpiarValidaciones([nombre, telefono, email, password, confirmPassword]);
            // un botón activo y el otro no activo
            showLoginBtn.classList.add('active');
            if (showRegisterBtn) showRegisterBtn.classList.remove('active');
        });
    }

    initTogglePassword();
    // Inicializar validación en tiempo real para login
    initLoginFieldValidation();
    
    // usuario de prueba para login
    const usuarioPrueba = {
        nombre: "Andrea Pérez",
        telefono: "5512345678",
        email: "andrea_123@gmail.com",
        password: "Contraseña123",
        rol: "user"
    };

    // usuario administrador
    const usuarioAdmin = {
        nombre: "Administrador",
        telefono: "5500000000",
        email: "admin@marcandohuellitas.com",
        password: "Admin123",
        rol: "admin"
    };

    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (!usuariosGuardados.some(usuario => usuario.email === usuarioPrueba.email)) {
        usuariosGuardados.push(usuarioPrueba);
    }
    if (!usuariosGuardados.some(usuario => usuario.email === usuarioAdmin.email)) {
        usuariosGuardados.push(usuarioAdmin);
    }

    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
});  