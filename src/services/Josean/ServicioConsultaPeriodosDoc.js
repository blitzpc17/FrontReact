import axios from "axios";

export class ServicioConsultaPeriodosDoc{

    baseUrl= "http://localhost:8080/api/v1/consultaperiodosdoc/";

    search(id){
        return axios.get(this.baseUrl + "search/"+ id).then(res => res.data);
    }

}