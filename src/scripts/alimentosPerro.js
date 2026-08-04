
function getFoodItemsPerView() {
    if (window.innerWidth < 576) return 1;
    if (window.innerWidth < 992) return 2;
    return 4;
}

function renderDogFood() {
    const dogFoodList = document.getElementById("dogFoodList");

    if (!dogFoodList || typeof store === "undefined") return;

    const items = store.getItems ? store.getItems() : store.items;

    const dogFoodItems = items.filter(item =>
        item.category && item.category.trim().toLowerCase() === "alimento"
    );

    console.log("Alimentos encontrados:", dogFoodItems);

    const itemsPerView = getFoodItemsPerView();
    let html = "";

    for (let i = 0; i < dogFoodItems.length; i += itemsPerView) {
        const chunk = dogFoodItems.slice(i, i + itemsPerView);
        const activeClass = i === 0 ? "active" : "";

        const chunkHtml = chunk.map(product => `
            <div class="col d-flex justify-content-center">
                <div class="product-item-card" style="width:110%; max-width:200px;">
                    <img 
                        src="${product.img}" 
                        class="product-img"
                        alt="${product.name}"
                        style="width:100%; height:180px; object-fit:cover; border-radius:8px;"
                    >
                    <span class="title mt-2 d-block">
                        ${product.name}
                    </span>
                    <span class="price text-center d-block">
                        ${product.price}
                    </span>
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

    dogFoodList.innerHTML = html;
    console.log("HTML alimentos generado");
}

let lastFoodItemsPerView = getFoodItemsPerView();

window.addEventListener("resize", function () {
    const currentFoodItemsPerView = getFoodItemsPerView();

    if (currentFoodItemsPerView !== lastFoodItemsPerView) {
        lastFoodItemsPerView = currentFoodItemsPerView;
        renderDogFood();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    renderDogFood();
});