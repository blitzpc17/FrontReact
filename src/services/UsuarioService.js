import axios from "axios";

export class UsuarioService{

    baseUrl = "http://localhost:8080/api/v1/usuarios/";

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

    login(correo, pass){
        return axios.get(this.baseUrl + "login", { params: {correo: correo, pass: pass}} ).then(res => res.data);
    }

    recuperar(correo){
        return axios.get(this.baseUrl + "recuperacontra", { params: {correo: correo}} ).then(res => res.data);
    }
}
