const express= require('express');
const morgan= require('morgan');
const exphbs= require('express-handlebars');
const path= require('path');
//inicializacion
const app= express();

//configuracion del servidor de express
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//middlewares: mostrar las peticiones que llegan al servidor. aceptar datos del formulario
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Variable globales solicitus, respuesta
app.use((req, res, next)=>{
    
    next();
});

//rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

//public
app.use(express.static(path.join(__dirname,'public')))

//start server
app.listen(app.get('port'),()=>{
    console.log('Server On, puerto: ',app.get('port'));
});