import axios from "axios";

export class RolesService{

    baseUrl = "http://localhost:8080/api/v1/rolesusuario/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(usuario){
        return axios.post(this.baseUrl + "save", usuario).then(res => res.data);
    }

    delete(id){
        return axios.get(this.baseUrl + "delete/" + id).then(res => res.data);
    }

    roles(id){
        return axios.get(this.baseUrl + "roles", { params: {usuario: id}} ).then(res => res.data);
    }
}
