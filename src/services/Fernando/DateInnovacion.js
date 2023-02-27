import axios from "axios";

export class DateInnovacion{

    baseUrl = "http://localhost:8080/api/v1/dateinn/";

    search(year){
        return axios.get(this.baseUrl + "search/" + year).then(res => res.data);
    }
}
