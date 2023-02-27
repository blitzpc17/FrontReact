import axios from "axios";

export class ServicioDocentePeriodo{

    baseUrl="http://localhost:8080/api/v1/docenteperiodo/";

    getAll(){
        return axios.get(this.baseUrl+"all").then(res=>res.data);
    }

    save(docpec){
        return axios.post(this.baseUrl+"save",docpec).then(res=>res.data);
    }
    
    delete(id){
        return axios.get(this.baseUrl+"delete/"+id).then(res=>res.data);
    }
}