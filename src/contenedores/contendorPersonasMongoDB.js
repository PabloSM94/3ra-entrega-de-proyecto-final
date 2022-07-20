import { MongoClient } from "mongodb";
import config from "../config.js";
// Replace the uri string with your MongoDB deployment's connection string.
const uri = config.mongodb.cnxStr;
const client = new MongoClient(uri);



await client.connect();

async function validarUsuarios(useraValidar){
    //console.log("a validar...")
    const database = client.db("users");
    const usuarios = database.collection("users")
    const datos = await usuarios.find({username: `${useraValidar}`}).toArray()
    return datos
}

async function guardarUsuario(usr){
    
    //console.log("guardando..")
    const database = client.db("users");
    const users = database.collection("users")
    await users.insertOne(usr)
    return usr
}

async function obtenerUsuarioporUsername(username){
    const database = client.db("users");
    const usuarios = database.collection("users")
    const datos = await usuarios.find({username: `${username}`}).toArray()
    return datos[0]
}

async function actualizarUsuario(username,id){
    const database = client.db("users");
    const usuarios = database.collection("users")
    await usuarios.updateOne({username: `${username}`},{$set:{idCarr: id}})
    const datos =  await obtenerUsuarioporUsername(username)
    return datos
}

async function actualizarAvatar(username,ruta){
    const database = client.db("users");
    const usuarios = database.collection("users")
    await usuarios.updateOne({username: `${username}`},{$set:{foto: ruta}})
}

export {guardarUsuario,validarUsuarios,obtenerUsuarioporUsername,actualizarUsuario,actualizarAvatar}