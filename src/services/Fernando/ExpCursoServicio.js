import axios from "axios";

export class ExpCursoServicio{

    baseUrl = "http://localhost:8080/api/v1/expcurso/";
    search(departamento){
        return axios.get(this.baseUrl + "search/" + departamento).then(res => res.data);
    }
}