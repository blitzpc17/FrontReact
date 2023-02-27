import axios from "axios";

export class ServicioConsultaP1{

    baseUrl= "http://localhost:8080/api/v1/consultap1/";

    search(){
        return axios.get(this.baseUrl + "search").then(res => res.data);
    }

}