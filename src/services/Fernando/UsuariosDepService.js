import axios from "axios";

export class UsuariosDepService{

    baseUrl = "http://localhost:8080/api/v1/usuariosq/";
    search(id_Departamento){
        return axios.get(this.baseUrl + "search/" + id_Departamento).then(res => res.data);
    }
}