import axios from "axios";

export class ServicioCarreras{

    baseUrl= "http://localhost:8080/api/v1/carreras/";

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

    comprobarCarrera(id,name){
        return axios.get(this.baseUrl + "comprobarcarrera/" + id + "/" + name).then(res => res.data);
    }


    

}