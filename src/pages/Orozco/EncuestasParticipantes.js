import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const cookies = new Cookies();

const EncuestasParticipantes = () => {

    const navigate = new useNavigate();

    const [participantes, setParticipantes] = useState([]);
    const [nombreCap, setNombreCap] = useState("");

    const {idCapacitacion} = new useParams();

    useEffect(() => {

        if(!cookies.get('rolesUsuario').rol_jefe_departamento && !cookies.get('rolesUsuario').rol_docente)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Encuestas Capacitación')
                datosTabla();
            else
                navigate('/plataforma/menu');
        }
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/participantes/" + idCapacitacion).then(res => setParticipantes(res.data));

        await axios.get("http://localhost:8080/api/v1/capacitaciones/find/" + idCapacitacion).then(res => setNombreCap(res.data.cap_nombre_cap));
    }

    const verBodyTemplate = (rowData) => {
        return <a href={rowData.part_pdf_encuesta} target={'_blank'} rel="noreferrer" style={{ textDecoration: 'none' }}><Button icon="pi pi-eye" disabled={rowData.part_pdf_encuesta == null} className="p-button-rounded p-button-warning" /></a>;
    }
    const rowTemplate = (rowData) => {
        return participantes.indexOf(rowData) + 1;
    }

    const getNombre = (rowdata) =>{
        var doc = rowdata.part_pdf_constancia.split('~');
        return doc[0];
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>ENCUESTAS POR PARTICIPANTES DE {nombreCap.toUpperCase()}</h1>
            <DataTable value={participantes} responsiveLayout="scroll">
                <Column header="#" body={rowTemplate} style={{ width: '10%' }}></Column>
                <Column header="Formato" body={getNombre}></Column>
                <Column header="Ver" body={verBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            </DataTable>
        </div>
    )
}

export default EncuestasParticipantes
