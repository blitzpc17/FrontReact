import axios from "axios";

export class ServicioProgramaEducativo{

    baseUrl= "http://localhost:8080/api/v1/programaeducativo/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }


    save(persona){
        return axios.post(this.baseUrl + "save", persona).then(res => res.data);
    }

    delete(id){
        return axios.get(this.baseUrl + "delete/" + id).then(res => res.data);
    }

    searchByNombre(id){
        return axios.get(this.baseUrl + "searchbydep/" + id).then(res => res.data);
    }

    comprobarPrograma(id,name){
        return axios.get(this.baseUrl + "comprobarcarrera/" + id + "/" + name).then(res => res.data);
    }


    

}