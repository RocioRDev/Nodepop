# Nodepop
Tienda de articulos de segunda mano

## Instalación
npm install

## Ejecución
npm start

## Configuración
La configuración se realiza a través de variables de entorno. Para ello se puede crear un fichero .env en la raíz del proyecto con las siguientes variables:

* PORT: Puerto de escucha del servidor. Por defecto 3000
* NODE_ENV: Entorno de ejecución. Por defecto development
* DB_NAME: Nombre de la base de datos. Por defecto nodepop
* DB_USER: Usuario de la base de datos. Por defecto nodepop
* DB_PASS: Contraseña de la base de datos. Por defecto nodepop

## API
La API se puede consultar en la siguiente URL: http://localhost:3000/apidoc

## Base de datos
La base de datos se puede inicializar con el siguiente comando:

node init-db.js

