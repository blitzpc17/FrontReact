import axios from "axios";

export class ProductosDocenciaService{

    baseUrl = "http://localhost:8080/api/v1/productosdocencia/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(id){
        return axios.post(this.baseUrl + "save", id).then(res => res.data);
    }

    delete(id){
        return axios.get(this.baseUrl + "delete/" + id).then(res => res.data);
    }
}