const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helprs = require('./helpers');

passport.use('local.login', new LocalStrategy({
    usernameField: 'rut',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req,  rut, password, done) => {
    try {
        const rows = await pool.query('SELECT * FROM Usuarios WHERE rut=?', [rut]);
        if (rows.length > 0) {
            const user = rows[0];
            if (user.activo != 0) {
                const validPassword = await helprs.matchPassword(password, user.password);
                if (validPassword) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } else {
                return done(null, false);
            }
        } else {
            return done(null, false);
        }
    } catch (e) {
        console.log('error en passport')
        return done(e)
    }
}));

passport.serializeUser((user, done) => {
    console.log('passport Serializando...')
    done(null, user.idUsuarios);
});

passport.deserializeUser(async (idUsuarios, done) => {
    console.log('passport Deserealizando')
    try {
        const rows = await pool.query('SELECT * FROM Usuarios WHERE idUsuarios = ?', [idUsuarios]);
        done(null, rows[0]);

    } catch (error) {
        console.log('error al deserializar');
    }
});