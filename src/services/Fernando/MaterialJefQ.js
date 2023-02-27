import axios from "axios";

export class MaterialJefQ{

    baseUrl = "http://localhost:8080/api/v1/matjefq/";

    search(id_Departamento){
        return axios.get(this.baseUrl + "search/" + id_Departamento).then(res => res.data);
    }
}