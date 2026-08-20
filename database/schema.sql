-- ==============================================================================
-- Base de Datos: marcando_huellitas
-- Motor: MySQL
-- Notas: Preparado para integración con Spring Boot (JPA / Hibernate)
-- ==============================================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS marcando_huellitas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE marcando_huellitas;

-- 1. Tabla de Usuarios (Autenticación y Roles)
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- IMPORTANTE: Nunca guardar en texto plano, usar BCrypt o Argon2
    rol VARCHAR(50) DEFAULT 'USUARIO', -- 'USUARIO' o 'ADMIN'
    
    -- Campos de Seguridad
    token_recuperacion VARCHAR(255), -- Para la recuperación de contraseña
    intentos_fallidos INT DEFAULT 0, -- Prevención de ataques de fuerza bruta (bloqueo de cuenta)
    bloqueado_hasta TIMESTAMP NULL, -- Fecha/hora hasta la que la cuenta estará bloqueada
    ultimo_login TIMESTAMP NULL, -- Registro de la última conexión exitosa
    
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabla de Refugios
CREATE TABLE IF NOT EXISTS refugios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NULL, -- Usuario dueño/creador del refugio
    nombre VARCHAR(150) NOT NULL,
    responsable VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    estado_entidad VARCHAR(100) NOT NULL,
    tipo_organizacion VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    sitio_web VARCHAR(255),
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    imagen_url VARCHAR(255),
    video_url VARCHAR(255), -- Para el video de YouTube en el carrusel
    estatus VARCHAR(50) DEFAULT 'PENDIENTE', -- Para validación por admin antes de publicar
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
);

-- 3. Tabla de Mascotas (Adopciones)
CREATE TABLE IF NOT EXISTS mascotas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL, -- Ej: 'perro', 'gato'
    raza VARCHAR(100) DEFAULT 'Mestizo', -- Ej: 'Pug', 'Siames', 'Cruza'
    sexo VARCHAR(20) NOT NULL, -- 'Macho' o 'Hembra'
    tamano VARCHAR(50), -- Ej: 'Chico', 'Mediano', 'Grande'
    edad VARCHAR(50), -- Ej: 'Cachorro', 'Adulto', '2 meses'
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'DISPONIBLE', -- 'DISPONIBLE', 'EN_PROCESO', 'ADOPTADO'
    imagen_url VARCHAR(255),
    caracteristicas VARCHAR(255), -- Características (ej: 'Tranquilo, Sano')
    refugio_id BIGINT NULL, -- Relación opcional con un refugio/asociación
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (refugio_id) REFERENCES refugios (id) ON DELETE SET NULL
);

-- 4. Tabla de Solicitudes de Adopción (Relación Usuario -> Mascota)
CREATE TABLE IF NOT EXISTS solicitudes_adopcion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    mascota_id BIGINT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT NOT NULL,
    experiencia TEXT, -- Experiencia previa con mascotas
    estado VARCHAR(50) DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'APROBADA', 'RECHAZADA'
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (mascota_id) REFERENCES mascotas (id) ON DELETE CASCADE
);

-- 5. Tabla de Productos (Tienda / Carrito)
CREATE TABLE IF NOT EXISTS productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    categoria VARCHAR(100), -- Ej: 'Alimento', 'Juguetes', 'Accesorios'
    imagen_url VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (refugio_id) REFERENCES refugios (id) ON DELETE SET NULL
);

-- 6. Tabla de Pedidos (Compras de la tienda)
CREATE TABLE IF NOT EXISTS pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    monto_total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'PAGADO', -- 'PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO'
    direccion_envio TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

-- 7. Tabla de Detalles de Pedido (Productos en cada orden)
CREATE TABLE IF NOT EXISTS detalles_pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_compra DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
);

-- 8. Tabla de Donaciones
CREATE TABLE IF NOT EXISTS donaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NULL, -- NULL si es donación anónima
    nombre_donante VARCHAR(150), -- Opcional: si el donante no está registrado
    correo_donante VARCHAR(150),
    telefono_donante VARCHAR(20),
    monto DECIMAL(10, 2) NOT NULL,
    frecuencia VARCHAR(50) DEFAULT 'Unica', -- 'Unica', 'Mensual', 'Anual'
    metodo_pago VARCHAR(50),
    comprobante_url VARCHAR(255), -- Guardará el enlace de S3/Cloudinary o ruta local del PDF/PNG
    estado VARCHAR(50) DEFAULT 'COMPLETADA',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
);

