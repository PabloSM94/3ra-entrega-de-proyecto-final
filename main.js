import express from 'express'
import router from './router/routerCarrito.js'
import {routerP} from './router/routerProductos.js'

const app = express()

//Extension para que Express reconozca los body
app.use(express.urlencoded({extended: true})) //Formularios
app.use(express.json()) //JSON

app.use('/api', router)
app.use('/api', routerP)
app.use(express.static('./public/'))

const PORT = 8080
const server = app.listen(PORT, ()=>{
    console.log(`Servidor HTTP escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

