document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("registerForm");

    const nombre = document.getElementById("nombre");
    const telefono = document.getElementById("telefono");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    const alertContainer = document.getElementById("alertContainer");


    formulario.addEventListener("submit", function (event) {

        event.preventDefault();

        limpiarValidaciones();
        limpiarAlerta();


        const nombreValor = nombre.value.trim();
        const telefonoValor = telefono.value.trim();
        const emailValor = email.value.trim();
        const passwordValor = password.value;
        const confirmPasswordValor = confirmPassword.value;


        let formularioValido = true;

        //validar que los campos no estén vacíos

        if (!validarCampoVacio(nombreValor)) {
            marcarError(nombre, "El nombre es obligatorio");
            formularioValido = false;
        }


        if (!validarCampoVacio(telefonoValor)) {
            marcarError(
                telefono,
                "El teléfono es obligatorio"
            );
            formularioValido = false;
        }


        if (!validarCampoVacio(emailValor)) {
            marcarError(
                email,
                "El correo es obligatorio"
            );
            formularioValido = false;
        }


        if (!validarCampoVacio(passwordValor)) {
            marcarError(
                password,
                "La contraseña es obligatoria"
            );
            formularioValido = false;
        }


        if (!validarCampoVacio(confirmPasswordValor)) {
            marcarError(
                confirmPassword,
                "Confirma tu contraseña"
            );
            formularioValido = false;
        }


        if (!formularioValido) {
            return;
        }

        //validar los campos del formulario


        if (!validarNombre(nombreValor)) {
            marcarError(
                nombre,
                "El nombre solo debe contener letras"
            );
            formularioValido = false;
        } else {
            marcarCorrecto(nombre);
        }


        if (!validarTelefono(telefonoValor)) {
            marcarError(
                telefono,
                "El teléfono debe contener 10 números"
            );
            formularioValido = false;
        } else {
            marcarCorrecto(telefono);
        }


        if (!validarEmail(emailValor)) {
            marcarError(
                email,
                "Ingresa un correo válido"
            );
            formularioValido = false;
        } else {
            marcarCorrecto(email);
        }

        if (!validarPassword(passwordValor)) {
            marcarError(
                password,
                "Mínimo 8 caracteres, una mayúscula, una minúscula y un número"
            );
            formularioValido = false;
        } else {
            marcarCorrecto(password);
        }


        if (!validarConfirmPassword(passwordValor, confirmPasswordValor)) {
            marcarError(
                confirmPassword,
                "Las contraseñas no coinciden"
            );
            formularioValido = false;
        } else {
            marcarCorrecto(confirmPassword);
        }


        if (!formularioValido) {
            return;
        }

        // localStorage

        const usuarioRegistro = JSON.parse(localStorage.getItem("usuarios")) || [];
        const existeUsuario = usuarioRegistro.some(function(usuario){
            return usuario.email === emailValor;
        });


        if(existeUsuario){
            marcarError(
                email,
                "Este correo ya está registrado"
            );
            return;
        }

        const usuario = {

            nombre: nombreValor,
            telefono: telefonoValor,
            email: emailValor,
            password: passwordValor

        };



        usuarioRegistro.push(usuario);
        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarioRegistro)
        );


        mostrarAlertaExito(
            "¡Usuario registrado correctamente!"
        );

        formulario.reset();

        limpiarValidaciones();


    });

    //funciones para validar


    function validarCampoVacio(valor){
        return valor !== "";
    }


    function validarNombre(valor){
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/;
        return regex.test(valor);
    }



    function validarTelefono(valor){
        const regex = /^[0-9]{10}$/;
        return regex.test(valor);
    }



    function validarEmail(valor){
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(valor);
    }



    function validarPassword(valor){
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(valor);
    }



    function validarConfirmPassword(password, confirm){
        return password === confirm;
    }



    function marcarError(campo, mensaje){
        campo.classList.add("is-invalid");
        campo.classList.remove("is-valid");
        let mensajeError = campo.parentElement.querySelector(".invalid-feedback");
        if(mensajeError){
            mensajeError.textContent = mensaje;
        }
    }



    function marcarCorrecto(campo){
        campo.classList.add("is-valid");
        campo.classList.remove("is-invalid");
    }



    function limpiarValidaciones(){
        const campos = [
            nombre,
            telefono,
            email,
            password,
            confirmPassword
        ];

        campos.forEach(function(campo){
            campo.classList.remove("is-valid");
            campo.classList.remove("is-invalid");
        });
    }



    function mostrarAlertaExito(mensaje){
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



    function limpiarAlerta(){
        if(alertContainer){
            alertContainer.innerHTML = "";
        }
    }

    

});