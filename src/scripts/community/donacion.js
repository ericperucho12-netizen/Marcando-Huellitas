// VIDEOS DEL BANNER

const donationVideo = document.getElementById("donationVideo");

const videos = [
    "../../assets/donaciones/video1.mp4",
    "../../assets/donaciones/video2.mp4"
];

let videoActual = 0;

if (donationVideo) {

    donationVideo.addEventListener("ended", () => {

        videoActual++;

        if (videoActual >= videos.length) {
            videoActual = 0;
        }

        donationVideo.src = videos[videoActual];

        donationVideo.load();

        donationVideo.play().catch(error => {
            console.log("No se pudo reproducir el video:", error);
        });

    });

}


// HISTORIAS QUE INSPIRAN

document.addEventListener("DOMContentLoaded", () => {

    const storiesCarousel =
        document.querySelector("#storiesCarousel");

    if (
        storiesCarousel &&
        typeof bootstrap !== "undefined"
    ) {

        new bootstrap.Carousel(storiesCarousel, {
            interval: false,
            ride: false,
            pause: "hover",
            wrap: true
        });

    }


    const stories = {

        tiago: {

            title: "Tiago",

            image: "../../assets/donaciones/Tiago.jpeg",

            text: `
                <p>
                    Tiago fue encontrado solo y asustado en la calle.
                    Al principio desconfiaba de las personas y necesitaba
                    un lugar donde sentirse seguro.
                </p>

                <p>
                    Con alimento, cuidados y mucho cariño comenzó a recuperar
                    la confianza. Poco a poco volvió a sentirse tranquilo
                    y comenzó a mostrar su verdadera personalidad.
                </p>

                <p>
                    Hoy Tiago es un gatito feliz, lleno de energía y con
                    muchas ganas de disfrutar cada día. Gracias al apoyo
                    recibido pudo tener una segunda oportunidad. ❤️🐱
                </p>
            `
        },

        junior: {

            title: "Junior",

            image: "../../assets/donaciones/Junior.jpeg",

            text: `
                <p>
                    Junior fue rescatado con desnutrición y algunas heridas.
                    Cuando llegó al refugio estaba débil y necesitaba
                    atención, alimento y muchos cuidados.
                </p>

                <p>
                    Durante su recuperación recibió alimento, atención
                    veterinaria y mucho cariño. Poco a poco recuperó su
                    energía y comenzó nuevamente a correr y jugar.
                </p>

                <p>
                    Hoy Junior es un perrito alegre que disfruta cada día
                    y demuestra que una segunda oportunidad puede cambiar
                    completamente una vida. ❤️🐶
                </p>
            `
        },

        michi: {

            title: "Michi",

            image: "../../assets/donaciones/Michi.jpeg",

            text: `
                <p>
                    Michi fue encontrada abandonada y con mucho miedo.
                    Al llegar al refugio necesitaba paciencia, cariño
                    y un lugar donde pudiera sentirse protegida.
                </p>

                <p>
                    Al principio le costaba confiar en las personas,
                    pero con el paso del tiempo comenzó a sentirse segura.
                    Cada pequeño avance fue una muestra de que estaba
                    recuperando la confianza.
                </p>

                <p>
                    Hoy Michi es una perrita llena de vida, cariño y alegría.
                    Ahora disfruta de una nueva oportunidad rodeada de amor
                    y cuidados. ❤️🐶
                </p>
            `
        }

    };


    const storyButtons =
        document.querySelectorAll(".story-button");

    const storyFull =
        document.getElementById("storyFull");

    const storyFullTitle =
        document.getElementById("storyFullTitle");

    const storyFullImage =
        document.getElementById("storyFullImage");

    const storyFullText =
        document.getElementById("storyFullText");

    const closeStory =
        document.getElementById("closeStory");


    storyButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const storyId =
                button.dataset.story;

            const story =
                stories[storyId];

            if (!story) {

                console.error(
                    "Historia no encontrada:",
                    storyId
                );

                return;
            }


            if (storyFullTitle) {

                storyFullTitle.textContent =
                    story.title;

            }


            if (storyFullImage) {

                storyFullImage.src =
                    story.image;

                storyFullImage.alt =
                    story.title;

            }


            if (storyFullText) {

                storyFullText.innerHTML =
                    story.text;

            }


            if (storyFull) {

                storyFull.classList.add("active");

                setTimeout(() => {

                    storyFull.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }, 100);

            }

        });

    });


    if (closeStory) {

        closeStory.addEventListener("click", () => {

            if (storyFull) {

                storyFull.classList.remove("active");

            }


            if (storiesCarousel) {

                storiesCarousel.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        });

    }

});


