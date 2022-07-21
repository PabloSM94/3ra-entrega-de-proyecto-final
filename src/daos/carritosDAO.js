import 'dotenv/config'
let contenedorCarrito;

switch (process.env.VARENT){
    case 'mem':
        const {default: CarritoDAOMemoria} = await import ('./carritos/carritosDAOMemoria.js')
        contenedorCarrito = new CarritoDAOMemoria()
        break
    case 'arch':
        const {default: CarritoDAOArchivo} = await import ('./carritos/carritosDAOArchivo.js')
        //console.log(CarritoDAOArchivo)
        contenedorCarrito = new CarritoDAOArchivo('./public')
        break
    case 'mongo':
        const {default: CarritosDAOMongo} = await import ('./carritos/carritosDAOMongo.js')
        contenedorCarrito = new CarritosDAOMongo()
    break
    case 'firebase':
        const {default: CarritosDAOFirebase} = await import ('./carritos/carritosDAOFirebase.js')
        contenedorCarrito = new CarritosDAOFirebase()
    break
}

export default contenedorCarrito