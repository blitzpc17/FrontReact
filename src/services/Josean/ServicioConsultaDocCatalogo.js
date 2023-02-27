import axios from "axios";

export class ServicioConsultaDocCatalogo{

    baseUrl= "http://localhost:8080/api/v1/consultadoccatalogo/";

    search(id){
        return axios.get(this.baseUrl + "search/"+ id).then(res => res.data);
    }

}