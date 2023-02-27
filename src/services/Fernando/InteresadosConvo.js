import axios from "axios";

export class InteresadosConvo{

    baseUrl = "http://localhost:8080/api/v1/interesados/";
    search(id){
        return axios.get(this.baseUrl + "search/" + id).then(res => res.data);
    }
}