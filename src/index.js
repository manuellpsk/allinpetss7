const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MysqlStore = require('express-mysql-session');
const passport = require('passport');
const { database } = require('./keys');
const auth = require('./lib/auth');
const cors = require('cors');


//inicializacion
const app = express();
require('./lib/passport');

//configuracion del servidor de express
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');
//middlewares: mostrar las peticiones que llegan al servidor. aceptar datos del formulario
app.use(session({
    secret: 'allinpetssession',
    resave: true,
    saveUninitialized: true,
    store: new MysqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors())

//Variable globales solicitudes, respuesta
app.use((req, res, next) => {
    app.locals.user = req.user;
    next();
});

//rutas
app.use(require('./routes')); //al iniciar la pagina ejecutará esta linea /routes/index.js
app.use(require('./routes/authentication'));
app.use('/perfil', require('./routes/perfil'));

//public
app.use(express.static(path.join(__dirname, 'public')))

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
