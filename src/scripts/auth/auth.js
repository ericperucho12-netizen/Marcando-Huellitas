
// Handle Google Sign-In Callback (Global function so the script can call it)
window.handleGoogleLogin = async function(response) {
    const loginAlertContainer = document.getElementById("loginAlertContainer");
    if (!loginAlertContainer) return;
    
    try {
        const fetchRes = await fetch("http://localhost:8080/api/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: response.credential })
        });
        
        if (!fetchRes.ok) {
            const errorTexto = await fetchRes.text();
            
            // Reutilizar mostrarAlerta de DOMContentLoaded si podemos, 
            // pero como estamos en window scope, lo hacemos directo:
            loginAlertContainer.innerHTML = `
            <div class="alert auth-alert-danger alert-dismissible fade show" role="alert">
                <div class="d-flex align-items-start">
                    <i class="bi bi-exclamation-circle-fill fs-4 me-2" aria-hidden="true"></i>
                    <div class="flex-grow-1">${errorTexto || "Error al autenticar con Google"}</div>
                    <button type="button" class="btn-close ms-3" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                </div>
            </div>`;
            return;
        }
        
        const usuarioEncontrado = await fetchRes.json();
        console.log("✅ [Google Login] Backend devolvió:", JSON.stringify(usuarioEncontrado));
        console.log("✅ [Google Login] Rol recibido:", usuarioEncontrado.rol);
        // Borramos cualquier sesión anterior para asegurar datos frescos (incluyendo rol)
        sessionStorage.removeItem("usuarioActual");
        sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));
        console.log("✅ [Google Login] Guardado en sessionStorage:", sessionStorage.getItem("usuarioActual"));
        
        loginAlertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            ¡Bienvenido/a con Google, ${usuarioEncontrado.nombre}!
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
        
        setTimeout(function () {
            window.location.href = "../../../index.html";
        }, 1200);
        
    } catch (error) {
        console.error("Error al iniciar con Google:", error);
        loginAlertContainer.innerHTML = `
        <div class="alert auth-alert-danger alert-dismissible fade show" role="alert">
            No se pudo conectar con el servidor.
        </div>`;
    }
};
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
        registerForm.addEventListener("submit", async function (event) {
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

            try {
                const response = await fetch("http://localhost:8080/api/auth/registro", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nombre: nombreValor,
                        apellido: "", // El formulario no tiene apellido, así que mandamos vacío por ahora
                        correo: emailValor,
                        password: passwordValor
                    })
                });

                if (!response.ok) {
                    const errorMsg = await response.text();
                    marcarError(email, errorMsg || "No se pudo registrar");
                    return;
                }

                mostrarAlerta(alertContainer, 'success', '¡Usuario registrado correctamente!');
                registerForm.reset();
                limpiarValidaciones([nombre, telefono, email, password, confirmPassword]);

                // Opcional: Cambiar a la vista de login
                setTimeout(() => {
                    authContainer.classList.remove("right-panel-active");
                    authContainer.classList.remove("mobile-register");
                    cleanAllValidations();
                }, 1500);

            } catch (error) {
                console.error("Error al registrar:", error);
                marcarError(email, "Error de conexión con el servidor");
            }
        });
    }

    // login
if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
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

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo: userOrEmailVal,
                    password: passwordVal
                })
            });

            if (!response.ok) {
                const errorTexto = await response.text();
                mostrarAlerta(loginAlertContainer, "danger", errorTexto || "Usuario o contraseña inválidos");
                marcarError(userOrEmail, "Verifica tus credenciales");
                marcarError(passwordLogin, "Verifica tus credenciales");
                return;
            }

            const usuarioEncontrado = await response.json();

            sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));

            mostrarAlerta(loginAlertContainer, "success", "¡Bienvenido/a, " + usuarioEncontrado.nombre + "!");

            loginForm.reset();
            limpiarValidaciones([userOrEmail, passwordLogin]);

            setTimeout(function () {
                window.location.href = "../../../index.html";
            }, 1200);

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            mostrarAlerta(loginAlertContainer, "danger", "No se pudo conectar con el servidor.");
        }
    });
} 

    // Vista entre login y registro (Sliding Panel)
    const signUpGhost = document.getElementById("signUpGhost");
    const signInGhost = document.getElementById("signInGhost");
    const showRegisterMobile = document.getElementById("showRegisterMobile");
    const showLoginMobile = document.getElementById("showLoginMobile");
    const authContainer = document.getElementById("authContainer");

    // Limpiar validaciones comunes
    const cleanAllValidations = () => {
        const userOrEmailEl = document.getElementById("userOrEmail");
        const passwordLoginEl = document.getElementById("passwordLogin");
        const nombre = document.getElementById("nombre");
        const telefono = document.getElementById("telefono");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirmPassword");
        limpiarValidaciones([userOrEmailEl, passwordLoginEl, nombre, telefono, email, password, confirmPassword]);
    };

    // Toggle Desktop (Animación css)
    if (signUpGhost) {
        signUpGhost.addEventListener("click", () => {
            authContainer.classList.add("right-panel-active");
            cleanAllValidations();
        });
    }

    if (signInGhost) {
        signInGhost.addEventListener("click", () => {
            authContainer.classList.remove("right-panel-active");
            cleanAllValidations();
        });
    }

    // Toggle Mobile (Clase mobile-register)
    if (showRegisterMobile) {
        showRegisterMobile.addEventListener("click", () => {
            authContainer.classList.add("mobile-register");
            cleanAllValidations();
        });
    }

    if (showLoginMobile) {
        showLoginMobile.addEventListener("click", () => {
            authContainer.classList.remove("mobile-register");
            cleanAllValidations();
        });
    }

    initTogglePassword();
    // Inicializar validación en tiempo real para login
    initLoginFieldValidation();
    
    // Se eliminó la creación de usuarios de prueba en localStorage para usar la base de datos real
});  
