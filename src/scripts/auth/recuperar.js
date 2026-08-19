document.addEventListener("DOMContentLoaded", () => {
    const formEmail = document.getElementById("formRecuperarEmail");
    const formPass = document.getElementById("formRecuperarPass");
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");

    let codigoGenerado = "";
    let emailRecuperacion = "";

    // Muestra/Ocultar contraseña
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

    // Paso 1: Validar correo y "enviar" código
    formEmail.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!formEmail.checkValidity()) {
            formEmail.classList.add("was-validated");
            return;
        }

        const emailInput = document.getElementById("recoveryEmail").value.trim().toLowerCase();
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        
        const usuarioExiste = usuarios.find(u => u.email.toLowerCase() === emailInput);

        if (!usuarioExiste) {
            Swal.fire({
                title: 'Correo no encontrado',
                text: 'No existe ninguna cuenta registrada con este correo electrónico.',
                icon: 'error',
                confirmButtonColor: '#e04b7b'
            });
            return;
        }

        // Generar código aleatorio de 4 dígitos
        codigoGenerado = Math.floor(1000 + Math.random() * 9000).toString();
        emailRecuperacion = emailInput;

        Swal.fire({
            title: '¡Código Enviado!',
            html: `Simulación: Se ha enviado un código a tu correo.<br><br><strong style="font-size: 24px; letter-spacing: 5px;">${codigoGenerado}</strong><br><br><small class="text-muted">En un entorno real, esto llegaría a tu bandeja de entrada.</small>`,
            icon: 'info',
            confirmButtonColor: '#2b2b2b'
        }).then(() => {
            step1.classList.add("d-none");
            step2.classList.remove("d-none");
        });
    });

    // Paso 2: Validar código y cambiar contraseña
    formPass.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const codigoInput = document.getElementById("recoveryCode").value.trim();
        const newPass = document.getElementById("newPassword").value;
        const confirmPass = document.getElementById("confirmNewPassword").value;

        let valido = true;

        if (codigoInput !== codigoGenerado) {
            document.getElementById("recoveryCode").classList.add("is-invalid");
            valido = false;
        } else {
            document.getElementById("recoveryCode").classList.remove("is-invalid");
        }

        if (newPass.length < 6) {
            document.getElementById("newPassword").classList.add("is-invalid");
            valido = false;
        } else {
            document.getElementById("newPassword").classList.remove("is-invalid");
        }

        if (newPass !== confirmPass || confirmPass === "") {
            document.getElementById("confirmNewPassword").classList.add("is-invalid");
            valido = false;
        } else {
            document.getElementById("confirmNewPassword").classList.remove("is-invalid");
        }

        if (!valido) return;

        // Actualizar contraseña en localStorage
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const index = usuarios.findIndex(u => u.email.toLowerCase() === emailRecuperacion);

        if (index !== -1) {
            usuarios[index].password = newPass;
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            
            Swal.fire({
                title: '¡Contraseña Actualizada!',
                text: 'Tu contraseña se ha cambiado correctamente. Ahora puedes iniciar sesión.',
                icon: 'success',
                confirmButtonColor: '#e04b7b'
            }).then(() => {
                window.location.href = "login.html";
            });
        }
    });

    // Restringir ingreso en el campo de código a solo números
    document.getElementById("recoveryCode").addEventListener("input", function (e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});
