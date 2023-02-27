import React from 'react'

import { useState, useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';
import { ServicioConsultaAlumnos } from '../../services/Josean/ServicioConsultaAlumnos';

import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const AlumnosServicio = () => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const [alumnos, setAlumnos] = useState(null);
    const [usuario, setUsuario] = useState(null);

    var cookiedep = cookies.get("id_Departamento");
    var cookieper = cookies.get("id_Periodo");

    const {idus} = new useParams();
    var cookiedocente = parseInt(idus); //se recibe de AsesoresServicio

    var servicioconsAlumno = new ServicioConsultaAlumnos();

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Asesorados'){
                servicioconsAlumno.search(cookiedep,cookieper,cookiedocente).then(data => setAlumnos(data));
                axios.get("http://localhost:8080/api/v1/usuarios/find/" + cookiedocente).then(res => setUsuario(res.data.user_Nombre));
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
                 navigate('/plataforma/documentosocialdep/' + rowData.serv_nombre_Alumno + '/' + rowData.serv_no_Control + '/' + rowData.id_Servicio );
            /* Redireccion a DocumentosSocial se manda rowData.id_Servicio (o todo el rowData para datos del alumno)*/
            }} />
            </>
        );
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/alumnoservicio/' + cookiedocente });

        cambiarBread(direccionesTemp, lblActual);
    }

   return (
        <div>
            <div className="card" >  
                    <h1>Alumnos en Servicio Social de {usuario}</h1>    
                    <DataTable value={alumnos} scrollable scrollHeight="67vh"  responsiveLayout="scroll">
                    <Column header="Nombre del Alumno" field="serv_nombre_Alumno" exportable={false} ></Column>
                    <Column header="No. de Control" field='serv_no_Control' exportable={false} ></Column>
                    <Column header="Documentos" body={redireccionDocumentos} exportable={false} ></Column>
                    </DataTable>
            </div>
        </div>
    );
}

export default AlumnosServicio
