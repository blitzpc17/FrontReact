import axios from "axios";

export class DocSocialServicio{

    baseUrl = "http://localhost:8080/api/v1/docsocial/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(docServicio){
        return axios.post(this.baseUrl + "save", docServicio).then(res => res.data);
    }

    delete(id_Documentos_Servicio){
        return axios.get(this.baseUrl + "delete/" + id_Documentos_Servicio).then(res => res.data);
    }
}