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
        let chunk = dogToysItems.slice(i, i + itemsPerView);
        let activeClass = i === 0 ? "active" : "";
        
        let chunkHtml = chunk.map(product => `
            <div class="col d-flex justify-content-center">
                <div class="product-item-card" style="width: 100%; max-width: 250px;">
                    <img src="${product.img}" class="product-img" alt="${product.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px;">
                    <span class="title text-center mt-2 d-block fw-bold">${product.name}</span>
                    <span class="price text-center d-block text-success">${product.price}</span>
                </div>
            </div>
        `).join("");

        html += `
            <div class="carousel-item ${activeClass}">
                <div class="row justify-content-center">
                    ${chunkHtml}
                </div>
            </div>
        `;
    }

    dogToysList.innerHTML = html;
}

// Bandera para optimizar el resize
let lastItemsPerView = getItemsPerView();

window.addEventListener("resize", function () {
    const currentItemsPerView = getItemsPerView();
    if (currentItemsPerView !== lastItemsPerView) {
        lastItemsPerView = currentItemsPerView;
        renderDogToys();
    }
});

// Render inicial
document.addEventListener("DOMContentLoaded", () => {
    renderDogToys();
});

