import axios from "axios";

export class ServicioConsultaDocVisitas{

    baseUrl= "http://localhost:8080/api/v1/consultadocvisitas/";

    search(idvisita){
        return axios.get(this.baseUrl + "search/"+ idvisita ).then(res => res.data);
    }

}