import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import FileService from '../../services/FileService';
import DialogSUbidaDocumentos from '../../components/Orozco/DialogSUbidaDocumentos';

const cookies = new Cookies();

const ParticipacionCapacitaciones = () => {

    const navigate = new useNavigate();

    const toast = useRef(null);

    const [participacion, setParticipacion] = useState({
        id_participante: null,
        id_capacitacion: null,
        id_Usuarios: null,
        part_pdf_encuesta: null,
        part_pdf_constancia: null,
        nombre: null,
        row: null,
        fecha: null
        });
    const [participaciones, setParticipaciones] = useState(null);
    const [visible, setVisible] = useState(false);

    const {idPeriodo} = new useParams();

    var fileService = new FileService();

    useEffect(() => {

        if(!cookies.get('idUsuario')){
            navigate('/');
        }else{
            if(!cookies.get('rolesUsuario').rol_docente)
                navigate('/plataforma/menu');
            else{
                if(cookies.get('actualTemp') === 'Participacion en Capacitaciones')
                    datosTabla();
                else
                    navigate('/plataforma/gestiondocencia');
            }
        }
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/materiasgrupos/participaciones/" + cookies.get('idUsuario') + "/" + idPeriodo).then(res => setParticipaciones(res.data));
    }

    const constanciaBodyTemplate = (rowData) => {
        return <a href={rowData.part_pdf_constancia} download={rowData.nombre + ' DE ' + cookies.get('lblPeriodo')} target={'_blank'} rel="noreferrer" style={{ textDecoration: 'none' }}><Button icon="pi pi-cloud-download" disabled={rowData.part_pdf_constancia == null} className="p-button-rounded p-button-success" /></a>;
    }

    const encuestaBodyTemplate = (rowData) => {
        return <Button icon={rowData.part_pdf_encuesta != null ? "pi pi-sync" : "pi pi-cloud-upload"} className="p-button-rounded p-button-help" onClick={() => subirPdf(rowData)}/>;
    }

    const subirPdf = (rowData) =>{
        setParticipacion(rowData);
        setVisible(true);
    }

    const onChangeInputFile = (file) =>{
        guardarDocumentoAlCargar(file);
    }

    const guardarDocumentoAlCargar = async(file) => {
        if(file !== null){
            var formdata = new FormData();
            let ruta = cookies.get('lblPeriodo') + '\\' + cookies.get('nombre_Departamento') + '\\' + cookies.get('nombreUsuario') + '\\CAPACITACIONES';
            
            formdata.append('file', file);
            formdata.append('ruta', ruta);
            formdata.append('nombrearch', participacion.nombre + '.pdf');
            
            await fileService.upload(formdata).then(data => {
                if(data.status === 200){
                    let objetoConDocumento = {
                        ...participacion, 
                        part_pdf_encuesta: data.message,
                    }

                    axios.post("http://localhost:8080/api/v1/participantes/save", objetoConDocumento).then(res => {
                        axios.get("http://localhost:8080/api/v1/materiasgrupos/participaciones/" + cookies.get('idUsuario') + "/" + idPeriodo).then(res => setParticipaciones(res.data));
                        toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Agregado Correctamente', life: 3000});
                    });

                    setParticipacion(objetoConDocumento);
                }else{
                    if(data.status === 501){
                        toast.current.show({severity:'error', summary: '¡Atención!', detail:'No se ha podido agregar el Documento', life: 3000});
                    }
                }
            });

        }
    }

    const eliminarPDF = async() =>{
        let objetoConDocumento = {
            ...participacion, 
            part_pdf_encuesta: null,
        }

        await fileService.delete(participacion.part_pdf_encuesta).then(data => {

            if(data.status === 200){
                axios.post("http://localhost:8080/api/v1/participantes/save", objetoConDocumento).then(res => {
                    axios.get("http://localhost:8080/api/v1/materiasgrupos/participaciones/" + cookies.get('idUsuario') + "/" + idPeriodo).then(res => setParticipaciones(res.data));
                    toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Eliminado Correctamente', life: 3000});
                });

                setParticipacion(objetoConDocumento);
            }else{
                if(data.status === 501){
                    toast.current.show({severity:'error', summary: '¡Atención!', detail:data.message, life: 3000});
                }
            }

        });
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>PARTICIPACIONES EN CAPACITACIONES DE {cookies.get('lblPeriodo')}</h1>
            <DataTable value={participaciones} responsiveLayout="scroll">
                <Column field="row" header="#" style={{ width: '5%' }}></Column>
                <Column field="nombre" header="Capacitación" style={{ width: '45%' }}></Column>
                <Column field="fecha" header="Fecha" style={{ width: '20%' }}></Column>
                <Column header="Constancia de Participación" body={constanciaBodyTemplate} style={{ width: '15%', textAlign: 'center' }}></Column>
                <Column header="Encuesta de Eficacia" body={encuestaBodyTemplate} style={{ width: '10%', textAlign: 'center' }}></Column>
            </DataTable>
            <DialogSUbidaDocumentos urlDoc = { participacion.part_pdf_encuesta } eliminarPDF= {eliminarPDF} header={"Encuesta de Eficacia " + participacion.nombre} visible={visible} onChangeInputFile= {onChangeInputFile} onHide={() => setVisible(false)}/>
            <Toast ref={toast} />
        </div>
    )
}

export default ParticipacionCapacitaciones;
