// El router base '/api/carrito' implementará tres rutas disponibles para usuarios y administradores:

import express  from 'express'
const { Router } = express
import fs from 'fs'

const app = express()
const router = Router()
import {carrito} from '../public/js/clasesProdyCarr.js'
import {producto} from '../public/js/clasesProdyCarr.js'
import contenedorCarrito from '../src/daos/carritosDAO.js'
import { contenedorProducto } from './routerProductos.js'


// POST: '/' - Crea un carrito y devuelve su id.

router.post('/carrito', (req, res) => {
    const nuevoCarrito = new carrito(new Date().toLocaleString(),[])
    contenedorCarrito.asignarId(nuevoCarrito)
    .then(result => {res.send(result)
    contenedorCarrito.guardar(nuevoCarrito)}
    )

    console.log(contenedorCarrito.datos)
 })


// DELETE: '/:id' - Vacía un carrito y lo elimina.
router.delete('/carrito/:id', (req, res) => {
    const {params} = req    
    contenedorCarrito.borrar(params.id)
    .then(result =>{
        console.log(result)
        res.json(result)
    })
 })

// GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
router.get('/carrito/:id/productos', (req, res) => {
    const {params} = req
    contenedorCarrito.buscarObjetos(params.id,"productos")
    .then (result => res.json(result)) 
 })
// POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto

router.post('/carrito/:id/productos', (req, res) => {
    const {params} = req
    const {body} = req
    let carritos;
    contenedorCarrito.obtenerObjetos()
    .then(result => {
        console.log(`ok`,result)
        carritos = JSON.parse(result)
        contenedorCarrito.obtenerObjetosxId(params.id)
        .then(result => {
            console.log(result)
            //Agregar error por id de carrito inexistente
        let carrito = JSON.parse(result)
        contenedorProducto.obtenerObjetosxId(body.id)
        .then(result2=>{
            //Agregar error por id de producto inexistente
            for (let elem of carritos){
                if (elem.id == parseInt(params.id)){
                    elem.productos.push(JSON.parse(result2))
                    contenedorCarrito.guardarenObj(elem)
                    .then(resu => res.json(`{"msg":"producto agregado"}`))
                }
            }
            
            
        })
    })

    }
    )

    
 })

// DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto

router.delete('/carrito/:id/productos/:id_prod', (req, res) => {
    console.log("peticion de borrado")
    const {params} = req
    contenedorCarrito.borrarObjetoN(params.id,"productos",params.id_prod)
    .then(result => {
        console.log(result)
        res.json(result)})
 })


 //// Exportar ---- 

export default router