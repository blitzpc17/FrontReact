import axios from "axios";

 export class ServicioOcupacionLaboratorio{
    baseUrl="http://localhost:8080/api/v1/ocupacionlaboratorio/";

    getAll(){
        return axios.get(this.baseUrl+"all").then(res=>res.data);
    }

    save(oculab){
        return axios.post(this.baseUrl+"save",oculab).then(res=>res.data);
    }
    delete(id){
        return axios.get(this.baseUrl+"delete/"+id).then(res=>res.data);
    }
}