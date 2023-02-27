import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import ModalRetroalimentacion from '../../components/Alonso/ModalRetroalimentacion';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import FileService from '../../services/FileService';

const cookies = new Cookies();

const ActividadesApoyoDocente = () => {

    const navigate = new useNavigate();

    const toast = useRef(null);

    const [seleccionActApoyoDocencia, setSeleccionActApoyoDocencia] = useState([]);
    const [visible, setVisible] = useState(false);
    const [comment, setComment] = useState('Sin Comentario');
    const [estadoDoc, setEstadoDoc] = useState(0);
    const [actividad, setActividad] = useState(null);

    const {iddocper} = new useParams();

    var fileService = new FileService();

    useEffect(() => {

        if(!cookies.get('idUsuario')){
            navigate('/');
        }else{
            if(!cookies.get('rolesUsuario').rol_docente)
                navigate('/plataforma/menu');
            else{
                if(cookies.get('actualTemp') === 'Actividades en Apoyo a la Docencia')
                    datosTabla();
                else
                    navigate('/plataforma/gestiondocencia');
            }
        }
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/materiasgrupos/actividades/" + cookies.get('idUsuario') + '/' + iddocper).then(res => setSeleccionActApoyoDocencia(res.data));
    }

    const verBodyTemplate = (rowData) => {
        return <a href={rowData.actdoc_pdf_actividad} target={'_blank'} rel="noreferrer" style={{ textDecoration: 'none' }}><Button icon="pi pi-eye" disabled={rowData.actdoc_pdf_actividad == null} className="p-button-rounded p-button-warning" /></a>;
    }

    const cargarBodyTemplate = (rowData) => {
        if(rowData.actdoc_pdf_actividad != null){
            return <Button icon="pi pi-sync" className="p-button-rounded p-button-success" onClick={() => subirPdf(rowData)}/>;
        }else{
            return <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" onClick={() => subirPdf(rowData)}/>;
        }
    }

    const subirPdf = (rowData) =>{
        setActividad(rowData);
        document.getElementById("inputFile").click();
    }

    const eliminarBodyTemplate = (rowData) => {
        return <Button icon="pi pi-trash" disabled={rowData.actdoc_pdf_actividad == null} className="p-button-rounded p-button-danger" onClick={() => eliminarPDF(rowData)}/>;
    }

    const eliminarPDF = async(rowData) =>{
        let objetoConDocumento = {
            ...rowData, 
            actdoc_pdf_actividad: null,
            actdoc_estadocomentario: 0
        }

        await fileService.delete(rowData.actdoc_pdf_actividad).then(data => {

            if(data.status === 200){
                axios.post("http://localhost:8080/api/v1/seleccionapoyo/save", objetoConDocumento).then(res => {
                    axios.get("http://localhost:8080/api/v1/materiasgrupos/actividades/" + cookies.get('idUsuario') + '/' + iddocper).then(res => setSeleccionActApoyoDocencia(res.data));
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
        if(rowData.actdoc_comentario != null){
            return <Button label={getEstado(rowData.actdoc_estadocomentario)} className="p-button-link" onClick={() => {
                setVisible(true);
                setComment(rowData.actdoc_comentario);
                setEstadoDoc(rowData.actdoc_estadocomentario);
            }}/>;
        }else{
            return <div>&nbsp;&nbsp;&nbsp;&nbsp;{getEstado(rowData.actdoc_estadocomentario)}</div>;
        }
    }

    const onChangeInputFile = (file) =>{
        guardarDocumentoAlCargar(file);
    }

    const guardarDocumentoAlCargar = async(file) => {
        if(file !== null){
            var formdata = new FormData();
            let ruta = cookies.get('lblPeriodo') + '\\' + cookies.get('nombre_Departamento') + '\\' + cookies.get('nombreUsuario') + '\\ACTIVIDADES EN APOYO A LA DOCENCIA';
            
            formdata.append('file', file);
            formdata.append('ruta', ruta);
            formdata.append('nombrearch', actividad.actdoc_nombre_actividad + '.pdf');
            
            await fileService.upload(formdata).then(data => {
                if(data.status === 200){
                    let objetoConDocumento = {
                        ...actividad, 
                        actdoc_pdf_actividad: data.message,
                        actdoc_estadocomentario: 3
                    }

                    axios.post("http://localhost:8080/api/v1/seleccionapoyo/save", objetoConDocumento).then(res => {
                        axios.get("http://localhost:8080/api/v1/materiasgrupos/actividades/" + cookies.get('idUsuario') + '/' + iddocper).then(res => setSeleccionActApoyoDocencia(res.data));
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
            <h1 style={{ textAlign: 'center' }}>ACTIVIDADES EN APOYO A LA DOCENCIA</h1>
            <DataTable value={seleccionActApoyoDocencia} responsiveLayout="scroll">
                <Column field="actdoc_nombre_actividad" header="Evidencia de Actividades Realizadas" style={{ width: '60%' }}></Column>
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

export default ActividadesApoyoDocente
