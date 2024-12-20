// Configuración de Mercado Pago
const PUBLIC_KEY = 'TEST-PUBLIC-KEY'; // Reemplazar con tu clave pública

document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.getElementById('checkout-btn');
    const cartTotal = document.getElementById('cart-total');
    
    // Cargar SDK de Mercado Pago
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
        const mp = new MercadoPago(PUBLIC_KEY, { locale: 'es-AR' });
        
        checkoutButton.addEventListener('click', async () => {
            try {
                // Obtener los productos del carrito
                const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
                
                if (cartItems.length === 0) {
                    alert('El carrito está vacío');
                    return;
                }

                // Calcular total
                const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                // Preparar los items para Mercado Pago
                const items = cartItems.map(item => ({
                    id: item.id.toString(),
                    title: `${item.brand} ${item.model}`,
                    unit_price: item.price,
                    quantity: item.quantity,
                    currency_id: 'ARS'
                }));

                // Crear preferencia de pago
                const response = await fetch('/create_preference', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        items,
                        total
                    })
                });

                const preference = await response.json();

                // Iniciar checkout de Mercado Pago
                const bricksBuilder = mp.bricks();
                await bricksBuilder.create(
                    'wallet', 
                    'wallet_container', 
                    {
                        initialization: {
                            preferenceId: preference.id,
                            redirectMode: 'modal'
                        },
                        callbacks: {
                            onSuccess: (response) => {
                                // Limpiar carrito después de pago exitoso
                                localStorage.removeItem('cart');
                                alert('Pago realizado con éxito');
                                location.reload();
                            },
                            onError: (error) => {
                                console.error('Error en el pago:', error);
                                alert('Hubo un error en el pago');
                            }
                        }
                    }
                );
            } catch (error) {
                console.error('Error en el proceso de pago:', error);
                alert('No se pudo procesar el pago');
            }
        });
    };
    
    document.head.appendChild(script);
});
