import axios from "axios";

export class EnviadosServicio{

    baseUrl = "http://localhost:8080/api/v1/enviados/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(mensajes){
        return axios.post(this.baseUrl + "save", mensajes).then(res => res.data);
    }

    delete(id_Mensajes){
        return axios.get(this.baseUrl + "delete/" + id_Mensajes).then(res => res.data);
    }
    search(rem, dest){
        return axios.get(this.baseUrl + "search/" + rem + "/" + dest).then(res => res.data);
    }
}