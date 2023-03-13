import axios from "axios";

export class ServicioProgramaEducativo{

    baseUrl= "http://localhost:8080/api/v1/programaeducativo/";

    getAll(){
        return axios.get(this.baseUrl + "all").then(res => res.data);
    }
    
    save(persona){
        return axios.post(this.baseUrl + "documentos/guardar", persona).then(res => res.data);
    }

    delete(id){
        return axios.get(this.baseUrl + "delete/" + id).then(res => res.data);
    }

    ListarDocumentosPorDepto(deptoId){
        return axios.get(this.baseUrl + "documentos/depto/listar/" + deptoId).then(res => res.data);
    }

    BuscarDocumentoNombre(deptoId, nombredoc){
        return axios.get(this.baseUrl + "documentos/buscar/" + deptoId + "/" + nombredoc).then(res => res.data);
    }

    ListarReportesLaboratorio(deptoId){
        return axios.get(this.baseUrl + "documentos/files/listar/"+ deptoId).then(res => res.data);
    }


    

}