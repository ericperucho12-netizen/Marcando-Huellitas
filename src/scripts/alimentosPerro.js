document.addEventListener("DOMContentLoaded", () => {
    const dogFoodList = document.getElementById("dogFoodList");
    const prevBtn = document.getElementById("prevDogFood");
    const nextBtn = document.getElementById("nextDogFood");

    if (dogFoodList && typeof store !== "undefined") {
        const items = store.getItems ? store.getItems() : store.items;
        const alimentos = items.filter(item => item.category === "alimento");

        if (alimentos.length > 0) {
            dogFoodList.innerHTML = alimentos.map(producto => `
                <div class="p-2 flex-shrink-0" style="width: 250px;">
                    <div class="card h-100 border-0 shadow-sm p-3 rounded-4 bg-white text-center">
                        <img src="${producto.img}" class="card-img-top rounded-3 mb-2" alt="${producto.name}" style="height: 180px; object-fit: cover;">
                        <div class="card-body p-0 d-flex flex-column justify-content-between">
                            <h6 class="card-title fw-bold text-dark mb-2" style="font-size: 0.95rem;">${producto.name}</h6>
                            <span class="fw-bold text-success" style="font-size: 0.9rem;">${producto.price}</span>
                        </div>
                    </div>
                </div>
            `).join("");
        }
    }

    // Navegación horizontal para las flechas
    if (prevBtn && nextBtn && dogFoodList) {
        prevBtn.addEventListener("click", () => {
            dogFoodList.scrollBy({ left: -260, behavior: "smooth" });
        });
        nextBtn.addEventListener("click", () => {
            dogFoodList.scrollBy({ left: 260, behavior: "smooth" });
        });
    }
});