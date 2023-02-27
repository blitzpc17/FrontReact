import axios from "axios";

export class CursoUsuarioServicio{

    baseUrl = "http://localhost:8080/api/v1/ucursos/";

    
    search(departamento){
        return axios.get(this.baseUrl + "search/" + departamento).then(res => res.data);
    }
}