// META DE DONACIÓN

const META_TOTAL = 10000;


// OBTENER DONACIONES

function obtenerDonaciones() {

    const datos =
        localStorage.getItem("donaciones");

    if (!datos) {
        return [];
    }

    try {

        const donaciones =
            JSON.parse(datos);

        if (!Array.isArray(donaciones)) {
            return [];
        }

        return donaciones;

    } catch (error) {

        console.error(
            "Error al leer las donaciones:",
            error
        );

        return [];

    }

}


// OBTENER TOTAL DONADO

function obtenerTotalDonado() {

    const donaciones =
        obtenerDonaciones();

    return donaciones.reduce(
        (total, donacion) => {

            const monto =
                Number(donacion.monto);

            if (
                isNaN(monto) ||
                monto <= 0
            ) {

                return total;

            }

            return total + monto;

        },
        0
    );

}


// ACTUALIZAR META

function actualizarMeta() {

    const currentAmount =
        document.getElementById("currentAmount");

    const goalAmount =
        document.getElementById("goalAmount");

    const progressPercent =
        document.getElementById("progressPercent");

    const progressBar =
        document.getElementById("progressBar");

    const remainingAmount =
        document.getElementById("remainingAmount");


    if (
        !currentAmount ||
        !goalAmount ||
        !progressPercent ||
        !progressBar
    ) {

        return;

    }


    const totalDonado =
        obtenerTotalDonado();


    const montoActual =
        Math.min(
            totalDonado,
            META_TOTAL
        );


    const porcentaje =
        Math.min(
            (montoActual / META_TOTAL) * 100,
            100
        );


    const faltante =
        Math.max(
            META_TOTAL - totalDonado,
            0
        );


    currentAmount.textContent =
        `$${montoActual.toLocaleString("es-MX")} MXN`;


    goalAmount.textContent =
        `$${META_TOTAL.toLocaleString("es-MX")} MXN`;


    progressPercent.textContent =
        `${Math.round(porcentaje)}%`;


    progressBar.style.width =
        `${porcentaje}%`;


    if (remainingAmount) {

        remainingAmount.textContent =
            `$${faltante.toLocaleString("es-MX")} MXN`;

    }


    console.log("Meta actualizada:", {
        totalDonado,
        montoActual,
        porcentaje,
        faltante
    });

}


// REGISTRAR DONACIÓN

function registrarDonacion(monto, datos = {}) {

    const montoNumerico =
        Number(monto);


    if (
        isNaN(montoNumerico) ||
        montoNumerico <= 0
    ) {

        return false;

    }


    const donaciones =
        obtenerDonaciones();


    const nuevaDonacion = {

        monto: montoNumerico,

        frecuencia:
            datos.frecuencia || "una_vez",

        paymentMethod:
            datos.paymentMethod || "",

        name:
            datos.name || "",

        email:
            datos.email || "",

        phone:
            datos.phone || "",

        fecha:
            new Date().toISOString()

    };


    donaciones.push(
        nuevaDonacion
    );


    localStorage.setItem(
        "donaciones",
        JSON.stringify(donaciones)
    );


    console.log(
        "Donación guardada:",
        nuevaDonacion
    );


    actualizarMeta();


    return true;

}


