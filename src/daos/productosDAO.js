let contenedorProducto;

switch (process.env.VARENT){
    case 'mem':
        const {default: ProductosDAOMemoria} = await import ('./productos/productosDAOMemoria.js')
        contenedorProducto = new ProductosDAOMemoria()
        break
    case 'arch':
        const {default: ProductosDAOArchivo} = await import ('./productos/productosDAOArchivo.js')
        contenedorProducto = new ProductosDAOArchivo('./public')
        break
    case 'mongo':
        const {default: ProductosDAOMongo} = await import ('./productos/productosDAOMongo.js')
        contenedorProducto = new ProductosDAOMongo()
        break
    case 'firebase':
        const {default: ProductosDAOFirebase} = await import ('./productos/productosDAOFirebase.js')
        contenedorProducto = new ProductosDAOFirebase()
        break
}

export default contenedorProducto