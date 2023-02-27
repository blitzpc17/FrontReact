import axios from "axios";

export class CEJefeLaboratorio{

    baseUrl="http://localhost:8080/api/v1/jefelaboratorio/";

    getGestionesLaboratorios(filtro,filtro2){
        return axios.get(this.baseUrl+"gestioneslaboratorios/"+filtro+"/"+filtro2).then(res=>res.data);

    }

    getJSolicitudes(filtro,filtro2,filtro3){
        return axios.get(this.baseUrl+"gestionsolicitudes/"+filtro+"/"+filtro2+"/"+filtro3).then(res=>res.data);
    }

    getDocumentosLaboratorios(filtro,filtro2){
        return axios.get(this.baseUrl+"documentoslaboratorios/"+filtro+"/"+filtro2).then(res=>res.data);
    }

    getNombreLabUser(filtro){
        return axios.get(this.baseUrl+"nombrelabuser/"+filtro).then(res=>res.data);
    }
}