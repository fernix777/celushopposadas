document.addEventListener('DOMContentLoaded', () => {
    // Tasas de cambio predefinidas (actualizadas manualmente)
    const exchangeRates = {
        oficial: 800,      // Dólar Oficial (Banco Nación)
        blue: 1100,        // Dólar Blue (mercado informal)
        turista: 1350      // Dólar Turista (con impuestos)
    };

    // Variable global para el tipo de cambio actual
    let currentExchangeRateType = 'blue';

    // Función para obtener la tasa de cambio actual
    async function fetchExchangeRate() {
        try {
            // Intentar obtener tasa de dólar blue desde API
            const response = await fetch('https://api.bluelytics.com.ar/v2/latest');
            const data = await response.json();
            
            // Actualizar tasas con datos de la API
            exchangeRates.blue = data.blue.value_sell;
            exchangeRates.oficial = data.oficial.value_sell;
            
            // Calcular dólar turista (aproximado)
            exchangeRates.turista = exchangeRates.blue * 1.3;

            console.log('Tasas de cambio actualizadas:', exchangeRates);
        } catch (error) {
            console.warn('No se pudo obtener tasas de cambio. Usando valores predeterminados.', error);
        }

        // Selector de tipo de cambio
        createExchangeRateSelector();
    }

    // Crear selector de tipo de cambio
    function createExchangeRateSelector() {
        const selector = document.createElement('div');
        selector.classList.add('exchange-rate-selector');
        selector.innerHTML = `
            <select id="exchange-rate-select">
                <option value="blue">Dólar Blue (Informal)</option>
                <option value="oficial">Dólar Oficial</option>
                <option value="turista">Dólar Turista</option>
            </select>
            <span class="exchange-rate-info">
                ${formatExchangeRateInfo()}
            </span>
        `;

        // Añadir al encabezado o a una ubicación apropiada
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(selector);
        }

        // Evento de cambio de tipo de cambio
        const exchangeRateSelect = document.getElementById('exchange-rate-select');
        exchangeRateSelect.addEventListener('change', (e) => {
            currentExchangeRateType = e.target.value;
            updateAllPrices();
            updateExchangeRateInfo();
        });
    }

    // Formatear información de tasa de cambio
    function formatExchangeRateInfo() {
        const rate = exchangeRates[currentExchangeRateType];
        return `1 USD = ${rate.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`;
    }

    // Actualizar información de tasa de cambio
    function updateExchangeRateInfo() {
        const infoElement = document.querySelector('.exchange-rate-info');
        if (infoElement) {
            infoElement.textContent = formatExchangeRateInfo();
        }
    }

    // Tasa de cambio (esta se actualizará dinámicamente)
    let exchangeRate = 1; // Valor por defecto
    let currentCurrency = 'ARS'; // Moneda por defecto

    // Función para formatear precio
    function formatPrice(price, currency) {
        if (currency === 'USD') {
            // Convertir usando la tasa de cambio actual
            const usdPrice = price / exchangeRates[currentExchangeRateType];
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(usdPrice);
        } else {
            return new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS'
            }).format(price);
        }
    }

    // Actualizar todos los precios en la página
    function updateAllPrices() {
        // Actualizar precios en tarjetas de productos
        document.querySelectorAll('.product-card .product-price').forEach(priceElement => {
            const productId = priceElement.closest('.product-card').querySelector('[data-id]').dataset.id;
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                priceElement.textContent = formatPrice(product.price, currentCurrency);
            }
        });

        // Actualizar precios en modales de producto
        document.querySelectorAll('.modal-price').forEach(priceElement => {
            const productId = priceElement.closest('.product-modal-content').querySelector('.add-to-cart-modal').dataset.id;
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                priceElement.textContent = formatPrice(product.price, currentCurrency);
            }
        });
    }

    // Crear selector de moneda
    function createCurrencySelector() {
        const selector = document.createElement('div');
        selector.classList.add('currency-selector');
        selector.innerHTML = `
            <select id="currency-select">
                <option value="ARS">Pesos Argentinos (ARS)</option>
                <option value="USD">Dólares Estadounidenses (USD)</option>
            </select>
        `;

        // Añadir al encabezado o a una ubicación apropiada
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(selector);
        }

        // Evento de cambio de moneda
        const currencySelect = document.getElementById('currency-select');
        currencySelect.addEventListener('change', (e) => {
            currentCurrency = e.target.value;
            updateAllPrices();
        });
    }

    const productsGrid = document.getElementById('products-grid');
    
    // Función para cargar productos desde el backend
    async function loadIPhoneProducts() {
        try {
            const response = await fetch('http://localhost:3000/products');
            const products = await response.json();
            
            // Filtrar solo productos de iPhone
            const iPhoneProducts = products.filter(product => 
                product.brand === 'Apple' && product.category === 'Smartphone'
            );
            
            productsGrid.innerHTML = ''; // Limpiar contenedor
            
            iPhoneProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.dataset.category = product.category;

                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.imageUrls[0]}" alt="${product.model}">
                    </div>
                    <div class="product-details">
                        <h3>${product.brand} ${product.model}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-footer">
                            <span class="product-price">${formatPrice(product.price, currentCurrency)}</span>
                            <div class="product-actions">
                                <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                                    <i class="fas fa-shopping-cart"></i>Agregar al Carrito
                                </button>
                                <button class="btn btn-secondary product-details-btn" data-id="${product.id}">
                                    <i class="fas fa-info-circle"></i>Ver Detalles
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                // Añadir evento para ver detalles
                const detailsBtn = productCard.querySelector('.product-details-btn');
                detailsBtn.addEventListener('click', () => {
                    showProductDetails(product);
                });

                productsGrid.appendChild(productCard);
            });
        } catch (error) {
            console.error('Error al cargar productos:', error);
            productsGrid.innerHTML = '<p>Error al cargar productos</p>';
        }
    }

    // Modificar la función de mostrar detalles para usar formatPrice
    function showProductDetails(product) {
        const modal = document.createElement('div');
        modal.classList.add('product-modal');
        modal.innerHTML = `
            <div class="product-modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-image">
                    <img src="${product.imageUrls[0]}" alt="${product.model}">
                </div>
                <div class="modal-details">
                    <h2>${product.brand} ${product.model}</h2>
                    <p class="modal-description">${product.description}</p>
                    
                    <div class="modal-specs">
                        <h3>Especificaciones</h3>
                        <div class="specs-grid">
                            <div class="spec-item">
                                <i class="fas fa-mobile-alt"></i>
                                <span>Pantalla</span>
                                <p>${product.specs.display}</p>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-microchip"></i>
                                <span>Procesador</span>
                                <p>${product.specs.processor}</p>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-memory"></i>
                                <span>RAM</span>
                                <p>${product.specs.ram}</p>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-hdd"></i>
                                <span>Almacenamiento</span>
                                <p>${product.specs.storage}</p>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-camera"></i>
                                <span>Cámara Principal</span>
                                <p>${product.specs.mainCamera}</p>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-selfie-stick"></i>
                                <span>Cámara Frontal</span>
                                <p>${product.specs.frontCamera}</p>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-battery-full"></i>
                                <span>Batería</span>
                                <p>${product.specs.battery}</p>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-mobile"></i>
                                <span>Sistema Operativo</span>
                                <p>${product.specs.os}</p>
                            </div>
                        </div>
                    </div>

                    <div class="modal-features">
                        <h3>Características Destacadas</h3>
                        <ul>
                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="modal-colors">
                        <h3>Colores Disponibles</h3>
                        <div class="color-options">
                            ${product.colors.map(color => `<span class="color-dot" style="background-color: ${getColorCode(color)};"></span>`).join('')}
                            <p>${product.colors.join(' / ')}</p>
                        </div>
                    </div>

                    <div class="modal-price-actions">
                        <span class="modal-price">${formatPrice(product.price, currentCurrency)}</span>
                        <button class="btn btn-primary add-to-cart-modal" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Cerrar modal
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Agregar al carrito desde modal
        const addToCartBtn = modal.querySelector('.add-to-cart-modal');
        addToCartBtn.addEventListener('click', () => {
            // Lógica para agregar al carrito (implementar en cart.js)
            console.log(`Agregando ${product.model} al carrito desde modal`);
        });

        document.body.appendChild(modal);
    }

    function getColorCode(color) {
        const colorMap = {
            'Azul': '#1E90FF',
            'Púrpura': '#8A2BE2',
            'Blanco': '#FFFFFF',
            'Negro': '#000000',
            'Titanio': '#C0C0C0'
        };
        return colorMap[color] || '#CCCCCC';
    }

    // Inicializar funciones
    fetchExchangeRate(); // Obtener tasa de cambio
    createCurrencySelector(); // Crear selector de moneda

    // Cargar productos al iniciar
    loadIPhoneProducts();
});
