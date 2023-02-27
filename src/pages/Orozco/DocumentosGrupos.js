import React, { useState, useEffect, useContext, useRef } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import ModalRetroalimentacion from '../../components/Alonso/ModalRetroalimentacion';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { Toast } from 'primereact/toast';
import FileService from '../../services/FileService';

const cookies = new Cookies();

const DocumentosGrupos = () => {

    const navigate = new useNavigate();

    const toast = useRef(null);

    const [documentosGrupos, setDocumentosGrupos] = useState([]);
    const [visible, setVisible] = useState(false);
    const [comment, setComment] = useState('Sin Comentario');
    const [estadoDoc, setEstadoDoc] = useState(0);
    const [documentoGrupo, setDocumentoGrupo] = useState(null);

    const {idGrupo} = new useParams();

    const { actual } = useContext(BreadCrumbContext);

    var fileService = new FileService();

    useEffect(() => {

        if(!cookies.get('idUsuario')){
            navigate('/');
        }else{
            if(!cookies.get('rolesUsuario').rol_docente || !cookies.get('actualTemp').includes(' Grupo '))
                navigate('/plataforma/menu');
            else{

                datosTabla();
            }
        }
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/materiasgrupos/documentos/" + idGrupo + '/'+cookies.get('id_Departamento')).then(res => setDocumentosGrupos(res.data));
    }

    const verBodyTemplate = (rowData) => {
        return <a href={rowData.docgrp_pdf_documento} target={'_blank'} rel="noreferrer" style={{ textDecoration: 'none' }}><Button icon="pi pi-eye" disabled={rowData.docgrp_pdf_documento == null} className="p-button-rounded p-button-warning" /></a>;
    }

    const cargarBodyTemplate = (rowData) => {
        if(rowData.docgrp_pdf_documento != null){
            return <Button icon="pi pi-sync" className="p-button-rounded p-button-success" onClick={() => subirPdf(rowData)}/>;
        }else{
            return <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" onClick={() => subirPdf(rowData)}/>;
        }
    }

    const subirPdf = (rowData) =>{
        setDocumentoGrupo(rowData);
        document.getElementById("inputFile").click();
    }

    const onChangeInputFile = (file) =>{
        guardarDocumentoAlCargar(file);
    }

    const guardarDocumentoAlCargar = async(file) => {
        if(file !== null){
            var formdata = new FormData();
            let ruta = cookies.get('lblPeriodo') + '\\' + cookies.get('nombre_Departamento') + '\\' + cookies.get('nombreUsuario') + '\\' + actual.toUpperCase();
            
            formdata.append('file', file);
            formdata.append('ruta', ruta);
            formdata.append('nombrearch', documentoGrupo.frm_nombre + '.pdf');
            
            await fileService.upload(formdata).then(data => {
                if(data.status === 200){
                    let objetoConDocumento = {
                        ...documentoGrupo, 
                        docgrp_pdf_documento: data.message,
                        docgrp_estadocomentario: 3,
                        id_grupo: idGrupo
                    }

                    axios.post("http://localhost:8080/api/v1/documentosgrupos/save", objetoConDocumento).then(res => {
                        
                        axios.get("http://localhost:8080/api/v1/materiasgrupos/documentos/" + idGrupo + '/'+cookies.get('id_Departamento')).then(res => setDocumentosGrupos(res.data));
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
        return <Button icon="pi pi-trash" disabled={rowData.docgrp_pdf_documento == null} className="p-button-rounded p-button-danger" onClick={() => eliminarPDF(rowData)}/>;
    }

    const eliminarPDF = async(rowData) =>{
        let objetoConDocumento = {
            ...documentoGrupo, 
            docgrp_pdf_documento: null,
            docgrp_estadocomentario: 0,
            id_grupo: idGrupo
        }

        await fileService.delete(rowData.docgrp_pdf_documento).then(data => {

            if(data.status === 200){
                axios.post("http://localhost:8080/api/v1/documentosgrupos/save", objetoConDocumento).then(res => {
                    axios.get("http://localhost:8080/api/v1/materiasgrupos/documentos/" + idGrupo + '/'+cookies.get('id_Departamento')).then(res => setDocumentosGrupos(res.data));
                    toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Eliminado Correctamente', life: 3000});
                });
            }else{
                if(data.status === 501){
                    toast.current.show({severity:'error', summary: '¡Atención!', detail:data.message, life: 3000});
                }
            }

        });
    }

    const estadoBodyTemplate = (rowData) => {
        if(rowData.docgrp_comentario != null){
            return <Button label={getEstado(rowData.docgrp_estadocomentario)} className="p-button-link" onClick={() => {
                setVisible(true);
                setComment(rowData.docgrp_comentario);
                setEstadoDoc(rowData.docgrp_estadocomentario);
            }}/>;
        }else{
            return <div>&nbsp;&nbsp;&nbsp;&nbsp;{getEstado(rowData.docgrp_estadocomentario)}</div>;
        }
    }

    const getEstado = (estado) => {
        switch (estado) {
            case 1:
                return   'Completo';
            case 2:
                return   'Incompleto';
            case 3:
                return   'Subido';
            default:
                return   'Sin Subir';
        }
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>DOCUMENTOS {actual.toUpperCase()}</h1>
            <DataTable value={documentosGrupos} responsiveLayout="scroll">
                <Column field="rowdgc" header="#" style={{ width: '10%' }}></Column>
                <Column field="frm_nombre" header="Formato" style={{ width: '50%' }}></Column>
                <Column header="Estado" body={estadoBodyTemplate} style={{ width: '25%' }}></Column>
                <Column header="Ver" body={verBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
                <Column header="Cargar" body={cargarBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
                <Column header="Eliminar" body={eliminarBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            </DataTable>
            <input type="file" id="inputFile" hidden accept=".pdf" onChange={(e) => onChangeInputFile(e.target.files[0])}/>
            <ModalRetroalimentacion header={"COMENTARIO DOCUMENTO"}  visible={visible} modal={true} style={{width: '500px'}}  onHide={()=>setVisible(false)} comentario={comment} estado={getEstado(estadoDoc)}/>
            <Toast ref={toast} />
        </div>
    )
}

export default DocumentosGrupos
