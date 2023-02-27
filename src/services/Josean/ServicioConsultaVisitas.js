import axios from "axios";

export class ServicioConsultaVisitas{

    baseUrl= "http://localhost:8080/api/v1/consultavisitas/";

    search(iddep,idper){
        return axios.get(this.baseUrl + "search/"+ iddep + "/" + idper ).then(res => res.data);
    }

}