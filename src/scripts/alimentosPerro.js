document.addEventListener("DOMContentLoaded", function () {
    const dogFoodList = document.getElementById("dogFoodList");

    if (dogFoodList && typeof store !== "undefined") {
        const alimentos = store.items.filter(item =>
            item.category.trim().toLowerCase() === "alimento"
        );

        dogFoodList.innerHTML = alimentos.map(producto => `
            <div class="col-auto">
                <div class="product-item-card">
                    <div class="image">
                        <img 
                            src="${producto.img}" 
                            class="product-img" 
                            alt="${producto.name}"
                        >
                    </div>

                    <span class="title">${producto.name}</span>
                    <span class="price">${producto.price}</span>
                </div>
            </div>
        `).join("");
    }
});