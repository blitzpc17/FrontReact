import axios from "axios";

export class ServicioSolicitudes{
    baseUrl="http://localhost:8080/api/v1/solicitudes/";

    getAll(){
        return axios.get(this.baseUrl+"all").then(res=>res.data);
    }

    save(solicitud){
        return axios.post(this.baseUrl+"save",solicitud).then(res=>res.data);
    }
    delete(id){
        return axios.get(this.baseUrl+"delete/"+id).then(res=>res.data);
    }
}