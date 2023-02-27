import axios from "axios";

export class ServicioConsultaAsesores{

    baseUrl= "http://localhost:8080/api/v1/consultaasesores/";

    search(iddep,idper){
        return axios.get(this.baseUrl + "search/"+ iddep + "/" + idper).then(res => res.data);
    }

}