-- 9. Tabla de Historias de Éxito
CREATE TABLE IF NOT EXISTS historias_exito (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mascota_id BIGINT NULL,
    usuario_id BIGINT NULL,
    titulo VARCHAR(150) NOT NULL,
    historia TEXT NOT NULL,
    imagen_url VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mascota_id) REFERENCES mascotas (id) ON DELETE SET NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
);

-- 9.5. Tabla de Solicitudes de Apoyo (Voluntariado, Apadrinamiento, Hogar Temporal)
CREATE TABLE IF NOT EXISTS solicitudes_apoyo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    refugio_id BIGINT NOT NULL,
    tipo_apoyo VARCHAR(50) NOT NULL, -- 'VOLUNTARIO', 'PADRINO', 'HOGAR_TEMPORAL'
    mensaje TEXT,
    estado VARCHAR(50) DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'CONTACTADO', 'RECHAZADO'
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (refugio_id) REFERENCES refugios (id) ON DELETE CASCADE
);

-- ==============================================================================
-- NUEVAS TABLAS DE PERFIL Y FAVORITOS (FRONTEND INTEGRATION)
-- ==============================================================================

-- 10. Tabla de Direcciones de Usuario
CREATE TABLE IF NOT EXISTS direcciones_usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    calle_numero VARCHAR(255) NOT NULL,
    colonia VARCHAR(150) NOT NULL,
    codigo_postal VARCHAR(20) NOT NULL,
    ciudad_estado VARCHAR(150) NOT NULL,
    referencias TEXT,
    es_principal BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

-- 11. Tabla de Métodos de Pago
CREATE TABLE IF NOT EXISTS metodos_pago_usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    titular VARCHAR(150) NOT NULL,
    ultimos_digitos VARCHAR(4) NOT NULL, -- Solo guardar los últimos 4 por seguridad
    marca VARCHAR(50), -- Ej: Visa, Mastercard
    expiracion VARCHAR(5), -- Ej: 12/25
    es_principal BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

-- 12. Tabla Intermedia: Mascotas Favoritas
CREATE TABLE IF NOT EXISTS mascotas_favoritas (
    usuario_id BIGINT NOT NULL,
    mascota_id BIGINT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, mascota_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (mascota_id) REFERENCES mascotas (id) ON DELETE CASCADE
);

-- 13. Tabla Intermedia: Productos Favoritos
CREATE TABLE IF NOT EXISTS productos_favoritos (
    usuario_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, producto_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
);

-- ==============================================================================
-- INSERCIÓN DE DATOS INICIALES (MOCK DATA PARA PRUEBAS)
-- ==============================================================================

-- Usuario Administrador por defecto
INSERT INTO
    usuarios (
        nombre,
        apellido,
        correo,
        password,
        rol
    )
VALUES (
        'Admin',
        'Huellitas',
        'admin@marcandohuellitas.com',
        '\\\/y...',
        'ADMIN'
    );

-- ==============================================================================
-- DATOS DE PRUEBA (MOCK DATA)
-- ==============================================================================

-- Mock Data para Usuarios (id 2 a 6)
INSERT INTO
    usuarios (
        nombre,
        apellido,
        correo,
        password,
        rol
    )
VALUES (
        'Juan',
        'Pérez',
        'juan@ejemplo.com',
        'pwd123',
        'USUARIO'
    ),
    (
        'María',
        'García',
        'maria@ejemplo.com',
        'pwd123',
        'USUARIO'
    ),
    (
        'Carlos',
        'López',
        'carlos@ejemplo.com',
        'pwd123',
        'USUARIO'
    ),
    (
        'Ana',
        'Martínez',
        'ana@ejemplo.com',
        'pwd123',
        'USUARIO'
    ),
    (
        'Luis',
        'Sánchez',
        'luis@ejemplo.com',
        'pwd123',
        'USUARIO'
    );

-- Mock Data para Refugios (id 1 a 5)
INSERT INTO
    refugios (
        nombre,
        responsable,
        correo,
        telefono,
        direccion,
        estado_entidad,
        tipo_organizacion,
        descripcion,
        sitio_web,
        instagram,
        facebook,
        imagen_url,
        estatus
    )
