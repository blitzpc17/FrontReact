import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import FileService from '../../services/FileService';

const cookies = new Cookies();

const CapacitacionesDocentes = () => {
    const navigate = new useNavigate();

    const [capacitaciones, setCapacitaciones] = useState([]);

    const {idPeriodo} = new useParams();

    const { direcciones, cambiarBread } = useContext(BreadCrumbContext);
    useEffect(() => {

        if(!cookies.get('rolesUsuario').rol_docente)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Capacitaciones Impartidas')
                datosTabla();
            else
                navigate('/plataforma/gestiondocencia');
        }
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/capacitaciones/" + idPeriodo + "/"+ cookies.get('idUsuario')).then(res => setCapacitaciones(res.data));
    }

    const rowTemplate = (rowData) => {
        return capacitaciones.indexOf(rowData) + 1;
    }

    const constanciaBodyTemplate = (rowData) => {
        return <a href={rowData.cap_pdf_constancia_instructor} download={"Constancia " + rowData.cap_nombre_cap} style={{ textDecoration: 'none' }}><Button icon="pi pi-cloud-download" className="p-button-rounded p-button-danger"/></a>
    }

    const encuestaBodyTemplate = (rowData) => {
        return <a href={rowData.cap_pdf_encuesta_eficacia} download={"Encuesta de Eficacia " + rowData.cap_nombre_cap} style={{ textDecoration: 'none' }}><Button icon="pi pi-cloud-download" className="p-button-rounded p-button-success"/></a>
    }

    const encuestaParticipantesBody = (rowData) => {
        return <Button icon="pi pi-arrow-circle-right" className="p-button-rounded p-button-warning" onClick={() => redireccionActividades(rowData)}/>;
    }

    const redireccionActividades = (rowData) => {
        var addDirecciones = direcciones;
        addDirecciones.push({ label: 'Capacitaciones Impartidas', url: '/plataforma/capacitacionesimpartidas/' + idPeriodo });
        
        cambiarBread(addDirecciones, 'Encuestas Capacitación');

        navigate('/plataforma/encuestasparticipantes/'+rowData.id_capacitacion);
    }
    
    const documentosBodyTemplate = (rowData) => {
        return <Button icon="pi pi-arrow-circle-right" className="p-button-rounded p-button-help" onClick={() => redireccionDocumentos(rowData)}/>;
    }

    const redireccionDocumentos = (rowData) => {
        var addDirecciones = direcciones;
        addDirecciones.push({ label: 'Capacitaciones Impartidas', url: '/plataforma/capacitacionesimpartidas/'+idPeriodo });
        
        cambiarBread(addDirecciones, 'Documentos Capacitación');

        navigate('/plataforma/documentoscapdocentes/'+rowData.id_capacitacion);
    }

    const fechaBody = (rowData) => {
        return rowData.cap_fecha_impartir.substr(0,10);
    }

    return <div>
        <h1 style={{ textAlign: 'center' }}>CAPACITACIONES {cookies.get('lblPeriodo')}</h1>
        <DataTable value={capacitaciones} responsiveLayout="scroll">
            <Column header="#" body={ rowTemplate } style={{ width: '10%' }}></Column>
            <Column field="cap_nombre_cap" header="Nombre Capacitación" style={{ width: '40%' }}></Column>
            <Column header="Fecha a Impartir" body={fechaBody} style={{ width: '15%', textAlign: 'center' }}></Column>
            <Column header="Encuestas Participantes" body={encuestaParticipantesBody} style={{ width: '10%', textAlign: 'center' }}></Column>
            <Column header="Encuesta Eficacia" body={encuestaBodyTemplate} style={{ width: '10%', textAlign: 'center' }}  ></Column>
            <Column header="Documentos" body={documentosBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            <Column header="Constancia Instructor" body={constanciaBodyTemplate} style={{ width: '10%', textAlign: 'center' }}></Column>
        </DataTable>
    </div>;
};

export default CapacitacionesDocentes;
