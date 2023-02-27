import axios from "axios";

export class CEAuxiliarLaboratorio{

    baseUrl="http://localhost:8080/api/v1/auxiliarlaboratorio/";

    getGestionAuxiliar(filtro,filtro2){
        return axios.get(this.baseUrl+"gestionauxiliar/"+filtro+"/"+filtro2).then(res=>res.data);

    }

    getEstadisticoAuxiliar(filtro){
        return axios.get(this.baseUrl+"estadisticoauxiliar/"+filtro).then(res=>res.data);
    }

    getCubiculosAuxiliar(filtro){
        return axios.get(this.baseUrl+"cubiculosauxiliar/"+filtro).then(res=>res.data);
    }
    getAuxiliarUsuarios(filtro){
        return axios.get(this.baseUrl+"auxiliarusuarios/"+filtro).then(res=>res.data);
    }
   
    getOcupacionAuxiliar(filtro){
        return axios.get(this.baseUrl+"ocupacionauxiliar/"+filtro).then(res=>res.data);
    }
    getValidarPractica(filtro,filtro2){
        return axios.get(this.baseUrl+"validarpractica/"+filtro+"/"+filtro2).then(res=>res.data);
    }
    getOcupacionIndividual(filtro){
        return axios.get(this.baseUrl+"ocupaciones/"+filtro).then(res=>res.data);
    }

    getDocenteCubiculo(filtro,filtro2){
        return axios.get(this.baseUrl+"docentecubiculo/"+filtro+"/"+filtro2).then(res=>res.data);
    }
}
