import axios from "axios";

export class DepsSocialService{

    baseUrl = "http://localhost:8080/api/v1/socialdep/";

    search(id_Departamento, per){
        return axios.get(this.baseUrl + "search/" + id_Departamento + "/" + per).then(res => res.data);
    }
}