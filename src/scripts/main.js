// Función global para validar sesión antes de acciones críticas
window.requireAuth = function(actionName) {
    const usuarioActual = sessionStorage.getItem("usuarioActual");
    if (!usuarioActual) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Inicia sesión',
                text: `Debes iniciar sesión para ${actionName}.`,
                icon: 'warning',
                confirmButtonColor: '#e04b7b',
                confirmButtonText: 'Ir a Iniciar Sesión'
            }).then(() => {
                const basePath = document.querySelector('script[src*="main.js"]')?.getAttribute('src').replace('/scripts/main.js', '') || '.';
                window.location.href = basePath + "/pages/auth/login.html";
            });
        } else {
            alert(`Debes iniciar sesión para ${actionName}.`);
            const basePath = document.querySelector('script[src*="main.js"]')?.getAttribute('src').replace('/scripts/main.js', '') || '.';
            window.location.href = basePath + "/pages/auth/login.html";
        }
        return false;
    }
    return true;
};

// Inyectar el loader inmediatamente
(function() {
    // 1. Inyectar CSS del loader
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    // Determinar la ruta base según donde estamos
    const scriptTag = document.querySelector('script[src*="main.js"]');
    const basePath = scriptTag ? scriptTag.getAttribute('src').replace('/scripts/main.js', '') : '.';
    cssLink.href = basePath + '/styles/loader.css';
    document.head.appendChild(cssLink);

    // 2. Inyectar HTML del loader
    const loader = document.createElement('div');
    loader.id = 'page-loader-overlay';
    loader.innerHTML = `
        <div class="loader-main">
            <div class="loader-dog">
                <div class="loader-dog__paws">
                    <div class="loader-dog__bl-leg loader-leg">
                        <div class="loader-dog__bl-paw loader-paw"></div>
                        <div class="loader-dog__bl-top loader-top"></div>
                    </div>
                    <div class="loader-dog__fl-leg loader-leg">
                        <div class="loader-dog__fl-paw loader-paw"></div>
                        <div class="loader-dog__fl-top loader-top"></div>
                    </div>
                    <div class="loader-dog__fr-leg loader-leg">
                        <div class="loader-dog__fr-paw loader-paw"></div>
                        <div class="loader-dog__fr-top loader-top"></div>
                    </div>
                </div>
                <div class="loader-dog__body">
                    <div class="loader-dog__tail"></div>
                </div>
                <div class="loader-dog__head">
                    <div class="loader-dog__snout">
                        <div class="loader-dog__eyes">
                            <div class="loader-dog__eye-l"></div>
                            <div class="loader-dog__eye-r"></div>
                        </div>
                    </div>
                </div>
                <div class="loader-dog__head-c">
                    <div class="loader-dog__ear-r"></div>
                    <div class="loader-dog__ear-l"></div>
                </div>
            </div>
        </div>
    `;
    
    // Añadir el loader
    document.documentElement.appendChild(loader);

    // 3. Remover el loader cuando cargue la página completa
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 600);
        }, 300); // Pequeño delay para asegurar transición suave
    });
})();

