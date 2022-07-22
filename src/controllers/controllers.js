import { obtenerUsuarioporUsername, actualizarUsuario } from '../contenedores/contendorPersonasMongoDB.js';
import { crearCarrito } from '../scripts/create&assignatr.js';
import enviarEmail from '../mensajes/mailTransporter.js';
import { result } from '../../router/routerLogin.js';
import { logger } from '../loggers/loggers.js';

//Controllers
export const controladorSuccesRegister = async function (req, res) {
    const usuario = await obtenerUsuarioporUsername(req.session.passport.user);
    const idCarr = await crearCarrito();
    await actualizarUsuario(req.session.passport.user, idCarr);
    await enviarEmail({ email: process.env.USER_EMAIL, password: process.env.TOKEN_EMAIL }, usuario.username, `Nuevo registro`, `<p>Hola!<br> 
    Queremos informarte que el usuario ${req.session.passport.user} se dio de alta en nuestros servicios!<br>
    Saludos</p>`);
    logger.info(`Nuevo usuario registrado: ${usuario.username}`)
    logger.warn(`Nuevo usuario registrado: ${usuario.username}`)
    res.json({ status: "ok", name: `${req.session.passport.user}`, usuario: usuario });
};
export const controladorFailRegister = (req, res) => {
    logger.error(`Registro fallido: ${result.msg}`)
    res.json({ status: "error", msg: `Registro fallido ${result.msg}` });
};
export const controladorSuccessLogin = async function (req, res) {
    const usuario = await obtenerUsuarioporUsername(req.session.passport.user.username);
    logger.info(`El usuario registrado: ${usuario.username} ha iniciado sesion`)
    logger.warn(`El usuario registrado: ${usuario.username} ha iniciado sesion`)
    res.json({ status: "ok", name: `${req.session.passport.user.username}`, usuario: usuario });
};
export const controladorFailLogin = function (req, res) {
    logger.info(`Fallo el inicio de sesion`)
    res.json({ status: "error", msg: `Login fallido --> ${result.msg}` });
};
export const controllerLogStatus = async (req, res) => {
    const usuario = await obtenerUsuarioporUsername(req.session.passport.user.username || req.session.passport.user);
    res.json({ status: "ok", name: `${req.session.passport.user.username || req.session.passport.user}`, usuario: usuario });
};
export const controladorLogout = async (req, res) => {
    if (req.isAuthenticated()) {
        const usuario = await obtenerUsuarioporUsername(req.session.passport.user.username || req.session.passport.user)
        req.logout(function (err) {
            if (err) { return next(err); }
        });
        res.json(`Hasta pronto ${usuario.nombre}`);
    }
    else {
        res.json(`Usuario no logueado`);
    }
};
