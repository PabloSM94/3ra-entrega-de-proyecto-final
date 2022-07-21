import express  from 'express'
const { Router } = express
import fs from 'fs'
import passport from 'passport'
import {  Strategy as LocalStrategy} from 'passport-local'
const routerLog = Router()
import {actualizarAvatar, guardarUsuario, validarUsuarios} from '../src/contenedores/contendorPersonasMongoDB.js'
import {crearUsuario,encriptar,autenticar} from '../src/scripts/funcionesRegistro.js'
import multer from 'multer'
import 'dotenv/config'
import { controladorFailRegister, controladorSuccesRegister, controladorFailLogin, controladorSuccessLogin, controllerLogStatus, controladorLogout } from '../src/controllers/controllers.js'

routerLog.use(passport.initialize())
routerLog.use(passport.session())
passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

export let result;
//Estrategias de registro y login
passport.use('registro', new LocalStrategy ({
    passReqToCallback: true
},
    async (req,username,password,done)=>{
        let datosUsuario;
        try {
            const validate = await validarUsuarios(username)
            if(validate.length === 0){
            datosUsuario = req.body
            //console.log(datosUsuario)
            try {
                await crearUsuario(datosUsuario)
                return done(null,username)
            } catch (error) {
                result = {msg: `${error}`} 
                return done(null,false)
            }
            

            }else{
                result = {msg: "Registro no completado, ya existe usuario en base de datos"} 
                return done(null,false)
            }
            
        }
        catch(error){
            result = {msg: "Registro fallido, no se pudo realizar comprobacion/guardado en base de datos"} 
            done(null,false)
        }
}))


passport.use('login', new LocalStrategy ({passReqToCallback: true}, async (req,username,password,done)=>{
    try{
        const usuario = {username: username , password: password}
        result = await autenticar(usuario.username,usuario.password)
    if (result.status === "ok"){
        done(null,usuario)
    } else {     
        done(null,false)
    }
    }
    catch{
        done(null,false)
    }
}))

//Comprobacion de login

const middleware = {
    estaLogeado: async function(req,res,next){
        //console.log(req.session.name)
        if(req.isAuthenticated()){
            //req.isAuthenticated() will return true if user is logged in
            next()}
        else{
            res.json({status: "error", msg:"usuario sin logear"})
        }
        
    }
}

//Multer para avatar

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/avatar')
    },
    filename: function (req,file,cb){
        cb(null, file.fieldname + (req.session.passport.user.username || req.session.passport.user) + '.jpg')
    }
})
const upload = multer ({ storage: storage})

routerLog.post('/saveAvatar',upload.single('avatar'),middleware.estaLogeado,async (req,res,next)=>{
    const file = req.file
    if(!file){
        const error = new Error("Subir un archivo")
        error.httpStatusCode = 400
        res.json(`${error}`)
    }else{
        await actualizarAvatar(req.session.passport.user.username || req.session.passport.user,`/avatar/${file.filename}`)
        //update ruta de imagen a la nueva /avatar/file.filename
        res.redirect("/")
    }
    
})

//Register

routerLog.post('/register',
    passport.authenticate('registro',{
    failureRedirect: '/api/failRegister',
    successRedirect: '/api/successRegister',
    })
    
)
routerLog.post('/failRegister',controladorFailRegister)

routerLog.post('/successRegister',controladorSuccesRegister)



//Login
routerLog.post('/login',
    passport.authenticate('login',{
    failureRedirect: '/api/failLogin',
    successRedirect: '/api/successLogin',
}
), 
)

routerLog.post('/failLogin', controladorFailLogin)

routerLog.post('/successLogin', controladorSuccessLogin)







routerLog.get('/logStatus', middleware.estaLogeado , controllerLogStatus)

routerLog.get('/logout', controladorLogout)

//RESPONSES PARA FRONTEND ... 
routerLog.get('/failLogin', controladorFailLogin)

routerLog.get('/successLogin', controladorSuccessLogin)

routerLog.get('/failRegister',controladorFailRegister)

routerLog.get('/successRegister', controladorSuccesRegister)

//----------------------------------------


export {routerLog}