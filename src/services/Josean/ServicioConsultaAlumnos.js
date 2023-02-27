import axios from "axios";

export class ServicioConsultaAlumnos{

    baseUrl= "http://localhost:8080/api/v1/consultaalumnos/";

    search(iddep,idper,idusuario){
        return axios.get(this.baseUrl + "search/"+ iddep + "/" + idper + "/" + idusuario).then(res => res.data);
    }

}