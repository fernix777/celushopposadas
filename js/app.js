document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');
    const categoryButtons = document.querySelectorAll('[data-category]');
    const searchInput = document.getElementById('search-input');
    const cartCount = document.getElementById('cart-count');
    let currentCategory = 'iphone'; // Categoría por defecto
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderProducts(category, searchTerm = '') {
        productsGrid.innerHTML = '';
        const filteredProducts = products.filter(product => 
            product.category === category && 
            (searchTerm === '' || 
             product.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
             product.model.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('col-md-4', 'col-lg-3', 'mb-4');
            productCard.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="position-relative text-center p-3">
                        <img src="${product.imageUrls[0]}" 
                             class="card-img-top img-fluid" 
                             alt="${product.brand} ${product.model}"
                             style="max-height: 250px; object-fit: contain;">
                        ${product.condition === 'Nuevo' ? '<span class="badge bg-success position-absolute top-0 end-0 m-2">Nuevo</span>' : ''}
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="text-center mb-3">
                            <h5 class="card-title mb-1">${product.brand} ${product.model}</h5>
                            <p class="card-text text-muted small mb-2">${product.description}</p>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <span class="h5 text-primary mb-0">$${product.price.toLocaleString()}</span>
                            <span class="text-muted small">${product.stock} disponibles</span>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent d-flex justify-content-between">
                        <button class="btn btn-outline-primary details-btn w-50 me-2" data-id="${product.id}">
                            Ver Detalles
                        </button>
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                            🛒 Añadir
                        </button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(productCard);

            // Añadir evento para ver detalles
            productCard.querySelector('.details-btn').addEventListener('click', () => showProductDetails(product));

            // Añadir evento para añadir al carrito
            productCard.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product));
        });

        // Si no hay productos, mostrar mensaje
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-info" role="alert">
                        No hay productos disponibles en esta categoría.
                    </div>
                </div>
            `;
        }
    }

    function showProductDetails(product) {
        const modalHtml = `
            <div class="modal fade" id="productModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${product.brand} ${product.model}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
                                        <div class="carousel-inner">
                                            ${product.imageUrls.map((url, index) => `
                                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                                    <img src="${url}" class="d-block w-100" alt="${product.brand} ${product.model}">
                                                </div>
                                            `).join('')}
                                        </div>
                                        <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                                            <span class="carousel-control-prev-icon"></span>
                                        </button>
                                        <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                                            <span class="carousel-control-next-icon"></span>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <h4>Especificaciones</h4>
                                    <table class="table">
                                        <tr><td>Pantalla:</td><td>${product.specs.screenSize} (${product.specs.resolution})</td></tr>
                                        <tr><td>Procesador:</td><td>${product.specs.processor}</td></tr>
                                        <tr><td>RAM:</td><td>${product.specs.ram}</td></tr>
                                        <tr><td>Almacenamiento:</td><td>${product.specs.storage}</td></tr>
                                        <tr><td>Batería:</td><td>${product.specs.battery}</td></tr>
                                        <tr><td>Cámara Principal:</td><td>${product.specs.mainCamera}</td></tr>
                                        <tr><td>Cámara Frontal:</td><td>${product.specs.frontCamera}</td></tr>
                                        <tr><td>Sistema Operativo:</td><td>${product.specs.os}</td></tr>
                                    </table>
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <span class="h4 text-primary">$${product.price.toLocaleString()}</span>
                                        <button class="btn btn-primary add-to-cart-modal" data-id="${product.id}">
                                            🛒 Añadir al Carrito
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Crear un div temporal para insertar el modal
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHtml;
        document.body.appendChild(tempDiv.firstChild);

        // Mostrar modal con Bootstrap
        const productModal = new bootstrap.Modal(document.getElementById('productModal'));
        productModal.show();

        // Añadir evento para añadir al carrito desde el modal
        document.querySelector('.add-to-cart-modal').addEventListener('click', () => {
            addToCart(product);
            productModal.hide();
        });
    }

    function addToCart(product) {
        // Buscar si el producto ya está en el carrito
        const existingProductIndex = cart.findIndex(item => item.id === product.id);

        if (existingProductIndex > -1) {
            // Si el producto ya existe, incrementar cantidad
            cart[existingProductIndex].quantity += 1;
        } else {
            // Si es un producto nuevo, añadirlo con cantidad 1
            cart.push({
                ...product,
                quantity: 1
            });
        }

        // Guardar en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Actualizar UI del carrito
        updateCartUI();

        // Mostrar notificación de producto añadido
        showCartNotification(product);
    }

    function showCartNotification(product) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.classList.add('cart-notification', 'alert', 'alert-success', 'position-fixed', 'top-0', 'end-0', 'm-3', 'z-3');
        notification.style.zIndex = '1050';
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${product.imageUrls[0]}" alt="${product.brand} ${product.model}" style="width: 50px; height: 50px; object-fit: cover;" class="me-2">
                <div>
                    <strong>${product.brand} ${product.model}</strong> añadido al carrito
                </div>
            </div>
        `;

        // Añadir al body
        document.body.appendChild(notification);

        // Eliminar notificación después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartQuantity(productId, newQuantity) {
        const productIndex = cart.findIndex(item => item.id === productId);
        
        if (productIndex > -1) {
            if (newQuantity > 0) {
                cart[productIndex].quantity = newQuantity;
            } else {
                // Si la cantidad es 0, eliminar del carrito
                cart.splice(productIndex, 1);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
        }
    }

    function clearCart() {
        cart = [];
        localStorage.removeItem('cart');
        updateCartUI();
    }

    function updateCartUI() {
        const cartItems = document.getElementById('cart-items');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartShipping = document.getElementById('cart-shipping');
        const cartTotalAmount = document.getElementById('cart-total-amount');
        const shippingMethodInputs = document.querySelectorAll('input[name="shippingMethod"]');
        
        cartItems.innerHTML = '';
        let subtotal = 0;
        let shippingCost = 500; // Envío estándar por defecto

        // Calcular subtotal de productos
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2', 'p-2', 'bg-light', 'rounded');
            cartItem.innerHTML = `
                <img src="${item.imageUrls[0]}" alt="${item.brand} ${item.model}" style="width: 50px; height: 50px; object-fit: cover;" class="me-2">
                <div class="flex-grow-1">
                    <span>${item.brand} ${item.model}</span>
                    <div class="input-group input-group-sm mt-1" style="max-width: 120px;">
                        <button class="btn btn-outline-secondary decrease-quantity" type="button" data-id="${item.id}">-</button>
                        <input type="text" class="form-control text-center quantity-input" value="${item.quantity}" data-id="${item.id}" readonly>
                        <button class="btn btn-outline-secondary increase-quantity" type="button" data-id="${item.id}">+</button>
                    </div>
                </div>
                <span class="text-primary">$${(item.price * item.quantity).toLocaleString()}</span>
                <button class="btn btn-sm btn-danger ms-2 remove-cart-item" data-id="${item.id}">🗑️</button>
            `;
            cartItems.appendChild(cartItem);
            subtotal += item.price * item.quantity;

            // Eventos para modificar cantidad
            const decreaseBtn = cartItem.querySelector('.decrease-quantity');
            const increaseBtn = cartItem.querySelector('.increase-quantity');
            const quantityInput = cartItem.querySelector('.quantity-input');

            decreaseBtn.addEventListener('click', () => {
                const currentQuantity = parseInt(quantityInput.value);
                if (currentQuantity > 1) {
                    updateCartQuantity(item.id, currentQuantity - 1);
                }
            });

            increaseBtn.addEventListener('click', () => {
                const currentQuantity = parseInt(quantityInput.value);
                updateCartQuantity(item.id, currentQuantity + 1);
            });

            // Evento para eliminar del carrito
            cartItem.querySelector('.remove-cart-item').addEventListener('click', () => {
                removeFromCart(item.id);
            });
        });

        // Manejar selección de método de envío
        shippingMethodInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                switch(e.target.value) {
                    case 'standard':
                        shippingCost = 500;
                        break;
                    case 'express':
                        shippingCost = 1000;
                        break;
                    case 'same-day':
                        shippingCost = 1500;
                        break;
                }
                updateCartTotal(subtotal, shippingCost);
            });
        });

        // Calcular total con envío
        updateCartTotal(subtotal, shippingCost);

        // Actualizar contador de carrito
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

        // Botón de limpiar carrito
        const clearCartBtn = document.getElementById('clear-cart-btn');
        if (!clearCartBtn) {
            const btn = document.createElement('button');
            btn.id = 'clear-cart-btn';
            btn.classList.add('btn', 'btn-warning', 'w-100', 'mt-2');
            btn.textContent = 'Limpiar Carrito';
            btn.addEventListener('click', clearCart);
            document.querySelector('.cart-dropdown').appendChild(btn);
        }
    }

    function updateCartTotal(subtotal, shippingCost) {
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartShipping = document.getElementById('cart-shipping');
        const cartTotalAmount = document.getElementById('cart-total-amount');
        const total = subtotal + shippingCost;
        
        cartSubtotal.textContent = `$${subtotal.toLocaleString()}`;
        cartShipping.textContent = `$${shippingCost.toLocaleString()}`;
        cartTotalAmount.textContent = `$${total.toLocaleString()}`;
    }

    // Inicializar con smartphones
    renderProducts(currentCategory);

    // Manejar cambios de categoría
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Añadir clase active al botón clickeado
            button.classList.add('active');
            
            currentCategory = button.dataset.category;
            renderProducts(currentCategory);
        });
    });

    // Establecer smartphones como categoría activa por defecto
    document.querySelector('[data-category="iphone"]').classList.add('active');

    // Búsqueda de productos
    searchInput.addEventListener('input', (e) => {
        renderProducts(currentCategory, e.target.value);
    });

    // Añadir evento de añadir al carrito a los botones de productos
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const product = products.find(p => p.id === productId);
            if (product) {
                addToCart(product);
            }
        });
    });

    // Inicializar eventos del carrito
    const cartToggle = document.getElementById('cart-toggle');
    const cartDropdown = document.getElementById('cart-dropdown');
    const cartLinks = document.querySelectorAll('.cart-link');

    // Función para alternar la visibilidad del carrito
    function toggleCart() {
        cartDropdown.classList.toggle('show');
    }

    // Evento para el botón de carrito en el encabezado
    cartToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCart();
    });

    // Eventos para los enlaces de carrito
    cartLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCart();
        });
    });

    // Cerrar el carrito si se hace clic fuera de él
    document.addEventListener('click', (e) => {
        if (!cartDropdown.contains(e.target) && !cartToggle.contains(e.target)) {
            cartDropdown.classList.remove('show');
        }
    });

    // Inicializar carrito al cargar la página
    updateCartUI();
});
