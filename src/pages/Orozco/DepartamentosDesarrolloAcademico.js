import React, { useEffect, useState, useContext } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from "axios";
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const DepartamentosDesarrolloAcademico  = () => {
    const navigate = new useNavigate();

    const [departamentos, setDepartamentos] = useState([]);

    const {id_desarrollo} = new useParams();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_desarrollo_academico)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Departamentos')
                datosPeriodo();
            else
                navigate('/plataforma/periodosdesarrollo');
        }
    }, []);

    const datosPeriodo = async () => {
        await axios.get("http://localhost:8080/api/v1/departamento/academicos/" + id_desarrollo).then(res => setDepartamentos(res.data));
    }

    const redireccionTemplate = (rowData) => {
        return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-info" onClick={() => cambiarBreadLocal(rowData)}/>;
    }

    const cambiarBreadLocal = (rowData) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/departamentosdesarrollo/' +  id_desarrollo});

        cambiarBread(direccionesTemp, 'Capacitaciones');

        navigate('/plataforma/capacitacionesdesarrollo/'+rowData.dep_creado_por)
    }

    const descargarBodyTemplate = (rowData) => {
        return <a href={rowData.dep_actualizado_por} download={"Diagnóstico y Necesidades de FyADyP " + rowData.dep_nombre + '.pdf'} style={{ textDecoration: 'none' }}><Button icon="pi pi-cloud-download" disabled={rowData.dep_actualizado_por == null} className="p-button-rounded p-button-success"/></a>;
    }

    const rowTemplate = (rowData) => {
        return departamentos.indexOf(rowData) + 1;
    }

    return <div>
        <h1 style={{ textAlign: 'center' }}>DEPARTAMENTOS</h1>
        <DataTable value={departamentos} responsiveLayout="scroll">
            <Column header="#" body={rowTemplate} style={{ width: '10%' }}></Column>
            <Column field="dep_nombre" header="Departamento" style={{ width: '60%' }}></Column>
            <Column header="Diagnóstico y Necesidades de FyADyP" body={ descargarBodyTemplate } style={{ width: '15%', textAlign: 'center' }}></Column>
            <Column header="Gestión de Capacitaciones" body={redireccionTemplate} style={{ width: '15%', textAlign: 'center' }}></Column>
        </DataTable>
    </div>;
};

export default DepartamentosDesarrolloAcademico ;
