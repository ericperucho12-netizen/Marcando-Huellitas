document.addEventListener("DOMContentLoaded", () => {
    const dogFoodList = document.getElementById("dogFoodList");

    if (dogFoodList && typeof alimentosPerro !== "undefined") {
        dogFoodList.innerHTML = alimentosPerro.map(producto => `
            <div class="col-auto">
                <div class="product-item-card">
                    <img src="${producto.imagen}" class="product-img" alt="${producto.nombre}" style="width: 100%; height: 180px; object-fit: cover;">
                    <span class="title">${producto.nombre}</span>
                    <span class="price">${producto.precio}</span>
                </div>
            </div>
        `).join("");
    }
});