import axios from "axios";

export class DocumentosVisitasServicio{

    baseUrl = "http://localhost:8080/api/v1/visitasdocumentos/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(id_documentos){
        return axios.post(this.baseUrl + "save", id_documentos).then(res => res.data);
    }

    delete(id_Documentos){
        return axios.get(this.baseUrl + "delete/" + id_Documentos).then(res => res.data);
    }
}