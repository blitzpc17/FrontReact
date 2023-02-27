import axios from "axios";

export class ServicioICursos{

    baseUrl = "http://localhost:8080/api/v1/instancias/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(instancia){
        return axios.post(this.baseUrl + "save", instancia).then(res => res.data);
    }

    delete(id_Instancia){
        return axios.get(this.baseUrl + "delete/" + id_Instancia).then(res => res.data);
    }
}