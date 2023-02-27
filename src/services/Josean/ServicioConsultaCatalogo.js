import axios from "axios";

export class ServicioConsultaCatalogo{

    baseUrl= "http://localhost:8080/api/v1/consultacatalogo/";

    search(id){
        return axios.get(this.baseUrl + "search/"+ id).then(res => res.data);
    }

}