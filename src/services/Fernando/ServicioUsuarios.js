import axios from "axios";

export class ServicioUsuarios{

    baseUrl = "http://localhost:8080/api/v1/usuarios/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(usuarios){
        return axios.post(this.baseUrl + "save", usuarios).then(res => res.data);
    }

    delete(usuarios){
        return axios.get(this.baseUrl + "delete/" + usuarios).then(res => res.data);
    }
    search(usuarios){
        return axios.get(this.baseUrl + "search/" + usuarios).then(res => res.data);
    }
}