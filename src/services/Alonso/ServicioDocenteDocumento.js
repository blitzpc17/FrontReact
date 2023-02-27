import axios from "axios";

export class ServicioDocenteDocumento
{

    baseUrl="http://localhost:8080/api/v1/docentedocumento/";

    getAll(){
        return axios.get(this.baseUrl+"all").then(res=>res.data);
    }

    save(documento){
        return axios.post(this.baseUrl+"save",documento).then(res=>res.data);
    }
    
    delete(id){
        return axios.get(this.baseUrl+"delete/"+id).then(res=>res.data);
    }
}