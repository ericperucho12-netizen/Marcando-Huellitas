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


    // Filtrar accesorios
    const dogAccessoriesItems = store.items.filter(item =>
        item.category.trim().toLowerCase() === "accesorio"
    );


    console.log("Accesorios encontrados:", dogAccessoriesItems);


    const itemsPerView = getAccessoriesItemsPerView();

    let html = "";



    for (let i = 0; i < dogAccessoriesItems.length; i += itemsPerView) {


        const chunk = dogAccessoriesItems.slice(i, i + itemsPerView);

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


                    <span class="title  mt-2 d-block">
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



    dogAccessoriesList.innerHTML = html;


    console.log("HTML accesorios generado");

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


document.addEventListener("DOMContentLoaded", () => {

    renderDogAccessories();

});