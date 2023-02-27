import axios from "axios";

export class UsuariosVisitas{

    baseUrl = "http://localhost:8080/api/v1/visitasus/";

    search(usuarios){
        return axios.get(this.baseUrl + "search/" + usuarios).then(res => res.data);
    }
}