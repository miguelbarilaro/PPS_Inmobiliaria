use inmobiliaria_db;

INSERT INTO Autorizadas (autorizada) VALUES
('pendiente'),
('aprobada');

INSERT INTO Provincias (nombre) VALUES
('Buenos Aires'),
('Ciudad Autónoma de Buenos Aires'),
('Catamarca'),
('Chaco'),
('Chubut'),
('Córdoba'),
('Corrientes'),
('Entre Ríos'),
('Formosa'),
('Jujuy'),
('La Pampa'),
('La Rioja'),
('Mendoza'),
('Misiones'),
('Neuquén'),
('Río Negro'),
('Salta'),
('San Juan'),
('San Luis'),
('Santa Cruz'),
('Santa Fe'),
('Santiago del Estero'),
('Tierra del Fuego, Antártida e Islas del Atlántico Sur'),
('Tucumán');



INSERT INTO Departamentos (nombre, id_provincia) VALUES
('Burruyacú', 24),
('Capital', 24),
('Chicligasta', 24),
('Cruz Alta', 24),
('Famaillá', 24),
('Graneros', 24),
('Juan Bautista Alberdi', 24),
('La Cocha', 24),
('Leales', 24),
('Lules', 24),
('Monteros', 24),
('Río Chico', 24),
('Simoca', 24),
('Tafí del Valle', 24),
('Tafí Viejo', 24),
('Trancas', 24),
('Yerba Buena', 24);



INSERT INTO Municipios (nombre, cp, id_departamento) VALUES
('San Miguel de Tucumán', '4000', 2),
('Burruyacú', '4119', 1),
('Concepción', '4146', 3),
('Banda del Río Salí', '4111', 4),
('Alderetes', '4178', 4),
('Famaillá', '4132', 5),
('Aguilares', '4152', 12),
('Bella Vista', '4156', 9),
('Graneros', '4172', 6),
('Juan Bautista Alberdi', '4158', 7),
('La Cocha', '4149', 8),
('Lules', '4128', 10),
('Monteros', '4142', 11),
('Simoca', '4174', 13),
('Tafí del Valle', '4137', 14),
('Tafí Viejo', '4103', 15),
('Trancas', '4126', 16),
('Yerba Buena', '4107', 17),
('Las Talitas', '4101', 15);

INSERT INTO Condiciones (estado) VALUES
('Nuevo'),
('Usado'),
('A estrenar');

INSERT INTO Categorias (nombre) VALUES
('Casa'),
('Departamento'),
('Terreno'),
('Galpón'),
('Oficina'),
('Local Comercial');


INSERT INTO Roles (nombre_rol) VALUES ('admin');

INSERT INTO Roles (nombre_rol) VALUES ('user');

INSERT INTO `inmobiliaria_db`.`personas` (`id_persona`, `cuil`, `dni`, `fecha_nacimiento`, `edad`) VALUES ('1', '324324', '32425', '34320', '40');


INSERT INTO Usuarios (email, contrasena, id_persona, id_rol)
VALUES ('admin', '$2b$10$xukTawNap8GwwPoWBr3eFu597wUP0GR2xu8ccGboPzikiarSplO6m', 1, 1);