import React, { useState, useEffect, useContext, useRef } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { Toast } from 'primereact/toast';
import FileService from '../../services/FileService';

const cookies = new Cookies();

const DocumentosCapacitacionesDocentes = () => {

    const navigate = new useNavigate();

    const toast = useRef(null);

    const [docCapacitaciones, setDocCapacitaciones] = useState([]);
    const [docCapacitacion, setDocCapacitacion] = useState(null);

    const {idCapacitacion} = new useParams();

    const { actual } = useContext(BreadCrumbContext);

    var fileService = new FileService();

    useEffect(() => {

        if(!cookies.get('rolesUsuario').rol_jefe_departamento && !cookies.get('rolesUsuario').rol_docente)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Documentos Capacitación')
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

    const cargarBodyTemplate = (rowData) => {
        return <Button icon={rowData.doccap_pdf_documento != null?"pi pi-sync":"pi pi-cloud-upload"} className="p-button-rounded p-button-success" onClick={() => subirPdf(rowData)}/>;
    }

    const subirPdf = (rowData) =>{
        setDocCapacitacion(rowData);
        document.getElementById("inputFileDocCapsDoc").click();
    }

    const onChangeInputFile = (file) =>{
        guardarDocumentoAlCargar(file);
    }

    const guardarDocumentoAlCargar = async(file) => {
        if(file !== null){
            
            var formdata = new FormData();
            let ruta = cookies.get('lblPeriodo') + '\\' + cookies.get('nombre_Departamento') + '\\' + cookies.get('nombreUsuario') + '\\CAPACITACIONES IMPARTIDAS\\CAPACITACIÓN ' + docCapacitacion.id_capacitacion;
            
            formdata.append('file', file);
            formdata.append('ruta', ruta);
            formdata.append('nombrearch', docCapacitacion.formato + '.pdf');
            
            await fileService.upload(formdata).then(data => {
                if(data.status === 200){
                    let objetoConDocumento = {
                        ...docCapacitacion,
                        id_capacitacion: parseInt(idCapacitacion),
                        doccap_pdf_documento: data.message,
                        id_doc_capacitaciones: docCapacitacion.id_doc_capacitaciones === 0? null : docCapacitacion.id_doc_capacitaciones
                    }

                    axios.post("http://localhost:8080/api/v1/documentoscapacitaciones/save", objetoConDocumento).then(res => {
                        
                        axios.get("http://localhost:8080/api/v1/materiasgrupos/capacitaciones/" + idCapacitacion).then(res => setDocCapacitaciones(res.data));
                        toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Agregado Correctamente', life: 3000});
                    });

                }else{
                    if(data.status === 501){
                        toast.current.show({severity:'error', summary: '¡Atención!', detail:'No se ha podido agregar el Documento', life: 3000});
                    }
                }
            });

        }
    }

    const eliminarBodyTemplate = (rowData) => {
        return <Button icon="pi pi-trash" disabled={rowData.doccap_pdf_documento == null} className="p-button-rounded p-button-danger" onClick={() => eliminarPDF(rowData)}/>;
    }

    const eliminarPDF = async(rowData) =>{
        let objetoConDocumento = {
            ...rowData, 
            doccap_pdf_documento: null
        }
        
        await fileService.delete(rowData.doccap_pdf_documento).then(data => {

            if(data.status === 200){
                axios.post("http://localhost:8080/api/v1/documentoscapacitaciones/save", objetoConDocumento).then(res => {
                    axios.get("http://localhost:8080/api/v1/materiasgrupos/capacitaciones/" + idCapacitacion).then(res => setDocCapacitaciones(res.data));
                    toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Eliminado Correctamente', life: 3000});
                });
            }else{
                if(data.status === 501){
                    toast.current.show({severity:'error', summary: '¡Atención!', detail:data.message, life: 3000});
                }
            }

        });
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>DOCUMENTOS {actual.toUpperCase()}</h1>
            <DataTable value={docCapacitaciones} responsiveLayout="scroll">
                <Column field="formato" header="Formato" ></Column>
                <Column header="Ver" body={verBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
                <Column header="Cargar" body={cargarBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
                <Column header="Eliminar" body={eliminarBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            </DataTable>
            <input type="file" id="inputFileDocCapsDoc" hidden accept=".pdf" onChange={(e) => onChangeInputFile(e.target.files[0])}/>
            <Toast ref={toast} />
        </div>
    )
}

export default DocumentosCapacitacionesDocentes
