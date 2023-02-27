import axios from "axios";

export class TecnologicoService{

    baseUrl = "http://localhost:8080/api/v1/productosdestec/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(periodo){
        return axios.post(this.baseUrl + "save", periodo).then(res => res.data);
    }

    delete(id_periodo){
        return axios.get(this.baseUrl + "delete/" + id_periodo).then(res => res.data);
    }
}
