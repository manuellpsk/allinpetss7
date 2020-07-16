const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helprs = require('../lib/helpers');

passport.use('local.singin', new LocalStrategy({
    usernameField: 'rutlogin',
    passwordField: 'passwordlogin',
    passReqToCallback: true,
}, async (req, rutlogin, passwordlogin, done) => {
    const rows = await pool.query('SELECT * FROM Usuarios WHERE rut=?', [rutlogin]);
    if (rows.length > 0) {
        const user = rows[0];
        if (user.activo != 0) {
            const validPassword = await helprs.matchPassword(passwordlogin, user.password);
            if (validPassword) {
                done(null, user, req.flash('success', 'Bienvenido ' + user.nombre));
            } else {
                done(null, false, req.flash('message', 'Credenciales Incorrectas'));
            }
        } else {
            done(null, false, req.flash('message', 'Credenciales Incorrectas'));
        }
    } else {
        return done(null, false, req.flash('message', 'Credenciales Incorrectas'));
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.idUsuarios);
});

passport.deserializeUser(async (idUsuarios, done) => {
    try {
        const rows = await pool.query('SELECT * FROM Usuarios WHERE idUsuarios = ?', [idUsuarios]);
        done(null, rows[0]);

    } catch (error) {
        console.log('error al deserializar');
    }
});