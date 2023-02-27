import axios from "axios";

export class CursoCount{

    baseUrl = "http://localhost:8080/api/v1/cursocount/";
    
    search(id_departamento){
        return axios.get(this.baseUrl + "search/" + id_departamento).then(res => res.data);
    }
}