// FORMULARIO DE DONACIÓN

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.querySelector("#donationForm");


    if (!form) {
        return;
    }


    const amountInput =
        document.querySelector("#amount");

    const phoneInput =
        document.querySelector("#phone");

    const donationAlert =
        document.querySelector("#donationAlert");

    const closeAlert =
        document.querySelector("#closeAlert");

    const successScreen =
        document.querySelector("#donationSuccess");


    let currentStep = 1;


    // FORMATO DE DINERO

    function formatMoney(amount) {

        return Number(amount).toLocaleString(
            "es-MX",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    }


    // FORMATO DEL MONTO

    if (amountInput) {

        amountInput.addEventListener("blur", () => {

            const value =
                parseFloat(
                    amountInput.value.replace(",", ".")
                );


            if (
                !isNaN(value) &&
                value > 0
            ) {

                amountInput.value =
                    value.toFixed(2);

            }

        });


        amountInput.addEventListener("input", () => {

            let value =
                amountInput.value;


            value =
                value.replace(
                    /[^0-9.]/g,
                    ""
                );


            const parts =
                value.split(".");


            if (parts.length > 2) {

                value =
                    parts[0] +
                    "." +
                    parts.slice(1).join("");

            }


            const finalParts =
                value.split(".");


            if (finalParts[1]) {

                value =
                    finalParts[0] +
                    "." +
                    finalParts[1].substring(0, 2);

            }


            amountInput.value =
                value;

        });

    }


    // TELÉFONO

    if (phoneInput) {

        phoneInput.addEventListener("input", () => {

            phoneInput.value =
                phoneInput.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

        });

    }


    // ALERTAS

    function showAlert(title, message) {

        const alertTitle =
            document.querySelector("#alertTitle");

        const alertMessage =
            document.querySelector("#alertMessage");


        if (alertTitle) {

            alertTitle.textContent =
                title;

        }


        if (alertMessage) {

            alertMessage.textContent =
                message;

        }


        if (donationAlert) {

            donationAlert.classList.add("show");

            donationAlert.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    }


    function hideAlert() {

        if (donationAlert) {

            donationAlert.classList.remove("show");

        }

    }


    if (closeAlert) {

        closeAlert.addEventListener(
            "click",
            hideAlert
        );

    }


    // CAMBIAR PASO

    function showStep(stepNumber) {

        currentStep =
            stepNumber;


        document
            .querySelectorAll(".donation-step-content")
            .forEach(section => {

                section.classList.remove("active");

            });


        const selectedSection =
            document.querySelector(
                `.donation-step-content[data-content="${stepNumber}"]`
            );


        if (selectedSection) {

            selectedSection.classList.add("active");

        }


        document
            .querySelectorAll(".step")
            .forEach(step => {

                const number =
                    Number(step.dataset.step);


                step.classList.toggle(
                    "active",
                    number <= stepNumber
                );

            });


        hideAlert();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // BOTONES SIGUIENTE

    document
        .querySelectorAll(".btn-next")
        .forEach(button => {

            button.addEventListener("click", () => {

                const nextStep =
                    Number(button.dataset.next);


                if (
                    currentStep === 1 &&
                    !validateStepOne()
                ) {

                    return;

                }


                if (
                    currentStep === 2 &&
                    !validateStepTwo()
                ) {

                    return;

                }


                if (
                    currentStep === 3 &&
                    !validateStepThree()
                ) {

                    return;

                }


                if (nextStep === 4) {

                    updateSummary();

                }


                showStep(nextStep);

            });

        });


    // BOTONES REGRESAR

    document
        .querySelectorAll(".btn-back")
        .forEach(button => {

            button.addEventListener("click", () => {

                const previousStep =
                    Number(button.dataset.back);


                showStep(previousStep);

            });

        });


    // MONTOS PREDEFINIDOS

    document
        .querySelectorAll(".amount-option")
        .forEach(button => {

            button.addEventListener("click", () => {

                const amount =
                    Number(button.dataset.amount);


                if (amountInput) {

                    amountInput.value =
                        amount.toFixed(2);

                }


                document
                    .querySelectorAll(".amount-option")
                    .forEach(option => {

                        option.classList.remove(
                            "selected"
                        );

                    });


                button.classList.add(
                    "selected"
                );

            });

        });


    // OTRO MONTO

    if (amountInput) {

        amountInput.addEventListener("input", () => {

            document
                .querySelectorAll(".amount-option")
                .forEach(button => {

                    button.classList.remove(
                        "selected"
                    );

                });

        });

    }


    // VALIDAR PASO 1

    function validateStepOne() {

        let valid = true;


        const amountError =
            document.querySelector("#amountError");

        const frequencyError =
            document.querySelector("#frequencyError");


        if (amountError) {
            amountError.textContent = "";
        }


        if (frequencyError) {
            frequencyError.textContent = "";
        }


        const amount =
            parseFloat(
                amountInput.value.replace(",", ".")
            );


        if (
            isNaN(amount) ||
            amount <= 0
        ) {

            if (amountError) {

                amountError.textContent =
                    "Ingresa un monto válido.";

            }


            showAlert(
                "Monto inválido",
                "Ingresa una cantidad mayor a $0.00 MXN."
            );


            valid = false;

        }


        const frequency =
            document.querySelector(
                'input[name="frequency"]:checked'
            );


        if (!frequency) {

            if (frequencyError) {

                frequencyError.textContent =
                    "Selecciona una frecuencia.";

            }


            showAlert(
                "Selecciona una frecuencia",
                "Elige si deseas donar una vez, semanal o mensualmente."
            );


            valid = false;

        }


        return valid;

    }


    // VALIDAR PASO 2

    function validateStepTwo() {

        const payment =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );


        const paymentError =
            document.querySelector("#paymentError");


        if (paymentError) {
            paymentError.textContent = "";
        }


        if (!payment) {

            if (paymentError) {

                paymentError.textContent =
                    "Selecciona un método de donación.";

            }


            showAlert(
                "Método de donación",
                "Selecciona transferencia, depósito o PayPal."
            );


            return false;

        }


        return true;

    }


    // VALIDAR PASO 3

    function validateStepThree() {

        let valid = true;


        const name =
            document.querySelector("#name");

        const email =
            document.querySelector("#email");

        const phone =
            document.querySelector("#phone");


        const nameError =
            document.querySelector("#nameError");

        const emailError =
            document.querySelector("#emailError");

        const phoneError =
            document.querySelector("#phoneError");


        if (nameError) {
            nameError.textContent = "";
        }


        if (emailError) {
            emailError.textContent = "";
        }


        if (phoneError) {
            phoneError.textContent = "";
        }


        if (
            !name ||
            name.value.trim() === ""
        ) {

            if (nameError) {

                nameError.textContent =
                    "Ingresa tu nombre completo.";

            }

            valid = false;

        }


        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !email ||
            email.value.trim() === "" ||
            !emailRegex.test(email.value.trim())
        ) {

            if (emailError) {

                emailError.textContent =
                    "Ingresa un correo electrónico válido.";

            }

            valid = false;

        }


        if (
            phone &&
            phone.value.trim() !== ""
        ) {

            if (
                !/^\d{10}$/.test(
                    phone.value.trim()
                )
            ) {

                if (phoneError) {

                    phoneError.textContent =
                        "El teléfono debe contener exactamente 10 números.";

                }

                valid = false;

            }

        }


        const payment =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );


        const proof =
            document.querySelector("#proof");


        const proofError =
            document.querySelector("#proofError");


        if (proofError) {
            proofError.textContent = "";
        }


        if (
            payment &&
            (
                payment.value === "transferencia" ||
                payment.value === "deposito"
            )
        ) {

            if (
                !proof ||
                !proof.files ||
                proof.files.length === 0
            ) {

                if (proofError) {

                    proofError.textContent =
                        "Adjunta el comprobante de tu donación.";

                }

                valid = false;

            }

        }


        if (!valid) {

            showAlert(
                "Revisa tus datos",
                "Hay información pendiente o incorrecta. Corrígela antes de continuar."
            );

        }


        return valid;

    }


    // MÉTODOS DE PAGO

    const paymentInputs =
        document.querySelectorAll(
            'input[name="paymentMethod"]'
        );


    paymentInputs.forEach(input => {

        input.addEventListener("change", () => {

            const transferencia =
                document.querySelector("#transferenciaInfo");

            const deposito =
                document.querySelector("#depositoInfo");

            const paypal =
                document.querySelector("#paypalInfo");

            const proofField =
                document.querySelector("#proofField");


            if (transferencia) {
                transferencia.classList.remove("active");
            }


            if (deposito) {
                deposito.classList.remove("active");
            }


            if (paypal) {
                paypal.classList.remove("active");
            }


            if (input.value === "transferencia") {

                if (transferencia) {
                    transferencia.classList.add("active");
                }

                if (proofField) {
                    proofField.style.display = "flex";
                }

            }


            if (input.value === "deposito") {

                if (deposito) {
                    deposito.classList.add("active");
                }

                if (proofField) {
                    proofField.style.display = "flex";
                }

            }


            if (input.value === "paypal") {

                if (paypal) {
                    paypal.classList.add("active");
                }

                if (proofField) {
                    proofField.style.display = "none";
                }

            }

        });

    });


    // ACTUALIZAR RESUMEN

    function updateSummary() {

        const amount =
            parseFloat(
                amountInput.value.replace(",", ".")
            );


        const frequency =
            document.querySelector(
                'input[name="frequency"]:checked'
            );


        const payment =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );


        const name =
            document.querySelector("#name");

        const email =
            document.querySelector("#email");


        const summaryAmount =
            document.querySelector("#summaryAmount");

        const summaryFrequency =
            document.querySelector("#summaryFrequency");

        const summaryPayment =
            document.querySelector("#summaryPayment");

        const summaryName =
            document.querySelector("#summaryName");

        const summaryEmail =
            document.querySelector("#summaryEmail");


        if (summaryAmount) {

            summaryAmount.textContent =
                `$${formatMoney(amount)} MXN`;

        }


        const frequencyNames = {

            una_vez: "Una vez",

            semanal: "Semanal",

            mensual: "Mensual"

        };


        if (
            summaryFrequency &&
            frequency
        ) {

            summaryFrequency.textContent =
                frequencyNames[frequency.value] ||
                frequency.value;

        }


        const paymentNames = {

            transferencia:
                "Transferencia bancaria",

            deposito:
                "Depósito bancario",

            paypal:
                "PayPal"

        };


        if (
            summaryPayment &&
            payment
        ) {

            summaryPayment.textContent =
                paymentNames[payment.value] ||
                payment.value;

        }


        if (
            summaryName &&
            name
        ) {

            summaryName.textContent =
                name.value.trim();

        }


        if (
            summaryEmail &&
            email
        ) {

            summaryEmail.textContent =
                email.value.trim();

        }

    }


    // ENVIAR DONACIÓN

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const terms =
                document.querySelector("#terms");

            const termsError =
                document.querySelector("#termsError");


            if (termsError) {
                termsError.textContent = "";
            }


            if (
                !terms ||
                !terms.checked
            ) {

                if (termsError) {

                    termsError.textContent =
                        "Debes confirmar la donación.";

                }


                showAlert(
                    "Confirma tu donación",
                    "Debes aceptar la confirmación antes de finalizar."
                );


                return;

            }


            const amount =
                parseFloat(
                    amountInput.value.replace(",", ".")
                );


            const frequency =
                document.querySelector(
                    'input[name="frequency"]:checked'
                );


            const payment =
                document.querySelector(
                    'input[name="paymentMethod"]:checked'
                );


            const name =
                document.querySelector("#name");

            const email =
                document.querySelector("#email");

            const phone =
                document.querySelector("#phone");


            const donationData = {

                monto: amount,

                frecuencia:
                    frequency
                        ? frequency.value
                        : "",

                paymentMethod:
                    payment
                        ? payment.value
                        : "",

                name:
                    name
                        ? name.value.trim()
                        : "",

                email:
                    email
                        ? email.value.trim()
                        : "",

                phone:
                    phone
                        ? phone.value.trim()
                        : ""

            };


            console.log(
                "Donación:",
                donationData
            );


            // PAYPAL

            if (
                payment &&
                payment.value === "paypal"
            ) {

                console.log(
                    "Preparando pago con PayPal:",
                    donationData
                );


                showAlert(
                    "PayPal",
                    "La conexión con PayPal se integrará mediante Spring Boot."
                );


                return;

            }


            // TRANSFERENCIA Y DEPÓSITO

            const registrada =
                registrarDonacion(
                    amount,
                    donationData
                );


            if (!registrada) {

                showAlert(
                    "Error",
                    "No fue posible registrar la donación."
                );


                return;

            }


            form.style.display =
                "none";


            if (successScreen) {

                successScreen.classList.add(
                    "active"
                );

            }

        }
    );


    // INICIALIZAR FORMULARIO

    showStep(1);

});


// INICIALIZAR META

document.addEventListener(
    "DOMContentLoaded",
    () => {

        actualizarMeta();

    }
);


// ACTUALIZAR META CUANDO CAMBIA LOCALSTORAGE

window.addEventListener(
    "storage",
    event => {

        if (
            event.key === "donaciones"
        ) {

            actualizarMeta();

        }

    }
);
