import axios from "axios";

export class ServicioConsultaCubiculos{

    baseUrl= "http://localhost:8080/api/v1/consultacubiculos/";

    search(iddep){
        return axios.get(this.baseUrl + "search/" + iddep).then(res => res.data);
    }

}