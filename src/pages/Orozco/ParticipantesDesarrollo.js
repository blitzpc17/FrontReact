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

const ParticipantesDesarrollo = () => {

    const navigate = new useNavigate();

    const toast = useRef(null);

    var fileService = new FileService();

    const [participantes, setParticipantes] = useState([]);
    const [participante, setParticipante] = useState({
        part_pdf_constancia: ' ~ '
    });
    const [visible, setVisible] = useState(false);
    const [nombreCap, setNombreCap] = useState("");

    const {idCapacitacion} = new useParams();

    useEffect(() => {

        if(!cookies.get('rolesUsuario').rol_jefe_desarrollo_academico)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Participantes')
                datosTabla();
            else
                navigate('/plataforma/periodosdesarrollo');
        }
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/participantes/" + idCapacitacion).then(res => setParticipantes(res.data));

        await axios.get("http://localhost:8080/api/v1/capacitaciones/find/" + idCapacitacion).then(res => setNombreCap(res.data.cap_nombre_cap));
    }

    const verBodyTemplate = (rowData) => {
        return <a href={rowData.part_pdf_encuesta} target={'_blank'} rel="noreferrer" style={{ textDecoration: 'none' }}><Button icon="pi pi-eye" disabled={rowData.part_pdf_encuesta == null} className="p-button-rounded p-button-warning" /></a>;
    }

    const subirBodyTemplate = (rowData) => {
        return <Button icon={rowData.actdoc_pdf_actividad != null ? "pi pi-sync" : "pi pi-cloud-upload"} className="p-button-rounded p-button-info" onClick={() => subirPdf(rowData)}/>;
    }

    const subirPdf = async(rowData) =>{
        setParticipante(rowData);
        setVisible(true);
    }

    const onChangeInputFile = (file) =>{
        guardarDocumentoAlCargar(file);
    }

    const guardarDocumentoAlCargar = async(file) => {
        if(file !== null){
            var formdata = new FormData();

            let ruta = 'DESARROLLO ACADÉMICO\\' + cookies.get('lblPeriodo') + '\\' + nombreCap;
            
            let nombre = getNombre(participante);

            formdata.append('file', file);
            formdata.append('ruta', ruta);
            formdata.append('nombrearch', nombre + '.pdf');
            
            await fileService.upload(formdata).then(data => {
                if(data.status === 200){
                    let objetoConDocumento = {
                        ...participante, 
                        part_pdf_constancia: data.message,
                    }

                    axios.post("http://localhost:8080/api/v1/participantes/save", objetoConDocumento).then(res => {
                        axios.get("http://localhost:8080/api/v1/participantes/" + idCapacitacion).then(res => setParticipantes(res.data));
                        toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Agregado Correctamente', life: 3000});
                    });

                    let objetoConDocumento2 = {
                        ...participante, 
                        part_pdf_constancia: nombre + '~' + data.message,
                    }

                    setParticipante(objetoConDocumento2);

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
            ...participante, 
            part_pdf_constancia: null,
        }

        await fileService.delete(participante.part_pdf_constancia).then(data => {

            if(data.status === 200){
                axios.post("http://localhost:8080/api/v1/participantes/save", objetoConDocumento).then(res => {
                    axios.get("http://localhost:8080/api/v1/participantes/" + idCapacitacion).then(res => setParticipantes(res.data));
                    toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Agregado Correctamente', life: 3000});
                });

                let objetoConDocumento2 = {
                    ...participante, 
                    part_pdf_constancia: getNombre(participante) + '~ ',
                }

                setParticipante(objetoConDocumento);

            }else{
                if(data.status === 501){
                    toast.current.show({severity:'error', summary: '¡Atención!', detail:data.message, life: 3000});
                }
            }

        });
    }
    const rowTemplate = (rowData) => {
        return participantes.indexOf(rowData) + 1;
    }

    const getDocumento = () =>{
        var doc = participante.part_pdf_constancia.split('~');
        return doc[1] == ' '? null : doc[1];
    }

    const getNombre = (rowdata) =>{
        var doc = rowdata.part_pdf_constancia.split('~');
        return doc[0];
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>PARTICIPANTES DE {nombreCap.toUpperCase()}</h1>
            <DataTable value={participantes} responsiveLayout="scroll">
                <Column header="#" body={rowTemplate} style={{ width: '10%' }}></Column>
                <Column header="Formato" body={getNombre}></Column>
                <Column header="Encuesta de Eficacia" body={verBodyTemplate} style={{ width: '10%', textAlign: 'center' }}></Column>
                <Column header="Constancia de Participación" body={subirBodyTemplate} style={{ width: '15%', textAlign: 'center' }}></Column>
            </DataTable>

            <DialogSUbidaDocumentos urlDoc = { getDocumento() } usuario = { getNombre(participante) } eliminarPDF= {eliminarPDF} header="Constancia de Participación" visible={visible} onChangeInputFile= {onChangeInputFile} onHide={() => setVisible(false)}/>
            <Toast ref={toast} />
        </div>
    )
}

export default ParticipantesDesarrollo
