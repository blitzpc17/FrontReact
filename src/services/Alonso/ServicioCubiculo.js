import axios from "axios";

export class ServicioCubiculo{
    baseUrl="http://localhost:8080/api/v1/cubiculo/";

    getAll(){
        return axios.get(this.baseUrl+"all").then(res=>res.data);
    }

    save(mensaje){
        return axios.post(this.baseUrl+"save",mensaje).then(res=>res.data);
    }
    delete(id){
        return axios.get(this.baseUrl+"delete/"+id).then(res=>res.data);
    }
}