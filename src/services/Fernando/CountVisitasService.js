import axios from "axios";

export class CountVisitasService{

    baseUrl = "http://localhost:8080/api/v1/countvisitas/";

    search(id, per){
        return axios.get(this.baseUrl + "search/" + id + "/" + per).then(res => res.data);
    }
}