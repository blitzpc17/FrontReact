import axios from "axios";

export class ServicioPeriodos{

    baseUrl = "http://localhost:8080/api/v1/periodos/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(periodo){
        return axios.post(this.baseUrl + "save", periodo).then(res => res.data);
    }

    delete(id_periodo){
        return axios.get(this.baseUrl + "delete/" + id_periodo).then(res => res.data);
    }
}