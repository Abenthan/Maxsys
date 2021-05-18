CREATE DATABASE maxsysdb;

USE maxsysdb;

CREATE TABLE users(
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(16) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT;

--Tabla  Empresas
CREATE TABLE empresas (
    id INT(11) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo_id VARCHAR(20) NOT NULL,
    identificacion VARCHAR(20) NOT NULL,
    fecha_registro timestamp NOT NULL DEFAULT current_timestamp
);
