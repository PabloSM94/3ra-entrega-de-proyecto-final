import express, { query } from 'express'
import fs from 'fs'
import config from '../config.js'
import {isObjEmpty} from '../scripts/clasesProdyCarr.js'

import admin from "firebase-admin"

admin.initializeApp({
    credential: admin.credential.cert(config.firebase.serviceAccount)
    });
    
const db = admin.firestore()

class ContenedorFirebase {
    constructor(coleccion){
        this.query = db.collection(coleccion)
        this.datos = []
    }
    
    async obtenerObjetos(){
        let array = []
        const snapshot = await this.query.get()
        snapshot.forEach(doc => {
            array.push(doc.data())
        })
        this.datos = array
        
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
        await this.query.add(JSON.parse(JSON.stringify(objeto)))
        
    }


    async guardarenObj(objeto){
        //obtengo path de documentos
        let array = []
        const snapshot = await this.query.get()
        snapshot.forEach(doc => {
            array.push({"path": doc.id, "data": doc.data()})
        })
        let path
        array.find(elem=> {
            if(elem.data.id == objeto.id){
            path = elem.path
        }})
        const doc = await this.query.doc(`${path}`)
        await doc.update(objeto)

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
            let array = []
            const snapshot = await this.query.get()
            snapshot.forEach(doc => {
                array.push({"path": doc.id, "data": doc.data()})
            })
            let path
            array.find(elem=> {
                if(elem.data.id == identificador){
                path = elem.path
            }})
            const doc = await this.query.doc(`${path}`)
            await doc.delete()
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
    //------------------idcarrito,"productos",idprodu
    async borrarObjetoN(idobjeto1,objetos,idobjetos){

        let array = []
        const snapshot = await this.query.get()
        snapshot.forEach(doc => {
            array.push({"path": doc.id, "data": doc.data()})
        })
        let path
        array.find(elem=> {
            if(elem.data.id == idobjeto1){
            path = elem.path
        }})
        const doc = await this.query.doc(`${path}`)
        const doc2 = await doc.get()
        const item = await doc2.data()
        //console.log(item[objetos])


        const filtro3 = item[objetos].filter(elem => elem.id !== parseInt(idobjetos))
        const validacion = item[objetos].filter(elem=> elem.id == parseInt(idobjetos))
        item[objetos] = filtro3
            if (isObjEmpty(validacion)){
                //console.log("no existe id elemento secundario")
                return JSON.stringify("no existe id elemento secundario")
            }else{
                await doc.update(item)
                //console.log("borrado exitoso",item)
                return JSON.stringify("borrado exitoso")
            }       
        
        }  
}

export default ContenedorFirebase