import axios from "axios";

export class ProcesosDepSocial{

    baseUrl = "http://localhost:8080/api/v1/socialprocesos/";

    search(periodo){
        return axios.get(this.baseUrl + "search/" + periodo).then(res => res.data);
    }
}
