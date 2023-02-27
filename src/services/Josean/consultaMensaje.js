import axios from "axios";

export class consultaMensajes{

    baseUrl = "http://localhost:8080/api/v1/cmensajes/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(mensajes){
        return axios.post(this.baseUrl + "save", mensajes).then(res => res.data);
    }

    delete(id_Mensajes){
        return axios.get(this.baseUrl + "delete/" + id_Mensajes).then(res => res.data);
    }
    search(departamento){
        return axios.get(this.baseUrl + "search/" + departamento).then(res => res.data);
    }
}