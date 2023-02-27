import axios from "axios";

export class ServicioConsultaDocSer{

    baseUrl= "http://localhost:8080/api/v1/consultadocservicio/";

    search(idservicio){
        return axios.get(this.baseUrl + "search/"+ idservicio ).then(res => res.data);
    }

}