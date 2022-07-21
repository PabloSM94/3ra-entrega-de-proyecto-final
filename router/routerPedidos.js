import express  from 'express'
import { buscarCarritodeUsuario, guardarCarritoenBDPedidos, eliminoProductosdeCarrito, generarMensaje } from '../src/scripts/create&assignatr.js'
import enviarEmail from '../src/mensajes/mailTransporter.js'
import {enviarWhatsapp} from '../src/mensajes/whatsappTransporter.js'
import { enviarSMS } from '../src/mensajes/smsTransporter.js'
import contenedorCarrito from '../src/daos/carritosDAO.js'
const { Router } = express
const routerPedidos = Router()


routerPedidos.post('/finalizarPedido', async (req,res) =>{
    const usuario = (req.session.passport.user.username || req.session.passport.user)
    const {carrito, idCarr, user} = await buscarCarritodeUsuario(usuario)
    const pedido = await guardarCarritoenBDPedidos(carrito,user)
    await eliminoProductosdeCarrito(idCarr)
    const mensaje = await generarMensaje(pedido)
    const asunto = `Nuevo pedido de ${pedido.usuario.username} ${pedido.nropedido}`
    enviarEmail({ email: process.env.USER_EMAIL, password: process.env.TOKEN_EMAIL }, usuario.username, asunto , `${mensaje}`)
    enviarWhatsapp(process.env.ADM_CEL, asunto)
    enviarSMS(pedido.usuario.username.tel, asunto)
    res.json(`Se genero el pedido ${pedido.nropedido} por un total de $ ${pedido.total}`)
}
)

routerPedidos.delete('/eliminarProducto/:id', async (req, res) => {
    const usuario = (req.session.passport.user.username || req.session.passport.user)
    const {carrito, idCarr, user} = await buscarCarritodeUsuario(usuario)
    const idProducto = req.params.id
    const resultado = await contenedorCarrito.borrarObjetoN(idCarr,"productos",idProducto)
    res.json('Se borro el producto deseado')
})


export {routerPedidos}