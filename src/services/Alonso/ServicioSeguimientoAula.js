import axios from "axios";

export class ServicioSeguimientoAula{
    baseUrl="http://localhost:8080/api/v1/seguimientoaula/";

    getAll(){
        return axios.get(this.baseUrl+"all").then(res=>res.data);
    }

    save(seguimiento){
        return axios.post(this.baseUrl+"save",seguimiento).then(res=>res.data);
    }
    delete(id){
        return axios.get(this.baseUrl+"delete/"+id).then(res=>res.data);
    }
}