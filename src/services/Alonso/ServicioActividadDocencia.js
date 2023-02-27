import axios from "axios";

export class ServicioActividadDocencia{
    baseUrl="http://localhost:8080/api/v1/actdocdocente/";

    getAll(){
        return axios.get(this.baseUrl+"all").then(res=>res.data);
    }

    save(actdoc){
        return axios.post(this.baseUrl+"save",actdoc).then(res=>res.data);
    }
    delete(id){
        return axios.get(this.baseUrl+"delete/"+id).then(res=>res.data);
    }
}