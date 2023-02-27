import React, { useEffect, useState, useContext, useRef } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import axios from "axios";
import swal from 'sweetalert';
import DialogSUbidaDocumentosComentarios from '../../components/Orozco/DialogSUbidaDocumentosComentarios';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { Toast } from 'primereact/toast';
import FileService from '../../services/FileService';

const cookies = new Cookies();

const GestionDocencia = () => {

    const [docentePeriodo, setDocentePeriodo] = useState({});
    const [visible, setVisible] = useState(false);

    const navigate = new useNavigate();

    const {idPeriodo} = new useParams();

    const toast = useRef(null);

    var fileService = new FileService();

    const { cambiarBread, actual, direcciones } = useContext(BreadCrumbContext);

    const funcionGrupos = () => {
        cambiarBreadLocal('Grupos');
        navigate('/plataforma/grupos/'+docentePeriodo.id_docper);
    }

    const funcionActAp = () => {
        cambiarBreadLocal('Actividades en Apoyo a la Docencia');
        navigate('/plataforma/actividadesapoyo/'+docentePeriodo.id_docper);
    }

    const funcionProdDoc = () => {
        console.log(docentePeriodo);
        cambiarBreadLocal('Productos Docencia');
        navigate('/plataforma/productosdocencia/'+docentePeriodo.id_docper);
    }

    const funcionProdDes = () => {
        cambiarBreadLocal('Productos Desarrollo Tecnológico');
        navigate('/plataforma/productosdesarrollo/'+docentePeriodo.id_docper);
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/menudocencia/' + idPeriodo });

        cambiarBread(direccionesTemp, lblActual);
    }

    useEffect(() => {
        //console.log(cookies.get('id_Periodo'));
        //console.log(cookies.get('lblPeriodo'));
        if(!cookies.get('idUsuario')){
            navigate('/');
        }else{
            if(!cookies.get('rolesUsuario').rol_docente)
                navigate('/plataforma/menu');
            else{
                if(cookies.get('actualTemp') === 'Gestión de Docencia')
                    datosDocentePeriodo();
                else
                    navigate('/plataforma/gestiondocencia');
            }
        }
    }, []);

    const datosDocentePeriodo = async () => {
        await axios.get("http://localhost:8080/api/v1/materiasgrupos/docentesperiodos/" + cookies.get('idUsuario') + "/"+ idPeriodo).then(res => {
            if(res.data.id_docper !== 0){
                setDocentePeriodo(res.data)
            }else{
                let objTemp = {
                    id_docper: null,
                    id_usuarios: parseInt(cookies.get('idUsuario')),
                    id_periodo: parseInt(idPeriodo),
                    docper_pdf_horario: null,
                    docper_pdf_liberacionact: null,
                    docper_pdf_reportefinal: null,
                    docper_retroalimentacion_reportefinal: null,
                    docper_estado_reportefinal: 0
                };
                axios.post("http://localhost:8080/api/v1/docenteperiodo/save", objTemp).then(resF => {
                    setDocentePeriodo(resF.data);
                });
            }    
        });
    }

    const renderHorario = () => {
        if(docentePeriodo.docper_pdf_horario != null)
            return <a href={docentePeriodo.docper_pdf_horario} download="Horario" style={{ textDecoration: 'none' }}><Button label="Horario" icon="pi pi-cloud-download" className="p-button-lg p-button-info" style={{ width: window.screen.width <= 1200 ? '100%' : '70%', height: '70px' }}/></a>
        else
            return <Button label="Horario" icon="pi pi-cloud-download" className="p-button-lg p-button-info" style={{ width: window.screen.width <= 1200 ? '100%' : '70%', height: '70px' }} onClick={() => alertaSinDocumento('¡Sin Hoario Asignado!')}/>
    }

    const renderLiberacion = () => {
        if(docentePeriodo.docper_pdf_liberacionact != null )
            return <a href={docentePeriodo.docper_pdf_liberacionact} download="Liberación de Actividades" style={{ textDecoration: 'none' }}><Button label="Liberación de Actividades" icon="pi pi-cloud-download" className="p-button-lg p-button-danger" style={{ width: window.screen.width <= 1200 ? '100%' : '70%', height: '70px' }}/></a>
        else
            return <Button label="Liberación de Actividades" icon="pi pi-cloud-download" className="p-button-lg p-button-danger" style={{ width: window.screen.width <= 1200 ? '100%' : '70%', height: '70px' }} onClick={() => alertaSinDocumento('¡Sin Liberación de Actividades Asignada')}/>; 
    }

    const alertaSinDocumento = (lblDoc) => {
        swal({
            title: "¡Atención!",
            text: lblDoc,
            icon: "warning",
            button: "Aceptar",
            timer: "3000"
        });
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

    const onChangeInputFile = (file) =>{
        guardarDocumentoAlCargar(file);
    }

    const guardarDocumentoAlCargar = async(file) => {
        if(file !== null){
            var formdata = new FormData();
            let ruta = cookies.get('lblPeriodo') + '\\' + cookies.get('nombre_Departamento') + '\\' + cookies.get('nombreUsuario');
            
            formdata.append('file', file);
            formdata.append('ruta', ruta);
            formdata.append('nombrearch', 'Reporte Final.pdf');
            
            await fileService.upload(formdata).then(data => {
                if(data.status === 200){
                    let objetoConDocumento = {
                        ...docentePeriodo, 
                        docper_pdf_reportefinal: data.message,
                        docper_estado_reportefinal: 3
                    }

                    axios.post("http://localhost:8080/api/v1/docenteperiodo/save", objetoConDocumento).then(res => {
                        axios.get("http://localhost:8080/api/v1/docenteperiodo/find/" + docentePeriodo.id_docper).then(res => setDocentePeriodo(res.data));
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

    const eliminarPDF = async() =>{
        let objetoConDocumento = {
            ...docentePeriodo, 
            docper_pdf_reportefinal: null,
            docper_estado_reportefinal: 0
        }

        await fileService.delete(docentePeriodo.docper_pdf_reportefinal).then(data => {

            if(data.status === 200){
                axios.post("http://localhost:8080/api/v1/docenteperiodo/save", objetoConDocumento).then(res => {
                    axios.get("http://localhost:8080/api/v1/docenteperiodo/find/" + docentePeriodo.id_docper).then(res => setDocentePeriodo(res.data));
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
            <h1 style={{ textAlign: 'center', paddingBottom: window.screen.width <= 1200 ? '0px' :'40px' }}>GESTIÓN DE DOCENCIA</h1>
            <table style={{ width: '100%', textAlign: 'center', wordSpacing: '100' }}>
                <tbody>
                    {
                        window.screen.width <= 1200 ? 
                        <>
                            <tr>
                                <td style={{ paddingBottom: '20px', width: '100%' }}>{ renderHorario() } </td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Grupos" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-help" style={{ width: '100%', height: '70px' }} onClick={ () => funcionGrupos() }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Act. Apoyo a la Docencia" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-primary" style={{ width: '100%', height: '70px' }} onClick={ () => funcionActAp() }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Productos Docencia" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-success" style={{ width: '100%', height: '70px' }} onClick={() => funcionProdDoc()}/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Productos D. Tecnológico" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-warning" style={{ width: '100%', height: '70px' }} onClick={() => funcionProdDes()}/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Reporte Final" icon="pi pi-cloud-upload" className="p-button-lg p-button-secondary" style={{ width: '100%', height: '70px' }} onClick={() => setVisible(true)}/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}>{ renderLiberacion() }</td>
                            </tr>
                        </> :
                        <>
                            <tr>
                                <td style={{ paddingBottom: '80px', width: '33%' }}>{ renderHorario() } </td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Grupos" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-help" style={{ width: '70%', height: '70px' }} onClick={ () => funcionGrupos() }/></td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Act. Apoyo a la Docencia" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-primary" style={{ width: '70%', height: '70px' }} onClick={ () => funcionActAp() }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '80px' }}><Button label="Productos Docencia" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-success" style={{ width: '70%', height: '70px' }} onClick={() => funcionProdDoc()}/></td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Productos D. Tecnológico" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-warning" style={{ width: '70%', height: '70px' }} onClick={() => funcionProdDes()}/></td>
                            </tr>
                            <tr>
                                <td><Button label="Reporte Final" icon="pi pi-cloud-upload" className="p-button-lg p-button-secondary" style={{ width: '70%', height: '70px' }} onClick={() => setVisible(true)}/></td>
                                <td>{ renderLiberacion() }</td>
                            </tr>
                        </>
                    }
                    
                </tbody>
            </table>
            <DialogSUbidaDocumentosComentarios urlDoc = { docentePeriodo.docper_pdf_reportefinal } eliminarPDF= {eliminarPDF} estado = {getEstado(docentePeriodo.docper_estado_reportefinal)} comentario = { docentePeriodo.docper_retroalimentacion_reportefinal == null ? '' : docentePeriodo.docper_retroalimentacion_reportefinal} header="REPORTE FINAL" visible={visible} onChangeInputFile= {onChangeInputFile} onHide={() => setVisible(false)}/>
            <Toast ref={toast} />
        </div>
    )
}

export default GestionDocencia
