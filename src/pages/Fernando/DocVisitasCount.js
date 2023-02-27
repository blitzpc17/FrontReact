import React, { useState, useEffect, useContext } from 'react'
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CountVisitasService } from '../../services/Fernando/CountVisitasService';
import { Button } from 'primereact/button';

import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { ServicioPeriodos } from '../../services/Fernando/ServicioPeriodos';

const cookies = new Cookies();

const DocVisitasCount = (props) => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const {titulo, iddep} = new useParams();

    const idDepReg = parseInt(iddep);
    const idPer = parseInt(cookies.get('id_Periodo')); 
    const nombrePer = cookies.get('lblPeriodo'); 

    const user = props.dif; //Variable para diferenciar usuario para redireccion 0- secretaria
    


    const [value, setValue] = useState([]);
    const CountVisita = new CountVisitasService();

    const [periodo, setPeriodo] = useState([]);
    const ServicioPer = new ServicioPeriodos();
    
    useEffect(() => {
        if((user == 0 && !cookies.get('rolesUsuario').rol_secretaria_vinculacion) || (user == 1 && !cookies.get('rolesUsuario').rol_jefe_vinculacion))
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Visitas Docentes'){
                CountVisita.search(idDepReg, idPer).then(data => setValue(data));
                ServicioPer.getAll().then(data => setPeriodo(data));
            }
            else{
                if(user == 0)
                    navigate('/plataforma/departamentosvisitas');
                else
                    navigate('/plataforma/menuvinculacion');
            }
        }
        
    }, []); 
   
    const redireccion =(rowData)=>{
        //idDepReg
        //titulo
        //rowData.vst_docente
        //rowData.id_Usuarios
        return(
            <Button icon="pi pi-angle-right" className="p-button-rounded p-button-info"
                onClick={()=>{
                    if(user == 0){
                        cambiarBreadLocal('Docentes Visita');
                        navigate('/plataforma/docentevisita/'+ rowData.id_Usuarios + '/' + titulo + '/' + rowData.vst_docente + '/' + idDepReg);
                    }else{
                        cambiarBreadLocal('Docentes Visita');
                        navigate('/plataforma/docentevisitajefe/'+ rowData.id_Usuarios + '/' + titulo + '/' + rowData.vst_docente + '/' + idDepReg);
                    }
                }}
            />
        )
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        if(user == 0)
            direccionesTemp.push({ label: actual, url: '/plataforma/visitasdocente/' + titulo + '/' + iddep });
        else
            direccionesTemp.push({ label: actual, url: '/plataforma/visitasdocentejefe/' + titulo + '/' + iddep });

        cambiarBread(direccionesTemp, lblActual);
    }

    return (
        <div>            
            <Panel>               
                <center>
                    <div><h1>Visitas a Empresas</h1></div>
                    <div><h2>{titulo}</h2></div>
                    <div><h3>{nombrePer}</h3></div>
                </center>
                <DataTable value={value} responsiveLayout="scroll">
                    <Column field="vst_docente" header="Docente"></Column>
                    <Column field="vst_virtuales" header="Visitas Virtuales"></Column>
                    <Column field="vst_presencial" header="Visitas Presenciales"></Column>
                    <Column header="Visitas" body={redireccion}></Column>
                </DataTable>                
            </Panel>
        </div>
    )
}

export default DocVisitasCount
