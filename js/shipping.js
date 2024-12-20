import ShippingService from './shipping-api.js';

class ShippingManager {
    constructor() {
        this.postalCodeData = {
            // Datos de códigos postales argentinos con información de ubicación y costos
            '1000': { 
                city: 'Ciudad Autónoma de Buenos Aires', 
                province: 'Buenos Aires', 
                baseShippingCost: 500,
                expressShippingCost: 1000,
                sameDayShippingCost: 1500
            },
            '2000': { 
                city: 'Rosario', 
                province: 'Santa Fe', 
                baseShippingCost: 700,
                expressShippingCost: 1200,
                sameDayShippingCost: 1800
            },
            '5000': { 
                city: 'Córdoba', 
                province: 'Córdoba', 
                baseShippingCost: 600,
                expressShippingCost: 1100,
                sameDayShippingCost: 1600
            }
            // Añadir más códigos postales según sea necesario
        };
    }

    validateForm() {
        const form = document.getElementById('shipping-form');
        const inputs = form.querySelectorAll('input');
        let isValid = true;

        inputs.forEach(input => {
            // Validaciones específicas por tipo de input
            switch(input.getAttribute('type')) {
                case 'text':
                    if (input.value.trim() === '') {
                        this.showError(input, 'Este campo no puede estar vacío');
                        isValid = false;
                    }
                    break;
                
                case 'tel':
                    const phoneRegex = /^[0-9]{10}$/; // Validación de teléfono de 10 dígitos
                    if (!phoneRegex.test(input.value)) {
                        this.showError(input, 'Ingrese un número de teléfono válido (10 dígitos)');
                        isValid = false;
                    }
                    break;
            }
        });

        // Validación específica de código postal
        const postalCodeInput = form.querySelector('input[placeholder="Código Postal"]');
        if (!this.validatePostalCode(postalCodeInput.value)) {
            this.showError(postalCodeInput, 'Código postal no válido o no cubierto');
            isValid = false;
        }

        return isValid;
    }

    validatePostalCode(postalCode) {
        // Validar formato de código postal argentino
        const postalCodeRegex = /^[0-9]{4}$/;
        if (!postalCodeRegex.test(postalCode)) {
            return false;
        }

        // Verificar si el código postal existe en nuestra base de datos
        return !!this.postalCodeData[postalCode];
    }

    showError(input, message) {
        // Eliminar errores previos
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Crear y mostrar mensaje de error
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message', 'text-danger', 'small', 'mt-1');
        errorElement.textContent = message;
        input.parentNode.appendChild(errorElement);
        input.classList.add('is-invalid');
    }

    getShippingCosts(postalCode) {
        // Obtener costos de envío basados en el código postal
        const locationData = this.postalCodeData[postalCode];
        return locationData ? {
            standard: locationData.baseShippingCost,
            express: locationData.expressShippingCost,
            sameDay: locationData.sameDayShippingCost,
            city: locationData.city,
            province: locationData.province
        } : null;
    }

    updateShippingOptions(postalCode) {
        const shippingCosts = this.getShippingCosts(postalCode);
        if (shippingCosts) {
            const standardShipping = document.getElementById('standard-shipping');
            const expressShipping = document.getElementById('express-shipping');
            const sameDayShipping = document.getElementById('same-day-shipping');

            standardShipping.nextElementSibling.textContent = `Envío Estándar (5-7 días) - $${shippingCosts.standard}`;
            expressShipping.nextElementSibling.textContent = `Envío Express (2-3 días) - $${shippingCosts.express}`;
            sameDayShipping.nextElementSibling.textContent = `Envío el Mismo Día - $${shippingCosts.sameDay}`;

            // Actualizar información de ubicación
            const locationInfo = document.getElementById('shipping-location-info');
            if (!locationInfo) {
                const infoElement = document.createElement('div');
                infoElement.id = 'shipping-location-info';
                infoElement.classList.add('text-muted', 'small', 'mt-2');
                infoElement.textContent = `Envío a ${shippingCosts.city}, ${shippingCosts.province}`;
                document.querySelector('.shipping-methods').appendChild(infoElement);
            } else {
                locationInfo.textContent = `Envío a ${shippingCosts.city}, ${shippingCosts.province}`;
            }

            return true;
        }
        return false;
    }

    initEventListeners() {
        const postalCodeInput = document.querySelector('input[placeholder="Código Postal"]');
        
        postalCodeInput.addEventListener('input', (e) => {
            const postalCode = e.target.value;
            if (postalCode.length === 4) {
                this.updateShippingOptions(postalCode);
            }
        });

        const form = document.getElementById('shipping-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                // Aquí puedes agregar lógica adicional para procesar el formulario
                console.log('Formulario válido');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const shippingForm = document.getElementById('shipping-calculator');
    const resultContainer = document.getElementById('shipping-results');

    shippingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const postalCode = document.getElementById('postal-code').value;
        const weight = parseFloat(document.getElementById('package-weight').value);

        try {
            const shippingOptions = await ShippingService.calculateShipping({
                destinationPostalCode: postalCode,
                weight: weight
            });

            if (shippingOptions) {
                resultContainer.innerHTML = `
                    <h3>Opciones de Envío</h3>
                    <p>Envío Estándar: $${shippingOptions.standardShipping}</p>
                    <p>Envío Express: $${shippingOptions.expressShipping}</p>
                `;
            } else {
                resultContainer.innerHTML = 'No se pudo calcular el envío';
            }
        } catch (error) {
            console.error('Error en cálculo de envío:', error);
            resultContainer.innerHTML = 'Hubo un error al calcular el envío';
        }
    });
});
