import ContenedorArchivo from "../../contenedores/contenedorArchivo.js";

class CarritoDAOArchivo extends ContenedorArchivo{
    constructor(rutaDir){
        super(`${rutaDir}/carritos.txt`)
    }
}

export default CarritoDAOArchivo