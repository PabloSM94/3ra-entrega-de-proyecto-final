import ContenedorMongo from "../../contenedores/contenedorMongoDB.js"

class CarritosDAOMongo extends ContenedorMongo{
    constructor() {
        super('carritos', {
            timestamp: { type: String, required: true },
            productos: { type: Array, required: true },
            id: { type: Number, required: true },
        })
    }
}


export default CarritosDAOMongo