VALUES (
        'Refugio Esperanza',
        'Laura Gómez',
        'contacto@esperanza.org',
        '555-0001',
        'Calle Falsa 123',
        'Activo',
        'Asociación Civil',
        'Refugio dedicado al rescate de perros callejeros.',
        'www.esperanza.org',
        '@refugioesperanza',
        'fb.com/esperanza',
        'logo1.png',
        'APROBADO'
    ),
    (
        'Amigos Peludos',
        'Pedro Ruiz',
        'hola@peludos.com',
        '555-0002',
        'Av. Siempre Viva 45',
        'Activo',
        'Independiente',
        'Damos hogar temporal a gatos abandonados.',
        'www.peludos.com',
        '@amigospeludos',
        'fb.com/peludos',
        'logo2.png',
        'APROBADO'
    ),
    (
        'Patitas Seguras',
        'Sofia Castro',
        'info@patitas.org',
        '555-0003',
        'Boulevard Principal 8',
        'Activo',
        'Fundación',
        'Especialistas en rescate de cachorros.',
        'www.patitasseguras.org',
        '@patitas_seguras',
        'fb.com/patitasseguras',
        'logo3.png',
        'APROBADO'
    ),
    (
        'Huellas de Amor',
        'Ricardo Vega',
        'ayuda@huellas.com',
        '555-0004',
        'Camino Real 150',
        'Activo',
        'Asociación Civil',
        'Brindamos atención médica y hogar.',
        'www.huellasamor.org',
        '@huellas_amor',
        'fb.com/huellasamor',
        'logo4.png',
        'PENDIENTE'
    ),
    (
        'El Gran Rescate',
        'Carmen Silva',
        'carmen@rescate.org',
        '555-0005',
        'Calle del Sol 42',
        'Activo',
        'Independiente',
        'Refugio para perros mayores.',
        'www.granrescate.com',
        '@granrescate',
        'fb.com/granrescate',
        'logo5.png',
        'APROBADO'
    );

-- Mock Data para Mascotas (id 1 a 5)
INSERT INTO
    mascotas (
        nombre,
        especie,
        raza,
        sexo,
        tamano,
        edad,
        descripcion,
        estado,
        imagen_url,
        caracteristicas,
        refugio_id
    )
VALUES (
        'Max',
        'perro',
        'Mestizo',
        'Macho',
        'Mediano',
        'Adulto',
        'Perrito muy juguetón y cariñoso',
        'DISPONIBLE',
        'max.jpg',
        'Juguetón, Activo',
        1
    ),
    (
        'Luna',
        'gato',
        'Siames Cruza',
        'Hembra',
        'Chico',
        'Cachorro',
        'Gatita curiosa y tranquila',
        'DISPONIBLE',
        'luna.jpg',
        'Tranquila, Cariñosa',
        2
    ),
    (
        'Rocky',
        'perro',
        'Pastor Alemán',
        'Macho',
        'Grande',
        'Adulto',
        'Excelente guardián y compañero',
        'EN_PROCESO',
        'rocky.jpg',
        'Protector, Leal',
        3
    ),
    (
        'Milo',
        'gato',
        'Mestizo',
        'Macho',
        'Chico',
        'Adulto',
        'Le encanta dormir al sol',
        'DISPONIBLE',
        'milo.jpg',
        'Perezoso, Tierno',
        4
    ),
    (
        'Bella',
        'perro',
        'Husky',
        'Hembra',
        'Grande',
        'Cachorro',
        'Perrita con mucha energía',
        'ADOPTADO',
        'bella.jpg',
        'Energética, Juguetona',
        5
    );

-- Mock Data para Solicitudes de Adopción (id 1 a 5)
INSERT INTO
    solicitudes_adopcion (
        usuario_id,
        mascota_id,
        telefono,
        direccion,
        experiencia,
        estado
    )
VALUES (
        2,
        1,
        '555-1234',
        'Calle 10, #32',
        'Tuve un perro antes',
        'PENDIENTE'
    ),
    (
        3,
        2,
        '555-5678',
        'Avenida Central 50',
        'Ninguna',
        'PENDIENTE'
    ),
    (
        4,
        3,
        '555-9012',
        'Residencial Las Flores 12',
        'Tuve un pastor alemán',
        'APROBADA'
    ),
    (
        5,
        4,
        '555-3456',
        'Callejón Sur 4',
        'Tengo otro gato',
        'RECHAZADA'
    ),
    (
        2,
        5,
        '555-1234',
        'Calle 10, #32',
        'Tuve un perro antes',
        'APROBADA'
    );

-- Mock Data para Productos (id 1 a 5)
INSERT INTO
    productos (
        nombre,
        descripcion,
        precio,
        stock,
        categoria,
        imagen_url
    )
