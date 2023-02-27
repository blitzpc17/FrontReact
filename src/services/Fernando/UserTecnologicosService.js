import axios from "axios";

export class UserTecnologicosService{

    baseUrl = "http://localhost:8080/api/v1/tecnologicous/";

    search(usuarios){
        return axios.get(this.baseUrl + "search/" + usuarios).then(res => res.data);
    }
}