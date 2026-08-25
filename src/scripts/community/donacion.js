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
                    Hoy Tiago es un perrito feliz, lleno de energía y con
                    muchas ganas de disfrutar cada día. Gracias al apoyo
                    recibido pudo tener una segunda oportunidad. ❤️
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
                    completamente una vida. ❤️
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
                    Hoy Michi es una gatita llena de vida, cariño y alegría.
                    Ahora disfruta de una nueva oportunidad rodeada de amor
                    y cuidados. ❤️
                </p>
            `
        },

        nube: {

            title: "Nube",

            image: "../../assets/donaciones/Nube.jpeg",

            text: `
                <p>
                    Nube llegó al refugio después de ser encontrada cerca
                    de una zona donde varios animales buscaban un lugar
                    para pasar la noche. Desde el primer día llamó la
                    atención por su manera tranquila de observar.
                </p>

                <p>
                    Con el paso de las semanas comenzó a adaptarse a su
                    nueva rutina. Le gustaba descansar en lugares soleados
                    y acercarse cuando alguien se sentaba cerca de ella.
                </p>

                <p>
                    Tiempo después, una familia conoció a Nube y decidió
                    darle una oportunidad. Hoy vive en un hogar donde tiene
                    una familia que la cuida y la acompaña, demostrando que
                    adoptar puede cambiar una vida. ❤️
                </p>
            `
        },

        bruno: {

            title: "Bruno",

            image: "../../assets/donaciones/Bruno.jpeg",

            text: `
                <p>
                    Bruno llegó después de haber pasado por momentos
                    difíciles en la calle. Tenía algunas heridas y su cuerpo
                    mostraba las marcas de todo lo que había tenido que
                    enfrentar antes de encontrar ayuda.
                </p>

                <p>
                    Durante su recuperación necesitó atención veterinaria,
                    descanso y tiempo. Cada día era un pequeño avance:
                    una herida que sanaba, una caminata más tranquila y una
                    mirada que poco a poco volvía a llenarse de esperanza.
                </p>

                <p>
                    Después de recuperarse, Bruno tuvo la oportunidad de
                    comenzar de nuevo. Hoy disfruta de un hogar donde es
                    cuidado y querido, demostrando que incluso después de
                    las heridas más difíciles siempre puede existir una
                    nueva oportunidad. ❤️
                </p>
            `
        },

        toby: {

            title: "Toby",

            image: "../../assets/donaciones/Toby.jpeg",

            text: `
                <p>
                    Toby pasó varios días rondando una colonia hasta que
                    una persona comenzó a dejarle un espacio para descansar.
                    Con el paso del tiempo, su presencia se volvió parte
                    de la rutina del lugar.
                </p>

                <p>
                    Un día, mientras buscaba una familia para él, alguien
                    se interesó en conocerlo. Después de varios encuentros,
                    descubrieron que Toby era un gato tranquilo, curioso
                    y muy cariñoso.
                </p>

                <p>
                    Finalmente llegó el momento de cambiar su historia:
                    Toby fue adoptado. Ahora tiene un hogar donde puede
                    dormir tranquilo, jugar y recibir el cariño que durante
                    tanto tiempo estuvo esperando. ❤️
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


// DONACIONES

async function obtenerDonaciones() {
    try {
        const response = await fetch('http://localhost:8080/api/donaciones');
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Error al obtener donaciones del servidor:", error);
        return [];
    }
}

async function obtenerTotalDonado() {
    const donaciones = await obtenerDonaciones();
    return donaciones.reduce(
        (total, donacion) => {
            const monto = Number(donacion.monto);
            if (isNaN(monto) || monto <= 0) {
                return total;
            }
            return total + monto;
        },
        0
    );
}


// ACTUALIZAR META

