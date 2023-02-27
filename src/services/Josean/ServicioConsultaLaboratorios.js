import axios from "axios";

export class ServicioConsultaLaboratorios{

    baseUrl= "http://localhost:8080/api/v1/consultalaboratorios/";

    search(id){
        return axios.get(this.baseUrl + "search/"+ id).then(res => res.data);
    }

}