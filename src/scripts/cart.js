(function () {
    const STORAGE_KEY = "marcandoHuellitasCart";
    const SHIPPING_COST = 29;

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

    function formatMoney(value) {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Number(value) || 0);
    }

    function getCart() {
        try {
            const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(raw) ? raw : [];
        } catch (error) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }

    function updateCartBadge() {
        const cartCount = getCart().reduce((total, item) => total + (Number(item.quantity) || 0), 0);

        document.querySelectorAll("[data-cart-count]").forEach(element => {
            element.textContent = cartCount;
            element.style.display = cartCount > 0 ? "inline-flex" : "none";
        });

        const cartBadge = document.getElementById("cartBadge");
        if (cartBadge) {
            cartBadge.textContent = cartCount;
            cartBadge.style.display = cartCount > 0 ? "inline-flex" : "none";
        }
    }

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

        const message = `${normalizedProduct.name} añadido al carrito`;
        showToast(message);
        return cart;
    }

    function removeFromCart(productId) {
        const updatedCart = getCart().filter(item => String(item.id) !== String(productId));
        saveCart(updatedCart);
        updateCartBadge();
        renderCartPage();
    }

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
    }

    function clearCart() {
        saveCart([]);
        updateCartBadge();
        renderCartPage();
    }

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

        const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity || 1)), 0);
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

    function showToast(message) {
        let toast = document.getElementById("cartToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "cartToast";
            toast.className = "cart-toast";
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(showToast.timeoutId);
        showToast.timeoutId = setTimeout(() => {
            toast.classList.remove("show");
        }, 1800);
    }

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

            const editBtn = event.target.closest(".btn-edit, .btn-delete");
            if (editBtn) {
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
    }

    document.addEventListener("DOMContentLoaded", function () {
        updateCartBadge();
        renderCartPage();
        bindProductCardClicks();
        bindCartActions();
    });

    window.MarcandoHuellitasCart = {
        getCart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        formatMoney,
        parseMoney,
        renderCartPage,
        updateCartBadge
    };
})();
