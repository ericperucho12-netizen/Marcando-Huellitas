const dogToys = new ItemsController();

dogToys.addItem(
    "Hueso mordedor",
    "/src/assets/productos/hueso_mordedor.png",
    "Mordedor resistente para fortalecer dientes y encías.",
    "$95.00 MXN"
);

dogToys.addItem(
    "Frisbee flexible",
    "/src/assets/productos/frisbee.png",
    "Disco ligero para jugar al aire libre.",
    "$150.00 MXN"
);

dogToys.addItem(
    "Peluche con sonido",
    "/src/assets/productos/peluche-sonido.png",
    "Peluche suave con sonido para entretenimiento.",
    "$180.00 MXN"
);

dogToys.addItem(
    "Juguete dispensador",
    "/src/assets/productos/dispensador_premios.png",
    "Juguete interactivo para colocar premios o croquetas.",
    "$210.00 MXN"
);

dogToys.addItem(
    "Aro mordedor",
    "/src/assets/productos/aro_mordedor.png",
    "Aro resistente para morder, lanzar y jugar.",
    "$130.00 MXN"
);

dogToys.addItem(
    "Pelota con textura",
    "/src/assets/productos/juguete_texturizado.png",
    "Pelota con relieve para estimular el juego y la mordida.",
    "$145.00 MXN"
);

// Índice inicial del carrusel
let currentDogToyIndex = 0;

// Define cuántas cards se muestran según el tamaño de pantalla
function getItemsPerView() {
    if (window.innerWidth < 576) {
        return 1;
    }

    if (window.innerWidth < 992) {
        return 2;
    }

    return 4;
}

function renderDogToys(products) {
    const dogToysList = document.getElementById("dogToysList");

    if (!dogToysList) {
        console.error("No se encontró el contenedor dogToysList");
        return;
    }

    const itemsPerView = getItemsPerView();

    const visibleProducts = products.slice(
        currentDogToyIndex,
        currentDogToyIndex + itemsPerView
    );

    dogToysList.innerHTML = "";

    visibleProducts.forEach(function (product) {
        const productCard = document.createElement("div");
        productCard.classList.add("dog-toy-card-wrapper");
        productCard.innerHTML = `
            <div class="product-item-card">
                <div class="image">
                    <img src="${product.img}" alt="${product.name}" class="product-img">
                </div>

                <span class="title">${product.name}</span>
                <span class="price">${product.price}</span>
            </div>
        `;

        dogToysList.appendChild(productCard);
    });
}

// Botones del carrusel
const prevDogToy = document.getElementById("prevDogToy");
const nextDogToy = document.getElementById("nextDogToy");

prevDogToy.addEventListener("click", function () {
    const itemsPerView = getItemsPerView();
    const maxIndex = dogToys.items.length - itemsPerView;

    if (currentDogToyIndex > 0) {
        currentDogToyIndex--;
    } else {
        currentDogToyIndex = maxIndex;
    }

    renderDogToys(dogToys.items);
});

nextDogToy.addEventListener("click", function () {
    const itemsPerView = getItemsPerView();
    const maxIndex = dogToys.items.length - itemsPerView;

    if (currentDogToyIndex < maxIndex) {
        currentDogToyIndex++;
    } else {
        currentDogToyIndex = 0;
    }

    renderDogToys(dogToys.items);
});

// Si cambia el tamaño de pantalla, reinicia el carrusel
window.addEventListener("resize", function () {
    currentDogToyIndex = 0;
    renderDogToys(dogToys.items);
});

// Render inicial
renderDogToys(dogToys.items);

console.log("Juguetes para perros:", dogToys.items);