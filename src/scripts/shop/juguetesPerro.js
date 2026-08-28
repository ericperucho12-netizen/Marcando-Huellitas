// Filtramos los juguetes del store global
const dogToysItems = store.items.filter(item => item.category === "juguete");

function getItemsPerView() {
    if (window.innerWidth < 576) return 1;
    if (window.innerWidth < 992) return 2;
    return 4;
}

function renderDogToys() {
    const dogToysList = document.getElementById("dogToysList");

    if (!dogToysList) return;

    const itemsPerView = getItemsPerView();
    let html = "";

    for (let i = 0; i < dogToysItems.length; i += itemsPerView) {
        const chunk = dogToysItems.slice(i, i + itemsPerView);
        const activeClass = i === 0 ? "active" : "";

        const chunkHtml = chunk.map(product => `
            <div class="col-12 col-sm-auto">
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

    dogToysList.innerHTML = html;

    const dogToysCarousel = document.getElementById("dogToysCarousel");
    if (dogToysCarousel && typeof bootstrap !== "undefined" && bootstrap.Carousel) {
        bootstrap.Carousel.getOrCreateInstance(dogToysCarousel, {
            interval: 6000,
            pause: "hover"
        }).cycle();
    }
}

let lastItemsPerView = getItemsPerView();

window.addEventListener("resize", function () {
    const currentItemsPerView = getItemsPerView();

    if (currentItemsPerView !== lastItemsPerView) {
        lastItemsPerView = currentItemsPerView;
        renderDogToys();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    renderDogToys();
});
