import { generoFormLogin, generarFormRegister } from './generarFormularios.js'
import { generoVistaHome } from './generadorVistas.js'

fetch('/api/logStatus')
    .then(res => res.json())
    .then(data => {
        if (data.status == "error") {
            generoFormLogin()
            const botonLogin = document.getElementById("botonLogin")
            const botonSingUp = document.getElementById("botonSingUp")

            botonLogin.addEventListener("click", e => {
                e.preventDefault()
                const user = {
                    username: document.getElementById("inputusername").value,
                    password: document.getElementById("inputpassword").value
                }
                fetch('/api/login', {
                    method: "POST",
                    body: JSON.stringify(user),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status == "ok") {
                            alert(`Bienvenido ${data.usuario.nombre}`)
                            generoVistaHome(data.usuario)
                        } else {
                            alert(data.msg)
                        }
                    }
                    )
            })

            botonSingUp.addEventListener("click", e => {
                e.preventDefault()
                generarFormRegister()
                const botonLogin = document.getElementById("botonLogin")
                botonLogin.addEventListener("click",e=>{
                    e.preventDefault()
                    location.reload("/")
                })
                const botonSingUp = document.getElementById("botonSingUp")
                botonSingUp.addEventListener("click", e=>{
                    e.preventDefault()
                        const newUser = {
                            username: document.getElementById("usernameNEW").value,
                            password: document.getElementById("passwordNEW").value,
                            nombre: document.getElementById("inputnombre").value,
                            direccion: document.getElementById("inputdireccion").value,
                            edad: document.getElementById("inputedad").value,
                            prefijo: document.getElementById("inputprefijo").value,
                            telefono: document.getElementById("inputtelefono").value,
                            
                        }
                        fetch('/api/register',{
                            method: "POST",
                            body: JSON.stringify(newUser),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(res => res.json())
                            .then(data => { alert(data.msg||`Bienvenido ${data.name}`)
                            location.reload("/")
                            }
                                )
                        
                    })})
               
        }
        else {
            generoVistaHome(data.usuario)
        }
    })