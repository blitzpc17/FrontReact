import axios from "axios";

export class CEProyectosDocencia{

    baseUrl="http://localhost:8080/api/v1/proyectosdocencia/";

    getCosultaDocentes(filtro,filtro2){
        return axios.get(this.baseUrl+"depadocentes/"+filtro+"/"+filtro2).then(res=>res.data);

    }

    getDocumentosGrupos(filtro,filtro2){
        return axios.get(this.baseUrl+"documentogrupo/"+filtro+"/"+filtro2).then(res=>res.data);
    }

    getSeguimientosAula(filtro,filtro2){
        return axios.get(this.baseUrl+"seguimientodocente/"+filtro+"/"+filtro2).then(res=>res.data);
    }

    getActividadesDocencia(filtro,filtro2){
        return axios.get(this.baseUrl+"docenteactividad/"+filtro+"/"+filtro2).then(res=>res.data);
    }

    getConsultaGrupo(filtro,filtro2){
        return axios.get(this.baseUrl+"gruposdocentes/"+filtro+"/"+filtro2).then(res=>res.data);
    }

    getEstadoDocencia(filtro,filtro2){
        return axios.get(this.baseUrl+"estadodocencia/"+filtro+"/"+filtro2).then(res=>res.data);
    }
    getEstadoGrupos(filtro,filtro2){
        return axios.get(this.baseUrl+"estadogrupo/"+filtro+"/"+filtro2).then(res=>res.data);
    }
    getCNombreMateriaDocente(filtro,filtro2,filtro3){
        return axios.get(this.baseUrl+"cnombremateriadocente/"+filtro+"/"+filtro2+"/"+filtro3).then(res=>res.data);
    }
    getCNombreDocente(filtro){
        return axios.get(this.baseUrl+"cnombredocente/"+filtro).then(res=>res.data);
    }
}
