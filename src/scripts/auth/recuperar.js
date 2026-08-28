document.addEventListener("DOMContentLoaded", () => {
    const formEmail = document.getElementById("formRecuperarEmail");
    const formPass = document.getElementById("formRecuperarPass");
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");

    // Mostrar/Ocultar contrasena
    document.querySelectorAll(".toggle-password").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const input = document.getElementById(targetId);
            const icon = btn.querySelector("i");
            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove("bi-eye");
                icon.classList.add("bi-eye-slash");
            } else {
                input.type = "password";
                icon.classList.remove("bi-eye-slash");
                icon.classList.add("bi-eye");
            }
        });
    });

    // Paso 1: Enviar correo real al backend
    formEmail.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!formEmail.checkValidity()) {
            formEmail.classList.add("was-validated");
            return;
        }

        const emailInput = document.getElementById("recoveryEmail").value.trim().toLowerCase();
        const btnSubmit = formEmail.querySelector("button[type=submit]");
        const originalText = btnSubmit ? btnSubmit.innerHTML : "";

        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';
        }

        try {
            const response = await fetch("/api/auth/recuperar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: emailInput })
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                Swal.fire({
                    title: "Correo no encontrado",
                    text: errorMsg || "No existe ninguna cuenta registrada con este correo.",
                    icon: "error",
                    confirmButtonColor: "#e04b7b"
                });
                return;
            }

            Swal.fire({
                title: "Correo Enviado",
                html: `Hemos enviado un codigo de recuperacion a <strong>${emailInput}</strong>.<br><br>Revisa tu bandeja de entrada (y spam).`,
                icon: "success",
                confirmButtonColor: "#2b2b2b"
            }).then(() => {
                step1.classList.add("d-none");
                step2.classList.remove("d-none");
            });

        } catch (error) {
            console.error("Error al solicitar recuperacion:", error);
            Swal.fire({
                title: "Error de conexion",
                text: "No se pudo conectar con el servidor. Verifica que el servidor este activo.",
                icon: "error",
                confirmButtonColor: "#e04b7b"
            });
        } finally {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalText;
            }
        }
    });

    // Paso 2: Enviar token + nueva contrasena al backend
    formPass.addEventListener("submit", async (e) => {
        e.preventDefault();

        const tokenInput = document.getElementById("recoveryCode").value.trim();
        const newPass = document.getElementById("newPassword").value;
        const confirmPass = document.getElementById("confirmNewPassword").value;

        let valido = true;

        // Validar token
        if (!tokenInput) {
            document.getElementById("recoveryCode").classList.add("is-invalid");
            valido = false;
        } else {
            document.getElementById("recoveryCode").classList.remove("is-invalid");
        }

        // Validar nueva contrasena (min 8 chars, mayuscula, minuscula, numero)
        const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!regexPass.test(newPass)) {
            document.getElementById("newPassword").classList.add("is-invalid");
            valido = false;
        } else {
            document.getElementById("newPassword").classList.remove("is-invalid");
        }

        // Validar confirmacion
        if (newPass !== confirmPass || confirmPass === "") {
            document.getElementById("confirmNewPassword").classList.add("is-invalid");
            valido = false;
        } else {
            document.getElementById("confirmNewPassword").classList.remove("is-invalid");
        }

        if (!valido) return;

        const btnSubmit = formPass.querySelector("button[type=submit]");
        const originalText = btnSubmit ? btnSubmit.innerHTML : "";

        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Actualizando...';
        }

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: tokenInput, nuevaPassword: newPass })
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                document.getElementById("recoveryCode").classList.add("is-invalid");
                Swal.fire({
                    title: "Token invalido",
                    text: errorMsg || "El codigo es incorrecto o ha expirado. Solicita uno nuevo.",
                    icon: "error",
                    confirmButtonColor: "#e04b7b"
                });
                return;
            }

            Swal.fire({
                title: "Contrasena Actualizada",
                text: "Tu contrasena se cambio correctamente. Ahora puedes iniciar sesion.",
                icon: "success",
                confirmButtonColor: "#e04b7b"
            }).then(() => {
                window.location.href = "login.html";
            });

        } catch (error) {
            console.error("Error al resetear contrasena:", error);
            Swal.fire({
                title: "Error de conexion",
                text: "No se pudo conectar con el servidor.",
                icon: "error",
                confirmButtonColor: "#e04b7b"
            });
        } finally {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalText;
            }
        }
    });

    // Solo permitir numeros y letras en el campo de token (UUID puede tener guiones)
    const recoveryCodeInput = document.getElementById("recoveryCode");
    if (recoveryCodeInput) {
        recoveryCodeInput.addEventListener("input", function () {
            // Permitir UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
            this.value = this.value.replace(/[^a-f0-9-]/gi, '');
        });
    }
});
