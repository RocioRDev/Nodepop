// Aplicacion nodejs principal para el servidor
// Creado por: Rocio Romero

// Configuramos el entorno
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var mongoDB = require("./dbConnection");
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var anunciosRouter = require('./routes/anuncios');

var app = express();

// Conectamos a la base de datos
mongoDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configurar swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api-nodepop/apidoc.json');

// Uso de las rutas
// app.use('/apidocs/', express.static(path.join(__dirname, 'api-nodepop/venta-articulos.yaml')));
// Ruta principal
app.use('/', indexRouter);
// Ruta de usuarios
app.use('/users', usersRouter);
// Ruta de anuncios
app.use('/api/v1/anuncios', anunciosRouter);
// Ruta de la documentacion de la API
app.use('/apidoc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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

module.exports = app;
