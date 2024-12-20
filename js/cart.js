// Definir productos globalmente si no están importados
const allProducts = [
    // iPhones
    {
        id: 'iphone14-1',
        name: 'iPhone 14',
        description: 'Potente smartphone con cámara profesional y diseño elegante',
        price: 299999,
        image: 'img/smartphones/iphone14.png',
        category: 'iphone'
    },
    {
        id: 'iphone15-pro',
        name: 'iPhone 15 Pro',
        description: 'Smartphone de alta gama con titanio y cámara profesional',
        price: 449999,
        image: 'img/smartphones/iphone15pro.png',
        category: 'iphone'
    },
    // Samsung
    {
        id: 'galaxy-s23-ultra',
        name: 'Samsung Galaxy S23 Ultra',
        description: 'Smartphone premium con cámara de 200MP y S Pen',
        price: 379999,
        image: 'img/smartphones/s23ultra.png',
        category: 'samsung'
    },
    {
        id: 'galaxy-z-fold5',
        name: 'Samsung Galaxy Z Fold 5',
        description: 'Smartphone plegable de última generación',
        price: 599999,
        image: 'img/smartphones/zfold5.png',
        category: 'samsung'
    },
    // Xiaomi
    {
        id: 'xiaomi-pocof6',
        name: 'Xiaomi Poco F6',
        description: 'Smartphone de alto rendimiento con procesador de última generación',
        price: 249999,
        image: 'img/smartphones/f6.png',
        category: 'xiaomi'
    },
    {
        id: 'xiaomi-mi13',
        name: 'Xiaomi Mi 13',
        description: 'Smartphone con tecnología Leica y diseño premium',
        price: 329999,
        image: 'img/smartphones/mi13.png',
        category: 'xiaomi'
    },
    // Motorola
    {
        id: 'motorola-edge40',
        name: 'Motorola Edge 40',
        description: 'Smartphone elegante con carga ultra rápida',
        price: 219999,
        image: 'img/smartphones/edge40.png',
        category: 'motorola'
    },
    // Google
    {
        id: 'google-pixel7',
        name: 'Google Pixel 7',
        description: 'Smartphone con inteligencia artificial líder',
        price: 329999,
        image: 'img/smartphones/pixel7.png',
        category: 'google'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Clase para manejar el carrito de compras
    class ShoppingCart {
        constructor() {
            this.items = [];
            this.cartElement = document.getElementById('cart-items');
            this.cartTotalElement = document.getElementById('cart-total-price');
            this.cartCountElement = document.getElementById('cart-count');
            this.loadCartFromLocalStorage();
            this.setupEventListeners();
            this.updateCartDisplay();
        }

        // Cargar carrito desde localStorage
        loadCartFromLocalStorage() {
            const savedCart = localStorage.getItem('shoppingCart');
            if (savedCart) {
                this.items = JSON.parse(savedCart);
            }
        }

        // Guardar carrito en localStorage
        saveCartToLocalStorage() {
            localStorage.setItem('shoppingCart', JSON.stringify(this.items));
        }

        // Configurar event listeners
        setupEventListeners() {
            // Delegación de eventos para agregar al carrito
            document.addEventListener('click', (event) => {
                const addToCartBtn = event.target.closest('.add-to-cart, .add-to-cart-modal');
                if (addToCartBtn) {
                    const productId = addToCartBtn.dataset.id;
                    this.addToCart(productId);
                }
            });

            // Delegación de eventos para eliminar del carrito
            document.addEventListener('click', (event) => {
                const removeBtn = event.target.closest('.remove-from-cart');
                if (removeBtn) {
                    const productId = removeBtn.dataset.id;
                    this.removeFromCart(productId);
                }
            });

            // Delegación de eventos para eliminar completamente un producto
            document.addEventListener('click', (event) => {
                const deleteBtn = event.target.closest('.delete-from-cart');
                if (deleteBtn) {
                    const productId = deleteBtn.dataset.id;
                    this.deleteFromCart(productId);
                }
            });

            // Botón de vaciar carrito
            const clearCartBtn = document.getElementById('cart-clear');
            if (clearCartBtn) {
                clearCartBtn.addEventListener('click', () => this.clearCart());
            }

            // Botón de checkout
            const checkoutBtn = document.getElementById('cart-checkout');
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', () => this.checkout());
            }
        }

        // Añadir producto al carrito
        addToCart(productId) {
            // Buscar el producto en el catálogo
            const product = allProducts.find(p => p.id === productId);
            
            console.log('Intentando agregar producto:', productId);
            console.log('Producto encontrado:', product);
            console.log('Productos disponibles:', allProducts);
            
            if (!product) {
                console.error('Producto no encontrado', productId, allProducts);
                return;
            }

            // Verificar si el producto ya está en el carrito
            const existingItem = this.items.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({
                    ...product,
                    quantity: 1
                });
            }

            console.log('Carrito después de agregar:', this.items);

            this.updateCartDisplay();
            this.saveCartToLocalStorage();
            this.showCartNotification(product);
        }

        // Eliminar producto del carrito
        removeFromCart(productId) {
            const itemIndex = this.items.findIndex(item => item.id === productId);
            
            if (itemIndex !== -1) {
                if (this.items[itemIndex].quantity > 1) {
                    this.items[itemIndex].quantity -= 1;
                } else {
                    this.items.splice(itemIndex, 1);
                }
                
                this.updateCartDisplay();
                this.saveCartToLocalStorage();
            }
        }

        // Vaciar carrito completamente
        clearCart() {
            this.items = [];
            this.updateCartDisplay();
            this.saveCartToLocalStorage();
        }

        // Calcular total del carrito
        calculateTotal() {
            return this.items.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);
        }

        // Mostrar notificación de producto añadido
        showCartNotification(product) {
            const notification = document.createElement('div');
            notification.classList.add('cart-notification');
            notification.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div>
                    <strong>${product.name}</strong> añadido al carrito
                </div>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 500);
            }, 2000);
        }

        // Actualizar visualización del carrito
        updateCartDisplay() {
            if (!this.cartElement || !this.cartTotalElement || !this.cartCountElement) {
                console.warn('Elementos del carrito no encontrados');
                return;
            }

            // Limpiar contenido actual
            this.cartElement.innerHTML = '';

            // Mostrar productos en el carrito
            this.items.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${(item.price * item.quantity).toLocaleString()}</p>
                        <div class="cart-item-quantity">
                            <button class="remove-from-cart" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="add-to-cart" data-id="${item.id}">+</button>
                        </div>
                        <button class="delete-from-cart" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                this.cartElement.appendChild(cartItemElement);
            });

            // Actualizar total y contador
            const total = this.calculateTotal();
            this.cartTotalElement.textContent = `$${total.toLocaleString()}`;
            this.cartCountElement.textContent = this.items.reduce((count, item) => count + item.quantity, 0);

            // Mostrar/ocultar mensaje de carrito vacío
            const cartEmptyMessage = document.querySelector('.cart-empty-message');
            if (this.items.length === 0) {
                cartEmptyMessage.style.display = 'block';
                this.cartElement.style.display = 'none';
            } else {
                cartEmptyMessage.style.display = 'none';
                this.cartElement.style.display = 'block';
            }
        }

        // Nuevo método para eliminar completamente un producto
        deleteFromCart(productId) {
            const itemIndex = this.items.findIndex(item => item.id === productId);
            
            if (itemIndex !== -1) {
                this.items.splice(itemIndex, 1);
                
                this.updateCartDisplay();
                this.saveCartToLocalStorage();
            }
        }

        // Método de checkout con Mercado Pago
        async checkout() {
            if (this.items.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }

            // Preparar datos para Mercado Pago
            const checkoutItems = this.items.map(item => {
                // Buscar el producto completo en allProducts
                const product = allProducts.find(p => p.id === item.id);
                return {
                    title: product.name,
                    unit_price: product.price,
                    quantity: item.quantity,
                    currency_id: 'ARS',
                    picture_url: window.location.origin + '/' + product.image
                };
            });

            try {
                const response = await fetch('http://localhost:5000/create-preference', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        items: checkoutItems
                    })
                });

                const preferenceData = await response.json();

                if (preferenceData.init_point) {
                    // Redirigir a Mercado Pago
                    window.location.href = preferenceData.init_point;
                } else {
                    throw new Error('No se pudo crear la preferencia de pago');
                }
            } catch (error) {
                console.error('Error en el checkout:', error);
                alert('Hubo un problema al procesar tu pago. Por favor, intenta de nuevo.');
            }
        }
    }

    // Inicializar carrito
    window.shoppingCart = new ShoppingCart();
});
