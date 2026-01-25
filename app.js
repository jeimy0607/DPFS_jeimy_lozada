var createError = require('http-errors');
var express = require('express');
//sequelize para conectar la BD
require("./database/models");
const { sequelize } = require("./database/conexion");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const cors = require('cors');


const sessionStore = new SequelizeStore({
  db: sequelize,
});


var indexRouter = require('./routes/indexRuta');
var usersRouter = require('./routes/usersRuta');
//Ruta Productos
var productoRouter = require('./routes/productoRuta');
//Ruta Carrito
var carritoRouter = require('./routes/carritoRuta');
//Ruta Login
var loginRouter = require('./routes/loginRuta');
//Ruta registro
var registroRouter = require('./routes/registroRuta');
//Ruta del buscador
var busquedaRuta = require('./routes/busquedaRuta');
//Ruta de recuperacion-usuario
var recuperarRouter = require("./routes/recuperarRuta");

//API-DASBOARD
var productsApiRoutes = require('./routes/api/products');
var usersApiRoutes = require('./routes/api/users');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/buscar', (req, res) => {
  const termino = req.query.q;

  // Aquí procesas los resultados
  res.render('resultados', { termino });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || "productos",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
  }
}));

sessionStore.sync();

app.use(cors());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

//funcion que agrega un eslabon a request y response
//Locals queda con la información para que se pueda mostrar en las vistas
app.use(function(req, res, next){
  

  if(req.session.ultimoProducto !== undefined){

    res.locals.ultimoProducto = req.session.ultimoProducto

  }

  return next()
})


//---USO DE RUTAS---
app.use('/', indexRouter);
app.use('/users', usersRouter);
//uso de ruta productos
app.use('/producto', productoRouter);
//uso de ruta carrito
app.use('/carrito', carritoRouter);
//Uso de ruta login
app.use('/login', loginRouter);
//Uso de ruta registro
app.use('/registro', registroRouter);
//Uso de ruta de busqueda
app.use('/buscador', busquedaRuta);
//uso de ruta recuperacion
app.use("/recuperarcontrasena", recuperarRouter);

//API-DASBOARD
app.use('/api/products', productsApiRoutes);
app.use('/api/users', usersApiRoutes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});




// prueba de conexión a MySQL
sequelize.authenticate()
  .then(() => console.log("✅ Conectado a MySQL"))
  .catch(err => console.error("❌ Error de conexión:", err.message));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server ON en http://localhost:${PORT}`);
}); 


module.exports = app;
