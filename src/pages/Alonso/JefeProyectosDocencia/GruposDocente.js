import React, {  useState, useEffect, useContext } from 'react';
import TablaRedirecciones from '../../../components/Orozco/TablaRedirecciones';
import { CEProyectosDocencia } from '../../../services/ConsultasEspecificas/Alonso/CEProyectosDocencia';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbContext from '../../../context/BreadCrumbContext';

const cookies=new Cookies();

const GruposDocente = () => {
    const navigate = new useNavigate();
    const cEProyectosDocencia=new CEProyectosDocencia();
    const [grupos, setGrupos] = useState(null);
    const [nombreDocente, setNombreDocente] = useState("");
    // Parametros para las consultas
    const departamento = parseInt(cookies.get('id_Departamento'));
    const {iddocper} = new useParams();
    const { cambiarBread, actual, direcciones } = useContext(BreadCrumbContext);
    const docper = iddocper;

    const accion = (rowData) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/gruposjefedocencia/'+docper });
  
        cambiarBread(direccionesTemp, "Documentos Grupos");
  
        navigate('/plataforma/documentosjefedocencia/' + docper + "/" + rowData.id_grupo);
    }

    const columnasRedireccion = [
        {field: "id_grupo", header:"#", redireccion: false},
        {field: "clavemateria", header:"Clave Materia", redireccion: false},
        {field: "nombre", header:"Materia", redireccion: false},
        {field: "grupo", header:"Grupo", redireccion: false},
        {field: "telefono", header:"Documentos", redireccion: true, icon: "pi pi-chevron-circle-right", className: "p-button-rounded p-button-success", accion: (rowData) => accion(rowData)}
   
      ];
      
      
    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_proyectos_docencia)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Grupos'){
                cEProyectosDocencia.getConsultaGrupo(departamento,docper).then(data=>{setGrupos(data);setNombreDocente(data[0].docente)});
            }
            else
                navigate('/plataforma/periodosjefedocencia');
        }
        
      
    }, [])
    return (
        <div>
            <center><h2>Grupos del Docente {nombreDocente}</h2></center>
            <TablaRedirecciones columnas={columnasRedireccion} value={grupos}/>
            
        </div>
    )
}

export default GruposDocente
