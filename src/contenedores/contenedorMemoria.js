import express from 'express'
import {isObjEmpty}  from '../../public/js/clasesProdyCarr.js'

class ContenedorMemoria {
    constructor(){
        this.datos = []
    }
    
    async obtenerObjetos(){
        return JSON.stringify(this.datos)
    }

    async obtenerObjetosxId(id){
        await this.obtenerObjetos()
    
        if(id){
            let dato = this.datos.find(elem => elem.id == id)
            if (dato){
            console.log(JSON.stringify(`dato`,dato))
            return JSON.stringify(dato)
            }
            else{
            console.log(`No existe el id especificado en la base de datos`)
            return JSON.stringify([]) 
            }
            return `No existe el id especificado en la base de datos`
        }
        else{
            return JSON.stringify(this.datos)
        }    
    }

    //Asignar id a objeto
    async asignarId(objeto){
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
        this.datos.push(objeto)
    }

    async guardarenObj(objeto){
        const array = this.datos
        console.log("array",array)
        const nuevoArray = array.filter(elem => parseInt(elem.id) !== parseInt(objeto.id))
        console.log("arrayfiltrado",nuevoArray)
        nuevoArray.push(objeto)
        return this.datos = nuevoArray
    }

    // Borrar por ID
    async borrar(identificador){
        let flag = 0;
        //Compruebo si existe el elemento
        for (let elements of this.datos){
            if (elements.id == parseInt(identificador)){
            flag = 1         
            }          
        }
        let nuevoArraydeObjetos
        if (flag == 1){
            nuevoArraydeObjetos = this.datos.filter((obj) => obj.id !== parseInt(identificador))
            this.datos = nuevoArraydeObjetos
            return (JSON.stringify({ "status": `ok`,"msg": `Se borro el objeto id ${identificador}`}))
        }
        else {
            return (JSON.stringify({ "status": `error404${identificador}`,"msg": "No existe el objeto, seleccione otro id"})) 
        }
        
    }
    //Buscar objetos dentro del objeto 1
    async buscarObjetos(idobjeto1,objetos){
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
                    return (JSON.stringify({"msg":"Borrado exitoso"}))
                }
                else{
                    console.log("no existe id en el subgrupo")
                    return (JSON.stringify({"msg":"no existe id en el subgrupo"}))
                }       


            }
            else{
                console.log("no existe id en el grupo principal")
                return (JSON.stringify({"msg":"no existe id en el grupo principal"}))
            } 
        }  
}

export default ContenedorMemoria