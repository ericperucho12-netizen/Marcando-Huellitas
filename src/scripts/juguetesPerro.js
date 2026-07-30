// Filtramos los juguetes del store global
const dogToysItems = store.items.filter(item => item.category === "juguete");

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

if (prevDogToy && nextDogToy) {
    prevDogToy.addEventListener("click", function () {
        const itemsPerView = getItemsPerView();
        const maxIndex = dogToysItems.length - itemsPerView;

        if (currentDogToyIndex > 0) {
            currentDogToyIndex--;
        } else {
            currentDogToyIndex = maxIndex;
        }
        renderDogToys(dogToysItems);
    });

    nextDogToy.addEventListener("click", function () {
        const itemsPerView = getItemsPerView();
        const maxIndex = dogToysItems.length - itemsPerView;

        if (currentDogToyIndex < maxIndex) {
            currentDogToyIndex++;
        } else {
            currentDogToyIndex = 0;
        }
        renderDogToys(dogToysItems);
    });
}

// Si cambia el tamaño de pantalla, reinicia el carrusel
window.addEventListener("resize", function () {
    currentDogToyIndex = 0;
    renderDogToys(dogToysItems);
});

// Render inicial
document.addEventListener("DOMContentLoaded", () => {
    renderDogToys(dogToysItems);
});
