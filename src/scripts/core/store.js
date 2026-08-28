class ProductController {
    constructor(currentId = 0) {
        this.items = [];
        this.currentId = currentId;
    }

    //Agregar un nuevo objeto/publicación
    addItem(name, img, description, price, category) {
        this.currentId++;

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
        return item;
    }

    //Modificar/Actualizar un objeto existente por su ID
    updateItem(id, updatedData) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            // Mantiene el ID y fecha original, actualiza los campos proporcionados
            this.items[index] = { ...this.items[index], ...updatedData };
            return this.items[index];
        }
        return null; // Retorna null si no lo encuentra
    }

    //Eliminar un objeto específico por su ID
    deleteItem(id) {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== id);
        return this.items.length < initialLength; // Retorna true si se eliminó algo
    }

    //Eliminar toda la lista de objetos
    clearItems() {
        this.items = [];
    }

    //Método para btener todos los objetos
    getItems() {
        return this.items;
    }
}

// Instancia global para manejar todos los productos
const store = new ProductController();

// --- 1. ALIMENTOS PARA PERROS ---
store.addItem(
    "Ganador Premium Adulto Razas Medianas y Grandes 20kg",
    "../assets/productos/Imagenes_Alimento_perro/Ganador_Premium_Adulto.jpeg",
    "Alimento premium para perros adultos con extra proteina.",
    "$1,150.00 MXN",
    "alimento"
);

store.addItem(
    "Ganador Original Adulto Biforas Carne y Cereales 15kg",
    "../assets/productos/Imagenes_Alimento_perro/ganador_original_adulto.jpeg",
    "Sabor a carne y cereales para una nutricion balanceada.",
    "$720.00 MXN",
    "alimento"
);

store.addItem(
    "Pro Plan Adulto Raza Mediana 13kg",
    "../assets/productos/Imagenes_Alimento_perro/pro-plan-adulto.jpeg",
    "Protege la salud general y mantiene un pelaje brillante.",
    "$1,450.00 MXN",
    "alimento"
);
store.addItem(
    "Royal Canin Mini Adulto 3kg",
    "../assets/productos/Imagenes_Alimento_perro/royal-canin-mini.jpeg",
    "Ideal para perros pequeños con paladares exigentes.",
    "$680.00 MXN",
    "alimento"
);
store.addItem(
    "NuSpec Perro Adulto Razas Grandes 15kg",
    "../assets/productos/Imagenes_Alimento_perro/nupec-adulto.jpeg",
    "Fortalece las articulaciones de razas grandes.",
    "$1,120.00 MXN",
    "alimento"
);
store.addItem(
    "Hill's Science Diet Cachorro 11kg",
    "../assets/productos/Imagenes_Alimento_perro/hills-cachorro.jpeg",
    "Desarrollo sano del cerebro y los ojos.",
    "$1,590.00 MXN",
    "alimento"
);
store.addItem(
    "Pedigree Res y Vegetales 15kg",
    "../assets/productos/Imagenes_Alimento_perro/pedigree-res.jpeg",
    "Sabor irresistible con ingredientes naturales.",
    "$780.00 MXN",
    "alimento"
);
store.addItem(
    "Dog Chow Adulto Razas Pequeñas 8kg",
    "../assets/productos/Imagenes_Alimento_perro/dog-chow.jpeg",
    "Nutricion equilibrada y cuidado oral diario.",
    "$450.00 MXN",
    "alimento"
);

