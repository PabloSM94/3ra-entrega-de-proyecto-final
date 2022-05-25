import express from 'express'
import {promises as fs} from 'fs'
import {isObjEmpty}  from '../../public/js/clasesProdyCarr.js'

class ContenedorArchivo {
    constructor(ruta){
        this.ruta = ruta
        this.datos = []
    }
    
    async obtenerObjetos(){
        const data = await fs.readFile(this.ruta,"utf-8")
        this.datos = JSON.parse(data)
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
            console.log(JSON.stringify(ObjetoBuscado))
            return JSON.stringify(ObjetoBuscado)
        }
        else{
            console.log(`No existe el id especificado en la base de datos`) 
            }
            return `No existe el id especificado en la base de datos`
        }
        else{
            console.log(JSON.stringify(this.datos))
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
        await this.obtenerObjetos()
        this.datos.push(objeto)
        await fs.writeFile(this.ruta, JSON.stringify(this.datos),"utf-8")
    }

    async guardarenObj(objeto){
        await this.obtenerObjetos()
        const array = this.datos
        console.log("array",array)
        const nuevoArray = array.filter(elem => parseInt(elem.id) !== parseInt(objeto.id))
        nuevoArray.push(objeto)
        await fs.writeFile(this.ruta, JSON.stringify(nuevoArray),"utf-8")
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
        let nuevoArraydeObjetos
        if (flag == 1){
            nuevoArraydeObjetos = this.datos.filter((obj) => obj.id !== parseInt(identificador))
            await fs.writeFile(this.ruta, JSON.stringify(nuevoArraydeObjetos),"utf-8")
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
            console.log(JSON.stringify(objetosdeObjetoBuscado))
            return (JSON.stringify(objetosdeObjetoBuscado))
        }
        else{
            console.log("no existe el objeto1")
            return (JSON.stringify({ "status": `error`,"msg": `no existe el objeto1`}))
            }

    }
    //borrar objetoN de grupo de objetos de objeto 1
    async borrarObjetoN(idobjeto1,objetos,idobjetos){
        await this.obtenerObjetos()
        let flag = 0;
        let flagP = 0;
        let objetoBuscado
        for (let elements of this.datos){
            if (elements.id == parseInt(idobjeto1)){
                objetoBuscado = elements
                flag = 1            
            }          
            }
            if (flag == 1){
                //Dentro de ese objeto, busco el objeto[objetos] con el idobjetos y elimino el objeto
                for (let subobj of objetoBuscado[objetos]){
                    if (subobj.id == parseInt(idobjetos)){
                        flagP = 1            
                    }
                }
                if (flagP ==1){
                    objetoBuscado[objetos] = objetoBuscado[objetos].filter((elem)=> elem.id !== parseInt(idobjetos))
                    await fs.writeFile(this.ruta, JSON.stringify(this.datos),"utf-8")
                    console.log("borrado exitoso")
                    return (JSON.stringify("Borrado exitoso"))
                }
                else{
                    console.log("no existe id en el subgrupo")
                    return (JSON.stringify("no existe id en el subgrupo"))
                }       


            }
            else{
                console.log("no existe id en el grupo principal")
                return (JSON.stringify({"msg":"no existe id en el grupo principal"}))
            } 
        }  
}

export default ContenedorArchivo