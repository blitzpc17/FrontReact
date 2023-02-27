import axios from "axios";

export class ResetService{

    baseUrl = "http://localhost:8080/api/v1/resetpass/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(reset){
        return axios.post(this.baseUrl + "save", reset).then(res => res.data);
    }

    delete(id){
        return axios.get(this.baseUrl + "delete/" + id).then(res => res.data);
    }

    find(id){
        return axios.get(this.baseUrl + "find/" + id).then(res => res.data);
    }
}
