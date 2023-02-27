import axios from "axios";

export class CarreraServicio{

    baseUrl = "http://localhost:8080/api/v1/qcarreras/";

    search(id_Departamento){
        return axios.get(this.baseUrl + "search/" + id_Departamento).then(res => res.data);
    }
}

