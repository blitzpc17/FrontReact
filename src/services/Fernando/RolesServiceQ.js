import axios from "axios";

export class RolesServiceQ{

    baseUrl = "http://localhost:8080/api/v1/qroles/";
    search(){
        return axios.get(this.baseUrl + "search/" ).then(res => res.data);
    }
}