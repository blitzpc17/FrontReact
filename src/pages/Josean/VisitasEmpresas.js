import React from 'react'

import { useState } from 'react';
import { useEffect, useContext } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { ServicioConsultaVisitas } from '../../services/Josean/ServicioConsultaVisitas';

import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const VisitasEmpresas = () => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread ,} = useContext(BreadCrumbContext);

    const [docentes, setDocentes] = useState(null);

    var cookiedep = cookies.get("id_Departamento");
    var cookieper = cookies.get("id_Periodo");

    var servicioconsVisitas = new ServicioConsultaVisitas();

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Docentes'){
                servicioconsVisitas.search(cookiedep,cookieper).then(data => setDocentes(data));
            }
            else
                navigate('/plataforma/menudepartamental');
        }
      
    }, [])
    

    const redireccionVisitas = (rowData) => {
        return(
            <>
             <Button icon="pi pi-angle-right" className="p-button-rounded p-button-info" onClick={() => {
                cambiarBreadLocal('Visitas Empresas');
                navigate('/plataforma/visitasdocentedep/' + rowData.id_Usuarios);     
            }} />
            </>
        );
    }

    const cambiarBreadLocal = (lblActual,rowData) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/visitasempresasdep' });


        cambiarBread(direccionesTemp, lblActual);
    }

    return (
        <div>
            <div className="card" >  
                    <h1>Visitas a Empresas {cookies.get("lblPeriodo")}</h1>    
                    <DataTable value={docentes} scrollable scrollHeight="67vh"  responsiveLayout="scroll" >
                    <Column header="Docente" field="user_Nombre" exportable={false} ></Column>
                    <Column header="Visitas Virtuales" field='visitasv' exportable={false} ></Column>
                    <Column header="Visitas Presenciales" field='visitasp' exportable={false} ></Column>
                    <Column header="Visitas" body={redireccionVisitas} exportable={false} ></Column>
                    </DataTable>
            </div>
        </div>
    );
}

export default VisitasEmpresas
