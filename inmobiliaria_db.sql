create database inmobiliaria_db;

use inmobiliaria_db;

create table Categorias(
id_categoria int auto_increment primary key,
categoria varchar(100)
);

create table Autorizadas(
id_autorizada int primary key auto_increment,
autorizada varchar(100)
);

create table Tipo_Inmuebles(
id_tipo_inmueble int auto_increment primary key,
tipo_inmueble varchar(100)
);

create table Provincias(
id_provincia int auto_increment primary key,
nombre varchar(100)
);

create table Departamentos(
id_departamento int auto_increment primary key,
nombre varchar(100),
id_provincia int,
foreign key (id_provincia) references Provincias(id_provincia)
);

create table Municipios(
id_municipio int auto_increment primary key,
nombre varchar(100),
cp varchar(100),
id_departamento int,
foreign key (id_departamento) references Departamentos(id_departamento)
);


create table Ambientes(
id_ambiente int auto_increment primary key,
numero varchar(100)
);

create table Dormitorios(
id_dormitorio int auto_increment primary key,
numero varchar(100)
);

create table Estacionamientos(
id_estacionamiento int auto_increment primary key,
numero varchar(100),
entrada_exclusiva varchar(100)
);

create table Condiciones(
id_condicion int primary key auto_increment,
estado varchar(100)
);


create table Direcciones(
id_direccion int auto_increment primary key,
id_municipio int,
calle varchar(100),
numero varchar(100),
ubicacion varchar(100),
observaciones varchar(100),
foreign key (id_municipio) references Municipios(id_municipio)
);

create table Personas(
id_persona int auto_increment primary key,
cuil varchar(100),
dni varchar(100),
fecha_nacimiento varchar(100),
edad varchar(100),
id_direccion int,
foreign key (id_direccion) references Direcciones(id_direccion)
);

create table Usuarios(
id_usuario int auto_increment primary key,
email varchar(100),
contrasena varchar(100),
id_persona int,
foreign key (id_persona) references Personas(id_persona)
);

create table Clientes(
id_cliente int auto_increment primary key,
tipo varchar(100),
categoria_fiscal varchar(100),
id_usuario int,
foreign key (id_usuario) references Usuarios(id_usuario)
);

create table Inmuebles(
id_inmueble int auto_increment primary key,
titulo varchar(100),
descripcion varchar(100),
pileta varchar(100),
terraza varchar(100),
id_categoria int,
id_autorizada int,
id_tipo_inmueble int,
id_ambiente int,
id_dormitorio int,
id_condicion int,
id_estacionamiento int,
id_direccion int,
id_cliente int,
foreign key (id_categoria) references Categorias(id_categoria),
foreign key (id_autorizada) references Autorizadas(id_autorizada),
foreign key (id_tipo_inmueble) references Tipo_Inmuebles(id_tipo_inmueble),
foreign key (id_ambiente) references Ambientes(id_ambiente),
foreign key (id_dormitorio) references Dormitorios(id_dormitorio),
foreign key (id_condicion) references Condiciones(id_condicion),
foreign key (id_estacionamiento) references Estacionamientos(id_estacionamiento),
foreign key (id_direccion) references Direcciones(id_direccion),
foreign key (id_cliente) references Clientes(id_cliente)
);

create table Publicaciones(
id_publicacion int auto_increment primary key,
precio varchar(100),
titulo varchar(100),
servicios varchar(100),
id_inmueble int,
foreign key (id_inmueble) references Inmuebles(id_inmueble)
);

create table Imagenes(
id_imagen int auto_increment primary key,
nombre varchar(100),
url varchar(100),
orden varchar(100),
id_publicacion int,
foreign key (id_publicacion) references Publicaciones(id_publicacion)
);

create table Citas(
id_cita int primary key auto_increment,
mensaje varchar(500),
estado varchar(100),
id_publicacion int,
id_cliente int,
foreign key (id_publicacion) references Publicaciones(id_publicacion),
foreign key (id_cliente) references Clientes(id_cliente)
);