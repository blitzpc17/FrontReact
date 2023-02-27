import axios from "axios";

export class ServicioConsultaDocLab{

    baseUrl= "http://localhost:8080/api/v1/consultadoclab/";

    search(idgestion, iddep){
        return axios.get(this.baseUrl + "search/"+ idgestion + "/" + iddep ).then(res => res.data);
    }

}