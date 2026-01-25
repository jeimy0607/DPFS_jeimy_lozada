# DPFS_jeimy_lozada
E-Comerce para venta de artículos en cuero de una empresa llamada Peletería Cuero y Color
# Cuero y Color - E-commerce

**Cuero y Color** es una tienda en línea especializada en productos artesanales en cuero: bolsos, carteras, cinturones, billeteras y accesorios únicos. Cada pieza es hecha a mano con materiales de alta calidad, resaltando el diseño colombiano.

## Público objetivo

Personas de 20 años en adelante, interesadas en moda, sostenibilidad y diseño artesanal. También turistas y compradores internacionales que valoran lo hecho a mano y de origen colombiano.

## ¿Cómo ajustaremos nuestra oferta a ese público?

- Diseñando una tienda online con estética elegante, sencilla y moderna.
- Mostrando imágenes claras y atractivas de los productos.
- Usando una navegación amigable desde dispositivos móviles.
- Ofreciendo productos organizados por categoría (ej. bolsos, cinturones).
- Incluyendo descripciones detalladas y resaltando que son productos hechos a mano en Colombia.
- Ofreciendo opciones de contacto y personalización si es necesario.

## Sobre mí

Mi nombre es **Jeimy Alexandra Lozada Ortiz**, estudiante de ingeniería de software en la Universidad Manuela Beltrán. Este proyecto es parte del desafío profesional del curso Full Stack de Digital House, y al mismo tiempo representa un paso real para llevar el emprendimiento familiar **"Cuero y Color"** al mundo digital.

## Sitios de referencia

1. [Gucci](https://www.gucci.com) → Inspiración estética y navegación clara.
2. [Koaj](https://www.koaj.co) → Buen manejo de catálogo, categorías y experiencia mobile.
3. [Etsy](https://www.etsy.com) → Referente en productos hechos a mano y personalizables.
4. [Bosi](https://www.bosi.com.co) → Marca colombiana de productos en cuero, navegación limpia.
5. [Artesanías de Colombia](https://www.artesaniasdecolombia.com.co) → Enfoque cultural, identidad de marca.



## Ejecución del Ecommerce BackEnd

El e-commerce se ejecuta desde la raíz del proyecto.

1) Clonar el repositorio
- git clone <(https://github.com/jeimy0607/DPFS_jeimy_lozada.git)>
- cd DPFS_JEIMY_LOZADA

2) **Instalar dependencias**
- npm install

3) **Crear y configurar el archivo .env**

Crea el archivo .env a partir del ejemplo:

Mac / Linux / Git Bash

- cp .env.example .env


Windows PowerShell

- copy .env.example .env


Luego abre el archivo .env y coloca los datos de tu base de datos (ejemplo):

- DB_NAME=ecommerce_db
- DB_USER=root
- DB_PASS=
- DB_HOST=localhost
- DB_PORT=3306

- SESSION_SECRET=change_this_secret

4) **Crear y preparar la base de datos (Sequelize)**
- npx sequelize db:create
- npx sequelize db:migrate
- npx sequelize db:seed:all

5) **Levantar el servidor**
- npm start


La app queda en:

- http://localhost:3000 (o el puerto definido en tu .env)


## Ejecucion FrontEnd

El proyecto cuenta con dos roles de ingreso al crear una cuenta:

**comprador** que solo permite visualizar el contenido y realizar compras
**Administrador** que permite aparte de visualizar y realizar compras; editar productos, crear productos, desactivar productos y destacar productos que aparecen en la pagina principal.

Para evidenciar esto, se pueden crear las cuentas en la ruta correspondiente a **crear cuenta** y seleccionando cada uno de los roles, a continuación dejo dos credenciales previamente creadas con las que 
se puede evidenciar el proyecto con respecto a los dos roles 

**-------Credenciales de prueba-------**

**comprador** 
- rolcompradorprueba@gmail.com
- RolComprador1

**Administrador**
- roladminprueba@gmail.com
- RolAdmin1

Las evidencias del proyecto (Capturas de cada una de las vistas en el navegador) se encuentran en la carpeta del proyecto:
- DPFS_JEIMY_LOZADA/docs



**URLS de ingreso**
-DashBoard: http://localhost:5173
-Ecommerce: http://localhost:3000



## Dashboard Administrativo en React

El proyecto cuenta con un **dashboard administrativo desarrollado en React (Vite)**, el cual consume la API REST del backend para mostrar información clave del e-commerce.

## Funcionalidades del Dashboard

- Total de productos registrados
- Total de usuarios registrados
- Total de categorías
- Panel con el detalle del último producto creado
- Panel con el detalle del último usuario creado
- Panel con el total de productos por categoría
- Listado completo de productos
- Listado completo de usuarios

El dashboard permite tener una **visión general del estado del sistema**, facilitando el monitoreo de la información principal del e-commerce.

El dashboard consume los siguientes endpoints:

- /api/products
- /api/users

## Ejecución del Dashboard

El dashboard se encuentra en una carpeta independiente dentro del proyecto.

Para ejecutarlo:

- cd dashboard
- npm install
- npm run dev


## Base de datos

El proyecto utiliza MySQL con Sequelize.

El modelo entidad-relación se encuentra en:
database/der/DER_Ecommerce


