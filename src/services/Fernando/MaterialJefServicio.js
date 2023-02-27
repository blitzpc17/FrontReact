import axios from "axios";

export class MaterialJefServicio{

    baseUrl = "http://localhost:8080/api/v1/matjefatura/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(id_mat){
        return axios.post(this.baseUrl + "save", id_mat).then(res => res.data);
    }

    delete(id_mat){
        return axios.get(this.baseUrl + "delete/" + id_mat).then(res => res.data);
    }
}