import axios from "axios";

export class ServicioRecursoProgramado{

    baseUrl= "http://localhost:8080/api/v1/rp/";
    
    save(ra){
        return axios.post(this.baseUrl + "guardar", ra).then(res => res.data);
    }

    BuscarDocumentoNombre(deptoId, periodoId){
        return axios.get(this.baseUrl + "obtener/" + deptoId + "/" + periodoId).then(res => res.data);
    }


    

}