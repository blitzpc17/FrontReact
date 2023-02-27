import axios from "axios";

export class ServicioDocumentoLaboratorio{
    baseUrl="http://localhost:8080/api/v1/documentolaboratorio/";

    getAll(){
        return axios.get(this.baseUrl+"all").then(res=>res.data);
    }

    save(doclab){
        return axios.post(this.baseUrl+"save",doclab).then(res=>res.data);
    }
    delete(id){
        return axios.get(this.baseUrl+"delete/"+id).then(res=>res.data);
    }
}