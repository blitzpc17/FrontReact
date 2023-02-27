import axios from "axios";

export class ServicioLaboratorios{

    baseUrl= "http://localhost:8080/api/v1/laboratorios/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }


    save(persona){
        return axios.post(this.baseUrl + "save", persona).then(res => res.data);
    }

    delete(id){
        return axios.get(this.baseUrl + "delete/" + id).then(res => res.data);
    }

    deletelab(id){
        return axios.get(this.baseUrl + "deletelab/" + id).then(res => res.data);
    }


}
