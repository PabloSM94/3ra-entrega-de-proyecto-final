import express from 'express'
import { routerC } from './router/routerCarrito.js'
import { routerP } from './router/routerProductos.js'
import { routerLog } from './router/routerLogin.js'
import { routerPedidos } from './router/routerPedidos.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import 'dotenv/config'
import cluster from 'cluster'
import os from 'os'
import { logger } from './src/loggers/loggers.js' 

const app = express()
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const numCPUs = os.cpus().length

//Extension para que Express reconozca los body
app.use(express.urlencoded({ extended: true })) //Formularios
app.use(express.json()) //JSON


app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${process.env.USER_BD}:${process.env.PASS_BD}@clusterpm.2bebn.mongodb.net/sessions`,
        mongoOptions: advancedOptions
    }),
    secret: 'mongoAtlasSecret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 100000,

    }
}))

app.use(express.static('./public/'))

app.use('/api', routerC)
app.use('/api', routerP)
app.use('/api', routerLog)
app.use('/api', routerPedidos)

const PORT = process.env.PORT || 8080
// const server = app.listen(PORT, ()=>{
//     console.log(`Servidor HTTP escuchando en el puerto ${server.address().port}`)
// })
// server.on("error", error => console.log(`Error en servidor ${error}`)
// )

if (process.env.MODO == "CLUSTER") {
    logger.info("servidor ... en modo CLUSTER")
    if (cluster.isPrimary) {
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }
        cluster.on('exit', (worker, code, signal) => {
            logger.info(`${worker.process.pid} died`)
        })
    } else {
        const server = app.listen(PORT, () => {
            logger.info(`Servidor HTTP escuchando en el puerto ${server.address().port}`)
        })
        server.on("error", error => console.log(`Error en servidor ${error}`)
        )
        logger.info(`${process.pid} started`)
    }
    
}
else {
    const server = app.listen(PORT, () => {
        logger.info(`Servidor HTTP escuchando en el puerto ${server.address().port}`)
    })
    server.on("error", error => console.log(`Error en servidor ${error}`)
    )
    logger.info("servidor creado en modo FORK")
}