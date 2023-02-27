import axios from "axios";

export class DatosCursoService{

    baseUrl = "http://localhost:8080/api/v1/datoscurso/";

    search(id_curso){
        return axios.get(this.baseUrl + "search/" + id_curso).then(res => res.data[0]);
    }
}