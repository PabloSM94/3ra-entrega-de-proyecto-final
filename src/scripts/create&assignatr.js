import {carrito} from './clasesProdyCarr.js'
import contenedorCarrito from '../../src/daos/carritosDAO.js'
import {obtenerUsuarioporUsername} from '../contenedores/contendorPersonasMongoDB.js'
import {guardarPedido,vaciarCarrito} from '../contenedores/contendorPedidos.js'
import { routerPedidos } from '../../router/routerPedidos.js'
import Handlebars from 'handlebars'


async function crearCarrito(){
    const nuevoCarrito = new carrito(new Date().toLocaleString(),[])
    const result = await contenedorCarrito.asignarId(nuevoCarrito)
    await contenedorCarrito.guardar(nuevoCarrito)
    return (nuevoCarrito.id)
}

async function buscarCarritodeUsuario(usuario){
    const user = await obtenerUsuarioporUsername(usuario)
    const carrito = await contenedorCarrito.buscarObjetos(user.idCarr,"productos")
    return ({carrito: JSON.parse(carrito),idCarr: user.idCarr,user: user})
}

async function guardarCarritoenBDPedidos(carrito,user){
    let pedido = {productos: [] ,nropedido: "",};
    let montoTotal = 0;
    for(let prod of carrito){
        pedido.productos.push(prod)
        montoTotal = parseInt(montoTotal) + (parseInt(prod.cantidad) * parseInt(prod.precio))
    }
    pedido.nropedido = Date.now()
    pedido.usuario = user
    pedido.total = montoTotal
    await guardarPedido(pedido)
    return pedido
}

async function eliminoProductosdeCarrito(id){
    //console.log("eliminar id ",id)
    await vaciarCarrito(id)
}

async function generarMensaje(pedido){
    const renderTablaProd = Handlebars.compile(
        `<h1>Se generó un nuevo pedido</h1>
        <br> 
        <p>Queremos informarte que el usuario ${pedido.usuario.username} ha generado el pedido numero ${pedido.nropedido}
        <br>
        Detalle del pedido:
        <br>
        <table>
                        <thead>
                            <tr>
                            <th scope="col">Producto</th>
                            <th scope="col">Precio Unitario</th>
                            <th scope="col">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{#each productos}}
                            <tr>
                            <th scope="row">{{this.nombre}}</th>
                            <td> $ {{this.precio}}</td>
                            <td>{{this.cantidad}}</td>
                            </tr>
                            {{/each}}
                        </tbody>
        </table>
        <br>
        Total del pedido $ ${pedido.total}
        <br>
        Saludos</p>`
    )
    const mensaje = renderTablaProd({
        productos: pedido.productos
    })
    return `${mensaje}`
}

export {crearCarrito, buscarCarritodeUsuario, guardarCarritoenBDPedidos, eliminoProductosdeCarrito, generarMensaje}
