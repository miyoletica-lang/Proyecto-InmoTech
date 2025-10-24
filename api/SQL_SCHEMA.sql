-- InmoTech Database Schema
-- SQL Server 2019+

CREATE DATABASE InmobiliariaDB;
GO

USE InmobiliariaDB;
GO

-- Tabla Personas (usuarios + sin cuenta)
CREATE TABLE Personas (
  id_persona INT PRIMARY KEY IDENTITY(1,1),
  tipo_documento VARCHAR(5) CHECK (tipo_documento IN ('CC','CE','NIT','Pasaporte','TI')),
  numero_documento VARCHAR(20) NOT NULL,
  primer_nombre VARCHAR(50) NOT NULL,
  segundo_nombre VARCHAR(50),
  primer_apellido VARCHAR(50) NOT NULL,
  segundo_apellido VARCHAR(50),
  correo VARCHAR(100) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  tiene_cuenta BIT DEFAULT 0,
  estado BIT DEFAULT 1,
  fecha_registro DATETIME2(3) DEFAULT GETDATE(),
  CONSTRAINT UQ_Personas_Documento UNIQUE (tipo_documento, numero_documento)
);
GO

CREATE INDEX IX_Personas_Correo ON Personas(correo);
GO

-- Tabla Acceso
CREATE TABLE Acceso (
  id_acceso INT PRIMARY KEY IDENTITY(1,1),
  id_persona INT UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  fecha_creacion DATETIME2(3) DEFAULT GETDATE(),
  ultimo_acceso DATETIME2(3),
  CONSTRAINT FK_Acceso_Persona FOREIGN KEY (id_persona) REFERENCES Personas(id_persona)
);
GO

-- Tabla Roles
CREATE TABLE Roles (
  id_rol INT PRIMARY KEY IDENTITY(1,1),
  nombre_rol VARCHAR(50) UNIQUE NOT NULL,
  descripcion VARCHAR(200),
  estado BIT DEFAULT 1,
  fecha_creacion DATETIME2(3) DEFAULT GETDATE()
);
GO

-- Tabla Personas_rol (many-to-many)
CREATE TABLE Personas_rol (
  id_persona_rol INT PRIMARY KEY IDENTITY(1,1),
  id_persona INT NOT NULL,
  id_rol INT NOT NULL,
  estado BIT DEFAULT 1,
  fecha_asignacion DATETIME2(3) DEFAULT GETDATE(),
  CONSTRAINT FK_PersonasRol_Persona FOREIGN KEY (id_persona) REFERENCES Personas(id_persona),
  CONSTRAINT FK_PersonasRol_Rol FOREIGN KEY (id_rol) REFERENCES Roles(id_rol),
  CONSTRAINT UQ_PersonasRol UNIQUE (id_persona, id_rol)
);
GO

-- Tabla Inmuebles
CREATE TABLE Inmuebles (
  id_inmueble INT PRIMARY KEY IDENTITY(1,1),
  registro_inmobiliario VARCHAR(50) UNIQUE NOT NULL,
  pais VARCHAR(50) NOT NULL,
  departamento VARCHAR(50) NOT NULL,
  ciudad VARCHAR(50) NOT NULL,
  direccion VARCHAR(100) NOT NULL,
  categoria VARCHAR(50),
  precio_venta DECIMAL(15,2),
  area_construida DECIMAL(10,2),
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'Disponible',
  fecha_registro DATETIME2(3) DEFAULT GETDATE()
);
GO

-- Tabla Propiedad_inmueble
CREATE TABLE Propiedad_inmueble (
  id_propietario INT PRIMARY KEY IDENTITY(1,1),
  id_inmueble INT NOT NULL,
  id_persona INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  estado VARCHAR(20) DEFAULT 'Activo',
  CONSTRAINT FK_Propiedad_Inmueble FOREIGN KEY (id_inmueble) REFERENCES Inmuebles(id_inmueble),
  CONSTRAINT FK_Propiedad_Persona FOREIGN KEY (id_persona) REFERENCES Personas(id_persona)
);
GO

-- Tabla Servicios_cita
CREATE TABLE Servicios_cita (
  id_servicio INT PRIMARY KEY IDENTITY(1,1),
  nombre_servicio VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  duracion_estimada INT DEFAULT 45,
  estado BIT DEFAULT 1
);
GO

-- Tabla Estados_cita
CREATE TABLE Estados_cita (
  id_estado_cita INT PRIMARY KEY IDENTITY(1,1),
  nombre_estado VARCHAR(50) UNIQUE NOT NULL,
  orden INT NOT NULL,
  es_estado_final BIT DEFAULT 0
);
GO

