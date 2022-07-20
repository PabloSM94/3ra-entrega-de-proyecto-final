function generoFormLogin() {
    const renderForm = Handlebars.compile(`
    <form>
    <div class="form-group">
      <label for="exampleInputEmail1">Email address</label>
      <input type="email" class="form-control" id="inputusername" aria-describedby="emailHelp" placeholder="Enter email">
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input type="password" class="form-control" id="inputpassword" placeholder="Password">
    </div>
    <button type="submit" id="botonLogin" class="btn btn-primary">Login</button>
    <button type="submit" id="botonSingUp" class="btn btn-primary">SignUp</button>
    </form>
    `)
    document.getElementById("cuerpo").innerHTML = renderForm({})
}


const camposRegistro = [
    { nombreCampo: "Email/Usuario", type: "text", name: "usernameNEW" },
    { nombreCampo: "Contraseña", type: "password", name: "passwordNEW" },
    { nombreCampo: "Nombre", type: "text", name: "nombre" },
    { nombreCampo: "Direccion", type: "text", name: "direccion" },
    { nombreCampo: "Edad", type: "number", name: "edad" },
    { nombreCampo: "Prefijo", type: "text", name: "prefijo" },
    { nombreCampo: "Telefono", type: "text", name: "telefono" },
    { nombreCampo: "Avatar/Foto", type: "file", name: "avatar" },
]

function generarFormRegister() {
    const renderForm = Handlebars.compile(`
    <form>
    <div class="form-row">
        <div class="form-group col-md-6">
        <label for="usernameNEW">Email</label>
        <input type="email" class="form-control" id="usernameNEW" placeholder="Email">
        </div>
        <div class="form-group col-md-6">
        <label for="passwordNEW">Password</label>
        <input type="password" class="form-control" id="passwordNEW" placeholder="Password">
        </div>
    </div>
    <div class="form-row">
        <div class="form-group col-md-6">
        <label for="inputnombre">Nombre</label>
        <input type="text" class="form-control" id="inputnombre" placeholder="Pablo">
    </div>
    <div class="form-row">
        <div class="form-group col-md-6">
        <label for="inputdireccion">Direccion</label>
        <input type="text" class="form-control" id="inputdireccion" placeholder="9 de Julio 1540">
    </div>
    <div class="form-row">
        <div class="form-group col-md-6">
        <label for="inputedad">Edad</label>
        <input type="number" class="form-control" id="inputedad" placeholder="25">
    </div>
    <div class="form-row">
        <div class="form-group col-md-6">
        <label for="inputprefijo">Prefijo</label>
        <input type="number" class="form-control" id="inputprefijo" placeholder="+54">
    </div>
    <div class="form-row">
        <div class="form-group col-md-6">
        <label for="inputtelefono">Telefono</label>
        <input type="number" class="form-control" id="inputtelefono" placeholder="297587545">
    </div>
    <div>
    <br>
    <button type="submit" id="botonSingUp" class="btn btn-primary">Registrarse</button>
    <button type="submit" id="botonLogin" class="btn btn-success">Ir a Login</button>
    </div>
    </form>
    `)
    document.getElementById("cuerpo").innerHTML = renderForm({})
}

export { generoFormLogin, generarFormRegister }