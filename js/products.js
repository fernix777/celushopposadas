const products = [
    {
        id: 1,
        brand: 'Apple',
        model: 'iPhone 13',
        category: 'iphone',
        price: 799.99,
        description: 'Smartphone de última generación con cámara dual y pantalla OLED',
        imageUrls: [
            'img/smartphones/iphone13-1.png',
            'img/smartphones/iphone13-2.jpg',
            'img/smartphones/iphone13-3.jpg'
        ],
        specs: {
            screenSize: '6.1 pulgadas',
            resolution: '2532 x 1170 píxeles',
            processor: 'A15 Bionic',
            ram: '4GB',
            storage: '128GB',
            battery: '3240 mAh',
            mainCamera: '12 MP + 12 MP',
            frontCamera: '12 MP',
            os: 'iOS 15'
        },
        colors: ['Azul', 'Rosa', 'Medianoche', 'Blanco'],
        stock: 15,
        condition: 'Nuevo',
        warranty: '1 año'
    },
    {
        id: 2,
        brand: 'Samsung',
        model: 'Galaxy S21',
        category: 'samsung',
        price: 699.99,
        description: 'Smartphone Android con cámara de alta resolución y diseño moderno',
        imageUrls: [
            'img/smartphones/galaxys21-1.jpg',
            'img/smartphones/galaxys21-2.jpg',
            'img/smartphones/galaxys21-3.jpg'
        ],
        specs: {
            screenSize: '6.2 pulgadas',
            resolution: '2400 x 1080 píxeles',
            processor: 'Exynos 2100',
            ram: '8GB',
            storage: '256GB',
            battery: '4000 mAh',
            mainCamera: '64 MP + 12 MP + 12 MP',
            frontCamera: '10 MP',
            os: 'Android 11'
        },
        colors: ['Gris', 'Blanco', 'Violeta'],
        stock: 10,
        condition: 'Nuevo',
        warranty: '2 años'
    },
    {
        id: 3,
        brand: 'Apple',
        model: 'iPhone 14 Pro',
        category: 'iphone',
        price: 999.99,
        description: 'Smartphone premium con Dynamic Island y cámara de 48 MP',
        imageUrls: [
            'img/smartphones/iphone14pro-1.jpg',
            'img/smartphones/iphone14pro-2.jpg',
            'img/smartphones/iphone14pro-3.jpg'
        ],
        specs: {
            screenSize: '6.1 pulgadas',
            resolution: '2556 x 1179 píxeles',
            processor: 'A16 Bionic',
            ram: '6GB',
            storage: '256GB',
            battery: '3200 mAh',
            mainCamera: '48 MP + 12 MP + 12 MP',
            frontCamera: '12 MP',
            os: 'iOS 16'
        },
        colors: ['Morado Profundo', 'Oro', 'Plata', 'Negro Espacial'],
        stock: 8,
        condition: 'Nuevo',
        warranty: '1 año'
    },
    {
        id: 4,
        brand: 'Samsung',
        model: 'Galaxy S22 Ultra',
        category: 'samsung',
        price: 1199.99,
        description: 'Smartphone de gama alta con S Pen integrado y cámara profesional',
        imageUrls: [
            'img/smartphones/galaxys22ultra-1.jpg',
            'img/smartphones/galaxys22ultra-2.jpg',
            'img/smartphones/galaxys22ultra-3.jpg'
        ],
        specs: {
            screenSize: '6.8 pulgadas',
            resolution: '3088 x 1440 píxeles',
            processor: 'Snapdragon 8 Gen 1',
            ram: '12GB',
            storage: '512GB',
            battery: '5000 mAh',
            mainCamera: '108 MP + 10 MP + 10 MP + 12 MP',
            frontCamera: '40 MP',
            os: 'Android 12'
        },
        colors: ['Negro Fantasma', 'Blanco', 'Verde Bosque'],
        stock: 5,
        condition: 'Nuevo',
        warranty: '2 años'
    },
    {
        id: 5,
        brand: 'Apple',
        model: 'iPhone SE (2022)',
        category: 'iphone',
        price: 429.99,
        description: 'Smartphone compacto con el potente chip A15 Bionic',
        imageUrls: [
            'img/smartphones/iphonese-1.jpg',
            'img/smartphones/iphonese-2.jpg',
            'img/smartphones/iphonese-3.jpg'
        ],
        specs: {
            screenSize: '4.7 pulgadas',
            resolution: '1334 x 750 píxeles',
            processor: 'A15 Bionic',
            ram: '4GB',
            storage: '64GB',
            battery: '2018 mAh',
            mainCamera: '12 MP',
            frontCamera: '7 MP',
            os: 'iOS 15'
        },
        colors: ['Rojo', 'Blanco', 'Negro'],
        stock: 12,
        condition: 'Nuevo',
        warranty: '1 año'
    },
    {
        id: 6,
        brand: 'Samsung',
        model: 'Galaxy A53 5G',
        category: 'samsung',
        price: 449.99,
        description: 'Smartphone de gama media con conectividad 5G y gran batería',
        imageUrls: [
            'img/smartphones/galaxya53-1.jpg',
            'img/smartphones/galaxya53-2.jpg',
            'img/smartphones/galaxya53-3.jpg'
        ],
        specs: {
            screenSize: '6.5 pulgadas',
            resolution: '2400 x 1080 píxeles',
            processor: 'Exynos 1280',
            ram: '6GB',
            storage: '128GB',
            battery: '5000 mAh',
            mainCamera: '64 MP + 12 MP + 5 MP + 5 MP',
            frontCamera: '32 MP',
            os: 'Android 12'
        },
        colors: ['Azul', 'Negro', 'Blanco'],
        stock: 15,
        condition: 'Nuevo',
        warranty: '2 años'
    }
];
