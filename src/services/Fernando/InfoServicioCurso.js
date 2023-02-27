import axios from "axios";

export class InfoCurso{

    baseUrl = "http://localhost:8080/api/v1/infocurso/";
    search(id_Curso){
        return axios.get(this.baseUrl + "search/" + id_Curso).then(res => res.data);
    }
}