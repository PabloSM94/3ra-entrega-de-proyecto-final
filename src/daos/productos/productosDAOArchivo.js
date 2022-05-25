import ContenedorArchivo from "../../contenedores/contenedorArchivo.js";

class ProductosDAOArchivo extends ContenedorArchivo{
    constructor(rutaDir){
        super(`${rutaDir}/productos.txt`)
    }
}

export default ProductosDAOArchivo