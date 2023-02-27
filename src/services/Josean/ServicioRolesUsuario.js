import axios from "axios";

export class ServicioRolesUsuario{

    baseUrl= "http://localhost:8080/api/v1/rolesusuario/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }


    save(persona){
        return axios.post(this.baseUrl + "save", persona).then(res => res.data);
    }

    delete(id){
        return axios.get(this.baseUrl + "delete/" + id).then(res => res.data);
    }

    deleteroles(id){
        return axios.get(this.baseUrl + "deleteroles/" + id).then(res => res.data);
    }

    selectroles(id){
        return axios.get(this.baseUrl + "selectroles/" + id).then(res => res.data);
    }

    setjefefalse(iduser){
	return axios.get(this.baseUrl + "setjefefalse/" + iduser).then(res => res.data);
    }

}
