import axios from "axios";

export class ServicioConsultaUsuarios{

    baseUrl= "http://localhost:8080/api/v1/consultausuarios/";

    search(iddep){
        return axios.get(this.baseUrl + "search/" + iddep).then(res => res.data);
    }

}