document.addEventListener("DOMContentLoaded", () => {
    const layoutContainers = document.querySelectorAll("[data-template]");

    layoutContainers.forEach(container => {
        const templatePath = container.getAttribute("data-template");
        const rootPath = container.getAttribute("data-root") || container.getAttribute("data-base");
        const srcPath = container.getAttribute("data-src") || container.getAttribute("data-base");

        fetch(templatePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${templatePath}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                // Reemplazar variables de ruta
                let replacedHtml = html.replace(/\{\{root\}\}/g, rootPath);
                replacedHtml = replacedHtml.replace(/\{\{src\}\}/g, srcPath);
                replacedHtml = replacedHtml.replace(/\{\{base\}\}/g, rootPath);
                container.innerHTML = replacedHtml;

                // Marcar el enlace activo según la página actual
                const currentPage = window.location.pathname;
                const currentFile = currentPage.split('/').pop().replace('.html', '') || 'index';

                const navLinks = container.querySelectorAll('[data-nav-page]');
                navLinks.forEach(link => {
                    const linkPage = link.getAttribute('data-nav-page');
                    link.classList.remove('active-link', 'text-secondary');

                    if (linkPage === currentFile || (currentFile === '' && linkPage === 'index')) {
                        link.classList.add('active-link');
                    } else {
                        link.classList.add('text-secondary');
                    }
                });

                // Lógica de Autenticación en la Barra de Navegación
                const usuarioActual = JSON.parse(sessionStorage.getItem("usuarioActual"));
                const navLoginBtn = container.querySelector("#navLoginBtn");
                const navUserDropdown = container.querySelector("#navUserDropdown");
                const navUserName = container.querySelector("#navUserName");
                const navUserHeader = container.querySelector("#navUserHeader");
                const navLogoutBtn = container.querySelector("#navLogoutBtn");

                if (usuarioActual) {
                    if (navLoginBtn) navLoginBtn.classList.add("d-none");
                    if (navUserDropdown) {
                        navUserDropdown.classList.remove("d-none");
                        if (navUserName) navUserName.textContent = usuarioActual.nombre.split(" ")[0]; // Mostrar solo el primer nombre
                        if (navUserHeader) navUserHeader.textContent = "Hola, " + usuarioActual.nombre;
                    }
                    if (navLogoutBtn) {
                        navLogoutBtn.addEventListener("click", function(e) {
                            e.preventDefault();
                            sessionStorage.removeItem("usuarioActual");
                            window.location.reload();
                        });
                    }
                } else {
                    if (navLoginBtn) navLoginBtn.classList.remove("d-none");
                    if (navUserDropdown) navUserDropdown.classList.add("d-none");
                }

                // Animación de salida al hacer clic en cualquier enlace interno
                container.querySelectorAll('a[href]').forEach(link => {
                    const href = link.getAttribute('href');
                    // Solo interceptar enlaces a páginas del mismo sitio (no anclas ni externos)
                    if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
                        link.addEventListener('click', function (e) {
                            e.preventDefault();
                            const destination = this.getAttribute('href');
                            document.body.classList.add('page-leaving');
                            setTimeout(() => {
                                window.location.href = destination;
                            }, 260);
                        });
                    }
                });
            })
            .catch(error => {
                console.error("Error loading layout:", error);
                container.innerHTML = `<p class="text-danger text-center">Error cargando el componente: ${templatePath}</p>`;
            });
    });
});

