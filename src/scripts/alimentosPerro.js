document.addEventListener("DOMContentLoaded", () => {
    const dogFoodList = document.getElementById("dogFoodList");
    const prevBtn = document.getElementById("prevDogFood");
    const nextBtn = document.getElementById("nextDogFood");

    // 1. Renderizar los productos dinámicamente
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
    } else {
        console.error("No se encontró el contenedor dogFoodList o los datos de alimentosPerro.");
    }

    // 2. Lógica del Carrusel (Desplazamiento Horizontal)
    const container = dogFoodList.parentElement; 
    let scrollAmount = 0;
    const cardWidth = 260; 
    const scrollStep = 3; 

    // Función para actualizar el estado de los botones (opcional, para deshabilitar si no hay más scroll)
    const updateButtons = () => {
        prevBtn.disabled = container.scrollLeft <= 0;
        nextBtn.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
    };

    if (prevBtn && nextBtn && container) {
        // Botón "Anterior" (‹)
        prevBtn.addEventListener("click", () => {
            container.scrollBy({ left: -(cardWidth * scrollStep), behavior: 'smooth' });
            setTimeout(updateButtons, 500); // Esperamos a que termine la animación
        });

        // Botón "Siguiente" (›)
        nextBtn.addEventListener("click", () => {
            container.scrollBy({ left: (cardWidth * scrollStep), behavior: 'smooth' });
            setTimeout(updateButtons, 500);
        });

        // Inicializar botones
        container.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', updateButtons);
        updateButtons();
    }
});