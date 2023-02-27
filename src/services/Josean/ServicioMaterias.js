import axios from "axios";

export class ServicioMaterias{

    baseUrl= "http://localhost:8080/api/v1/materias/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }


    save(persona){
        return axios.post(this.baseUrl + "save", persona).then(res => res.data);
    }

    delete(id){
        return axios.get(this.baseUrl + "delete/" + id).then(res => res.data);
    }

    searchByDep(id){
        return axios.get(this.baseUrl + "searchbydep/" + id).then(res => res.data);
    }

    comprobarMat(id,clave){
        return axios.get(this.baseUrl + "comprobarmateria/" + id + "/" + clave).then(res => res.data);
    }

}