import axios from "axios";

export class QConvocatorias{

    baseUrl = "http://localhost:8080/api/v1/convocatoriasq/";
    search(id, per){
        return axios.get(this.baseUrl + "search/" + id + "/" + per).then(res => res.data);
    }
}