CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    cuit VARCHAR(20) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(80) UNIQUE NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE permisos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(120) UNIQUE NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE establecimientos (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id),
    nombre VARCHAR(150) NOT NULL,
    latitud NUMERIC(10,7),
    longitud NUMERIC(10,7),
    descripcion TEXT
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE usuario_rol (
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    rol_id INTEGER NOT NULL REFERENCES roles(id),
    PRIMARY KEY (usuario_id, rol_id)
);

CREATE TABLE rol_permiso (
    rol_id INTEGER NOT NULL REFERENCES roles(id),
    permiso_id INTEGER NOT NULL REFERENCES permisos(id),
    PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE corrales (
    id SERIAL PRIMARY KEY,
    establecimiento_id INTEGER NOT NULL REFERENCES establecimientos(id),
    codigo VARCHAR(50) NOT NULL,
    capacidad INTEGER,
    superficie_m2 NUMERIC(10,2),
    frente_comedero_m NUMERIC(10,2)
);

CREATE TABLE lotes (
    id SERIAL PRIMARY KEY,
    corral_id INTEGER NOT NULL REFERENCES corrales(id),
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(80),
    fecha_inicio TIMESTAMPTZ
);

CREATE TABLE animales (
    id SERIAL PRIMARY KEY,
    lote_id INTEGER NOT NULL REFERENCES lotes(id),
    rfid VARCHAR(80) NOT NULL UNIQUE,
    numero_caravana VARCHAR(80),
    raza VARCHAR(100),
    sexo VARCHAR(20),
    estado VARCHAR(50) NOT NULL DEFAULT 'activo',
    peso_ingreso NUMERIC(8,2),
    fecha_ingreso TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pesajes (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER NOT NULL REFERENCES animales(id),
    fecha TIMESTAMPTZ DEFAULT NOW(),
    peso_estimado NUMERIC(8,2) NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    margen_error NUMERIC(5,2)
);

CREATE TABLE alertas (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER REFERENCES animales(id),
    corral_id INTEGER REFERENCES corrales(id),
    tipo VARCHAR(80) NOT NULL,
    severidad VARCHAR(30) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'abierta',
    descripcion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE auditoria_logs (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER,
    accion VARCHAR(120) NOT NULL,
    entidad VARCHAR(120) NOT NULL,
    entidad_id VARCHAR(80),
    datos JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO empresas (nombre, cuit) VALUES ('Feedlot Demo', '30-00000000-1');
INSERT INTO establecimientos (empresa_id, nombre, latitud, longitud) VALUES (1, 'Campo Demo San Luis', -33.3435000, -66.0574167);
INSERT INTO roles (nombre, descripcion) VALUES ('Admin', 'Administrador general'), ('Operario', 'Carga datos de campo'), ('Veterinario', 'Gestiona eventos sanitarios');
INSERT INTO permisos (codigo, descripcion) VALUES ('animales.read', 'Ver animales'), ('animales.write', 'Gestionar animales'), ('alertas.read', 'Ver alertas'), ('alertas.write', 'Gestionar alertas');
INSERT INTO corrales (establecimiento_id, codigo, capacidad, superficie_m2, frente_comedero_m) VALUES (1, 'CORRAL-01', 300, 6000, 100);
INSERT INTO lotes (corral_id, nombre, categoria, fecha_inicio) VALUES (1, 'Lote inicial', 'Engorde', NOW());
INSERT INTO animales (lote_id, rfid, numero_caravana, raza, sexo, peso_ingreso) VALUES
(1, 'RFID-0001', 'A001', 'Britanica/Mestiza', 'M', 320.5),
(1, 'RFID-0002', 'A002', 'Britanica/Mestiza', 'H', 298.0);
