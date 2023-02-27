import axios from "axios";

export class ServicioConsultaVisitasDocente{

    baseUrl= "http://localhost:8080/api/v1/consultavisitasdocente/";

    search(iddep,idper,iduser){
        return axios.get(this.baseUrl + "search/"+ iddep + "/" + idper + "/" + iduser ).then(res => res.data);
    }

}