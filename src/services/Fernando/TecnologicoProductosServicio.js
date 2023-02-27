import axios from "axios";

export class TecnologicoProductosServicio{

    baseUrl = "http://localhost:8080/api/v1/tecnologicoq/";
    search(dep, periodo){
        return axios.get(this.baseUrl + "search/" + dep + '/' + periodo).then(res => res.data);
    }
}
