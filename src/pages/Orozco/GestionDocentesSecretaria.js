import React, { useState, useEffect, useContext, useRef } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import DialogSUbidaDocumentos from '../../components/Orozco/DialogSUbidaDocumentos';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { Toast } from 'primereact/toast';
import FileService from '../../services/FileService';

const cookies = new Cookies();

const GestionDocentesSecretaria = () => {
    const navigate = new useNavigate();

    const [usuarios, setUsuarios] = useState([]);
    const [docentePeriodo, setDocentePeriodo] = useState({});
    const [visible, setVisible] = useState(false);
    const [headerDialog, setHeaderDialog] = useState('Horario');
    const [documentoDialog, setDocumentoDialog] = useState(null);

    const {idPeriodo} = new useParams();

    const { direcciones, cambiarBread } = useContext(BreadCrumbContext);

    var fileService = new FileService();

    const toast = useRef(null);

    useEffect(() => {

        if(!cookies.get('rolesUsuario').rol_secretaria_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Gestión de Docentes')
                datosTabla();
            else
                navigate('/plataforma/periodosecretaria');
        }
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/secretaria/docenteperiodo/" + idPeriodo + "/" + cookies.get('id_Departamento')).then(res => setUsuarios(res.data));
    }

    const rowTemplate = (rowData) => {
        return usuarios.indexOf(rowData) + 1;
    }

    const horarioBodyTemplate = (rowData) => {
        return <Button icon="pi pi-arrow-circle-right" className="p-button-rounded p-button-help" onClick={() => verDialog(rowData, 'Horario', rowData.docper_pdf_horario)}/>;
    }
    
    const verDialog = async(rowData, headerD, doc) => {
        setHeaderDialog(headerD);
        setDocumentoDialog(doc);
        if(rowData.id_docper !== 0){
            setDocentePeriodo(rowData)
        }else{
            let objTemp = {
                id_docper: null,
                id_usuarios: rowData.id_usuarios,
                id_periodo: parseInt(idPeriodo),
                docper_pdf_horario: null,
                docper_pdf_liberacionact: null,
                docper_pdf_reportefinal: null,
                docper_retroalimentacion_reportefinal: null,
                docper_estado_reportefinal: 0
            };
            await axios.post("http://localhost:8080/api/v1/docenteperiodo/save", objTemp).then(resF => {
                setDocentePeriodo({...resF.data, user_nombre: rowData.user_nombre});
            });

            await axios.get("http://localhost:8080/api/v1/secretaria/docenteperiodo/" + idPeriodo + "/" + cookies.get('id_Departamento')).then(res => setUsuarios(res.data));
        } 
        setVisible(true);
    }

    const liberacionBodyTemplate = (rowData) => {
        return <Button icon="pi pi-arrow-circle-right" disabled = {!rowData.libera} className="p-button-rounded p-button-danger" disabled = {!rowData.libera} onClick={() => verDialog(rowData, 'Liberación de Actividades', rowData.docper_pdf_liberacionact)}/>;
    }

    const actividadesBodyTemplate = (rowData) => {
        return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-info" onClick={() => redireccionActividades(rowData)}/>;
    }

    const redireccionActividades = async(rowData) => {
        let rowTemp = {};

        if(rowData.id_docper !== 0){
            rowTemp = rowData;
        }else{
            let objTemp = {
                id_docper: null,
                id_usuarios: rowData.id_usuarios,
                id_periodo: parseInt(idPeriodo),
                docper_pdf_horario: null,
                docper_pdf_liberacionact: null,
                docper_pdf_reportefinal: null,
                docper_retroalimentacion_reportefinal: null,
                docper_estado_reportefinal: 0
            };
            await axios.post("http://localhost:8080/api/v1/docenteperiodo/save", objTemp).then(resF => {
                rowTemp = {...resF.data, user_nombre: rowData.user_nombre};
            });
        } 

        var addDirecciones = direcciones;
        addDirecciones.push({ label: 'Gestión de Docentes', url: '/plataforma/gestiondocentes/'+idPeriodo });
        
        cambiarBread(addDirecciones, 'Actividades en Apoyo a la Docencia ' + rowTemp.user_nombre);

        navigate('/plataforma/actividadesdocente/'+rowTemp.id_docper);
    }
    
    const documentosBodyTemplate = (rowData) => {
        return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-warning" onClick={() => redireccionDocumentos(rowData)}/>;
    }

    const redireccionDocumentos = async(rowData) => {
        let rowTemp = {};

        if(rowData.id_docper !== 0){
            rowTemp = rowData;
        }else{
            let objTemp = {
                id_docper: null,
                id_usuarios: rowData.id_usuarios,
                id_periodo: parseInt(idPeriodo),
                docper_pdf_horario: null,
                docper_pdf_liberacionact: null,
                docper_pdf_reportefinal: null,
                docper_retroalimentacion_reportefinal: null,
                docper_estado_reportefinal: 0
            };
            await axios.post("http://localhost:8080/api/v1/docenteperiodo/save", objTemp).then(resF => {
                rowTemp = {...resF.data, user_nombre: rowData.user_nombre};
            });
        }

        var addDirecciones = direcciones;
        addDirecciones.push({ label: 'Gestión de Docentes', url: '/plataforma/gestiondocentes/'+idPeriodo });
        
        cambiarBread(addDirecciones, 'Grupos de ' + rowTemp.user_nombre);

        navigate('/plataforma/gruposdocente/'+rowTemp.id_docper);
    }

    const onChangeInputFile = (file) =>{
        guardarDocumentoAlCargar(file);
    }

    const guardarDocumentoAlCargar = async(file) => {
        if(file !== null){
            var formdata = new FormData();
            let ruta = cookies.get('lblPeriodo') + '\\' + cookies.get('nombre_Departamento') + '\\' + docentePeriodo.user_nombre;
            console.log(ruta)
            formdata.append('file', file);
            formdata.append('ruta', ruta);
            formdata.append('nombrearch', headerDialog + '.pdf');
            
            await fileService.upload(formdata).then(data => {
                if(data.status === 200){
                    let objetoConDocumento;

                    if(headerDialog === 'Horario'){
                        objetoConDocumento = {
                            ...docentePeriodo, 
                            docper_pdf_horario: data.message,
                        }
                    }else{
                        objetoConDocumento = {
                            ...docentePeriodo, 
                            docper_pdf_liberacionact: data.message,
                        }
                    }

                    axios.post("http://localhost:8080/api/v1/docenteperiodo/save", objetoConDocumento).then(res => {
                        axios.get("http://localhost:8080/api/v1/secretaria/docenteperiodo/" + idPeriodo).then(res => setUsuarios(res.data));
                        toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Agregado Correctamente', life: 3000});
                    });

                    setDocumentoDialog(data.message);
                }else{
                    if(data.status === 501){
                        toast.current.show({severity:'error', summary: '¡Atención!', detail:'No se ha podido agregar el Documento', life: 3000});
                    }
                }
            });

        }
    }

    const eliminarPDF = async() =>{
        let objetoConDocumento;

        if(headerDialog === 'Horario'){
            objetoConDocumento = {
                ...docentePeriodo, 
                docper_pdf_horario: null,
            }
        }else{
            objetoConDocumento = {
                ...docentePeriodo, 
                docper_pdf_liberacionact: null,
            }
        }

        await fileService.delete(headerDialog === 'Horario'? docentePeriodo.docper_pdf_horario : docentePeriodo.docper_pdf_liberacionact).then(data => {

            if(data.status === 200){
                axios.post("http://localhost:8080/api/v1/docenteperiodo/save", objetoConDocumento).then(res => {
                    axios.get("http://localhost:8080/api/v1/secretaria/docenteperiodo/" + idPeriodo).then(res => setUsuarios(res.data));
                    toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Eliminado Correctamente', life: 3000});
                });

                setDocumentoDialog(null);
            }else{
                if(data.status === 501){
                    toast.current.show({severity:'error', summary: '¡Atención!', detail:data.message, life: 3000});
                }
            }

        });
    }

    return <div>
        <h1 style={{ textAlign: 'center' }}>GESTIÓN DE DOCENTES {cookies.get('lblPeriodo')}</h1>
        <DataTable value={usuarios} responsiveLayout="scroll">
            <Column header="#" body={ rowTemplate } style={{ width: '10%' }}></Column>
            <Column field="user_nombre" header="Nombre Docente" style={{ width: '50%' }}></Column>
            <Column header="Horario" body={horarioBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            <Column header="Liberación de Actividades" body={liberacionBodyTemplate} style={{ width: '10%', textAlign: 'center' }}></Column>
            <Column header="Gestión de Actividades de Apoyo a la Docencia" body={actividadesBodyTemplate} style={{ width: '15%', textAlign: 'center' }}  ></Column>
            <Column header="Gestión de Grupos" body={documentosBodyTemplate} style={{ width: '10%', textAlign: 'center' }}></Column>
        </DataTable>
        <Toast ref={toast} />
        <DialogSUbidaDocumentos urlDoc = { documentoDialog } usuario={docentePeriodo.user_nombre} eliminarPDF= {eliminarPDF}  onChangeInputFile= {onChangeInputFile}  header={headerDialog} visible={visible} onHide={() => setVisible(false)}/>
    </div>;
};

export default GestionDocentesSecretaria;
