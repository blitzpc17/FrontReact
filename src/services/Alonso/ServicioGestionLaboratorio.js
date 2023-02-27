import axios from "axios";

export class ServicioGestionLaboratorio{
    baseUrl="http://localhost:8080/api/v1/gestionlaboratorio/";

    getAll(){
        return axios.get(this.baseUrl+"all").then(res=>res.data);
    }

    save(geslab){
        return axios.post(this.baseUrl+"save",geslab).then(res=>res.data);
    }
    delete(id){
        return axios.get(this.baseUrl+"delete/"+id).then(res=>res.data);
    }
}