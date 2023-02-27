import React from 'react'

import { useState } from 'react';
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { ServicioConsultaAsesores } from '../../services/Josean/ServicioConsultaAsesores';

import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const AsesoresServicio = () => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const [asesores, setAsesores] = useState(null);

    var cookiedep=cookies.get("id_Departamento");
    var cookieper=cookies.get("id_Periodo");

    var servicioconsAsesores = new ServicioConsultaAsesores();

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Servicio Social'){
                servicioconsAsesores.search(cookiedep,cookieper).then(data => setAsesores(data));
            }
            else
                navigate('/plataforma/menudepartamental');
        }
      
    }, [])
    

    const redireccionDocumentos = (rowData) => {
        return(
            <>
             <Button icon="pi pi-angle-right" className="p-button-rounded p-button-info" onClick={() => {
                cambiarBreadLocal('Asesorados');
                navigate('/plataforma/alumnoservicio/' + rowData.id_Usuarios );
            }} />
            </>
        );
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/serviciosocialdep' });

        cambiarBread(direccionesTemp, lblActual);
    }

    return (
        <div>
            <div className="card" >  
                    <h1>Asesores Servicio Social {cookies.get("lblPeriodo")}</h1>    
                    <DataTable value={asesores} scrollable scrollHeight="67vh"  responsiveLayout="scroll" >
                    <Column header="Nombre del Asesor" field="user_Nombre" exportable={false} ></Column>
                    <Column header="Numero de Asesorados" field='asesorados' exportable={false} ></Column>
                    <Column header="Documentos" body={redireccionDocumentos} exportable={false} ></Column>
                    </DataTable>
            </div>
        </div>
    );
}

export default AsesoresServicio