import axios from "axios";

export class ServicioPeriodos{

    baseUrl= "http://localhost:8080/api/v1/periodos/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }


    save(persona){
        return axios.post(this.baseUrl + "save", persona).then(res => res.data);
    }

    delete(id){
        return axios.get(this.baseUrl + "delete/" + id).then(res => res.data);
    }

    comprobarP(mesini,mesfin,year){
        return axios.get(this.baseUrl + "comprobarperiodos/" + mesini + "/" + mesfin + "/" + year).then(res => res.data);
    }

    updateP(){
        return axios.get(this.baseUrl + "updateperiodos").then(res => res.data);
    }

    searchP(){
        return axios.get(this.baseUrl + "searchperiodos").then(res => res.data);
    }

}