store.addItem(
    "Lata Pedigree Alimento Húmedo Pavo 300g",
    "../assets/productos/Imagenes_Alimento_perro/lata-pedigree.jpeg",
    "Delicioso paté con sabor a pavo fresco.",
    "$45.00 MXN",
    "alimento"
);
store.addItem(
    "Sobres Pro Plan Wet Food Pollo 85g",
    "../assets/productos/Imagenes_Alimento_perro/sobre-proplan.jpeg",
    "Trocitos de pollo en salsa para perros de todas las razas.",
    "$35.00 MXN",
    "alimento"
);
store.addItem(
    "Premios Dentastix Pedigree Raza Mediana",
    "../assets/productos/Imagenes_Alimento_perro/dentastix.jpeg",
    "Ayuda a reducir la formacion de sarro.",
    "$120.00 MXN",
    "alimento"
);
store.addItem(
    "Biscuits NuSpec Galletas Premios 500g",
    "../assets/productos/Imagenes_Alimento_perro/galletas-nupec.jpeg",
    "Galletas horneadas ricas en vitaminas.",
    "$160.00 MXN",
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

// --- 3. ACCESORIOS PARA PERROS ---
store.addItem(
    "Cama en forma de avellana",
    "../assets/productos/accesorios_perro/producto-cama-perro.png",
    "Cama en forma de avellana para razas pequeñas.",
    "$550.00 MXN",
    "accesorio"
);

store.addItem(
    "Cama Multicolor",
    "../assets/productos/accesorios_perro/producto-cama2-perro.png",
    "Cama Multicolor para razas pequeñas.",
    "$350.00 MXN",
    "accesorio"
);

store.addItem(
    "Cama Tejido Confort",
    "../assets/productos/accesorios_perro/cama3_perro.png",
    "Cama suave con diseño trenzado que brinda comodidad y un descanso acogedor para tu mascota.",
    "$450.00 MXN",
    "accesorio"
);

store.addItem(
    "Casa Blanca Premium ",
    "../assets/productos/accesorios_perro/casa1_perro.png",
    "Casa resistente para interiores",
    "$2,450.00 MXN",
    "accesorio"
);

store.addItem(
    "Casa de Madera para Exterior ",
    "../assets/productos/accesorios_perro/producto-casa3-perro.png",
    "Casa resistente con acabado color madera, ideal para brindar protección y comodidad a tu perro en exteriores",
    "$2,950.00 MXN",
    "accesorio"
);

store.addItem(
    "Casa para Exterior ",
    "../assets/productos/accesorios_perro/casa5_perro.png",
    "Casa resistente, ideal para brindar protección y comodidad a tu perro en exteriores",
    "$2,950.00 MXN",
    "accesorio"
);

store.addItem(
    "Casa Confort Translúcida ",
    "../assets/productos/accesorios_perro/casa6_perro.png",
    "Casa de plástico resistente con diseño moderno, ideal para brindar un refugio cómodo y seguro.",
    "$2,950.00 MXN",
    "accesorio"
);

store.addItem(
    "Kit de Platos ",
    "../assets/productos/accesorios_perro/platos4_perros.png",
    "Incluye dos platos resistentes para alimento y agua, ideales para el uso diario.",
    "$320.00 MXN",
    "accesorio"
);

store.addItem(
    "Kit de Platos con Base de Madera",
    "../assets/productos/accesorios_perro/producto-plato-perro.png",
    "Set de dos platos con base de madera resistente, ideal para servir alimento y agua con estilo.",
    "$550.00 MXN",
    "accesorio"
);

store.addItem(
    "Comedero Doble con Soporte",
    "../assets/productos/accesorios_perro/platos5_perro.png",
    "Dos platos de acero inoxidable con estructura resistente, ideales para alimento y agua.",
    "$530.00 MXN",
    "accesorio"
);

store.addItem(
    "Comedero Elevado Premium Ámbar",
    "../assets/productos/accesorios_perro/producto-plato2-perro.png",
    "Brinda mayor comodidad a tu mascota durante la hora de la comida",
    "$499.00 MXN",
    "accesorio"
);

store.addItem(
    "Plato colorido",
    "../assets/productos/accesorios_perro/producto-plato3-perro.png",
    "Haz que la hora de la comida sea más divertida con este plato colorido para mascotas.",
    "$120.00 MXN",
    "accesorio"
);

store.addItem(
    "Arcoíris con Collar Reflectante",
    "../assets/productos/accesorios_perro/producto-correa-perro.png",
    "Añade estilo y seguridad a cada paseo con este set de correa y collar premium",
    "$349.00 MXN",
    "accesorio"
);

store.addItem(
    "Correa Azul Clásica",
    "../assets/productos/accesorios_perro/correa2_perro.png",
    "Disfruta de paseos cómodos y seguros con esta correa azul clásica para perros",
    "$175.00 MXN",
    "accesorio"
);

store.addItem(
    "Set Verde Pet",
    "../assets/productos/accesorios_perro/producto-coleccion-perro.png",
    "Set de pechera, collar y correa en color verde. Fabricado con materiales resistentes y cómodos, ideal para paseos seguros y con estilo.",
    "$549.00 MXN",
    "accesorio"
);

store.addItem(
    "Pechera Colorida",
    "../assets/productos/accesorios_perro/producto-pechera-perro.png",
    "Pechera para perros con diseño colorido, elaborada con materiales resistentes y cómodos.",
    "$349.00 MXN",
    "accesorio"
);

store.addItem(
    "Chaleco Naranja Aventurero",
    "../assets/productos/accesorios_perro/ropa_chaleconaranja2_perro.png",
    "Chaleco para perro cómodo y ligero, ideal para paseos diarios.",
    "$249.00 MXN",
    "accesorio"
);

store.addItem(
    "Chaleco Verde Fresco",
    "../assets/productos/accesorios_perro/ropa_chalecoverde_perro.png",
    "Chaleco cómodo y ligero para perros, ideal para brindar estilo y protección durante sus paseos",
    "$349.00 MXN",
    "accesorio"
);

store.addItem(
    "Chaleco Arcoíris Pet",
    "../assets/productos/accesorios_perro/ropa_chalecolores_perro.png",
    "Chaleco colorido para perros con diseño alegre y cómodo, ideal para darle un toque divertido a sus paseos",
    "$349.00 MXN",
    "accesorio"
);

store.addItem(
    "Playera Rayitas Pet",
    "../assets/productos/accesorios_perro/ropa_playera_perro.png",
    "Playera de rayas para perros, ligera y cómoda, perfecta para mantener a tu mascota con un estilo moderno",
    "$219.99 MXN",
    "accesorio"
);
// Exportar store si usamos modulos, o dejarlo global en el navegador
