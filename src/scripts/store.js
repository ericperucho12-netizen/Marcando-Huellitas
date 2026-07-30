class ProductController {
    constructor(currentId = 0) {
        this.items = [];
        this.currentId = currentId;
    }

    // Funcion requerida por la tarea para agregar elementos
    addItem(name, img, description, price, category) {
        this.currentId++;

        // Objeto que cumple estrictamente con el JSON de la tarea
        const item = {
            id: this.currentId,
            name: name,
            img: img,
            description: description,
            price: price,
            category: category,
            createdAt: new Date().toISOString().split('T')[0]
        };

        this.items.push(item);
    }
}

// Instancia global para manejar todos los productos
const store = new ProductController();

// --- 1. ALIMENTOS PARA PERROS ---
store.addItem(
    "Ganador Premium Adulto Razas Medianas y Grandes 20kg",
    "../assets/productos/alimentos-perro/ganador-premium-adulto.jpg",
    "Alimento premium para perros adultos con extra proteina.",
    "$1,150.00 MXN",
    "alimento"
);
store.addItem(
    "Ganador Premium Cachorro Razas Todas 15kg",
    "../assets/productos/alimentos-perro/ganador-premium-cachorro.jpg",
    "Formula especial para el crecimiento de cachorros.",
    "$980.00 MXN",
    "alimento"
);
store.addItem(
    "Ganador Original Adulto Biforas Carne y Cereales 15kg",
    "../assets/productos/alimentos-perro/ganador-original-adulto.jpg",
    "Sabor a carne y cereales para una nutricion balanceada.",
    "$720.00 MXN",
    "alimento"
);
store.addItem(
    "Ganador Premium Razas Pequeñas Adulto 4kg",
    "../assets/productos/alimentos-perro/ganador-premium-raza-pequena.jpg",
    "Croquetas pequeñas para facil masticacion.",
    "$340.00 MXN",
    "alimento"
);
store.addItem(
    "Pro Plan Adulto Raza Mediana 13kg",
    "../assets/productos/alimentos-perro/pro-plan-adulto.jpg",
    "Protege la salud general y mantiene un pelaje brillante.",
    "$1,450.00 MXN",
    "alimento"
);
store.addItem(
    "Royal Canin Mini Adulto 3kg",
    "../assets/productos/alimentos-perro/royal-canin-mini.jpg",
    "Ideal para perros pequeños con paladares exigentes.",
    "$680.00 MXN",
    "alimento"
);
store.addItem(
    "NuSpec Perro Adulto Razas Grandes 15kg",
    "../assets/productos/alimentos-perro/nuspec-adulto.jpg",
    "Fortalece las articulaciones de razas grandes.",
    "$1,120.00 MXN",
    "alimento"
);
store.addItem(
    "Hill's Science Diet Cachorro 11kg",
    "../assets/productos/alimentos-perro/hills-cachorro.jpg",
    "Desarrollo sano del cerebro y los ojos.",
    "$1,590.00 MXN",
    "alimento"
);
store.addItem(
    "Pedigree Res y Vegetales 15kg",
    "../assets/productos/alimentos-perro/pedigree-res.jpg",
    "Sabor irresistible con ingredientes naturales.",
    "$780.00 MXN",
    "alimento"
);
store.addItem(
    "Dog Chow Adulto Razas Pequeñas 8kg",
    "../assets/productos/alimentos-perro/dog-chow.jpg",
    "Nutricion equilibrada y cuidado oral diario.",
    "$450.00 MXN",
    "alimento"
);
store.addItem(
    "Pro Plan Sensitive Digestion 13kg",
    "../assets/productos/alimentos-perro/pro-plan-sensitive.jpg",
    "Facil de digerir para estomagos sensibles.",
    "$1,620.00 MXN",
    "alimento"
);
store.addItem(
    "Royal Canin Puppy Medium 10kg",
    "../assets/productos/alimentos-perro/royal-canin-puppy.jpg",
    "Crecimiento optimo y defensas naturales fuertes.",
    "$1,380.00 MXN",
    "alimento"
);
store.addItem(
    "Lata Pedigree Alimento Húmedo Pavo 300g",
    "../assets/productos/alimentos-perro/lata-pedigree.jpg",
    "Delicioso paté con sabor a pavo fresco.",
    "$45.00 MXN",
    "alimento"
);
store.addItem(
    "Sobres Pro Plan Wet Food Pollo 85g",
    "../assets/productos/alimentos-perro/sobre-proplan.jpg",
    "Trocitos de pollo en salsa para perros de todas las razas.",
    "$35.00 MXN",
    "alimento"
);
store.addItem(
    "Premios Dentastix Pedigree Raza Mediana",
    "../assets/productos/alimentos-perro/dentastix.jpg",
    "Ayuda a reducir la formacion de sarro.",
    "$120.00 MXN",
    "alimento"
);
store.addItem(
    "Biscuits NuSpec Galletas Premios 500g",
    "../assets/productos/alimentos-perro/galletas-nuspec.jpg",
    "Galletas horneadas ricas en vitaminas.",
    "$160.00 MXN",
    "alimento"
);
store.addItem(
    "Lata Alimento Húmedo Pollo",
    "../assets/productos/alimentos-perro/alimento-humedo.jpg",
    "Carne de pollo fresca en jugo natural.",
    "$65.00 MXN",
    "alimento"
);
store.addItem(
    "Premios Dentales Limpieza Bucal",
    "../assets/productos/alimentos-perro/premios-dentales.jpg",
    "Mantiene los dientes sanos y el aliento fresco.",
    "$140.00 MXN",
    "alimento"
);

// --- 2. JUGUETES PARA PERROS ---
store.addItem(
    "Hueso mordedor",
    "../assets/productos/juguetes-perro/hueso_mordedor.png",
    "Mordedor resistente para fortalecer dientes y encías.",
    "$95.00 MXN",
    "juguete"
);
store.addItem(
    "Frisbee flexible",
    "../assets/productos/juguetes-perro/frisbee.png",
    "Disco ligero para jugar al aire libre.",
    "$150.00 MXN",
    "juguete"
);
store.addItem(
    "Peluche con sonido",
    "../assets/productos/juguetes-perro/peluche-sonido.png",
    "Peluche suave con sonido para entretenimiento.",
    "$180.00 MXN",
    "juguete"
);
store.addItem(
    "Juguete dispensador",
    "../assets/productos/juguetes-perro/dispensador_premios.png",
    "Juguete interactivo para colocar premios o croquetas.",
    "$210.00 MXN",
    "juguete"
);
store.addItem(
    "Aro mordedor",
    "../assets/productos/juguetes-perro/aro_mordedor.png",
    "Aro resistente para morder, lanzar y jugar.",
    "$130.00 MXN",
    "juguete"
);
store.addItem(
    "Pelota con textura",
    "../assets/productos/juguetes-perro/juguete_texturizado.png",
    "Pelota con relieve para estimular el juego y la mordida.",
    "$145.00 MXN",
    "juguete"
);

// Exportar store si usamos modulos, o dejarlo global en el navegador
