-- ==============================================================================
-- Base de Datos: marcando_huellitas
-- Motor: MySQL
-- Notas: Preparado para integración con Spring Boot (JPA / Hibernate)
-- Tablas y columnas en español
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
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'USUARIO', -- 'USUARIO' o 'ADMIN'
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabla de Mascotas (Adopciones)
CREATE TABLE IF NOT EXISTS mascotas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL, -- Ej: 'perro', 'gato'
    edad VARCHAR(50),             -- Ej: 'Cachorro', 'Adulto', '2 meses'
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'DISPONIBLE', -- 'DISPONIBLE', 'EN_PROCESO', 'ADOPTADO'
    imagen_url VARCHAR(255),
    caracteristicas VARCHAR(255), -- Características (ej: 'Tranquilo, Sano')
    refugio_id BIGINT NULL,       -- Relación opcional con un refugio/asociación
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (refugio_id) REFERENCES refugios(id) ON DELETE SET NULL
);

-- 3. Tabla de Solicitudes de Adopción (Relación Usuario -> Mascota)
CREATE TABLE IF NOT EXISTS solicitudes_adopcion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    mascota_id BIGINT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT NOT NULL,
    experiencia TEXT, -- Experiencia previa con mascotas
    estado VARCHAR(50) DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'APROBADA', 'RECHAZADA'
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
);

-- 4. Tabla de Productos (Tienda / Carrito)
CREATE TABLE IF NOT EXISTS productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    categoria VARCHAR(100), -- Ej: 'Alimento', 'Juguetes', 'Accesorios'
    imagen_url VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (refugio_id) REFERENCES refugios(id) ON DELETE SET NULL
);

-- 5. Tabla de Pedidos (Compras de la tienda)
CREATE TABLE IF NOT EXISTS pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'PAGADO', -- 'PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO'
    direccion_envio TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 6. Tabla de Detalles de Pedido (Productos en cada orden)
CREATE TABLE IF NOT EXISTS detalles_pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- 7. Tabla de Donaciones
CREATE TABLE IF NOT EXISTS donaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NULL, -- NULL si es donación anónima
    monto DECIMAL(10, 2) NOT NULL,
    proposito VARCHAR(100), -- 'Alimentación', 'Atención Veterinaria', etc.
    metodo_pago VARCHAR(50),
    comprobante_url VARCHAR(255), -- Guardará el enlace de S3/Cloudinary o ruta local del PDF/PNG
    estado VARCHAR(50) DEFAULT 'COMPLETADA',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
);

-- 8. Tabla de Refugios
CREATE TABLE IF NOT EXISTS refugios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    persona_responsable VARCHAR(150) NOT NULL,
    correo_electronico VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    estado_entidad VARCHAR(100) NOT NULL,
    tipo_organizacion VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    sitio_web VARCHAR(255),
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    imagen_url VARCHAR(255),
    estatus VARCHAR(50) DEFAULT 'PENDIENTE', -- Para validación por admin antes de publicar
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabla de Historias de Éxito
CREATE TABLE IF NOT EXISTS historias_exito (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_mascota VARCHAR(100) NOT NULL,
    historia TEXT NOT NULL,
    imagen_url VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INSERCIÓN DE DATOS INICIALES (MOCK DATA PARA PRUEBAS)
-- ==============================================================================

-- Usuario Administrador por defecto
INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol) 
VALUES ('Admin', 'Huellitas', 'admin@marcandohuellitas.com', '\\\/y...', 'ADMIN');



