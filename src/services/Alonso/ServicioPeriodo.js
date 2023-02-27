import axios from "axios";

 export class ServicioPeriodo{
    baseUrl="http://localhost:8080/api/v1/periodos/";

    getAll(){
        return axios.get(this.baseUrl+"all").then(res=>res.data);
    }

    save(periodo){
        return axios.post(this.baseUrl+"save",periodo).then(res=>res.data);
    }
    delete(id){
        return axios.get(this.baseUrl+"delete/"+id).then(res=>res.data);
    }
}