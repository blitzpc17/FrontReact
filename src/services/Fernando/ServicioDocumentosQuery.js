import axios from "axios";

export class QueryDocumentos{

    baseUrl = "http://localhost:8080/api/v1/socialdq/";
    
    search(id_Servicio){
        return axios.get(this.baseUrl + "search/" + id_Servicio).then(res => res.data);
    }
}