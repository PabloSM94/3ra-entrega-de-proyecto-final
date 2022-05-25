import ContenedorFirebase from "../../contenedores/contenedorFirebase.js"

class ProductosDAOFirebase extends ContenedorFirebase{
    constructor() {
        super('productos')
    }
}


export default ProductosDAOFirebase