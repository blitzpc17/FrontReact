import axios from "axios";

export class EnviadosServicio{

    baseUrl = "http://localhost:8080/api/v1/enviados/";

    
    search(rem, dest){
        return axios.get(this.baseUrl + "search/" + rem + "/" + dest).then(res => res.data);
    }
}
