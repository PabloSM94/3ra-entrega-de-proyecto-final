import { MongoClient } from "mongodb";
import config from "../config.js";
// Replace the uri string with your MongoDB deployment's connection string.
const uri = config.mongodb.cnxStr;
const client = new MongoClient(uri);



await client.connect();

async function guardarPedido(pedido){
    const database = client.db("pedidos");
    const users = database.collection("pedidos")
    await users.insertOne(pedido)
    return
}

async function vaciarCarrito(idCarr){
    const database = client.db("ecommerce");
    const usuarios = database.collection("carritos")
    await usuarios.updateOne({id: idCarr},{$set:{productos: []}})
}


export {guardarPedido,vaciarCarrito}