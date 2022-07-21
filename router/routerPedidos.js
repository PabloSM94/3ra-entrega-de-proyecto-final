import express  from 'express'
import { buscarCarritodeUsuario, guardarCarritoenBDPedidos, eliminoProductosdeCarrito, generarMensaje } from '../src/scripts/create&assignatr.js'
import enviarEmail from '../src/mensajes/mailTransporter.js'
import {enviarWhatsapp} from '../src/mensajes/whatsappTransporter.js'
//import { enviarSMS } from '../src/mensajes/smsTransporter.js'
import contenedorCarrito from '../src/daos/carritosDAO.js'
const { Router } = express
const routerPedidos = Router()

function controladorBorrarProd() {
    return async (req, res) => {
        const usuario = (req.session.passport.user.username || req.session.passport.user)
        const { carrito, idCarr, user } = await buscarCarritodeUsuario(usuario)
        const idProducto = req.params.id
        const resultado = await contenedorCarrito.borrarObjetoN(idCarr, "productos", idProducto)
        res.json('Se borro el producto deseado')
    }
}

function controladorPedidos() {
    return async (req, res) => {
        const usuario = (req.session.passport.user.username || req.session.passport.user)
        const { carrito, idCarr, user } = await buscarCarritodeUsuario(usuario)
        const pedido = await guardarCarritoenBDPedidos(carrito, user)
        await eliminoProductosdeCarrito(idCarr)
        const mensaje = await generarMensaje(pedido)
        const asunto = `Nuevo pedido de ${pedido.usuario.username} ${pedido.nropedido}`
        const mensajeUsuario = `Hola! Tu pedido ${pedido.nropedido} esta siendo procesado, nos contactaremos a ${pedido.usuario.username} a la brevedad para comentarte los pasos a seguir. Deberas abonar $ ${pedido.total}. Gracias`
        await enviarEmail({ email: process.env.USER_EMAIL, password: process.env.TOKEN_EMAIL }, usuario.username, asunto, `${mensaje}`)
        const mjadm = await enviarWhatsapp(process.env.ADM_CEL, asunto)
        const mjusr = await enviarWhatsapp(pedido.usuario.wapp, mensajeUsuario)
        //enviarSMS(pedido.usuario.username.tel, asunto)  --> Se reemplaza por whatsapp
        res.json(`Se genero el pedido ${pedido.nropedido} por un total de $ ${pedido.total} y se ha enviado un Whatsapp con la informacion del mismo.`)
    }
}

routerPedidos.post('/finalizarPedido', controladorPedidos())

routerPedidos.delete('/eliminarProducto/:id', controladorBorrarProd())


export {routerPedidos}