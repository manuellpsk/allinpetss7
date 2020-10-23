const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helprs = require('../lib/helpers');

passport.use('local.singin', new LocalStrategy({
    usernameField: 'rut',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, rut, password, done) => {
    const rows = await pool.query('SELECT * FROM Usuarios WHERE rut=?', [rut]);
    if (rows.length > 0) {
        const user = rows[0];
        if (user.activo != 0) {
            const validPassword = await helprs.matchPassword(password, user.password);
            if (validPassword) {
                done(null, user);
            } else {
                done(null, false);
            }
        } else {
            done(null, false);
        }
    } else {
        return done(null, false);
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