import axios from "axios";

export class ServicioCursos{

    baseUrl = "http://localhost:8080/api/v1/cursos/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(cursos){
        return axios.post(this.baseUrl + "save", cursos).then(res => res.data);
    }

    delete(id_curso){
        return axios.get(this.baseUrl + "delete/" + id_curso).then(res => res.data);
    }

    find(id_curso){
        return axios.get(this.baseUrl + "find/" + id_curso).then(res => res.data);
    }
}