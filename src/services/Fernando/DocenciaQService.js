import axios from "axios";

export class DocenciaQService{

    baseUrl = "http://localhost:8080/api/v1/prodocq/";

    search(id_Departamento, per){
        return axios.get(this.baseUrl + "search/" + id_Departamento + '/' + per).then(res => res.data);
    }
}
