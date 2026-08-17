document.addEventListener("DOMContentLoaded", function () {
    const dynamicProductsSection = document.getElementById("dynamicProductsSection");
    const productsList = document.getElementById("productsList");
    const emptyStateMsg = document.getElementById("emptyStateMsg");
    const productoForm = document.getElementById("producto-form");
    const adminToggleContainer = document.getElementById("adminToggleContainer");

    // Obtener usuario autenticado de la sesión
    const usuarioActual = JSON.parse(sessionStorage.getItem("usuarioActual"));
    
    // Validar si es administrador (por su rol o su email)
    const isAdmin = usuarioActual && (usuarioActual.rol === "admin" || usuarioActual.email === "admin@marcandohuellitas.com");

    if (isAdmin && adminToggleContainer) {
        adminToggleContainer.style.display = "block";
    }

    localStorage.removeItem("productosAdmin");
    let productos = JSON.parse(localStorage.getItem("productosAdmin")) || [];
    
    // Si no hay productos, cargamos los de prueba para que no se vea vacío
    if (productos.length === 0) {
        productos = [
    {
        "id": "prod-auto-1",
        "nombre": "Cama3 Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "193.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/cama3_perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-2",
        "nombre": "Casa1 Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "1039.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/casa1_perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-3",
        "nombre": "Casa4 Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "1483.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/casa4_perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-4",
        "nombre": "Casa5 Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "1259.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/casa5_perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-5",
        "nombre": "Casa6 Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "1176.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/casa6_perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-6",
        "nombre": "Correa2 Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "151.00",
        "oferta": "si",
        "imagen": "../../assets/productos/accesorios_perro/correa2_perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-7",
        "nombre": "Platos4 Perros",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "1273.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/platos4_perros.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-8",
        "nombre": "Platos5 Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "1225.00",
        "oferta": "si",
        "imagen": "../../assets/productos/accesorios_perro/platos5_perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-9",
        "nombre": "Producto Cama Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "189.00",
        "oferta": "si",
        "imagen": "../../assets/productos/accesorios_perro/producto-cama-perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-10",
        "nombre": "Producto Cama2 Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "813.00",
        "oferta": "si",
        "imagen": "../../assets/productos/accesorios_perro/producto-cama2-perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-11",
        "nombre": "Producto Casa2 Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "459.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/producto-casa2-perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-12",
        "nombre": "Producto Casa3 Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "1227.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/producto-casa3-perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-13",
        "nombre": "Producto Coleccion Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "898.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/producto-coleccion-perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-14",
        "nombre": "Producto Correa Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "1465.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/producto-correa-perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-15",
        "nombre": "Producto Pechera Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "566.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/producto-pechera-perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-16",
        "nombre": "Producto Plato Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "663.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/producto-plato-perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-17",
        "nombre": "Producto Plato2 Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "321.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/producto-plato2-perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-18",
        "nombre": "Producto Plato3 Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "1078.00",
        "oferta": "si",
        "imagen": "../../assets/productos/accesorios_perro/producto-plato3-perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-19",
        "nombre": "Producto Ropa Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "937.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/producto-ropa-perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-20",
        "nombre": "Producto Toalla Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "1461.00",
        "oferta": "si",
        "imagen": "../../assets/productos/accesorios_perro/producto-toalla-perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-21",
        "nombre": "Ropa Chalecolores Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "256.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/ropa_chalecolores_perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-22",
        "nombre": "Ropa Chaleconaranja2 Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "242.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/ropa_chaleconaranja2_perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-23",
        "nombre": "Ropa Chaleconaranja Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "498.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/ropa_chaleconaranja_perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-24",
        "nombre": "Ropa Chalecoverde Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "1296.00",
        "oferta": "no",
        "imagen": "../../assets/productos/accesorios_perro/ropa_chalecoverde_perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-25",
        "nombre": "Ropa Playera Perro",
        "categoria": "Accesorios",
        "especie": "perro",
        "marca": "otra",
        "precio": "1385.00",
        "oferta": "si",
        "imagen": "../../assets/productos/accesorios_perro/ropa_playera_perro.png",
        "descripcion": "Excelente producto de la categoría Accesorios para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-26",
        "nombre": "Hills Croqueta",
        "categoria": "Alimento",
        "especie": "gato",
        "marca": "otra",
        "precio": "279.00",
        "oferta": "no",
        "imagen": "../../assets/productos/comida gato/Hills Croqueta.png",
        "descripcion": "Excelente producto de la categoría Alimento para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-27",
        "nombre": "Hills Diet Lata",
        "categoria": "Alimento",
        "especie": "gato",
        "marca": "otra",
        "precio": "300.00",
        "oferta": "no",
        "imagen": "../../assets/productos/comida gato/Hills Diet Lata.png",
        "descripcion": "Excelente producto de la categoría Alimento para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-28",
        "nombre": "Hills Diet Sobre",
        "categoria": "Alimento",
        "especie": "gato",
        "marca": "otra",
        "precio": "959.00",
        "oferta": "no",
        "imagen": "../../assets/productos/comida gato/Hills Diet Sobre.png",
        "descripcion": "Excelente producto de la categoría Alimento para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-29",
        "nombre": "Kitten Sobre Royal",
        "categoria": "Alimento",
        "especie": "gato",
        "marca": "otra",
        "precio": "511.00",
        "oferta": "no",
        "imagen": "../../assets/productos/comida gato/Kitten Sobre Royal.png",
        "descripcion": "Excelente producto de la categoría Alimento para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-30",
        "nombre": "Nupec Croqueta",
        "categoria": "Alimento",
        "especie": "gato",
        "marca": "otra",
        "precio": "162.00",
        "oferta": "no",
        "imagen": "../../assets/productos/comida gato/Nupec Croqueta.png",
        "descripcion": "Excelente producto de la categoría Alimento para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-31",
        "nombre": "Proplan Croqueta",
        "categoria": "Alimento",
        "especie": "gato",
        "marca": "otra",
        "precio": "626.00",
        "oferta": "no",
        "imagen": "../../assets/productos/comida gato/Proplan Croqueta.png",
        "descripcion": "Excelente producto de la categoría Alimento para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-32",
        "nombre": "ProPlan Lata Con Trozos",
        "categoria": "Alimento",
        "especie": "gato",
        "marca": "otra",
        "precio": "457.00",
        "oferta": "si",
        "imagen": "../../assets/productos/comida gato/ProPlan Lata con trozos.png",
        "descripcion": "Excelente producto de la categoría Alimento para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-33",
        "nombre": "ProPlan Lata",
        "categoria": "Alimento",
        "especie": "gato",
        "marca": "otra",
        "precio": "1044.00",
        "oferta": "no",
        "imagen": "../../assets/productos/comida gato/ProPlan Lata.png",
        "descripcion": "Excelente producto de la categoría Alimento para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-34",
        "nombre": "Roya Lata",
        "categoria": "Alimento",
        "especie": "gato",
        "marca": "otra",
        "precio": "1383.00",
        "oferta": "no",
        "imagen": "../../assets/productos/comida gato/Roya Lata.png",
        "descripcion": "Excelente producto de la categoría Alimento para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-35",
        "nombre": "Royal Kitten Mother Croqueta",
        "categoria": "Alimento",
        "especie": "gato",
        "marca": "otra",
        "precio": "325.00",
        "oferta": "si",
        "imagen": "../../assets/productos/comida gato/Royal Kitten Mother Croqueta.png",
        "descripcion": "Excelente producto de la categoría Alimento para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-36",
        "nombre": "Aro Mordedor",
        "categoria": "Juguetes",
        "especie": "perro",
        "marca": "otra",
        "precio": "376.00",
        "oferta": "si",
        "imagen": "../../assets/productos/juguetes-perro/aro_mordedor.png",
        "descripcion": "Excelente producto de la categoría Juguetes para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-37",
        "nombre": "Dispensador Premios",
        "categoria": "Juguetes",
        "especie": "perro",
        "marca": "otra",
        "precio": "519.00",
        "oferta": "no",
        "imagen": "../../assets/productos/juguetes-perro/dispensador_premios.png",
        "descripcion": "Excelente producto de la categoría Juguetes para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-38",
        "nombre": "Frisbee",
        "categoria": "Juguetes",
        "especie": "perro",
        "marca": "otra",
        "precio": "809.00",
        "oferta": "no",
        "imagen": "../../assets/productos/juguetes-perro/frisbee.png",
        "descripcion": "Excelente producto de la categoría Juguetes para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-39",
        "nombre": "Hueso Mordedor",
        "categoria": "Juguetes",
        "especie": "perro",
        "marca": "otra",
        "precio": "367.00",
        "oferta": "no",
        "imagen": "../../assets/productos/juguetes-perro/hueso_mordedor.png",
        "descripcion": "Excelente producto de la categoría Juguetes para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-40",
        "nombre": "Juguete Texturizado",
        "categoria": "Juguetes",
        "especie": "perro",
        "marca": "otra",
        "precio": "908.00",
        "oferta": "no",
        "imagen": "../../assets/productos/juguetes-perro/juguete_texturizado.png",
        "descripcion": "Excelente producto de la categoría Juguetes para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-41",
        "nombre": "Peluche Sonido",
        "categoria": "Juguetes",
        "especie": "perro",
        "marca": "otra",
        "precio": "1431.00",
        "oferta": "si",
        "imagen": "../../assets/productos/juguetes-perro/peluche-sonido.png",
        "descripcion": "Excelente producto de la categoría Juguetes para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-42",
        "nombre": "Dentastix",
        "categoria": "Alimento",
        "especie": "perro",
        "marca": "otra",
        "precio": "1111.00",
        "oferta": "si",
        "imagen": "../../assets/productos/Imagenes_Alimento_perro/Dentastix.jpeg",
        "descripcion": "Excelente producto de la categoría Alimento para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-43",
        "nombre": "Dog Chow",
        "categoria": "Alimento",
        "especie": "perro",
        "marca": "otra",
        "precio": "1411.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Alimento_perro/dog-chow.jpeg",
        "descripcion": "Excelente producto de la categoría Alimento para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-44",
        "nombre": "Galletas Nupec",
        "categoria": "Alimento",
        "especie": "perro",
        "marca": "otra",
        "precio": "1221.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Alimento_perro/galletas-nupec.jpeg",
        "descripcion": "Excelente producto de la categoría Alimento para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-45",
        "nombre": "Ganador Original Adulto",
        "categoria": "Alimento",
        "especie": "perro",
        "marca": "otra",
        "precio": "434.00",
        "oferta": "si",
        "imagen": "../../assets/productos/Imagenes_Alimento_perro/Ganador_Original_Adulto.jpeg",
        "descripcion": "Excelente producto de la categoría Alimento para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-46",
        "nombre": "Ganador Premium Adulto",
        "categoria": "Alimento",
        "especie": "perro",
        "marca": "otra",
        "precio": "623.00",
        "oferta": "si",
        "imagen": "../../assets/productos/Imagenes_Alimento_perro/Ganador_Premium_Adulto.jpeg",
        "descripcion": "Excelente producto de la categoría Alimento para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-47",
        "nombre": "Hills Cachorro",
        "categoria": "Alimento",
        "especie": "perro",
        "marca": "otra",
        "precio": "1032.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Alimento_perro/hills-cachorro.jpeg",
        "descripcion": "Excelente producto de la categoría Alimento para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-48",
        "nombre": "Lata Pedigree",
        "categoria": "Alimento",
        "especie": "perro",
        "marca": "otra",
        "precio": "303.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Alimento_perro/lata-pedigree.jpeg",
        "descripcion": "Excelente producto de la categoría Alimento para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-49",
        "nombre": "Nupec Adulto",
        "categoria": "Alimento",
        "especie": "perro",
        "marca": "otra",
        "precio": "915.00",
        "oferta": "si",
        "imagen": "../../assets/productos/Imagenes_Alimento_perro/nupec-adulto.jpeg",
        "descripcion": "Excelente producto de la categoría Alimento para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-50",
        "nombre": "Pedigree Res",
        "categoria": "Alimento",
        "especie": "perro",
        "marca": "otra",
        "precio": "776.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Alimento_perro/pedigree-res.jpeg",
        "descripcion": "Excelente producto de la categoría Alimento para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-51",
        "nombre": "Pro Plan Adulto",
        "categoria": "Alimento",
        "especie": "perro",
        "marca": "otra",
        "precio": "239.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Alimento_perro/pro-plan-adulto.jpeg",
        "descripcion": "Excelente producto de la categoría Alimento para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-52",
        "nombre": "Royal Canin Mini",
        "categoria": "Alimento",
        "especie": "perro",
        "marca": "otra",
        "precio": "428.00",
        "oferta": "si",
        "imagen": "../../assets/productos/Imagenes_Alimento_perro/royal-canin-mini.jpeg",
        "descripcion": "Excelente producto de la categoría Alimento para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-53",
        "nombre": "Sobre Proplan",
        "categoria": "Alimento",
        "especie": "perro",
        "marca": "otra",
        "precio": "1197.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Alimento_perro/sobre-proplan.jpeg",
        "descripcion": "Excelente producto de la categoría Alimento para tu perro. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-54",
        "nombre": "Juguete Gato 1 Ratonpeluche",
        "categoria": "Juguetes",
        "especie": "gato",
        "marca": "otra",
        "precio": "182.00",
        "oferta": "no",
        "imagen": "../../assets/productos/juguetes-gato/Juguete-Gato-1-Ratonpeluche.jpg",
        "descripcion": "Excelente producto de la categoría Juguetes para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-55",
        "nombre": "Juguete Gato 2 TunelPlegable",
        "categoria": "Juguetes",
        "especie": "gato",
        "marca": "otra",
        "precio": "528.00",
        "oferta": "si",
        "imagen": "../../assets/productos/juguetes-gato/Juguete-Gato-2-TunelPlegable.jpg",
        "descripcion": "Excelente producto de la categoría Juguetes para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-56",
        "nombre": "Juguete Gato 3 TorrePelotas",
        "categoria": "Juguetes",
        "especie": "gato",
        "marca": "otra",
        "precio": "1336.00",
        "oferta": "no",
        "imagen": "../../assets/productos/juguetes-gato/Juguete-Gato-3-TorrePelotas.jpg",
        "descripcion": "Excelente producto de la categoría Juguetes para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-57",
        "nombre": "Juguete Gato 4 PajaroYute",
        "categoria": "Juguetes",
        "especie": "gato",
        "marca": "otra",
        "precio": "1491.00",
        "oferta": "no",
        "imagen": "../../assets/productos/juguetes-gato/Juguete-Gato-4-PajaroYute.jpg",
        "descripcion": "Excelente producto de la categoría Juguetes para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-58",
        "nombre": "Gato Boina",
        "categoria": "Accesorios",
        "especie": "gato",
        "marca": "otra",
        "precio": "178.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Gato_Productos/Gato_Boina.jpg",
        "descripcion": "Excelente producto de la categoría Accesorios para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-59",
        "nombre": "Gato Bruja",
        "categoria": "Accesorios",
        "especie": "gato",
        "marca": "otra",
        "precio": "975.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Gato_Productos/Gato_Bruja.jpg",
        "descripcion": "Excelente producto de la categoría Accesorios para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-60",
        "nombre": "Gato Cama",
        "categoria": "Accesorios",
        "especie": "gato",
        "marca": "otra",
        "precio": "458.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Gato_Productos/Gato_Cama.jpg",
        "descripcion": "Excelente producto de la categoría Accesorios para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-61",
        "nombre": "Gato Cama2",
        "categoria": "Accesorios",
        "especie": "gato",
        "marca": "otra",
        "precio": "1312.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Gato_Productos/Gato_Cama2.jpg",
        "descripcion": "Excelente producto de la categoría Accesorios para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-62",
        "nombre": "Gato Collar",
        "categoria": "Accesorios",
        "especie": "gato",
        "marca": "otra",
        "precio": "744.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Gato_Productos/Gato_Collar.jpg",
        "descripcion": "Excelente producto de la categoría Accesorios para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-63",
        "nombre": "Gato Naruto",
        "categoria": "Accesorios",
        "especie": "gato",
        "marca": "otra",
        "precio": "713.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Gato_Productos/Gato_Naruto.jpg",
        "descripcion": "Excelente producto de la categoría Accesorios para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-64",
        "nombre": "Gato Pantalones",
        "categoria": "Accesorios",
        "especie": "gato",
        "marca": "otra",
        "precio": "761.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Gato_Productos/Gato_Pantalones.jpg",
        "descripcion": "Excelente producto de la categoría Accesorios para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-65",
        "nombre": "Gato Pez",
        "categoria": "Accesorios",
        "especie": "gato",
        "marca": "otra",
        "precio": "480.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Gato_Productos/Gato_Pez.jpg",
        "descripcion": "Excelente producto de la categoría Accesorios para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-66",
        "nombre": "Gato Plato",
        "categoria": "Accesorios",
        "especie": "gato",
        "marca": "otra",
        "precio": "184.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Gato_Productos/Gato_Plato.jpg",
        "descripcion": "Excelente producto de la categoría Accesorios para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-67",
        "nombre": "Gato Plato2",
        "categoria": "Accesorios",
        "especie": "gato",
        "marca": "otra",
        "precio": "129.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Gato_Productos/Gato_Plato2.jpg",
        "descripcion": "Excelente producto de la categoría Accesorios para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-68",
        "nombre": "Gato Vestido",
        "categoria": "Accesorios",
        "especie": "gato",
        "marca": "otra",
        "precio": "931.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Gato_Productos/Gato_Vestido.jpg",
        "descripcion": "Excelente producto de la categoría Accesorios para tu gato. Alta calidad garantizada."
    },
    {
        "id": "prod-auto-69",
        "nombre": "Gato Zapatos",
        "categoria": "Accesorios",
        "especie": "gato",
        "marca": "otra",
        "precio": "572.00",
        "oferta": "no",
        "imagen": "../../assets/productos/Imagenes_Gato_Productos/Gato_Zapatos.jpg",
        "descripcion": "Excelente producto de la categoría Accesorios para tu gato. Alta calidad garantizada."
    }
];
        localStorage.setItem("productosAdmin", JSON.stringify(productos));
    } else {
        // Fix broken image paths and append new items to existing localStorage if needed
        let changed = false;
        productos = productos.map(p => {
            if (p.imagen && p.imagen.startsWith("../assets/")) {
                p.imagen = p.imagen.replace("../assets/", "../../assets/");
                changed = true;
            }
            if (p.imagen && p.imagen.includes("Accesorios/Correa1.jpg")) {
                p.imagen = "../../assets/productos/accesorios_perro/producto-correa-perro.png";
                changed = true;
            }
            if (p.imagen && p.imagen.includes("Juguetes Perro/Juguete2.jpg")) {
                p.imagen = "../../assets/productos/juguetes-perro/hueso_mordedor.png";
                changed = true;
            }
            return p;
        });
        if (productos.length === 6 && productos[0].id === "prod-1") {
            productos.push(
                {
                    id: "prod-7",
                    nombre: "Correa retráctil para perro",
                    categoria: "Accesorios",
                    especie: "perro",
                    marca: "flexi",
                    precio: "350",
                    oferta: "no",
                    imagen: "../../assets/productos/accesorios_perro/producto-correa-perro.png",
                    descripcion: "Correa retráctil de 5 metros de largo."
                },
                {
                    id: "prod-8",
                    nombre: "Hueso de carnaza grande",
                    categoria: "Juguetes",
                    especie: "perro",
                    marca: "otra",
                    precio: "120",
                    oferta: "si",
                    imagen: "../../assets/productos/juguetes-perro/hueso_mordedor.png",
                    descripcion: "Hueso ideal para morder y limpiar dientes."
                }
            );
            changed = true;
        }
        if (changed) {
            localStorage.setItem("productosAdmin", JSON.stringify(productos));
        }
    }
    
    let currentFilter = "todos"; // todos, perro, gato

    let currentCategories = [];
    let filterOffers = false;
    let currentSpecies = []; // [] means all
    let maxPrice = 2000;
    let currentBrands = []; // [] means all
    let currentRating = 0; // 0 means all
    let currentSort = "popular";
    
    // Auto-generate more products if we don't have enough to test pagination
    if (productos.length < 33) {
        const base = [...productos];
        while (productos.length < 40) {
            base.forEach(p => {
                productos.push({
                    ...p,
                    id: p.id + "-" + Math.random().toString(36).substr(2, 5),
                    nombre: p.nombre + " (Copia)"
                });
            });
        }
        localStorage.setItem("productosAdmin", JSON.stringify(productos));
    }

    // Pagination state
    let currentPage = 1;
    const itemsPerPage = 32; // 4 columns x 8 rows

    renderizarProductos();

    // ── Filtros Categoría (Sidebar) ──
    document.querySelectorAll(".category-check").forEach(chk => {
        chk.addEventListener("change", function() {
            currentCategories = [];
            document.querySelectorAll(".category-check:checked").forEach(cb => {
                currentCategories.push(cb.value.toLowerCase());
            });
            currentPage = 1;
            renderizarProductos();
        });
    });

    // ── Filtro Ofertas ──
    const filterOffersCheckbox = document.getElementById("filterOffers");
    if (filterOffersCheckbox) {
        filterOffersCheckbox.addEventListener("change", function() {
            filterOffers = this.checked;
            currentPage = 1;
            renderizarProductos();
        });
    }

    // ── Rango de Precio ─────────────────────────────────────
    const priceRange = document.getElementById("priceRange");
    const priceRangeValue = document.getElementById("priceRangeValue");
    const clearPriceFilter = document.getElementById("clearPriceFilter");

    if (priceRange) {
        priceRange.addEventListener("input", function() {
            maxPrice = Number(this.value);
            if (priceRangeValue) priceRangeValue.textContent = "$" + maxPrice.toLocaleString("es-MX");
            currentPage = 1;
            renderizarProductos();
        });
    }
    if (clearPriceFilter) {
        clearPriceFilter.addEventListener("click", function() {
            if (priceRange) { priceRange.value = 2000; }
            maxPrice = 2000;
            if (priceRangeValue) priceRangeValue.textContent = "$2,000";
            currentPage = 1;
            renderizarProductos();
        });
    }

    // ── Especie Checkboxes ───────────────────────────────────
    document.querySelectorAll(".species-check").forEach(chk => {
        chk.addEventListener("change", function() {
            currentSpecies = [];
            document.querySelectorAll(".species-check:checked").forEach(cb => {
                if (cb.checked) currentSpecies.push(cb.value);
            });

            currentPage = 1; // Reset page
            renderizarProductos();
        });
    });

    // ── Marcas Checkboxes ─────────────────────────────────────
    document.querySelectorAll(".brand-check").forEach(chk => {
        chk.addEventListener("change", function() {
            currentBrands = [];
            document.querySelectorAll(".brand-check:checked").forEach(cb => {
                currentBrands.push(cb.value.toLowerCase());
            });
            currentPage = 1;
            renderizarProductos();
        });
    });

    // ── Calificación Radio ────────────────────────────────────
    document.querySelectorAll(".rating-check").forEach(chk => {
        chk.addEventListener("change", function() {
            const checked = document.querySelector(".rating-check:checked");
            currentRating = checked ? Number(checked.value) : 0;
            currentPage = 1;
            renderizarProductos();
        });
    });

    // ── Ordenamiento ──────────────────────────────────────────
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
        sortSelect.addEventListener("change", function() {
            currentSort = this.value;
            currentPage = 1;
            renderizarProductos();
        });
    }

    // ── Botón Aplicar Filtros ─────────────────────────────────
    const applyFiltersBtn = document.getElementById("applyFiltersBtn");
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener("click", function() {
            currentPage = 1;
            renderizarProductos();
            document.getElementById("productsList").scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Escuchar el click en el botón de "Agregar Nuevo Producto"
    const btnAgregarProducto = document.getElementById("btnAgregarProducto");
    if (btnAgregarProducto) {
        btnAgregarProducto.addEventListener("click", function() {
            if (productoForm) productoForm.reset();
            document.getElementById("id-producto").value = ""; // Limpiar ID explícitamente
            const imagePreview = document.getElementById("imagen-preview");
            if (imagePreview) {
                imagePreview.innerHTML = "Sin imagen";
                imagePreview.style.backgroundImage = "";
            }
        });
    }

    function renderizarProductos() {
        if (!productsList) return;
        productsList.innerHTML = "";

        // Filtrar productos con los nuevos controles
        let productosFiltrados = productos;

        // Filtro por categoría (Sidebar)
        if (currentCategories.length > 0) {
            productosFiltrados = productosFiltrados.filter(p =>
                currentCategories.includes((p.categoria || "").toLowerCase())
            );
        }

        // Filtro por Ofertas
        if (filterOffers) {
            productosFiltrados = productosFiltrados.filter(p => p.oferta === "si");
        }

        // Filtro por especie (checkboxes Perros / Gatos)
        if (currentSpecies.length > 0) {
            productosFiltrados = productosFiltrados.filter(p =>
                currentSpecies.includes((p.especie || "").toLowerCase())
            );
        }

        // Filtro por precio máximo
        productosFiltrados = productosFiltrados.filter(p => Number(p.precio) <= maxPrice);

        // Filtro por marca
        if (currentBrands.length > 0) {
            productosFiltrados = productosFiltrados.filter(p =>
                currentBrands.includes((p.marca || "otra").toLowerCase())
            );
        }

        // Filtro por calificación (Simulado para frontend)
        if (currentRating > 0) {
            productosFiltrados = productosFiltrados.filter(p => {
                // Simular calificación: los en oferta son 4, los demás 5
                const rating = p.oferta === "si" ? 4 : 5;
                return rating >= currentRating;
            });
        }

        // ── Ordenamiento ──
        if (currentSort === "precio_asc") {
            productosFiltrados.sort((a, b) => Number(a.precio) - Number(b.precio));
        } else if (currentSort === "precio_desc") {
            productosFiltrados.sort((a, b) => Number(b.precio) - Number(a.precio));
        } else if (currentSort === "nombre") {
            productosFiltrados.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
        } else if (currentSort === "popular") {
            productosFiltrados.sort((a, b) => (a.oferta === "si" ? -1 : 1));
        }

        if (productosFiltrados.length === 0) {
            if (emptyStateMsg) emptyStateMsg.style.display = "block";
            renderPagination(0);
            return;
        }

        if (emptyStateMsg) emptyStateMsg.style.display = "none";

        // --- Paginación ---
        const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedProductos = productosFiltrados.slice(startIndex, startIndex + itemsPerPage);

        paginatedProductos.forEach((producto) => {
            const col = document.createElement("div");
            col.className = "col-12 col-sm-6 col-lg-4 col-xl-3 mb-4"; // 4 cards per row on extra large screens

            let catColor = "#4fb34a"; // matches the green in the reference image text

            // Lógica de oferta
            const esOferta = producto.oferta === "si";
            let precioHtml = `<div class="d-flex flex-column"><span class="fw-bold price" style="color:#2f8f30;font-size:1.6rem;line-height:1;">${formatearPrecio(producto.precio)}</span></div>`;
            let ofertaBadge = "";
            if (esOferta) {
                const precioNormal = Number(producto.precio) * 1.2;
                precioHtml = `<div class="d-flex flex-column"><span class="fw-bold price" style="color:#2f8f30;font-size:1.6rem;line-height:1;margin-bottom:4px;">${formatearPrecio(producto.precio)}</span> <small class="text-muted text-decoration-line-through" style="font-size:0.85rem;">${formatearPrecio(precioNormal)}</small></div>`;
                ofertaBadge = `<span class="position-absolute m-2 px-2 py-1 rounded-pill fw-bold text-white shadow-sm" style="background:#ff4d4f;font-size:.75rem;top:8px;left:8px;">-20%</span>`;
            }

            col.innerHTML = `
                <div class="card h-100 border-0 product-item-card" data-product-id="${escaparAtributo(producto.id)}" style="border-radius:16px;overflow:hidden;transition:transform .2s; background-color:#fff; box-shadow: 0 4px 15px rgba(0,0,0,0.05);" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div class="position-relative" style="background-color: #f8f9fa; border-bottom: 1px solid #f0f0f0;">
                        <img src="${escaparAtributo(producto.imagen)}" onerror="this.src='../../assets/footer/Huellita-footer.png'; this.style.objectFit='contain'; this.style.padding='20px';" class="card-img-top" style="height:250px; object-fit:cover;" alt="${escaparAtributo(producto.nombre)}">
                        ${ofertaBadge}
                        <span class="position-absolute rounded-circle d-flex align-items-center justify-content-center" style="background:rgba(255,255,255,0.7); width:32px; height:32px; top:12px; right:12px; cursor:pointer;">
                            <i class="bi bi-heart text-secondary"></i>
                        </span>
                        <div class="admin-actions gap-2 p-2" style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 10; display: ${isAdmin ? 'flex' : 'none'} !important;">
                            <button type="button" class="btn btn-light btn-edit shadow-sm rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; padding: 0;" data-id="${escaparAtributo(producto.id)}" aria-label="Editar producto" title="Editar">
                                <i class="bi bi-pencil" style="color: #0aa738; font-size: 1.1rem;"></i>
                            </button>
                            <button type="button" class="btn btn-light btn-delete shadow-sm rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; padding: 0;" data-id="${escaparAtributo(producto.id)}" aria-label="Eliminar producto" title="Eliminar">
                                <i class="bi bi-trash" style="color: red; font-size: 1.1rem;"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body p-4 d-flex flex-column">
                        <p class="mb-2 fw-bold text-uppercase" style="font-size:.75rem; color:${catColor}; letter-spacing: 0.5px;">${escaparHTML(producto.categoria || 'Sin categoría')}</p>
                        <h6 class="title fw-bold mb-3 flex-grow-1" style="font-size:1.1rem; color:#2b2b2b; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; line-height:1.4;">${escaparHTML(producto.nombre)}</h6>
                        <div class="mb-3 d-flex align-items-center" style="color:#ffb800;font-size:.9rem;">
                            <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i> 
                            <small class="text-muted ms-2" style="font-size: 0.8rem;">(128)</small>
                        </div>
                        <div class="d-flex align-items-end justify-content-between mt-auto">
                            ${precioHtml}
                        </div>
                    </div>
                </div>
            `;

            productsList.appendChild(col);
        });
        
        renderPagination(totalPages);
        agregarEventosAcciones();
    }

    function renderPagination(totalPages) {
        const paginationContainer = document.getElementById("paginationContainer");
        if (!paginationContainer) return;
        paginationContainer.innerHTML = "";

        if (totalPages <= 1) return; // Hide pagination if only 1 page

        // Helper para crear botones
        const createBtn = (text, page, isActive = false, isDisabled = false) => {
            const btn = document.createElement("button");
            btn.innerHTML = text;
            btn.className = `btn fw-bold ${isActive ? 'btn-success' : 'btn-outline-secondary bg-white text-secondary'}`;
            btn.style.width = "40px";
            btn.style.height = "40px";
            btn.style.display = "flex";
            btn.style.alignItems = "center";
            btn.style.justifyContent = "center";
            btn.style.borderRadius = "8px";
            btn.style.transition = "all 0.2s";
            if (isActive) {
                btn.style.backgroundColor = "#4fb34a";
                btn.style.borderColor = "#4fb34a";
                btn.style.color = "white";
            } else {
                btn.style.borderColor = "#eaeaea";
            }
            if (isDisabled) {
                btn.disabled = true;
                btn.style.opacity = "0.5";
            }
            
            if (!isDisabled && !isActive) {
                btn.addEventListener("click", () => {
                    currentPage = page;
                    renderizarProductos();
                    // Scroll back to top of products list
                    document.getElementById("productsList").scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            }
            return btn;
        };

        // Botón Anterior
        paginationContainer.appendChild(createBtn("<i class='bi bi-chevron-left'></i>", currentPage - 1, false, currentPage === 1));

        // Páginas (Lógica simplificada para mostrar máximo 5 números)
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        if (startPage > 1) {
            paginationContainer.appendChild(createBtn("1", 1));
            if (startPage > 2) {
                const dots = document.createElement("span");
                dots.className = "d-flex align-items-end pb-2 text-muted fw-bold";
                dots.innerHTML = "...";
                paginationContainer.appendChild(dots);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationContainer.appendChild(createBtn(i, i, i === currentPage));
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = document.createElement("span");
                dots.className = "d-flex align-items-end pb-2 text-muted fw-bold";
                dots.innerHTML = "...";
                paginationContainer.appendChild(dots);
            }
            paginationContainer.appendChild(createBtn(totalPages, totalPages));
        }

        // Botón Siguiente
        paginationContainer.appendChild(createBtn("<i class='bi bi-chevron-right'></i>", currentPage + 1, false, currentPage === totalPages));
    }

    function formatearPrecio(precio) {
        return Number(precio).toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN"
        });
    }

    function agregarEventosAcciones() {
        document.querySelectorAll(".btn-delete").forEach((boton) => {
            boton.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                productos = productos.filter(producto => String(producto.id) !== String(id));
                localStorage.setItem("productosAdmin", JSON.stringify(productos));
                renderizarProductos();
            });
        });

        document.querySelectorAll(".btn-edit").forEach((boton) => {
            boton.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                window.location.href = `admin-producto.html?id=${id}`;
            });
        });
    }

    function escaparHTML(texto) {
        if (texto == null) return "";
        const elemento = document.createElement("div");
        elemento.textContent = String(texto);
        return elemento.innerHTML;
    }

    function escaparAtributo(texto) {
        if (texto == null) return "";
        return String(texto)
            .replaceAll("&", "&amp;")
            .replaceAll('"', "&quot;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
    }
});
