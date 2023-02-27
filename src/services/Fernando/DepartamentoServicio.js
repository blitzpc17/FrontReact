import axios from "axios";

export class DepartamentoServicio{

    baseUrl = "http://localhost:8080/api/v1/departamento/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(departamento){
        return axios.post(this.baseUrl + "save", departamento).then(res => res.data);
    }

    delete(id_departamento){
        return axios.get(this.baseUrl + "delete/" + id_departamento).then(res => res.data);
    }
}

