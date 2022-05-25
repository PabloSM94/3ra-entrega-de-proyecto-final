// El router base '/api/productos' implementará cuatro funcionalidades:

import express  from 'express'
const { Router } = express
import fs from 'fs'

const app = express()
const routerP = Router()
import {carrito} from '../public/js/clasesProdyCarr.js'
import {producto} from '../public/js/clasesProdyCarr.js'
import { isObjEmpty } from '../public/js/clasesProdyCarr.js'
import contenedorProducto from '../src/daos/productosDAO.js'


// GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)
routerP.get('/productos/:id?', (req, res) => {
    const {params} = req
    console.log(params.id)
    if(params.id){
        contenedorProducto.obtenerObjetosxId(params.id)
        .then(resultado => res.json(resultado))
    }
    else{
        contenedorProducto.obtenerObjetosxId()
        .then(resultado => res.json(resultado))
    }
    
 })
// POST: '/' - Para incorporar productos al listado (disponible para administradores)

routerP.post('/productos/', (req, res) => {
    //permiso de administrador 
    const admin = true
    if (admin){
        console.log("modo administrador")
        const {body} = req
        
        const nuevoProd = new producto (body.nombre,body.descripcion,body.codigo,body.thumbnail,body.precio,body.stock)
        contenedorProducto.asignarId(nuevoProd)
        .then(result => {
            contenedorProducto.guardar(nuevoProd)
        })
        
        res.redirect("/")

    }
    else{
        res.send(`Debes logearte como administrador`)
    }
})

// PUT: '/:id' - Actualiza un producto por su id (disponible para administradores)

routerP.put('/productos/:id', (req, res) => {
    //permiso de administrador 
    const admin=true
    if (admin){
        const {params} = req
        const {body} = req
        let flag = 0;
        //Modificacion de campos 
        contenedorProducto.obtenerObjetos()
        .then (data =>{
            const productos = JSON.parse(data)
            return productos
        })
        .then (productos => {
            for (let product of productos){
                if (product.id == parseInt(params.id)){
                    //Ejecuto modificaciones
                    if (isObjEmpty(body.nombre)){
                    }else{product.nombre = body.nombre}
                    if (isObjEmpty(body.descripcion)){
                    }else{product.descripcion = body.descripcion}
                    if (isObjEmpty(body.codigo)){
                    }else{product.codigo = body.codigo}
                    if (isObjEmpty(body.thumbnail)){
                    }else{product.thumbnail = body.thumbnail}
                    if (isObjEmpty(body.precio)){
                    }else{product.precio = body.precio}
                    if (isObjEmpty(body.stock)){
                    }else{product.stock = body.stock}
                    contenedorProducto.guardarenObj(product)
                    flag = 1
                }
            }
            if (flag == 1){
                res.json(JSON.stringify({ "status": `ok`,"msg":`Se modifico el producto`}))
            }
            else{
                res.json(JSON.stringify({ "status": `error404${params.id}`,"msg":`Error! el id: ${params.id} no se encuentra en la base de datos`}))
            }
        })
        

        console.log("login ok")
    }
    else{
        res.send(`Debes logearte como administrador`)
    }
})

// DELETE: '/:id' - Borra un producto por su id (disponible para administradores)
routerP.delete('/productos/:id', (req, res) => {
    //permiso de administrador 
    const admin=true
    if (admin){
        console.log("login ok")
        const {params} = req
        contenedorProducto.borrar(params.id)
        .then (result => res.json(result))
    }
    else{
        res.send(`Debes logearte como administrador`)
    }
})
export {routerP, contenedorProducto}
 
 