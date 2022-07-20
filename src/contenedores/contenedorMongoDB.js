import express from 'express'
import {promises as fs} from 'fs'
import mongoose from 'mongoose'
import config from '../config.js'
import {isObjEmpty} from '../scripts/clasesProdyCarr.js'

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

class ContenedorMongo {
    constructor(coleccion,esquema){
        this.coleccion = mongoose.model(coleccion, esquema)
        this.datos = []
    }
    
    async obtenerObjetos(){
        this.datos = await this.coleccion.find({},{_id:0, __v:0})
        return JSON.stringify(this.datos)
    }

    async obtenerObjetosxId(id){
        await this.obtenerObjetos()
        let flag=0;
        let ObjetoBuscado;
        if(id){
            for (let obj of this.datos){
            if (obj.id == parseInt(id)){
                ObjetoBuscado = obj
                flag = 1            
            }          
            }
        if (flag == 1){
            //console.log(JSON.stringify(ObjetoBuscado))
            return JSON.stringify(ObjetoBuscado)
        }
        else{
            //console.log(`No existe el id especificado en la base de datos`) 
            }
            return `No existe el id especificado en la base de datos`
        }
        else{
            //console.log(JSON.stringify(this.datos))
            return JSON.stringify(this.datos)
        }    
    }

    //Asignar id a objeto
    async asignarId(objeto){
        await this.obtenerObjetos()
        //Recorrer objeto con el fin de encontrar id faltante   
        let ids = [];
        for (let elements of this.datos){
            ids.push(elements.id)
        }
        let idsOrdenados = ids.sort(function(a, b) {return a - b})
        //Asignar id en funcion de la memoria
        let identificador = 1;
        while (identificador == idsOrdenados[identificador-1]){
            identificador++
        }
        objeto.id = identificador
        return `El id asignado al nuevo elemento es ${identificador}`
    }

    async guardar (objeto){
        await this.coleccion(objeto).save()
    }

    async guardarenObj(objeto){
        const identificador = objeto.id
        //console.log(objeto)
        await this.coleccion.replaceOne({id: identificador},objeto)
    }

    // Borrar por ID
    async borrar(identificador){
        let flag = 0;
        await this.obtenerObjetos()
        //Compruebo si existe el elemento
        for (let elements of this.datos){
            if (elements.id == parseInt(identificador)){
            flag = 1         
            }          
        }
        if (flag == 1){
            await this.coleccion.deleteOne({id: identificador})
            return (JSON.stringify({ "status": `ok`,"msg": `Se borro el objeto id ${identificador}`}))
        }
        else {
            return (JSON.stringify({ "status": `error404${identificador}`,"msg": "No existe el objeto, seleccione otro id"})) 
        }
        
    }
    //Buscar objetos dentro del objeto 1
    async buscarObjetos(idobjeto1,objetos){
        await this.obtenerObjetos()
        let flag = 0;
        let objetoBuscado
        for (let elements of this.datos){
            if (elements.id == parseInt(idobjeto1)){
                objetoBuscado = elements
                flag = 1            
            }          
        }
        if (flag == 1){
            const objetosdeObjetoBuscado = objetoBuscado[objetos]
            //console.log(JSON.stringify(objetosdeObjetoBuscado))
            return (JSON.stringify(objetosdeObjetoBuscado))
        }
        else{
            //console.log("no existe el objeto1")
            return (JSON.stringify({ "status": `error`,"msg": `no existe el objeto1`}))
            }

    }
    //borrar objetoN de grupo de objetos de objeto 1
    async borrarObjetoN(idobjeto1,objetos,idobjetos){
        const document = await this.coleccion.find({id: idobjeto1})
        if(isObjEmpty(document)){
            //console.log("no existe id de elemento principal")
        }else{
            let filtro2 = document.find(elem => elem)
            const filtro3 = filtro2[objetos].filter(elem => elem.id !== parseInt(idobjetos))
            const validacion = filtro2[objetos].filter(elem=> elem.id == parseInt(idobjetos))
            filtro2[objetos] = filtro3
            if (isObjEmpty(validacion)){
                //console.log("no existe id elemento secundario")
                return JSON.stringify("no existe id elemento secundario")
            }else{
                await this.coleccion.replaceOne({id: idobjeto1},filtro2)
                //console.log("borrado exitoso")
                return JSON.stringify("borrado exitoso")
            }   
        }
        }  
}

export default ContenedorMongo