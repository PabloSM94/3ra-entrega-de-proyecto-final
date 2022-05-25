import ContenedorMongo from "../../contenedores/contenedorMongoDB.js"

class ProductosDAOMongo extends ContenedorMongo{
    constructor() {
        super('productos', {
            id: { type: Number, required: true },
            nombre: { type: String, required: true },
            descripcion: { type: String, required: true },
            codigo: { type: Number, required: true },
            thumbnail: { type: String, required: true },
            precio: { type: Number, required: true },
            stock: { type: Number, required: true },
        })
    }
}


export default ProductosDAOMongo