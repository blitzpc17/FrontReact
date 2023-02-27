import axios from "axios";

export class ServiceInnovacion{
    baseUrl="http://localhost:8080/api/v1/innovacion/";

    getAll(){
        return axios.get(this.baseUrl+"all").then(res=>res.data);
    }

    save(inno){
        return axios.post(this.baseUrl+"save",inno).then(res=>res.data);
    }
    delete(id){
        return axios.get(this.baseUrl+"delete/"+id).then(res=>res.data);
    }
}
