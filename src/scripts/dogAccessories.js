// ================================
// CARRUSEL ACCESORIOS PARA PERROS
// ================================

function getAccessoriesItemsPerView() {
    if (window.innerWidth < 576) return 1;
    if (window.innerWidth < 992) return 2;

    return 4;
}

function renderDogAccessories() {
    const dogAccessoriesList = document.getElementById("dogAccessoriesList");

    if (!dogAccessoriesList) return;

    const dogAccessoriesItems = store.items.filter(item =>
        item.category.trim().toLowerCase() === "accesorio"
    );

    const itemsPerView = getAccessoriesItemsPerView();

    let html = "";

    for (let i = 0; i < dogAccessoriesItems.length; i += itemsPerView) {
        const chunk = dogAccessoriesItems.slice(i, i + itemsPerView);
        const activeClass = i === 0 ? "active" : "";

        const chunkHtml = chunk.map(product => `
            <div class="col-auto">
                <div class="product-item-card">
                    <div class="image">
                        <img 
                            src="${product.img}" 
                            class="product-img"
                            alt="${product.name}"
                        >
                    </div>

                    <span class="title">${product.name}</span>
                    <span class="price">${product.price}</span>
                </div>
            </div>
        `).join("");

        html += `
            <div class="carousel-item ${activeClass}">
                <div class="row g-4 justify-content-center">
                    ${chunkHtml}
                </div>
            </div>
        `;
    }

    dogAccessoriesList.innerHTML = html;

    const dogAccessoriesCarousel = document.getElementById("dogAccessoriesCarousel");
    if (dogAccessoriesCarousel && typeof bootstrap !== "undefined" && bootstrap.Carousel) {
        bootstrap.Carousel.getOrCreateInstance(dogAccessoriesCarousel, {
            interval: 6000,
            pause: "hover"
        }).cycle();
    }
}

// ================================
// RESIZE RESPONSIVE
// ================================

let lastAccessoriesItemsPerView = getAccessoriesItemsPerView();

window.addEventListener("resize", function () {
    const currentAccessoriesItemsPerView = getAccessoriesItemsPerView();

    if (currentAccessoriesItemsPerView !== lastAccessoriesItemsPerView) {
        lastAccessoriesItemsPerView = currentAccessoriesItemsPerView;
        renderDogAccessories();
    }
});

// ================================
// INICIO
// ================================

document.addEventListener("DOMContentLoaded", function () {
    renderDogAccessories();
});