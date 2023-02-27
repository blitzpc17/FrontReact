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
import DialogSUbidaDocumentos from '../../components/Orozco/DialogSUbidaDocumentos';

const cookies = new Cookies();

const CapacitacionesDesarrolloAcademico = () => {
    const navigate = new useNavigate();

    const [capacitaciones, setCapacitaciones] = useState([]);
    const [capacitacion, setCapacitacion] = useState({
        cap_nombre_Instructor: '',
        cap_pdf_constancia_instructor: null
    });
    const [visible, setVisible] = useState(false);

    const {iddepdesa} = new useParams();

    var fileService = new FileService();

    const toast = useRef(null);

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);
    useEffect(() => {

        if(!cookies.get('rolesUsuario').rol_jefe_desarrollo_academico)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Capacitaciones')
                datosTabla();
            else
                navigate('/plataforma/periodosdesarrollo');
        }
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/capacitaciones/depdesa/" + iddepdesa).then(res => setCapacitaciones(res.data));
    }

    const rowTemplate = (rowData) => {
        return capacitaciones.indexOf(rowData) + 1;
    }

    const constanciaBodyTemplate = (rowData) => {
        return <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" onClick={() => subirPdf(rowData)}/>;
    }

    const subirPdf = (rowData) =>{
        setCapacitacion(rowData);
        setVisible(true);
    }

    const onChangeInputFile = (file) =>{
        guardarDocumentoAlCargar(file);
    }

    const guardarDocumentoAlCargar = async(file) => {
        if(file !== null){
            var formdata = new FormData();
            let ruta = 'DESARROLLO ACADÉMICO\\' + cookies.get('lblPeriodo') + '\\CAPACITACIONES';
            
            formdata.append('file', file);
            formdata.append('ruta', ruta);
            formdata.append('nombrearch', capacitacion.cap_nombre_cap + '.pdf');
            
            await fileService.upload(formdata).then(data => {
                if(data.status === 200){
                    let objetoConDocumento = {
                        ...capacitacion, 
                        cap_pdf_constancia_instructor: data.message,
                    }

                    axios.post("http://localhost:8080/api/v1/capacitaciones/save", objetoConDocumento).then(res => {
                        axios.get("http://localhost:8080/api/v1/capacitaciones/depdesa/" + iddepdesa).then(res => setCapacitaciones(res.data));
                        toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Agregado Correctamente', life: 3000});
                    });

                    setCapacitacion(objetoConDocumento);
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
            ...capacitacion, 
            cap_pdf_constancia_instructor: null,
        }

        await fileService.delete(capacitacion.cap_pdf_constancia_instructor).then(data => {

            if(data.status === 200){
                axios.post("http://localhost:8080/api/v1/capacitaciones/save", objetoConDocumento).then(res => {
                    axios.get("http://localhost:8080/api/v1/capacitaciones/depdesa/" + iddepdesa).then(res => setCapacitaciones(res.data));
                    toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Eliminado Correctamente', life: 3000});
                });

                setCapacitacion(objetoConDocumento);
            }else{
                if(data.status === 501){
                    toast.current.show({severity:'error', summary: '¡Atención!', detail:data.message, life: 3000});
                }
            }

        });
    }

    const encuestaBodyTemplate = (rowData) => {
        return <a href={rowData.cap_pdf_encuesta_eficacia} style={{ textDecoration: 'none' }}><Button disabled={rowData.cap_pdf_encuesta_eficacia == null} icon="pi pi-eye" className="p-button-rounded p-button-warning"/></a>
    }

    const encuestaParticipantesBody = (rowData) => {
        return <Button icon="pi pi-arrow-circle-right" className="p-button-rounded p-button-danger" onClick={() => redireccionActividades(rowData)}/>;
    }

    const redireccionActividades = (rowData) => {
        var addDirecciones = direcciones;
        addDirecciones.push({ label: actual, url: '/plataforma/capacitacionesdesarrollo/' + iddepdesa });
        
        cambiarBread(addDirecciones, 'Participantes');

        navigate('/plataforma/participantesdesarrollo/'+rowData.id_capacitacion);
    }
    
    const documentosBodyTemplate = (rowData) => {
        return <Button icon="pi pi-arrow-circle-right" className="p-button-rounded p-button-help" onClick={() => redireccionDocumentos(rowData)}/>;
    }

    const redireccionDocumentos = (rowData) => {
        var addDirecciones = direcciones;
        addDirecciones.push({ label: actual, url: '/plataforma/capacitacionesdesarrollo/'+iddepdesa });
        
        cambiarBread(addDirecciones, 'Documentos');

        navigate('/plataforma/documentoscapdesarrollo/'+rowData.id_capacitacion);
    }

    const fechaBody = (rowData) => {
        return rowData.cap_fecha_impartir.substr(0,10);
    }

    return <div>
        <h1 style={{ textAlign: 'center' }}>CAPACITACIONES {cookies.get('lblPeriodo')}</h1>
        <DataTable value={capacitaciones} responsiveLayout="scroll">
            <Column header="#" body={ rowTemplate } style={{ width: '5%' }}></Column>
            <Column field="cap_nombre_cap" header="Nombre Capacitación" style={{ width: '20%' }}></Column>
            <Column field="cap_nombre_Instructor" header="Nombre Instructor" style={{ width: '20%' }}></Column>
            <Column field="cap_tipo_instructor" header="Instructor" style={{ width: '5%' }}></Column>
            <Column header="Fecha a Impartir" body={fechaBody} style={{ width: '15%', textAlign: 'center' }}></Column>
            <Column header="Gestión de Participantes" body={encuestaParticipantesBody} style={{ width: '10%', textAlign: 'center' }}></Column>
            <Column header="Encuesta Eficacia" body={encuestaBodyTemplate} style={{ width: '10%', textAlign: 'center' }}  ></Column>
            <Column header="Documentos" body={documentosBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            <Column header="Constancia Instructor" body={constanciaBodyTemplate} style={{ width: '10%', textAlign: 'center' }}></Column>
        </DataTable>

        <DialogSUbidaDocumentos urlDoc = { capacitacion.cap_pdf_constancia_instructor } eliminarPDF= {eliminarPDF} header="Constancia de Participación" usuario={capacitacion.cap_nombre_Instructor} visible={visible} onChangeInputFile= {onChangeInputFile} onHide={() => setVisible(false)}/>
        <Toast ref={toast} />
    </div>;
};

export default CapacitacionesDesarrolloAcademico;
