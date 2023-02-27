import React from 'react'

import { useState, useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { ServicioConsultaVisitasDocente } from '../../services/Josean/ServicioConsultaVisitasDocente';

import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const VisitasDocente = () => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const [empresas, setEmpresas] = useState(null);

    var servicioconsVisitasDocente = new ServicioConsultaVisitasDocente();

    var cookiedep = cookies.get("id_Departamento");
    var cookieper = cookies.get("id_Periodo");
    const {idus} = new useParams();
    var iduser = parseInt(idus);

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Visitas Empresas'){
                servicioconsVisitasDocente.search(cookiedep,cookieper,iduser).then(data => setEmpresas(data));
            }
            else
                navigate('/plataforma/menudepartamental');
        }
        
    }, [])
    

    const redireccionDocumentos = (rowData) => {
        return(
            <>
             <Button icon="pi pi-angle-right" className="p-button-rounded p-button-info" onClick={() => {
                 cambiarBreadLocal('Documentos');
                 navigate('/plataforma/documentosvisitasdep/' + rowData.vst_nombre_empresa + '/' + rowData.id_Visita);
             }} />
            </>
        );
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/visitasdocentedep/' + iduser });

        cambiarBread(direccionesTemp, lblActual);
    }

    return (
        <div>
            <div className="card" >  
                    <h1>Visitas de {"docente"}</h1>    
                    <DataTable value={empresas} scrollable scrollHeight="67vh"  responsiveLayout="scroll"  >
                    <Column header="Tipo de Visita" field="vst_tipo_visita" exportable={false} ></Column>
                    <Column header="Empresa" field='vst_nombre_empresa' exportable={false} ></Column>
                    <Column header="Documentos" body={redireccionDocumentos} exportable={false} ></Column>
                    </DataTable>
            </div>
        </div>
    );
}

export default VisitasDocente