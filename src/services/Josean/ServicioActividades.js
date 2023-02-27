import axios from "axios";

export class ServicioActividades{

    baseUrl= "http://localhost:8080/api/v1/actividades/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    deps(iddep){
        return axios.get(this.baseUrl + iddep).then(res => res.data);
    }
    
    save(persona){
        return axios.post(this.baseUrl + "save", persona).then(res => res.data);
    }

    delete(id){
        return axios.get(this.baseUrl + "delete/" + id).then(res => res.data);
    }

    

}