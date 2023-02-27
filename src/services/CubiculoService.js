import axios from "axios";

export class CubiculoService{

    baseUrl = "http://localhost:8080/api/v1/cubiculo/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }

    save(usuario){
        return axios.post(this.baseUrl + "save", usuario).then(res => res.data);
    }

    delete(id){
        return axios.get(this.baseUrl + "delete/" + id).then(res => res.data);
    }

    find(id){
        return axios.get(this.baseUrl + "find/" + id).then(res => res.data);
    }

    buscarCubiculoxUsuario(id_usuarios){
        return axios.get(this.baseUrl + "usuario", { params: {id_usuarios: id_usuarios}} ).then(res => res.data);
    }
}
