
function mostrarProductos(input) {

    if (input.length == 0) {
        const renderTabla = Handlebars.compile(`<div class="alerta alert alert-warning" role="alert">
        No existen productos cargados
      </div>`)
        document.getElementById("listaProd").innerHTML = renderTabla()
    } else {
        const renderTabla = Handlebars.compile(`
        <h2>Listado de productos</h2>
        <div id="cartasHTML" class="cards grid row text-dark">
        {{#each productos}}
            <div class="card" style="width: 18rem; margin: 5px" >
                <img class="card-img-top" src="{{this.thumbnail}}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">{{this.nombre}}</h5>
                    <p class="card-text">{{this.descripcion}}</p>
                    <p class="card-text">$ {{this.precio}}</p>
                    <div>
                    <label for="cantidad">Cantidad</label>
                    <input type="number" required="required" min="1" class="inputsCards col-auto me-auto" style="margin: 5px;" id="ndCarrito{{this.id}}" name="cantidad" value="1"></input>
                    </div>
                    <button id="bdProd{{this.id}}" class="botonCards btn btn-primary">Agregar al carrito</button>
                </div>
            </div>
        {{/each}}
        </div>
        `)
        document.getElementById("listaProd").innerHTML = renderTabla({
            productos: input
        })
    }
}

function generoVistadeProductos() {
    fetch(`/api/productos/`, { method: "get" })
        .then(res => res.json())
        .then(data => {
            const productos = JSON.parse(data)
            let idsDisponibles = []
            for (let elements of productos) {
                idsDisponibles.push({ "id": elements.id, "nombre": elements.nombre })
            }
            let idsOrdenados = idsDisponibles.sort(function (a, b) { return a - b })


            return [productos, idsOrdenados]
        }
        )
        .then(([productos, idsOrdenados]) => {

            const renderForm = Handlebars.compile(`
            <h2>Buscar productos</h2>
            <div class="row row-cols-lg-auto">
                <div style="padding-top: 9px; padding-left: 17px;"> 
                <h6>Buscar producto:</h6> 
                </div>
    
                <div>
                <select class="form-control" id="seleccion">
                {{#each id}}
                <option value="{{this.id}}">{{this.nombre}}</option>
                {{/each}}
                <option value="">Todos</option>
                </select>
                </div>
                
                <div>
                <button id="verProd" class="btn btn-primary">Ver</button>
                </div>
                <div id="listaProd"></div>
            </div>
            `)
            document.getElementById("productos").innerHTML = renderForm({ id: idsOrdenados })
            return
        })
        .then(() => {
            const solicitarProducto = document.getElementById("verProd")
            solicitarProducto.addEventListener("click", e => {
                e.preventDefault()
                const inputIDelement = document.getElementById("seleccion").value
                fetch(`/api/productos/${inputIDelement}`, { method: "get" })
                    .then(res => res.json())
                    .then(data => {
                        let productos;
                        if (inputIDelement === "") {
                            productos = JSON.parse(data)
                        } else {
                            productos = [JSON.parse(data)]
                        }
                        mostrarProductos(productos)
                        return productos
                    })
                    .then((productos) => {
                        //console.log(productos)
                        const cartas = document.getElementsByClassName("botonCards")

                        //console.log(cartas)
                        for (let i = 0; cartas.length; i++) {
                            cartas[i].addEventListener("click", e => {
                                //console.log(`se hizo click en ${cartas[i].id}`)
                                const idProd = parseInt((cartas[i].id).substring(6, 7))
                                //console.log(idProd)
                                const cantidad = document.getElementById(`ndCarrito${idProd}`)
                                //console.log("se debe agregar al carrito")
                                //console.log(parseInt(`${idagregaraCarrito.value}`))
                                const cantidadAg = cantidad.value
                                let iddeCarrito;
                                fetch('/api/logStatus')
                                    .then(res => res.json())
                                    .then(data => {
                                        //console.log(data)
                                        if (data.status == "ok") {
                                            iddeCarrito = data.usuario.idCarr
                                        } else {
                                            iddeCarrito = false
                                        }

                                        const postID = { id: idProd, cantidad: cantidadAg }
                                        //console.log(iddeCarrito)
                                        if (iddeCarrito) {
                                            fetch(`/api/carrito/${iddeCarrito}/productos`,
                                                {
                                                    method: "POST",
                                                    body: JSON.stringify(postID),
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    }
                                                })
                                                .then(res => res.json())
                                                .then(data => {
                                                    //console.log(data)
                                                    const mensajes1 = JSON.parse(data)
                                                    alert(`${mensajes1.msg}`)
                                                })
                                        } else {
                                            alert("Por favor, inicie sesion para agregar productos al carrito")
                                        }
                                    })

                            })
                        }



                    })
            })

        })
}

function deslogeo(){
    fetch('/api/logout')
        .then(res => res.json())
        .then(data => {
            alert(data)
            location.reload("/")
        })
}