(function () {
    const STORAGE_KEY = "marcandoHuellitasCart";
    const SHIPPING_COST = 69;
    const MINI_CART_OPEN_KEY = "marcandoHuellitasMiniCartOpen";
    const DESKTOP_BREAKPOINT = 800;

    // Revisa si la pantalla es de escritorio
    function isDesktop() {
        return window.innerWidth >= DESKTOP_BREAKPOINT;
    }

    // Convierte precios en texto a número
    function parseMoney(value) {
        if (typeof value === "number" && Number.isFinite(value)) {
            return value;
        }

        if (typeof value !== "string") {
            return 0;
        }

        const cleaned = value
            .replace(/\s+/g, "")
            .replace(/[$,MXN]/gi, "")
            .replace(/\.(?=\d{3}(?:\D|$))/g, "")
            .replace(/,/g, "");

        const parsed = Number.parseFloat(cleaned);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    // Da formato de moneda mexicana
    function formatMoney(value) {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Number(value) || 0);
    }

    // Obtiene el carrito guardado
    function getCart() {
        try {
            const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(raw) ? raw : [];
        } catch (error) {
            return [];
        }
    }

    // Guarda el carrito en localStorage
    function saveCart(cart) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }

    // Calcula el subtotal del carrito
    function getCartSubtotal(cart = getCart()) {
        return cart.reduce((sum, item) => {
            return sum + (Number(item.price) * Number(item.quantity || 1));
        }, 0);
    }

    // Cuenta cuántos productos hay
    function getCartCount(cart = getCart()) {
        return cart.reduce((total, item) => {
            return total + (Number(item.quantity) || 0);
        }, 0);
    }

    // Actualiza el número del ícono del carrito
    function updateCartBadge() {
        const cartCount = getCartCount();

        const badges = [
            ...document.querySelectorAll("[data-cart-count]"),
            document.getElementById("cartBadge"),
            document.getElementById("cartCountBadge")
        ].filter(Boolean);

        badges.forEach(function (badge) {
            badge.textContent = cartCount;
            badge.style.display = cartCount > 0 ? "inline-flex" : "none";
        });
    }

    // Obtiene la información desde una tarjeta
    function getItemInfoFromCard(card) {
        const titleEl = card.querySelector(".title") || card.querySelector("h3") || card.querySelector(".card-title");
        const priceEl = card.querySelector(".price") || card.querySelector(".product-price") || card.querySelector("[data-price]");
        const imageEl = card.querySelector("img");

        const name = (card.dataset.productName || titleEl?.textContent || "Producto").trim();
        const image = card.dataset.productImage || imageEl?.src || "";
        const priceText = card.dataset.productPrice || priceEl?.textContent || "$0.00 MXN";
        const id = String(card.dataset.productId || `${name}-${priceText}`);

        return {
            id,
            name,
            img: image,
            price: parseMoney(priceText),
            quantity: 1
        };
    }

    // Agrega un producto al carrito
    function addToCart(product, quantity = 1) {
        const normalizedProduct = {
            id: String(product.id || `${product.name}-${product.price}`),
            name: String(product.name || "Producto").trim(),
            img: product.img || "",
            price: Number.isFinite(Number(product.price)) ? Number(product.price) : parseMoney(product.price || 0),
            quantity: Number(quantity) > 0 ? Number(quantity) : 1
        };

        if (!normalizedProduct.name) {
            return getCart();
        }

        const cart = getCart();
        const existing = cart.find(item => String(item.id) === String(normalizedProduct.id));

        if (existing) {
            existing.quantity += normalizedProduct.quantity;
        } else {
            cart.push(normalizedProduct);
        }

        saveCart(cart);
        updateCartBadge();
        renderCartPage();
        renderMiniCart();

        showToast(`${normalizedProduct.name} se agregó al carrito`);

        if (isDesktop()) {
            openMiniCart();
        }

        return cart;
    }

    // Elimina un producto del carrito
    function removeFromCart(productId) {
        const updatedCart = getCart().filter(item => String(item.id) !== String(productId));

        saveCart(updatedCart);
        updateCartBadge();
        renderCartPage();
        renderMiniCart();

        // Si queda vacío, cierra el mini carrito
        if (updatedCart.length === 0) {
            localStorage.setItem(MINI_CART_OPEN_KEY, "false");

            const miniCartElement = document.getElementById("miniCartOffcanvas");

            if (miniCartElement && typeof bootstrap !== "undefined") {
                const miniCart = bootstrap.Offcanvas.getInstance(miniCartElement);

                if (miniCart) {
                    miniCart.hide();
                }
            }
        }
    }

    // Cambia la cantidad de un producto
    function updateCartItemQuantity(productId, delta) {
        const cart = getCart();
        const item = cart.find(entry => String(entry.id) === String(productId));

        if (!item) {
            return;
        }

        item.quantity += delta;

        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        saveCart(cart);
        updateCartBadge();
        renderCartPage();
        renderMiniCart();
    }

    // Vacía el carrito completo
    function clearCart() {
        saveCart([]);
        localStorage.setItem(MINI_CART_OPEN_KEY, "false");

        updateCartBadge();
        renderCartPage();
        renderMiniCart();

        const miniCartElement = document.getElementById("miniCartOffcanvas");

        if (miniCartElement && typeof bootstrap !== "undefined") {
            const miniCart = bootstrap.Offcanvas.getInstance(miniCartElement);

            if (miniCart) {
                miniCart.hide();
            }
        }
    }

    // Muestra los productos en la página del carrito
    function renderCartPage() {
        const emptyState = document.getElementById("cartEmptyState");
        const container = document.getElementById("cartItemsContainer");
        const subtotalEl = document.getElementById("cartSubtotal");
        const shippingEl = document.getElementById("cartShipping");
        const totalEl = document.getElementById("cartTotal");

        if (!container) {
            return;
        }

        const cart = getCart();

        if (cart.length === 0) {
            container.innerHTML = "";

            if (emptyState) {
                emptyState.style.display = "block";
            }

            if (subtotalEl) subtotalEl.textContent = formatMoney(0);
            if (shippingEl) shippingEl.textContent = formatMoney(0);
            if (totalEl) totalEl.textContent = formatMoney(0);

            return;
        }

        if (emptyState) {
            emptyState.style.display = "none";
        }

        const subtotal = getCartSubtotal(cart);
        const shipping = subtotal > 0 && subtotal < 800 ? SHIPPING_COST : 0;
        const total = subtotal + shipping;

        container.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.img || '../assets/Logo.png'}" alt="${item.name}" class="cart-product-img">

                <div class="cart-product-info">
                    <h3>${item.name}</h3>
                    <p>${formatMoney(Number(item.price))}</p>

                    <div class="quantity-controls">
                        <button type="button" data-action="decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button type="button" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                </div>

                <div class="cart-price">
                    <button type="button" class="remove-item" data-action="remove" data-id="${item.id}">x</button>
                    <strong>${formatMoney(Number(item.price) * Number(item.quantity))}</strong>
                </div>
            </div>
        `).join("");

        if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
        if (shippingEl) shippingEl.textContent = formatMoney(shipping);
        if (totalEl) totalEl.textContent = formatMoney(total);
    }

    // Muestra los productos en el mini carrito
    function renderMiniCart() {
        const miniCartItems = document.getElementById("miniCartItems");
        const miniCartEmpty = document.getElementById("miniCartEmpty");
        const miniCartSubtotal = document.getElementById("miniCartSubtotal");
        const miniCartTotalItems = document.getElementById("miniCartTotalItems");

        if (!miniCartItems || !miniCartSubtotal || !miniCartTotalItems) {
            return;
        }

        const cart = getCart();
        const subtotal = getCartSubtotal(cart);
        const totalItems = getCartCount(cart);

        miniCartSubtotal.textContent = formatMoney(subtotal);
        miniCartTotalItems.textContent = totalItems;

        if (cart.length === 0) {
            miniCartItems.innerHTML = "";

            if (miniCartEmpty) {
                miniCartEmpty.style.display = "block";
            }

            return;
        }

        if (miniCartEmpty) {
            miniCartEmpty.style.display = "none";
        }

        miniCartItems.innerHTML = cart.map(item => `
            <div class="mini-cart-item" data-id="${item.id}">
                <img src="${item.img || '../assets/Logo.png'}" alt="${item.name}" class="mini-cart-img">

                <div class="mini-cart-info">
                    <span class="mini-cart-title">${item.name}</span>
                    <span class="mini-cart-price">${formatMoney(Number(item.price))}</span>

                    <div class="mini-cart-actions">
                        <button type="button" data-action="remove" data-id="${item.id}" class="mini-cart-remove">
                            <i class="bi bi-trash"></i>
                        </button>

                        <div class="mini-cart-qty">
                            <button type="button" data-action="decrease" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button type="button" data-action="increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join("");
    }

    // Abre el mini carrito en escritorio
    function openMiniCart() {
        if (!isDesktop()) {
            return;
        }

        const cart = getCart();

        if (cart.length === 0) {
            localStorage.setItem(MINI_CART_OPEN_KEY, "false");
            return;
        }

        const miniCartElement = document.getElementById("miniCartOffcanvas");

        if (!miniCartElement || typeof bootstrap === "undefined") {
            return;
        }

        const miniCart = bootstrap.Offcanvas.getOrCreateInstance(miniCartElement, {
            backdrop: false,
            keyboard: false,
            scroll: true
        });

        localStorage.setItem(MINI_CART_OPEN_KEY, "true");
        miniCart.show();
    }

    // Cierra el mini carrito con la X
    function closeMiniCart() {
        const miniCartElement = document.getElementById("miniCartOffcanvas");

        if (!miniCartElement || typeof bootstrap === "undefined") {
            return;
        }

        const miniCart = bootstrap.Offcanvas.getInstance(miniCartElement);

        localStorage.setItem(MINI_CART_OPEN_KEY, "false");

        if (miniCart) {
            miniCart.hide();
        }
    }

    // Restaura el mini carrito si estaba abierto
    function restoreMiniCartState() {
        const cart = getCart();
        const shouldBeOpen = localStorage.getItem(MINI_CART_OPEN_KEY) === "true";

        if (!isDesktop()) {
            return;
        }

        if (cart.length === 0) {
            localStorage.setItem(MINI_CART_OPEN_KEY, "false");
            return;
        }

        if (shouldBeOpen) {
            openMiniCart();
        }
    }

    // Cierra el mini carrito en pantallas pequeñas
    function closeMiniCartOnMobile() {
        const miniCartElement = document.getElementById("miniCartOffcanvas");

        if (!miniCartElement || typeof bootstrap === "undefined") {
            return;
        }

        if (!isDesktop()) {
            const miniCart = bootstrap.Offcanvas.getInstance(miniCartElement);

            if (miniCart) {
                miniCart.hide();
            }
        }
    }

    // Cambia el carrito del navbar según la pantalla
    function updateCartNavbarBehavior() {
        const cartLinks = document.querySelectorAll(".cart-navbar-link");

        cartLinks.forEach(function (cartLink) {
            if (isDesktop()) {
                cartLink.setAttribute("href", "#");
                cartLink.setAttribute("data-bs-toggle", "offcanvas");
                cartLink.setAttribute("data-bs-target", "#miniCartOffcanvas");
                cartLink.setAttribute("aria-controls", "miniCartOffcanvas");
            } else {
                cartLink.setAttribute("href", "carrito.html");
                cartLink.removeAttribute("data-bs-toggle");
                cartLink.removeAttribute("data-bs-target");
                cartLink.removeAttribute("aria-controls");
            }
        });
    }

    // Muestra mensaje al agregar producto
    function showToast(message) {
        const miniCartElement = document.getElementById("miniCartOffcanvas");

        if (!miniCartElement) {
            return;
        }

        let toast = document.getElementById("cartToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "cartToast";
            toast.className = "cart-toast";
        }

        // Lo mete dentro del mini carrito para que siga su posición sticky
        if (toast.parentElement !== miniCartElement) {
            miniCartElement.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(showToast.timeoutId);

        showToast.timeoutId = setTimeout(function () {
            toast.classList.remove("show");
        }, 3000);
    }

    // Detecta clics en tarjetas de productos
    function bindProductCardClicks() {
        document.addEventListener("click", function (event) {
            const actionButton = event.target.closest("[data-add-to-cart]");

            if (actionButton) {
                const card = actionButton.closest(".product-item-card");
                const info = card ? getItemInfoFromCard(card) : null;

                if (info && info.name) {
                    addToCart(info, Number(actionButton.dataset.quantity || 1));
                }

                return;
            }

            const blockedClick = event.target.closest(
                ".btn-edit, .btn-delete, [data-action], .carousel-control-prev, .carousel-control-next"
            );

            if (blockedClick) {
                return;
            }

            const card = event.target.closest(".product-item-card");

            if (!card) {
                return;
            }

            const info = getItemInfoFromCard(card);

            if (info && info.name) {
                addToCart(info, 1);
            }
        });
    }

    // Detecta botones del carrito
    function bindCartActions() {
        document.addEventListener("click", function (event) {
            const target = event.target.closest("[data-action]");

            if (!target) {
                return;
            }

            const action = target.getAttribute("data-action");
            const productId = target.getAttribute("data-id");

            if (action === "increase") {
                updateCartItemQuantity(productId, 1);
                return;
            }

            if (action === "decrease") {
                updateCartItemQuantity(productId, -1);
                return;
            }

            if (action === "remove") {
                removeFromCart(productId);
            }
        });

        const clearBtn = document.getElementById("btnClearCart");

        if (clearBtn) {
            clearBtn.addEventListener("click", clearCart);
        }

        const miniCartOffcanvas = document.getElementById("miniCartOffcanvas");

        if (miniCartOffcanvas) {
            miniCartOffcanvas.addEventListener("show.bs.offcanvas", function () {
                if (!isDesktop()) {
                    return;
                }

                renderMiniCart();
                updateCartBadge();
            });
        }

        const closeMiniCartButton = document.querySelector(".mini-cart-close");

        if (closeMiniCartButton) {
            closeMiniCartButton.addEventListener("click", closeMiniCart);
        }
    }

    // Ajusta el carrito al cambiar tamaño de pantalla
    window.addEventListener("resize", function () {
        updateCartNavbarBehavior();
        closeMiniCartOnMobile();
    });

    // Inicializa el carrito al cargar la página
    document.addEventListener("DOMContentLoaded", function () {
        function updateMiniCartTop() {
            if (window.scrollY > 180) {
                document.body.classList.add("mini-cart-scrolled");
            } else {
                document.body.classList.remove("mini-cart-scrolled");
            }
        }

        updateMiniCartTop();
        window.addEventListener("scroll", updateMiniCartTop);

        updateCartBadge();
        renderCartPage();
        renderMiniCart();
        bindProductCardClicks();
        bindCartActions();
        updateCartNavbarBehavior();
        restoreMiniCartState();

        setTimeout(function () {
            updateCartBadge();
            renderMiniCart();
            updateCartNavbarBehavior();
            restoreMiniCartState();
        }, 300);

        setTimeout(function () {
            updateCartBadge();
            renderMiniCart();
            updateCartNavbarBehavior();
            restoreMiniCartState();
        }, 800);
    });

    // Permite usar funciones desde otros archivos
    window.MarcandoHuellitasCart = {
        getCart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        formatMoney,
        parseMoney,
        renderCartPage,
        renderMiniCart,
        updateCartBadge,
        openMiniCart
    };
})();
// --- INYECCIÓN DE ICONO ANIMADO EN TARJETAS ---
function injectAnimatedCart() {
    const cards = document.querySelectorAll('.product-item-card');
    cards.forEach(card => {
        if (!card.querySelector('.cart-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'cart-overlay';
            overlay.innerHTML = `
                <lord-icon src="https://cdn.lordicon.com/pbrgppbb.json" trigger="hover" colors="primary:#ffffff" style="width:28px;height:28px"></lord-icon>
                <span class="cart-text">Agregar</span>
            `;
            card.appendChild(overlay);
            
            // Hover animation
            card.addEventListener('mouseenter', () => {
                const icon = overlay.querySelector('lord-icon');
                if (icon && typeof icon.play === 'function') icon.play();
            });

            // Click animation ("Agregado") and Add to Cart
            overlay.addEventListener('click', (e) => {
                // Prevenir que el click se propague a la tarjeta
                e.stopPropagation();

                // Check auth first!
                if (window.requireAuth && !window.requireAuth('agregar productos al carrito')) return;

                const textSpan = overlay.querySelector('.cart-text');
                if (textSpan) {
                    textSpan.textContent = '¡Agregado!';
                    setTimeout(() => {
                        textSpan.textContent = 'Agregar';
                    }, 1500);
                }

                if (window.MarcandoHuellitasCart) {
                    const productId = card.getAttribute("data-product-id") || card.getAttribute("data-id") || Date.now().toString();
                    const titleEl = card.querySelector(".title, h3, h5");
                    const priceEl = card.querySelector(".price, .text-e04b7b, .fw-bold.mb-0");
                    const imgEl = card.querySelector("img");

                    if (titleEl) {
                        const productInfo = {
                            id: productId,
                            name: titleEl.textContent.trim(),
                            price: priceEl ? priceEl.textContent.replace(/[^0-9.]/g, "") : 0,
                            image: imgEl ? imgEl.src : "../../assets/footer/Huellita-footer.png",
                        };
                        window.MarcandoHuellitasCart.addToCart(productInfo, 1);
                    }
                }
            });
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(injectAnimatedCart, 500); // Dar tiempo a cargar lordicon
});
const observer = new MutationObserver(() => injectAnimatedCart());
observer.observe(document.body, { childList: true, subtree: true });



// Toggle Favoritos (Corazones) y Guardar en LocalStorage
document.addEventListener('click', (e) => {
    const heartBtn = e.target.closest('.btn:has(.bi-heart), .btn:has(.bi-heart-fill), .fav-heart, .btn-like-heart');
    if (heartBtn) {
        if (!window.requireAuth('agregar a favoritos')) return;

        const icon = heartBtn.querySelector('i');
        if (icon && (icon.classList.contains('bi-heart') || icon.classList.contains('bi-heart-fill'))) {
            
            const isAdding = icon.classList.contains('bi-heart');
            
            icon.classList.toggle('bi-heart');
            icon.classList.toggle('bi-heart-fill');
            icon.classList.toggle('text-secondary');
            icon.classList.toggle('text-danger');
            
            // Animacion pequeña
            heartBtn.style.transform = 'scale(1.2)';
            setTimeout(() => heartBtn.style.transform = 'scale(1)', 200);

            // Guardar o eliminar datos en LocalStorage
            const card = heartBtn.closest('.card, .team-card, .product-item-card, .favorite-card');
            if (card) {
                const titleEl = card.querySelector('h3, h5, h6.title');
                const title = titleEl ? titleEl.textContent.trim() : 'Sin título';
                const isProduct = card.classList.contains('product-item-card') || window.location.pathname.includes('productos.html') || (card.closest('#pills-productos'));
                const key = isProduct ? 'favoritosProductos' : 'favoritosMascotas';
                
                let favs = JSON.parse(localStorage.getItem(key)) || [];

                if (isAdding) {
                    const imgEl = card.querySelector('img');
                    const imgSrc = imgEl ? imgEl.src : '';
                    
                    let desc = '';
                    if (isProduct) {
                        const strongEl = card.querySelector('.text-e04b7b, .fw-bold.text-danger, strong');
                        desc = strongEl ? strongEl.textContent.trim() : 'Producto de Tienda';
                    } else {
                        const pEl = card.querySelector('p.text-muted');
                        desc = pEl ? pEl.textContent.trim() : 'Mascota adorable';
                    }

                    if (!favs.find(f => f.title === title)) {
                        favs.push({ id: Date.now(), title, desc, img: imgSrc });
                        localStorage.setItem(key, JSON.stringify(favs));
                    }
                } else {
                    favs = favs.filter(f => f.title !== title);
                    localStorage.setItem(key, JSON.stringify(favs));
                    
                    if (card.classList.contains('favorite-card')) {
                        const colWrapper = card.closest('.col-md-6, .col-lg-4');
                        if (colWrapper) colWrapper.style.display = 'none';
                    }
                }
            }
        }
    }
});