async function actualizarMeta() {

    const currentAmount =
        document.getElementById("currentAmount");

    if (!currentAmount) {
        return;
    }

    const totalDonado =
        await obtenerTotalDonado();

    let valorActual =
        Number(
            currentAmount.dataset.valor || 0
        );

    if (valorActual === totalDonado) {

        currentAmount.textContent =
            `$${totalDonado.toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;

        return;
    }

    const diferencia =
        Math.abs(totalDonado - valorActual);

    let velocidad = 1;

    if (diferencia >= 10000) {
        velocidad = 100;
    } else if (diferencia >= 1000) {
        velocidad = 50;
    } else if (diferencia >= 100) {
        velocidad = 2;
    }

    const direccion =
        totalDonado > valorActual ? 1 : -1;

    function contar() {

        valorActual +=
            velocidad * direccion;

        if (
            direccion === 1 &&
            valorActual >= totalDonado
        ) {
            valorActual = totalDonado;
        }

        if (
            direccion === -1 &&
            valorActual <= totalDonado
        ) {
            valorActual = totalDonado;
        }

        currentAmount.textContent =
            `$${valorActual.toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;

        currentAmount.dataset.valor =
            valorActual;

        if (valorActual !== totalDonado) {
            requestAnimationFrame(contar);
        }

    }

    requestAnimationFrame(contar);

}


// REGISTRAR DONACIÓN

async function registrarDonacion(monto, datos = {}) {

    const montoNumerico = Number(monto);

    if (isNaN(montoNumerico) || montoNumerico <= 0) {
        return false;
    }

    try {
        const usuarioActual = JSON.parse(sessionStorage.getItem("usuarioActual") || "null");
        
        const payload = {
            monto: montoNumerico,
            frecuencia: datos.frecuencia || "una_vez",
            metodoPago: datos.paymentMethod || "Transferencia",
            nombreDonante: datos.name || (usuarioActual ? usuarioActual.nombre : "Anónimo"),
            correoDonante: datos.email || (usuarioActual ? usuarioActual.correo : ""),
            telefonoDonante: datos.phone || "",
            usuario_id: usuarioActual ? usuarioActual.id : null,
            estado: 'COMPLETADA'
        };

        const headers = { 'Content-Type': 'application/json' };
        if (usuarioActual && usuarioActual.token) {
            headers['Authorization'] = 'Bearer ' + usuarioActual.token;
        }

        const response = await fetch('http://localhost:8080/api/donaciones', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            await actualizarMeta();
            return true;
        } else {
            console.error("Error al registrar la donación");
            return false;
        }

    } catch (error) {
        console.error("Error en la conexión con el servidor:", error);
        return false;
    }

}


// FORMULARIO

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("donationForm");

    if (!form) {
        return;
    }

    const amountInput =
        document.getElementById("amount");

    const phoneInput =
        document.getElementById("phone");

    const cardNumber =
        document.getElementById("cardNumber");

    const cardExpiry =
        document.getElementById("cardExpiry");

    const cardCvv =
        document.getElementById("cardCvv");

    const proof =
        document.getElementById("proof");

    const proofField =
        document.getElementById("proofField");

    const donationAlert =
        document.getElementById("donationAlert");

    const successScreen =
        document.getElementById("donationSuccess");

    const closeAlert =
        document.getElementById("closeAlert");

    let currentStep = 1;


    // MONTO INICIAL

    if (amountInput) {
        amountInput.value = "";
    }


    function formatMoney(amount) {

        return Number(amount).toLocaleString(
            "es-MX",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    }


    // ALERTA

    function showAlert(title, message) {

        const alertTitle =
            document.getElementById("alertTitle");

        const alertMessage =
            document.getElementById("alertMessage");

        if (alertTitle) {
            alertTitle.textContent = title;
        }

        if (alertMessage) {
            alertMessage.textContent = message;
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


    // MONTO

    if (amountInput) {

        amountInput.addEventListener("input", () => {

            let value =
                amountInput.value;

            value =
                value.replace(/[^0-9.]/g, "");

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

            document
                .querySelectorAll(".amount-option")
                .forEach(button => {

                    button.classList.remove("selected");

                });

        });


        amountInput.addEventListener("blur", () => {

            const value =
                parseFloat(amountInput.value);

            if (
                !isNaN(value) &&
                value > 0
            ) {

                amountInput.value =
                    value.toFixed(2);

            }

        });

    }


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

                button.classList.add("selected");

            });

        });


    // TELÉFONO

    if (phoneInput) {

        phoneInput.addEventListener("input", () => {

            phoneInput.value =
                phoneInput.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

        });

    }


    // TARJETA

    if (cardNumber) {

        cardNumber.addEventListener("input", () => {

            let value =
                cardNumber.value
                    .replace(/\D/g, "")
                    .slice(0, 16);

            let formatted = "";

            for (
                let i = 0;
                i < value.length;
                i++
            ) {

                if (
                    i > 0 &&
                    i % 4 === 0
                ) {
                    formatted += " ";
                }

                formatted += value[i];

            }

            cardNumber.value =
                formatted;

        });

    }


    // FECHA DE VENCIMIENTO

    if (cardExpiry) {

        cardExpiry.addEventListener("input", () => {

            let value =
                cardExpiry.value
                    .replace(/\D/g, "")
                    .slice(0, 4);

            if (value.length >= 3) {

                value =
                    value.substring(0, 2) +
                    "/" +
                    value.substring(2);

            }

            cardExpiry.value =
                value;

        });

    }


    // CVV

    if (cardCvv) {

        cardCvv.addEventListener("input", () => {

            cardCvv.value =
                cardCvv.value
                    .replace(/\D/g, "")
                    .slice(0, 4);

        });

    }


    // MOSTRAR PASO

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


    // VALIDAR PASO 1

    function validateStepOne() {

        let valid = true;

        const amountError =
            document.getElementById("amountError");

        const frequencyError =
            document.getElementById("frequencyError");

        if (amountError) {
            amountError.textContent = "";
        }

        if (frequencyError) {
            frequencyError.textContent = "";
        }

        const amount =
            amountInput
                ? parseFloat(amountInput.value)
                : 0;

        if (
            isNaN(amount) ||
            amount <= 0
        ) {

            if (amountError) {

                amountError.textContent =
                    "Ingresa un monto mayor a $0.00.";

            }

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

            valid = false;

        }

        if (!valid) {

            showAlert(
                "Completa la donación",
                "Ingresa un monto válido y selecciona la frecuencia."
            );

        }

        return valid;

    }


    // VALIDAR TARJETA

    function validateCard() {

        let valid = true;

        const cardNumberError =
            document.getElementById("cardNumberError");

        const cardExpiryError =
            document.getElementById("cardExpiryError");

        const cardCvvError =
            document.getElementById("cardCvvError");

        if (cardNumberError) {
            cardNumberError.textContent = "";
        }

        if (cardExpiryError) {
            cardExpiryError.textContent = "";
        }

        if (cardCvvError) {
            cardCvvError.textContent = "";
        }

        const number =
            cardNumber
                ? cardNumber.value.replace(/\s/g, "")
                : "";

        if (!/^\d{16}$/.test(number)) {

            if (cardNumberError) {

                cardNumberError.textContent =
                    "Ingresa los 16 dígitos de tu tarjeta.";

            }

            valid = false;

        }

        const expiry =
            cardExpiry
                ? cardExpiry.value
                : "";

        if (!/^\d{2}\/\d{2}$/.test(expiry)) {

            if (cardExpiryError) {

                cardExpiryError.textContent =
                    "Usa el formato MM/AA.";

            }

            valid = false;

        } else {

            const [month, year] =
                expiry.split("/").map(Number);

            const currentDate =
                new Date();

            const currentYear =
                currentDate.getFullYear() % 100;

            const currentMonth =
                currentDate.getMonth() + 1;

            if (
                month < 1 ||
                month > 12
            ) {

                if (cardExpiryError) {

                    cardExpiryError.textContent =
                        "El mes debe estar entre 01 y 12.";

                }

                valid = false;

            }

            if (
                year < currentYear ||
                (
                    year === currentYear &&
                    month < currentMonth
                )
            ) {

                if (cardExpiryError) {

                    cardExpiryError.textContent =
                        "La tarjeta está vencida.";

                }

                valid = false;

            }

        }

        const cvv =
            cardCvv
                ? cardCvv.value
                : "";

        if (!/^\d{3,4}$/.test(cvv)) {

            if (cardCvvError) {

                cardCvvError.textContent =
                    "Ingresa un CVV válido.";

            }

            valid = false;

        }

        if (!valid) {

            showAlert(
                "Datos de tarjeta incorrectos",
                "Revisa el número, la fecha de vencimiento y el CVV."
            );

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
            document.getElementById("paymentError");

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
                "Selecciona una opción para continuar."
            );

            return false;

        }

        if (
            payment.value === "tarjeta"
        ) {

            return validateCard();

        }

        return true;

    }


    // VALIDAR PASO 3

    function validateStepThree() {

        let valid = true;

        const name =
            document.getElementById("name");

        const email =
            document.getElementById("email");

        const phone =
            document.getElementById("phone");

        const nameError =
            document.getElementById("nameError");

        const emailError =
            document.getElementById("emailError");

        const phoneError =
            document.getElementById("phoneError");

        const proofError =
            document.getElementById("proofError");

        if (nameError) {
            nameError.textContent = "";
        }

        if (emailError) {
            emailError.textContent = "";
        }

        if (phoneError) {
            phoneError.textContent = "";
        }

        if (proofError) {
            proofError.textContent = "";
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
            !emailRegex.test(
                email.value.trim()
            )
        ) {

            if (emailError) {

                emailError.textContent =
                    "Ingresa un correo válido.";

            }

            valid = false;

        }

        if (
            phone &&
            phone.value.trim() !== "" &&
            !/^\d{10}$/.test(
                phone.value.trim()
            )
        ) {

            if (phoneError) {

                phoneError.textContent =
                    "Debe contener 10 dígitos.";

            }

            valid = false;

        }

        const payment =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );

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

            } else {

                const file =
                    proof.files[0];

                const maxSize =
                    5 * 1024 * 1024;

                if (file.size > maxSize) {

                    if (proofError) {

                        proofError.textContent =
                            "El archivo no debe superar los 5 MB.";

                    }

                    valid = false;

                }

            }

        }

        if (!valid) {

            showAlert(
                "Revisa tus datos",
                "Hay información pendiente o incorrecta."
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
                document.getElementById(
                    "transferenciaInfo"
                );

            const deposito =
                document.getElementById(
                    "depositoInfo"
                );

            const tarjeta =
                document.getElementById(
                    "tarjetaInfo"
                );

            const paypal =
                document.getElementById(
                    "paypalInfo"
                );

            [
                transferencia,
                deposito,
                tarjeta,
                paypal
            ].forEach(element => {

                if (element) {
                    element.classList.remove("active");
                }

            });

            if (proofField) {
                proofField.style.display = "none";
            }

            if (
                input.value === "transferencia"
            ) {

                if (transferencia) {
                    transferencia.classList.add("active");
                }

                if (proofField) {
                    proofField.style.display = "flex";
                }

            }

            if (
                input.value === "deposito"
            ) {

                if (deposito) {
                    deposito.classList.add("active");
                }

                if (proofField) {
                    proofField.style.display = "flex";
                }

            }

            if (
                input.value === "tarjeta"
            ) {

                if (tarjeta) {
                    tarjeta.classList.add("active");
                }

            }

            if (
                input.value === "paypal"
            ) {

                if (paypal) {
                    paypal.classList.add("active");
                }

            }

        });

    });


    // ACTUALIZAR RESUMEN

    function updateSummary() {

        const amount =
            parseFloat(
                amountInput.value
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
            document.getElementById("name");

        const email =
            document.getElementById("email");

        const summaryAmount =
            document.getElementById("summaryAmount");

        const summaryFrequency =
            document.getElementById("summaryFrequency");

        const summaryPayment =
            document.getElementById("summaryPayment");

        const summaryName =
            document.getElementById("summaryName");

        const summaryEmail =
            document.getElementById("summaryEmail");

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
                frequencyNames[
                    frequency.value
                ];

        }

        const paymentNames = {

            transferencia:
                "Transferencia bancaria",

            deposito:
                "Depósito bancario",

            tarjeta:
                "Tarjeta",

            paypal:
                "PayPal"

        };

        if (
            summaryPayment &&
            payment
        ) {

            summaryPayment.textContent =
                paymentNames[
                    payment.value
                ];

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


    // BOTONES SIGUIENTE

    document
        .querySelectorAll(".btn-next")
        .forEach(button => {

            button.addEventListener("click", () => {

                const nextStep =
                    Number(
                        button.dataset.next
                    );

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
                    Number(
                        button.dataset.back
                    );

                showStep(previousStep);

            });

        });


    // ENVIAR FORMULARIO

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();
            if (window.requireAuth && !window.requireAuth('realizar un donativo')) return;

            const terms =
                document.getElementById("terms");

            const termsError =
                document.getElementById("termsError");

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
                    "Debes confirmar que los datos son correctos."
                );

                return;

            }

            const amount =
                parseFloat(
                    amountInput.value
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
                document.getElementById("name");

            const email =
                document.getElementById("email");

            const phone =
                document.getElementById("phone");

            if (
                !payment ||
                !frequency ||
                !amount ||
                amount <= 0
            ) {

                showAlert(
                    "Datos incompletos",
                    "Revisa la información de tu donación."
                );

                return;

            }


            // PAYPAL

            if (
                payment.value === "paypal"
            ) {

                showAlert(
                    "PayPal",
                    "La integración con PayPal se realizará mediante el backend."
                );

                return;

            }


            // TARJETA

            if (
                payment.value === "tarjeta"
            ) {

                if (!validateCard()) {
                    return;
                }

                showAlert(
                    "Pago con tarjeta",
                    "La conexión con el proveedor de pagos se integrará mediante Spring Boot."
                );

                return;

            }


            // TRANSFERENCIA / DEPÓSITO

            const donationData = {

                monto: amount,

                frecuencia:
                    frequency.value,

                paymentMethod:
                    payment.value,

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

            const registrada =
                await registrarDonacion(
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


            // FINALIZAR DONACIÓN

            form.style.display = "none";

            if (successScreen) {

                successScreen.classList.add("show");

                successScreen.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        }
    );


    // INICIAR EN PASO 1

    showStep(1);

});


// INICIALIZAR META

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const currentAmount =
            document.getElementById(
                "currentAmount"
            );

        if (!currentAmount) {
            return;
        }

        currentAmount.dataset.valor =
            0;

        currentAmount.textContent =
            "$0.00";

        setTimeout(() => {

            actualizarMeta();

        }, 300);

    }
);
