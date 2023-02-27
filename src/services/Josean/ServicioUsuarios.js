import axios from "axios";

export class ServicioUsuarios{

    baseUrl= "http://localhost:8080/api/v1/usuarios/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }


    save(persona){
        return axios.post(this.baseUrl + "save", persona).then(res => res.data);
    }

    delete(id){
        return axios.get(this.baseUrl + "delete/" + id).then(res => res.data);
    }


    get(id){
        return axios.get(this.baseUrl + "find/" + id).then(res => res.data);
    }

    getusuariosbydep(id){
        return axios.get(this.baseUrl + "getusuariosbydep/" + id).then(res => res.data);
    }

    docentes(id){
        return axios.get(this.baseUrl + "docentes/" + id).then(res => res.data);
    }


checkcorreo(mail){
        return axios.get(this.baseUrl + "checkcorreo/" + mail ).then(res => res.data);
    }
}
