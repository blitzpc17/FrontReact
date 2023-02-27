import axios from "axios";

export default class FileService{

    baseUrl = "http://localhost:8080/api/v1/file/";

    upload(formdata){
        return axios.post(this.baseUrl + "upload", formdata).then(res => res.data);
    }

    delete(nombrearch){
        return axios.get(this.baseUrl + "delete" , {params:{nombrearch:nombrearch}}).then(res => res.data);
    }
}
