import axios from "axios";

export class VisitasService{

    baseUrl = "http://localhost:8080/api/v1/visitas/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(visita){
        return axios.post(this.baseUrl + "save", visita).then(res => res.data);
    }

    delete(visita){
        return axios.get(this.baseUrl + "delete/" + visita).then(res => res.data);
    }
}