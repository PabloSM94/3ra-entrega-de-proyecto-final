class producto {
    constructor (nombre, descripcion, codigo, thumbnail, precio, stock){
        this.timestamp = new Date().toLocaleString()
        this.nombre = nombre
        this.descripcion = descripcion
        this.codigo = codigo
        this.thumbnail = thumbnail
        this.precio = precio
        this.stock = stock
    }
}

class carrito {
    constructor (timestamp, productos){
        this.timestamp = timestamp
        this.productos = productos
    }
}

//Comprobacion de conjuntos vacios
function isObjEmpty(obj) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
  
    return true;
  }


export {producto,carrito,isObjEmpty}