import axios from "axios";

export class ConvocatoriasService{

    baseUrl = "http://localhost:8080/api/v1/convocatorias/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(id_Convocatoria){
        return axios.post(this.baseUrl + "save", id_Convocatoria).then(res => res.data);
    }

    delete(id_Convocatoria){
        return axios.get(this.baseUrl + "delete/" + id_Convocatoria).then(res => res.data);
    }
}