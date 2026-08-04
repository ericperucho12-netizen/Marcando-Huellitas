document.addEventListener("DOMContentLoaded", function () {
    const adminPanel = document.getElementById("adminPanel");
    const accessDeniedMsg = document.getElementById("accessDeniedMsg");
    const productForm = document.getElementById("productForm");
    const dynamicProductsSection = document.getElementById("dynamicProductsSection");
    const productsList = document.getElementById("productsList");
    const alertContainer = document.getElementById("alertContainer");
    const btnClearAll = document.getElementById("btnClearAll");

    // Simulador de Rol (Cambiar a true para probar como Administrador)
    const isAdmin = true; 

    if (isAdmin) {
        if (adminPanel) adminPanel.style.display = "block";
        if (accessDeniedMsg) accessDeniedMsg.style.display = "none";
    } else {
        if (adminPanel) adminPanel.style.display = "none";
        if (accessDeniedMsg) accessDeniedMsg.style.display = "block";
    }

    // Obtener productos guardados en localStorage
    let productos = JSON.parse(localStorage.getItem("productosAdmin")) || [];
    renderizarProductos();

    if (productForm) {
        productForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const id = document.getElementById("productId").value;
            const name = document.getElementById("productName").value.trim();
            const img = document.getElementById("productImg").value.trim();
            const description = document.getElementById("productDescription").value.trim();
            const price = document.getElementById("productPrice").value.trim();
            const category = document.getElementById("productCategory").value;

            // Validación
            if (!name || !img || !description || !price || !category) {
                mostrarAlerta("Por favor completa todos los campos obligatorios.", "danger");
                return;
            }

            const nuevoProducto = {
                id: id ? parseInt(id) : Date.now(),
                name,
                img,
                description,
                price: parseFloat(price).toFixed(2),
                category
            };

            if (id) {
                // Editar
                productos = productos.map(p => p.id === parseInt(id) ? nuevoProducto : p);
                mostrarAlerta("Producto actualizado con éxito.", "success");
            } else {
                // Crear
                productos.push(nuevoProducto);
                mostrarAlerta("Producto agregado correctamente.", "success");
            }

            localStorage.setItem("productosAdmin", JSON.stringify(productos));
            productForm.reset();
            document.getElementById("productId").value = "";
            renderizarProductos();
        });
    }

    if (btnClearAll) {
        btnClearAll.addEventListener("click", function () {
            if (confirm("¿Estás seguro de eliminar todos los productos creados?")) {
                productos = [];
                localStorage.removeItem("productosAdmin");
                renderizarProductos();
                mostrarAlerta("Todos los productos creados han sido eliminados.", "warning");
            }
        });
    }

    function renderizarProductos() {
        if (!productsList) return;

        productsList.innerHTML = "";

        if (productos.length === 0) {
            if (dynamicProductsSection) dynamicProductsSection.style.display = "none";
            return;
        }

        if (dynamicProductsSection) dynamicProductsSection.style.display = "block";

        productos.forEach(prod => {
            const col = document.createElement("div");
            col.className = "col-auto";
            col.innerHTML = `
                <div class="product-item-card">
                    <img src="${prod.img}" class="product-img" alt="${prod.name}" style="width: 100%; height: 180px; object-fit: cover;">
                    <span class="title">${prod.name}</span>
                    <span class="price">$${prod.price} MXN</span>
                    <div class="mt-2 d-flex justify-content-between">
                        <button class="btn btn-sm btn-outline-primary btn-edit" data-id="${prod.id}"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${prod.id}"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            `;
            productsList.appendChild(col);
        });

        agregarEventosAcciones();
    }

    function agregarEventosAcciones() {
        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", function () {
                const id = parseInt(this.getAttribute("data-id"));
                productos = productos.filter(p => p.id !== id);
                localStorage.setItem("productosAdmin", JSON.stringify(productos));
                renderizarProductos();
                mostrarAlerta("Producto eliminado.", "info");
            });
        });

        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", function () {
                const id = parseInt(this.getAttribute("data-id"));
                const prod = productos.find(p => p.id === id);
                if (prod) {
                    document.getElementById("productId").value = prod.id;
                    document.getElementById("productName").value = prod.name;
                    document.getElementById("productImg").value = prod.img;
                    document.getElementById("productDescription").value = prod.description;
                    document.getElementById("productPrice").value = prod.price;
                    document.getElementById("productCategory").value = prod.category;
                    window.scrollTo({ top: adminPanel.offsetTop - 20, behavior: 'smooth' });
                }
            });
        });
    }

    function mostrarAlerta(mensaje, tipo) {
        if (!alertContainer) return;
        alertContainer.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }
});