VALUES (
        'Croquetas Premium',
        'Alimento balanceado 15kg',
        850.00,
        50,
        'Alimento',
        'croquetas.jpg'
    ),
    (
        'Juguete Mordedera',
        'Hueso de goma resistente',
        120.00,
        100,
        'Juguetes',
        'hueso.jpg'
    ),
    (
        'Cama Suave',
        'Cama acolchada tamaño mediano',
        450.00,
        20,
        'Accesorios',
        'cama.jpg'
    ),
    (
        'Collar Reflectante',
        'Collar seguro para paseos nocturnos',
        150.00,
        80,
        'Accesorios',
        'collar.jpg'
    ),
    (
        'Arena para Gato',
        'Arena aglutinante 10kg',
        250.00,
        40,
        'Alimento',
        'arena.jpg'
    );

-- Mock Data para Pedidos (id 1 a 5)
INSERT INTO
    pedidos (
        usuario_id,
        monto_total,
        estado,
        direccion_envio
    )
VALUES (
        2,
        850.00,
        'PAGADO',
        'Calle 10, #32'
    ),
    (
        3,
        120.00,
        'PENDIENTE',
        'Avenida Central 50'
    ),
    (
        4,
        600.00,
        'ENVIADO',
        'Residencial Las Flores 12'
    ),
    (
        5,
        250.00,
        'ENTREGADO',
        'Callejón Sur 4'
    ),
    (
        2,
        450.00,
        'PAGADO',
        'Calle 10, #32'
    );

-- Mock Data para Detalles de Pedido
INSERT INTO
    detalles_pedido (
        pedido_id,
        producto_id,
        cantidad,
        precio_compra
    )
VALUES (1, 1, 1, 850.00),
    (2, 2, 1, 120.00),
    (3, 3, 1, 450.00),
    (3, 4, 1, 150.00),
    (4, 5, 1, 250.00),
    (5, 3, 1, 450.00);

-- Mock Data para Donaciones
INSERT INTO
    donaciones (
        usuario_id,
        nombre_donante,
        correo_donante,
        telefono_donante,
        monto,
        frecuencia,
        metodo_pago,
        comprobante_url,
        estado
    )
VALUES (
        2,
        'Juan Pérez',
        'juan@ejemplo.com',
        '555-1234',
        500.00,
        'Unica',
        'Tarjeta',
        's3.com/comprobante1.pdf',
        'COMPLETADA'
    ),
    (
        NULL,
        'Anónimo',
        'anonimo@ejemplo.com',
        '555-0000',
        100.00,
        'Mensual',
        'Efectivo OXXO',
        's3.com/comp2.png',
        'COMPLETADA'
    ),
    (
        3,
        'María García',
        'maria@ejemplo.com',
        '555-5678',
        1000.00,
        'Unica',
        'Transferencia',
        's3.com/transf3.jpg',
        'COMPLETADA'
    ),
    (
        4,
        'Carlos López',
        'carlos@ejemplo.com',
        '555-9012',
        250.00,
        'Anual',
        'PayPal',
        's3.com/paypal4.pdf',
        'COMPLETADA'
    ),
    (
        5,
        'Ana Martínez',
        'ana@ejemplo.com',
        '555-3456',
        300.00,
        'Mensual',
        'Tarjeta',
        's3.com/comp5.pdf',
        'PENDIENTE'
    );

-- Mock Data para Historias de Éxito
INSERT INTO
    historias_exito (
        mascota_id,
        usuario_id,
        titulo,
        historia,
        imagen_url
    )
VALUES (
        5,
        2,
        'Bella llegó a mi vida',
        'Desde que Bella llegó, la casa está llena de alegría.',
        'bella_feliz.jpg'
    ),
    (
        1,
        4,
        'Max es el mejor',
        'Max nos acompaña a todos lados.',
        'max_parque.jpg'
    ),
    (
        2,
        3,
        'Luna la gatita',
        'Luna ya se adaptó y duerme todo el día en mi cama.',
        'luna_cama.jpg'
    ),
    (
        3,
        5,
        'Rocky mi guardián',
        'Rocky es muy leal y ya conoce todos mis comandos.',
        'rocky_entrenado.jpg'
    ),
    (
        4,
        2,
        'Milo el perezoso',
        'A Milo le encanta su nueva camita que compramos en la tienda.',
        'milo_dormido.jpg'
    );