document.addEventListener("DOMContentLoaded", function () {
    const adminPanel = document.getElementById("adminPanel");
    const accessDeniedMsg = document.getElementById("accessDeniedMsg");
    const productForm = document.getElementById("productForm");
    const dynamicProductsSection = document.getElementById(
        "dynamicProductsSection"
    );
    const productsList = document.getElementById("productsList");
    const alertContainer = document.getElementById("alertContainer");
    const btnClearAll = document.getElementById("btnClearAll");

    const productId = document.getElementById("productId");
    const productName = document.getElementById("productName");
    const productImg = document.getElementById("productImg");
    const productDescription = document.getElementById(
        "productDescription"
    );
    const productPrice = document.getElementById("productPrice");
    const productCategory = document.getElementById(
        "productCategory"
    );

    // Simulador de rol administrador
    const isAdmin = true;

    if (adminPanel && accessDeniedMsg) {
        if (isAdmin) {
            adminPanel.style.display = "block";
            accessDeniedMsg.style.display = "none";
        } else {
            adminPanel.style.display = "none";
            accessDeniedMsg.style.display = "block";
        }
    }

    let productos =
        JSON.parse(localStorage.getItem("productosAdmin")) || [];

    renderizarProductos();

    if (productForm) {
        productForm.addEventListener("submit", function (event) {
            event.preventDefault();

            limpiarAlerta();
            limpiarValidaciones();

            const errores = validarFormularioProducto();

            if (errores.length > 0) {
                mostrarErrores(errores);
                return;
            }

            const id = productId.value;
            const name = productName.value.trim();
            const img = productImg.value.trim();
            const description =
                productDescription.value.trim();
            const price = Number(productPrice.value);
            const category = productCategory.value;

            /*
             * Modelo de datos del producto.
             * Este objeto posteriormente se convierte a JSON
             * al guardarse en localStorage.
             */
            const nuevoProducto = {
                id: id ? Number(id) : Date.now(),
                name,
                img,
                description,
                price,
                category,
                createdAt: new Date()
                    .toISOString()
                    .split("T")[0]
            };

            console.log(
                "Objeto del producto:",
                nuevoProducto
            );

            console.log(
                "Producto en formato JSON:",
                JSON.stringify(nuevoProducto, null, 2)
            );

            if (id) {
                productos = productos.map((producto) =>
                    producto.id === Number(id)
                        ? nuevoProducto
                        : producto
                );

                mostrarAlerta(
                    "Producto actualizado con éxito.",
                    "success"
                );
            } else {
                productos.push(nuevoProducto);

                mostrarAlerta(
                    "Producto agregado correctamente.",
                    "success"
                );
            }

            localStorage.setItem(
                "productosAdmin",
                JSON.stringify(productos)
            );

            productForm.reset();
            productId.value = "";

            limpiarValidaciones();
            renderizarProductos();
        });
    }

    if (btnClearAll) {
        btnClearAll.addEventListener("click", function () {
            const confirmarEliminacion = confirm(
                "¿Estás seguro de eliminar todos los productos creados?"
            );

            if (!confirmarEliminacion) {
                return;
            }

            productos = [];
            localStorage.removeItem("productosAdmin");

            renderizarProductos();

            mostrarAlerta(
                "Todos los productos creados han sido eliminados.",
                "warning"
            );
        });
    }

    function validarFormularioProducto() {
        const errores = [];

        const name = productName.value.trim();
        const img = productImg.value.trim();
        const description =
            productDescription.value.trim();
        const priceValue = productPrice.value.trim();
        const price = Number(priceValue);
        const category = productCategory.value;

        // Validación del nombre
        if (name === "") {
            errores.push(
                "El nombre del producto es obligatorio."
            );

            marcarInvalido(productName);
        } else if (name.length < 3) {
            errores.push(
                "El nombre debe tener al menos 3 caracteres."
            );

            marcarInvalido(productName);
        } else if (name.length > 80) {
            errores.push(
                "El nombre no debe superar los 80 caracteres."
            );

            marcarInvalido(productName);
        } else {
            marcarValido(productName);
        }

        // Validación de la imagen
        if (img === "") {
            errores.push(
                "La URL o ruta de la imagen es obligatoria."
            );

            marcarInvalido(productImg);
        } else if (!esImagenValida(img)) {
            errores.push(
                "La imagen debe ser una URL válida o una ruta local con extensión JPG, JPEG, PNG, WEBP o GIF."
            );

            marcarInvalido(productImg);
        } else {
            marcarValido(productImg);
        }

        // Validación de la descripción
        if (description === "") {
            errores.push(
                "La descripción del producto es obligatoria."
            );

            marcarInvalido(productDescription);
        } else if (description.length < 10) {
            errores.push(
                "La descripción debe tener al menos 10 caracteres."
            );

            marcarInvalido(productDescription);
        } else if (description.length > 500) {
            errores.push(
                "La descripción no debe superar los 500 caracteres."
            );

            marcarInvalido(productDescription);
        } else {
            marcarValido(productDescription);
        }

        // Validación del precio
        if (priceValue === "") {
            errores.push(
                "El precio del producto es obligatorio."
            );

            marcarInvalido(productPrice);
        } else if (Number.isNaN(price)) {
            errores.push(
                "El precio debe ser un valor numérico."
            );

            marcarInvalido(productPrice);
        } else if (price <= 0) {
            errores.push(
                "El precio debe ser mayor que cero."
            );

            marcarInvalido(productPrice);
        } else if (price > 1000000) {
            errores.push(
                "El precio no puede superar $1,000,000 MXN."
            );

            marcarInvalido(productPrice);
        } else {
            marcarValido(productPrice);
        }

        // Validación de la categoría
        if (category === "") {
            errores.push(
                "Debes seleccionar una categoría."
            );

            marcarInvalido(productCategory);
        } else {
            marcarValido(productCategory);
        }

        return errores;
    }

    function esImagenValida(valor) {
        const rutaLocal =
            valor.startsWith("../") ||
            valor.startsWith("./") ||
            valor.startsWith("/");

        const extensionImagen =
            /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i;

        if (rutaLocal) {
            return extensionImagen.test(valor);
        }

        try {
            const url = new URL(valor);

            const protocoloValido =
                url.protocol === "http:" ||
                url.protocol === "https:";

            return protocoloValido;
        } catch {
            return false;
        }
    }

    function marcarInvalido(campo) {
        campo.classList.remove("is-valid");
        campo.classList.add("is-invalid");
    }

    function marcarValido(campo) {
        campo.classList.remove("is-invalid");
        campo.classList.add("is-valid");
    }

    function limpiarValidaciones() {
        if (!productForm) {
            return;
        }

        productForm
            .querySelectorAll(".is-valid, .is-invalid")
            .forEach((campo) => {
                campo.classList.remove(
                    "is-valid",
                    "is-invalid"
                );
            });
    }

    function mostrarErrores(errores) {
        if (!alertContainer) {
            return;
        }

        const listaErrores = errores
            .map(
                (error) =>
                    `<li>${escaparHTML(error)}</li>`
            )
            .join("");

        alertContainer.innerHTML = `
            <div
                class="alert alert-danger alert-dismissible fade show"
                role="alert"
            >
                <i class="bi bi-exclamation-triangle-fill me-2"></i>

                <strong>
                    No fue posible guardar el producto.
                </strong>

                <ul class="mb-0 mt-2">
                    ${listaErrores}
                </ul>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Cerrar"
                ></button>
            </div>
        `;

        alertContainer.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    function mostrarAlerta(mensaje, tipo) {
        if (!alertContainer) {
            return;
        }

        const iconos = {
            success: "bi-check-circle-fill",
            danger: "bi-exclamation-triangle-fill",
            warning: "bi-exclamation-circle-fill",
            info: "bi-info-circle-fill"
        };

        const icono =
            iconos[tipo] || "bi-info-circle-fill";

        alertContainer.innerHTML = `
            <div
                class="alert alert-${tipo} alert-dismissible fade show"
                role="alert"
            >
                <i class="bi ${icono} me-2"></i>

                ${escaparHTML(mensaje)}

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Cerrar"
                ></button>
            </div>
        `;
    }

    function limpiarAlerta() {
        if (alertContainer) {
            alertContainer.innerHTML = "";
        }
    }

    function renderizarProductos() {
        if (!productsList) {
            return;
        }

        productsList.innerHTML = "";

        if (productos.length === 0) {
            if (dynamicProductsSection) {
                dynamicProductsSection.style.display =
                    "none";
            }

            return;
        }

        if (dynamicProductsSection) {
            dynamicProductsSection.style.display =
                "block";
        }

        productos.forEach((producto) => {
            const col = document.createElement("div");

            col.className =
                "col-12 col-sm-6 col-md-4 col-lg-3";

            col.innerHTML = `
                <div class="product-item-card h-100">
                    <img
                        src="${escaparAtributo(producto.img)}"
                        class="product-img"
                        alt="${escaparAtributo(producto.name)}"
                        style="
                            width: 100%;
                            height: 180px;
                            object-fit: cover;
                        "
                    >

                    <span class="title">
                        ${escaparHTML(producto.name)}
                    </span>

                    <span class="price">
                        ${formatearPrecio(producto.price)}
                    </span>

                    <div class="mt-2 d-flex justify-content-between">
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-primary btn-edit"
                            data-id="${producto.id}"
                            aria-label="Editar producto"
                        >
                            <i class="bi bi-pencil"></i>
                        </button>

                        <button
                            type="button"
                            class="btn btn-sm btn-outline-danger btn-delete"
                            data-id="${producto.id}"
                            aria-label="Eliminar producto"
                        >
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;

            productsList.appendChild(col);
        });

        agregarEventosAcciones();
    }

    function formatearPrecio(precio) {
        return Number(precio).toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN"
        });
    }

    function agregarEventosAcciones() {
        document
            .querySelectorAll(".btn-delete")
            .forEach((boton) => {
                boton.addEventListener(
                    "click",
                    function () {
                        const id = Number(
                            this.getAttribute("data-id")
                        );

                        productos = productos.filter(
                            (producto) =>
                                producto.id !== id
                        );

                        localStorage.setItem(
                            "productosAdmin",
                            JSON.stringify(productos)
                        );

                        renderizarProductos();

                        mostrarAlerta(
                            "Producto eliminado.",
                            "info"
                        );
                    }
                );
            });

        document
            .querySelectorAll(".btn-edit")
            .forEach((boton) => {
                boton.addEventListener(
                    "click",
                    function () {
                        const id = Number(
                            this.getAttribute("data-id")
                        );

                        const producto = productos.find(
                            (productoActual) =>
                                productoActual.id === id
                        );

                        if (!producto) {
                            return;
                        }

                        productId.value = producto.id;
                        productName.value = producto.name;
                        productImg.value = producto.img;
                        productDescription.value =
                            producto.description;
                        productPrice.value =
                            producto.price;
                        productCategory.value =
                            producto.category;

                        limpiarValidaciones();
                        limpiarAlerta();

                        window.scrollTo({
                            top:
                                adminPanel.offsetTop -
                                20,
                            behavior: "smooth"
                        });
                    }
                );
            });
    }

    function escaparHTML(texto) {
        const elemento =
            document.createElement("div");

        elemento.textContent = String(texto);

        return elemento.innerHTML;
    }

    function escaparAtributo(texto) {
        return String(texto)
            .replaceAll("&", "&amp;")
            .replaceAll('"', "&quot;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