-- Tabla Citas (módulo principal)
CREATE TABLE Citas (
  id_cita INT PRIMARY KEY IDENTITY(1,1),
  id_persona INT NOT NULL,
  id_inmueble INT NOT NULL,
  id_servicio INT NOT NULL,
  id_usuario_creador INT,
  fecha_cita DATE NOT NULL,
  hora_inicio TIME(0) NOT NULL,
  hora_fin TIME(0) NOT NULL CHECK (hora_fin > hora_inicio),
  id_estado_cita INT NOT NULL DEFAULT 1,
  id_agente_asignado INT,
  observaciones TEXT,
  motivo_cancelacion VARCHAR(500),
  es_reagendada BIT DEFAULT 0,
  id_cita_original INT,
  fecha_creacion DATETIME2(3) DEFAULT GETDATE(),
  fecha_confirmacion DATETIME2(3),
  fecha_cancelacion DATETIME2(3),
  fecha_completada DATETIME2(3),
  CONSTRAINT FK_Citas_Persona FOREIGN KEY (id_persona) REFERENCES Personas(id_persona),
  CONSTRAINT FK_Citas_Inmueble FOREIGN KEY (id_inmueble) REFERENCES Inmuebles(id_inmueble),
  CONSTRAINT FK_Citas_Servicio FOREIGN KEY (id_servicio) REFERENCES Servicios_cita(id_servicio),
  CONSTRAINT FK_Citas_Estado FOREIGN KEY (id_estado_cita) REFERENCES Estados_cita(id_estado_cita),
  CONSTRAINT FK_Citas_Agente FOREIGN KEY (id_agente_asignado) REFERENCES Personas(id_persona),
  CONSTRAINT FK_Citas_Creador FOREIGN KEY (id_usuario_creador) REFERENCES Personas(id_persona)
);
GO

CREATE INDEX IX_Citas_Estado ON Citas(id_estado_cita, fecha_cita);
CREATE INDEX IX_Citas_ConflictoHorario ON Citas(id_inmueble, fecha_cita, hora_inicio, hora_fin);
GO

-- Tabla Notificaciones
CREATE TABLE Notificaciones (
  id_notificacion INT PRIMARY KEY IDENTITY(1,1),
  tipo_notificacion VARCHAR(50) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  id_cita INT,
  id_rol_destino INT,
  id_persona_destino INT,
  leida BIT DEFAULT 0,
  fecha_creacion DATETIME2(3) DEFAULT GETDATE(),
  CONSTRAINT FK_Notif_Cita FOREIGN KEY (id_cita) REFERENCES Citas(id_cita),
  CONSTRAINT FK_Notif_Rol FOREIGN KEY (id_rol_destino) REFERENCES Roles(id_rol),
  CONSTRAINT FK_Notif_Persona FOREIGN KEY (id_persona_destino) REFERENCES Personas(id_persona)
);
GO

CREATE INDEX IX_Notificaciones_NoLeidas ON Notificaciones(leida, fecha_creacion DESC) WHERE leida=0;
GO

-- Tabla Reportes
CREATE TABLE Reportes (
  id_reporte INT PRIMARY KEY IDENTITY(1,1),
  id_inmueble INT NOT NULL,
  tipo_reporte VARCHAR(50) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  prioridad VARCHAR(20) DEFAULT 'Media',
  estado VARCHAR(50) DEFAULT 'Pendiente',
  id_persona_reporta INT NOT NULL,
  fecha_creacion DATETIME2(3) DEFAULT GETDATE(),
  CONSTRAINT FK_Reportes_Inmueble FOREIGN KEY (id_inmueble) REFERENCES Inmuebles(id_inmueble),
  CONSTRAINT FK_Reportes_Persona FOREIGN KEY (id_persona_reporta) REFERENCES Personas(id_persona)
);
GO

-- SEEDS
INSERT INTO Roles (nombre_rol, descripcion) VALUES
('Super Administrador', 'Acceso total al sistema'),
('Administrador', 'Gestión de usuarios y configuración'),
('Empleado', 'Gestión de citas y operaciones diarias'),
('Usuario', 'Funcionalidades básicas'),
('Propietario', 'Gestión de propiedades propias');
GO

INSERT INTO Estados_cita (nombre_estado, orden, es_estado_final) VALUES
('Solicitada', 1, 0),
('Confirmada', 2, 0),
('Programada', 3, 0),
('Reagendada', 4, 0),
('Completada', 5, 1),
('Cancelada', 6, 1);
GO

INSERT INTO Servicios_cita (nombre_servicio, descripcion, duracion_estimada) VALUES
('Visita a Propiedad', 'Visita presencial al inmueble', 45),
('Avalúos', 'Tasación profesional del inmueble', 60),
('Gestión de Alquileres', 'Asesoría para alquileres', 30),
('Asesoría Legal', 'Consulta legal inmobiliaria', 45);
GO

-- Super Admin (password: Admin123!)
-- Hash bcrypt de Admin123! con 10 rounds
DECLARE @idPersona INT;
INSERT INTO Personas (tipo_documento, numero_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, correo, telefono, tiene_cuenta, estado)
VALUES ('CC', '999999999', 'Super', NULL, 'Admin', NULL, 'admin@inmotech.com', '+57 300 000 0000', 1, 1);

SET @idPersona = SCOPE_IDENTITY();

-- Nota: Este hash es de ejemplo. En producción debes generar el hash correcto con bcrypt
INSERT INTO Acceso (id_persona, contrasena)
VALUES (@idPersona, '$2b$10$rKvFJZEJfRJdLx6jxL5zMeyPh8s9JZCvC.yMFNyV8HQKZ6yFN.JxC');

INSERT INTO Personas_rol (id_persona, id_rol, estado)
VALUES (@idPersona, 1, 1);
GO

PRINT 'Base de datos InmobiliariaDB creada exitosamente';
PRINT 'Usuario Super Admin creado:';
PRINT '  Email: admin@inmotech.com';
PRINT '  Password: Admin123!';
GO
