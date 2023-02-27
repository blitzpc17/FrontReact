import axios from "axios";

export class DepartamentoService{

    baseUrl = "http://localhost:8080/api/v1/departamento/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(dep){
        return axios.post(this.baseUrl + "save", dep).then(res => res.data);
    }

    delete(id){
        return axios.get(this.baseUrl + "delete/" + id).then(res => res.data);
    }

    find(id){
        return axios.get(this.baseUrl + "find/" + id).then(res => res.data);
    }
}
