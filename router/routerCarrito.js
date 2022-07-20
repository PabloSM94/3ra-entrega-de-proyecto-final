// El router base '/api/carrito' implementará tres rutas disponibles para usuarios y administradores:

import express  from 'express'
const { Router } = express
import fs from 'fs'

const app = express()
const routerC = Router()
import {carrito} from '../src/scripts/clasesProdyCarr.js'
import {producto} from '../src/scripts/clasesProdyCarr.js'
import contenedorCarrito from '../src/daos/carritosDAO.js'
import { contenedorProducto } from './routerProductos.js'


// POST: '/' - Crea un carrito y devuelve su id.

routerC.post('/carrito', async (req, res) => {
    const nuevoCarrito = new carrito(new Date().toLocaleString(),[])
    const result = await contenedorCarrito.asignarId(nuevoCarrito)
    await contenedorCarrito.guardar(nuevoCarrito)
    res.json({nuevoCarrito})
 })


// DELETE: '/:id' - Vacía un carrito y lo elimina.
routerC.delete('/carrito/:id', (req, res) => {
    const {params} = req    
    contenedorCarrito.borrar(params.id)
    .then(result =>{
        //console.log(result)
        res.json(result)
    })
 })

// GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
routerC.get('/carrito/:id/productos', async (req, res) => {
    const {params} = req
    const result = await contenedorCarrito.buscarObjetos(params.id,"productos")
    res.json(result)
 })
// POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto

routerC.post('/carrito/:id/productos', (req, res) => {
    const {params} = req
    const {body} = req
    let carritos;
    let carrito;
    contenedorCarrito.obtenerObjetos()
    .then(result => {
        //console.log(`ok`,result)
        carritos = JSON.parse(result)
        contenedorCarrito.obtenerObjetosxId(params.id)
        .then(result => {
            // console.log(result)
            //Agregar error por id de carrito inexistente
        carrito = JSON.parse(result)
        contenedorProducto.obtenerObjetosxId(body.id)
        .then(result2=>{
            let existencia = false;
            const productoag = (JSON.parse(result2))
            //console.log('preagregar',carrito,productoag)
            for (let elem of carrito.productos){
                if (elem.id == body.id){
                    const cantidadActual = elem.cantidad
                    existencia = true
                    elem.cantidad = parseInt(cantidadActual) + parseInt(body.cantidad)
                }
            }
            if(!existencia){
                productoag.cantidad = parseInt(body.cantidad)
                carrito.productos.push(productoag)
            }else{

            }            
            //console.log(carrito)
            contenedorCarrito.guardarenObj(carrito)
                .then(resu => res.json(`{"msg":"producto agregado"}`))
                
            
              
        })
    })

    }
    )

    
 })

// DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto

routerC.delete('/carrito/:id/productos/:id_prod', (req, res) => {
    //console.log("peticion de borrado")
    const {params} = req
    contenedorCarrito.borrarObjetoN(params.id,"productos",params.id_prod)
    .then(result => {
        //console.log(result)
        res.json(result)})
 })


 //// Exportar ---- 

export {routerC}