function generoVistaCarrito(){
    fetch('/api/logStatus')
    .then(res => res.json())
    .then(data => {
        let iddeCarrito;
        let nombre;
        if (data.status == "ok") {
            iddeCarrito = data.usuario.idCarr
            nombre = data.usuario.nombre
        } else {
            iddeCarrito = false
        }
        if (iddeCarrito) {
            fetch(`/api/carrito/${iddeCarrito}/productos`)
                .then(res => res.json())
                .then(data => { 
                    const productosdecarrito = JSON.parse(data)
                    let i = 1;
                    for (let elements of productosdecarrito){
                        elements.total = elements.precio * elements.cantidad
                        elements.posicion = i
                        i++
                    }
                    let total = 0;
                    for (let elements of productosdecarrito){
                        total += elements.total
                    }
                    const renderProdCarr = Handlebars.compile(`
                    <h1>Productos de carrito de ${nombre}</h1>
                    <button id="refreshCarrito" class="botonCards btn btn-primary">Actualizar carrito con cantidades</button>
                    <button id="finalizarPedido" class="botonCards btn btn-primary">Finalizar pedido</button>
                    <table class="table table-dark">
                    <thead>
                        <tr>
                        <th scope="col">Producto</th>
                        <th scope="col">Precio Unitario</th>
                        <th scope="col">Foto</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Total Producto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{#each productos}}
                        <tr>
                        <th scope="row">{{this.nombre}}</th>
                        <td> $ {{this.precio}}</td>
                        <td><img src="{{this.thumbnail}}" alt="Card image cap" width="50px" height="50px"></td>
                        <td><input type="number" required="required" min="1" class="col-auto me-auto" style="margin: 5px;" id="producto{{this.posicion}}" name="cantidad" value="{{this.cantidad}}"></input><button id="producto{{this.id}}" class="botonTabla btn btn-danger">Eliminar</button></td>
                        <td> $ {{this.total}}</td>
                        </tr>
                        {{/each}}
                    </tbody>
                    </table>
                    <div>Total $ ${total}</div>
                    
                    
            `)
            document.getElementById("productos").innerHTML = renderProdCarr({
                productos: productosdecarrito
            })
            document.getElementById("botonDerecho").innerHTML = `<button id="botonProductos" class="btn btn-info" style="margin: 5px;">Ir a productos</button>`
            const botonProductos = document.getElementById("botonProductos")
            botonProductos.addEventListener("click",e=>{
                e.preventDefault()
                location.reload("/")
            })
            const refreshCarrito = document.getElementById("refreshCarrito")
            refreshCarrito.addEventListener("click",e=>{
                e.preventDefault()
                alert("Funcion temporalmente indisponible, borre el producto e ingrese nuevamente la cantidad reingresando el producto")
            })
            const botonFinalizar = document.getElementById("finalizarPedido")
            botonFinalizar.addEventListener("click",e=>{
                e.preventDefault()
                fetch(`/api/finalizarPedido`,
                                                {
                                                    method: "POST",
                                                    // body: JSON.stringify(postID),
                                                    // headers: {
                                                    //     'Content-Type': 'application/json'
                                                    // }
                                                }
                )
                    .then(res => res.json())
                    .then(data => {
                        alert(data)
                        location.reload("/")}
                    )
                
            })
            const botonTabla = document.getElementsByClassName("botonTabla")
            for (let n=0;n<productosdecarrito.length;n++){
                botonTabla[n].addEventListener("click",e=>{
                    e.preventDefault()
                    const idProducto = (botonTabla[n].id).substring(8,10)
                    fetch(`/api/eliminarProducto/${idProducto}`,{
                        method: "DELETE"
                    })
                    .then(res => res.json())
                    .then(data => {
                        alert(data)
                        location.reload("/")
                    })
                })
            }
            
            
        })
            
            
        } else {
            alert("Por favor, inicie sesion para agregar productos al carrito")
        }
    })
}

function generoVistaHome(usuario) {
    const renderForm = Handlebars.compile(`
    <h1>API de Productos - Bienvenido/a </h1>
    <div>
    <nav class="navbar bg-dark">
    <div class="container">
      
        <img src="${usuario.foto}" alt="Avatar" width="75" height="75" class="d-inline-block align-text-top">
        ${usuario.nombre}
        <br>
        ${usuario.username}
        <br>
        ${usuario.tel}
        <br>
      
      <button id="botonAvatar" class="btn btn-success">Cambiar foto</button>
    </div>
    </nav>    


    </div>
    <div id="botonesdeAccesos" class="flex row">
    <div class="col-auto me-auto" style="margin: 5px;" id="login">
    <button id="botonLogout" class="btn btn-danger">Logout</button>  
    </div>
    <div class="col-auto" id="botonDerecho">
    <button id="botonCarrito" class="btn btn-info" style="margin: 5px;">Carrito</button>
    </div>
    </div>
    <div id="productos">
    </div>
    `)
    document.getElementById("principalMain").innerHTML = renderForm({})
    generoVistadeProductos()

    const botonLogout = document.getElementById("botonLogout")
    const botonCarrito = document.getElementById("botonCarrito")

    botonLogout.addEventListener("click",e=>{
        e.preventDefault()
        deslogeo()
    })

    botonCarrito.addEventListener("click",e=>{
        e.preventDefault()
        generoVistaCarrito()
    })

    const botonAvatar = document.getElementById("botonAvatar")
    botonAvatar.addEventListener("click",e=>{
        e.preventDefault()
        fetch('/api/logStatus')
        .then(res => res.json())
        .then(data => {
            if(data.status == "ok"){
                location.replace("/crearAvatar.html")
            }else{
                alert("La sesion ha expirado")
                location.reload("/")
            }
        }
        )
        
    })

}

export { generoVistaHome }