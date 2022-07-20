import {guardarUsuario,validarUsuarios} from '../../src/contenedores/contendorPersonasMongoDB.js'
import bCrypt from 'bcrypt'

async function crearUsuario(datos){
    
    if(!datos.username){
        throw new Error('falta campo obligatorio username')
    }
    if(!datos.password){
        throw new Error('falta campo obligatorio password')
    }

    
    const prefijo = datos.prefijo
    const telefono = datos.telefono
    const contrasenaEnc = await encriptar(datos.password)
    //console.log("hasta aca",datos.prefijo,contrasenaEnc)
    const usuarioNuevo = {
        username: datos.username, //email
        password: contrasenaEnc,
        nombre: datos.nombre,
        direccion: datos.direccion,
        edad: datos.edad,
        tel: `+${prefijo}${telefono}`,
        wapp:`+${prefijo}9${telefono}`,
        foto: `/avatar/avatarpordefecto.jpg`
    }

    //console.log("ok, casi guardo",usuarioNuevo)
    await guardarUsuario(usuarioNuevo)
}//Creo el usuario y lo guardo en base de datos

async function encriptar (pass){
    //Encriptar pass
    const passEnc = bCrypt.hashSync(pass,bCrypt.genSaltSync(10),null)
    return passEnc
}

async function autenticar(user,pass){
    const validate = await validarUsuarios(user)
    if(validate.length === 0){
        return({status: "error", msg: "usuario no existe en base de datos"})
    }
    else{
        if (bCrypt.compareSync(pass,validate[0].password)){
            return({status: "ok", msg:"Usuario autenticado"})
        }
        else{
            return({status: "error", msg:"contraseña incorrecta"})
        }
        
        
    }
}


export {crearUsuario,encriptar,autenticar}