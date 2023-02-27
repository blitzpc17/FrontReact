import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const DocumentosCapacitacionesDesarrollo = () => {

    const navigate = new useNavigate();

    const [docCapacitaciones, setDocCapacitaciones] = useState([]);

    const {idCapacitacion} = new useParams();

    const { actual } = useContext(BreadCrumbContext);

    useEffect(() => {

        if(!cookies.get('rolesUsuario').rol_jefe_desarrollo_academico && !cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Documentos')
                datosTabla();
            else
                navigate('/plataforma/menu');
        }
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/materiasgrupos/capacitaciones/" + idCapacitacion).then(res => setDocCapacitaciones(res.data));
    }

    const verBodyTemplate = (rowData) => {
        return <a href={rowData.doccap_pdf_documento} target={'_blank'} rel="noreferrer" style={{ textDecoration: 'none' }}><Button icon="pi pi-eye" disabled={rowData.doccap_pdf_documento == null} className="p-button-rounded p-button-warning" /></a>;
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>DOCUMENTOS {actual.toUpperCase()}</h1>
            <DataTable value={docCapacitaciones} responsiveLayout="scroll">
                <Column field="formato" header="Formato" ></Column>
                <Column header="Ver" body={verBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            </DataTable>
        </div>
    )
}

export default DocumentosCapacitacionesDesarrollo
