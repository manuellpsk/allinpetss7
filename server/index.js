//dependencias
const express = require('express');
const path = require('path')
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config({
    path: path.join(__dirname, '.env')
});
/* 
const { database } = require('./keys');
const auth = require('./lib/auth').default;
const path = require('path');
const session = require('cookie-session')
const flash = require('connect-flash');
//const session = require('express-session');
const MysqlStore = require('express-mysql-session'); */

//inicializacion
const app = express();
require('./lib/passport');
//configuracion del servidor de express
app.set('port', process.env.PORT || 4000);
//middlewares: mostrar las peticiones que llegan al servidor. aceptar datos del formulario
/* app.use(session({
    secret: 'allinpetssession',
    resave: true,
    saveUninitialized: true,
    store: new MysqlStore(database)
})); */
//app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())
app.use(passport.initialize());
//Variable globales solicitudes, respuesta
/* app.use((req, res, next) => {
    app.locals.user = req.user;
    next();
}); */
//rutas
app.use(require('./routes')); //al iniciar la pagina ejecutará esta linea /routes/index.js
app.use('/perfil', require('./routes/perfil'));
app.use('/chat', require('./routes/chat'));

//middleware para error 500
app.use((error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: `Ha ocurrido un error FATAL en la ruta ${req.originalUrl}`,
        stack: error.message
    });
});
//start server
app.listen(app.get('port'), () => {
    console.log('Server On, puerto:', app.get('port'));
});
