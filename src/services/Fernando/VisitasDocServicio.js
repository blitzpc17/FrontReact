import axios from "axios";

export class VisitasDocServicio{

    baseUrl = "http://localhost:8080/api/v1/qvisitas/";

    search(visita){
        return axios.get(this.baseUrl + "search/" + visita).then(res => res.data);
    }
}