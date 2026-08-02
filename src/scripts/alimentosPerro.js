document.addEventListener("DOMContentLoaded", () => {
    const dogFoodList = document.getElementById("dogFoodList");

    if (dogFoodList && typeof store !== "undefined") {
        // Filtrar solo los alimentos
        const alimentos = store.items.filter(item => item.category === "alimento");

        dogFoodList.innerHTML = alimentos.map(producto => `
            <div class="col-auto">
                <div class="product-item-card">
                    <img src="${producto.img}" class="product-img" alt="${producto.name}" style="width: 100%; height: 180px; object-fit: cover;">
                    <span class="title">${producto.name}</span>
                    <span class="price">${producto.price}</span>
                </div>
            </div>
        `).join("");
    }
});
