import axios from "axios";

export class DocenciaRetroRegistroService{

    baseUrl = "http://localhost:8080/api/v1/docenciaq/";
    
    search(id){
        return axios.get(this.baseUrl + "search/" + id).then(res => res.data);
    }
}