import axios from "axios";

export class RolesUsuarioService{

    baseUrl = "http://localhost:8080/api/v1/rolesusuario/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(docServicio){
        return axios.post(this.baseUrl + "save", docServicio).then(res => res.data);
    }

    delete(id_Documentos_Servicio){
        return axios.get(this.baseUrl + "delete/" + id_Documentos_Servicio).then(res => res.data);
    }

    selectroles(id){
        return axios.get(this.baseUrl + "selectroles/" + id).then(res => res.data);
    }

    find(id){
        return axios.get(this.baseUrl + "find/" + id).then(res => res.data);
    }
}