import React, { useState, useEffect, useContext, useRef } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText  } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import swal from 'sweetalert';
import FileService from '../../services/FileService';
import DialogSUbidaDocumentos from '../../components/Orozco/DialogSUbidaDocumentos';

const cookies = new Cookies();

const CapacitacionesJefeDepartamento = () => {
    const navigate = new useNavigate();

    const [capacitaciones, setCapacitaciones] = useState([]);
    const [capacitacion, setCapacitacion] = useState({
        cap_nombre_Instructor: '',
        cap_pdf_constancia_instructor: null
    });
    const [visible, setVisible] = useState(false);
    const [visibleAgregar, setVisibleAgregar] = useState(false);
    const [docentesDepartamento, setDocentesDepartamento] = useState([]);
    const [activo, setActivo] = useState(true);
    const [listaParticipantes, setListaParticipantes] = useState([]);
    const [participantesAnteriores, setParticipantesAnteriores] = useState([]);

    const {iddepdesa} = new useParams();

    var fileService = new FileService();

    const toast = useRef(null);

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);
    useEffect(() => {

        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Capacitaciones')
                datosTabla();
            else
                navigate('/plataforma/periodoscapacitacionesdep');
        }
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/capacitaciones/depdesa/" + iddepdesa).then(res => setCapacitaciones(res.data));

        await axios.get("http://localhost:8080/api/v1/usuarios/docentes/" + cookies.get('id_Departamento')).then(res => crearListaDocentes(res.data));
    }

    const crearListaDocentes = (usuarios) => {
        var listaTemp = [];

        usuarios.forEach(usuario => {
            listaTemp.push({
                name: usuario.user_Nombre,
                code: usuario.id_Usuarios
            });
        });

        setDocentesDepartamento(listaTemp);
    }

    const crearListaParticipantes = (participantes) => {
        var listaTemp = [];

        participantes.forEach(participante => {
            var nombre = participante.part_pdf_constancia.split('~');

            listaTemp.push({
                name: nombre[0],
                code: participante.id_Usuarios
            });
        });

        setParticipantesAnteriores(participantes);
        setListaParticipantes(listaTemp);
    }

    const rowTemplate = (rowData) => {
        return capacitaciones.indexOf(rowData) + 1;
    }

    const encuestaBodyTemplate = (rowData) => {
        return <Button  icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" onClick={() => subirPdf(rowData)}/>;
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
            let ruta = cookies.get('lblPeriodo') + '\\DESARROLLO ACADÉMICO\\CAPACITACIONES';
            
            formdata.append('file', file);
            formdata.append('ruta', ruta);
            formdata.append('nombrearch', capacitacion.cap_nombre_cap + '.pdf');
            
            await fileService.upload(formdata).then(data => {
                if(data.status === 200){
                    let objetoConDocumento = {
                        ...capacitacion, 
                        cap_pdf_encuesta_eficacia: data.message,
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
            cap_pdf_encuesta_eficacia: null,
        }

        await fileService.delete(capacitacion.cap_pdf_encuesta_eficacia).then(data => {

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

    const constanciaBodyTemplate = (rowData) => {
        return <a href={rowData.cap_pdf_constancia_instructor} target={'_blank'} rel="noreferrer" style={{ textDecoration: 'none' }}><Button disabled={rowData.cap_pdf_constancia_instructor == null} icon="pi pi-eye" className="p-button-rounded p-button-warning"/></a>
    }

    const encuestaParticipantesBody = (rowData) => {
        return <Button icon="pi pi-arrow-circle-right" className="p-button-rounded p-button-secondary" onClick={() => redireccionActividades(rowData)}/>;
    }

    const redireccionActividades = (rowData) => {
        var addDirecciones = direcciones;
        addDirecciones.push({ label: actual, url: '/plataforma/capacitacionesjefedep/' + iddepdesa });
        
        cambiarBread(addDirecciones, 'Encuestas Capacitación');

        navigate('/plataforma/encuestasparticipantes/'+rowData.id_capacitacion);
    }
    
    const documentosBodyTemplate = (rowData) => {
        return <Button icon="pi pi-arrow-circle-right" className="p-button-rounded p-button-help" onClick={() => redireccionDocumentos(rowData)}/>;
    }

    const editarBodyTemplate = (rowData) => {
        return <Button icon="pi pi-pencil" className="p-button-rounded p-button-primary" onClick={() => abrirDialogEditar(rowData)} disabled={rowData.cap_pdf_constancia_instructor != null}/>;
    }

    const abrirDialogEditar = async(rowData) => {
        setCapacitacion({
            ...rowData,
            cap_fecha_impartir: new Date(rowData.cap_fecha_impartir)
        });

        setActivo(rowData.cap_tipo_instructor === "Interno" );

        await axios.get("http://localhost:8080/api/v1/participantes/" + rowData.id_capacitacion).then(res => crearListaParticipantes(res.data));
        
        setVisibleAgregar(true);
    }

    const eliminarBodyTemplate = (rowData) => {
        return <Button icon="pi pi-trash" disabled={rowData.cap_pdf_constancia_instructor != null} className="p-button-rounded p-button-danger" onClick={() => eliminarCapacitacion(rowData)}/>;
    }

    const eliminarCapacitacion = (rowData) => {
        swal({
            title: "¿Deseas Eliminar la Capacitación?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
        }).then(async(OK) => {
            if(OK){
                await axios.get("http://localhost:8080/api/v1/capacitaciones/delete/" + rowData.id_capacitacion).then(res => {
                    axios.get("http://localhost:8080/api/v1/capacitaciones/depdesa/" + iddepdesa).then(res => setCapacitaciones(res.data));

                    swal({
                        title: "¡Atención!",
                        text: "Capacitación Eliminada Correctamente!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                    });
                });
            }else{
                swal({
                    title: "¡Atención!",
                    text: "¡No se ha Eliminado la Capacitación!",
                    icon: "info",
                    button: "Aceptar",
                    timer: "3000"
                });
            }
        });
    }

    const redireccionDocumentos = (rowData) => {
        var addDirecciones = direcciones;
        addDirecciones.push({ label: actual, url: '/plataforma/capacitacionesjefedep/'+iddepdesa });
        
        if(rowData.cap_tipo_instructor === 'Interno'){
            cambiarBread(addDirecciones, 'Documentos');
            navigate('/plataforma/documentoscapdesarrollo/'+rowData.id_capacitacion);
        }else{
            cambiarBread(addDirecciones, 'Documentos Capacitación');
            navigate('/plataforma/documentoscapdocentes/'+rowData.id_capacitacion);
        }
        
    }

    const fechaBody = (rowData) => {
        return rowData.cap_fecha_impartir.substr(0,10);
    }

    const abrirDialogNuevo = () => {
        setCapacitacion({
            id_capacitacion: null,
            id_dep_desa: parseInt(iddepdesa),
            cap_nombre_cap: "",
            cap_nombre_Instructor: "",
            cap_tipo_instructor: "Interno",
            cap_fecha_impartir: null,
            cap_pdf_encuesta_eficacia: null,
            cap_pdf_constancia_instructor: null,
            cap_creado_por: "Orozco",
            cap_fecha_creacion: new Date(),
            cap_actualizado_por: null,
            cap_fecha_actualizacion: null,
            id_instructor: 0
        });
        //new Date("2022-02-06T06:00:00.000+00:00")
        setVisibleAgregar(true);
    }

    const footer = () => {
        return <Button label="Guardar Cambios" className="p-button p-button-info" onClick={() => guardarCap()} />   
    }

    const guardarCap = async() => {
        if(capacitacion.cap_nombre_Instructor !== "" && capacitacion.cap_nombre_Instructor != null && capacitacion.cap_nombre_cap !== "" && capacitacion.cap_fecha_impartir != null ){
            if(listaParticipantes.length !== 0){
                var ban = capacitacion.id_capacitacion == null;

                await axios.post("http://localhost:8080/api/v1/capacitaciones/save", capacitacion).then(res => {
                    let idCapTemp = res.data.id_capacitacion;

                    if(ban){

                        listaParticipantes.forEach(participantes => {
                            let participanteTemp = {
                                id_participante: null,
                                id_capacitacion: idCapTemp,
                                id_Usuarios: participantes.code,
                                part_pdf_encuesta: null,
                                part_pdf_constancia: null
                            };
        
                            axios.post("http://localhost:8080/api/v1/participantes/save", participanteTemp);
        
                        });

                    }else{

                        docentesDepartamento.forEach(docentesDep => {

                            var id = docentesDep.code, idPartCapa = 0;
                
                            var ban1 = false, ban2 = false;
                
                            participantesAnteriores.forEach(participanteAnterior => {
                                if(participanteAnterior.id_Usuarios === id){
                                    ban1 = true;
                                    idPartCapa = participanteAnterior.id_participante
                                }
                            });
                
                            listaParticipantes.forEach(participonte => {
                                if(participonte.code === id){
                                    ban2 = true;
                                }
                            });
                
                            if(ban2){
                                if(!ban1){
                                    let participanteTemp = {
                                        id_participante: null,
                                        id_capacitacion: idCapTemp,
                                        id_Usuarios: docentesDep.code,
                                        part_pdf_encuesta: null,
                                        part_pdf_constancia: null
                                    };
                
                                    axios.post("http://localhost:8080/api/v1/participantes/save", participanteTemp);
                                }
                            }else{
                                if(ban1){
                                    axios.get("http://localhost:8080/api/v1/participantes/delete/" + idPartCapa);
                                }
                            }
                        });
                    }
                    
                    axios.get("http://localhost:8080/api/v1/capacitaciones/depdesa/" + iddepdesa).then(res => setCapacitaciones(res.data));

                    swal({
                        title: "¡Atención!",
                        text: "Capacitación Guardada Correctamente!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                    });

                    setVisibleAgregar(false);
                });

            }else{
                swal({
                    title: "¡Atención!",
                    text: "Debes Seleccionar los Participantes de la Capacitación",
                    icon: "error",
                    button: "Aceptar",
                    timer: "3000"
                });
            }
        }else{
            swal({
                title: "¡Atención!",
                text: "Llena Correctamente la Información de la Capacitación",
                icon: "error",
                button: "Aceptar",
                timer: "3000"
            });
        }
        
        
    }

    const cambioEstado = (e) =>{
        setCapacitacion({
            ...capacitacion,
            cap_nombre_Instructor: e.target.value.name,
            id_instructor: e.target.value.code
        });
    }

    const changeRadio = (tipo, val) =>{
        setCapacitacion({
            ...capacitacion,
             cap_tipo_instructor: tipo,
             cap_nombre_Instructor: "",
            id_instructor:0
        });
        setActivo(val);
    }

    return <div>
        <h1 style={{ textAlign: 'center' }}>CAPACITACIONES {cookies.get('lblPeriodo')}</h1>

        <div style={{ textAlign: 'right', marginBottom: '10px', marginTop: '10px' }}>
            <Button label='Agregar Capacitación' onClick={() => abrirDialogNuevo()} />
        </div>

        <DataTable value={capacitaciones} responsiveLayout="scroll">
            <Column header="#" body={ rowTemplate } style={{ width: '5%' }}></Column>
            <Column field="cap_nombre_cap" header="Nombre Capacitación" style={{ width: '20%' }}></Column>
            <Column field="cap_nombre_Instructor" header="Nombre Instructor" style={{ width: '20%' }}></Column>
            <Column field="cap_tipo_instructor" header="Instructor" style={{ width: '5%' }}></Column>
            <Column header="Fecha a Impartir" body={fechaBody} style={{ width: '10%', textAlign: 'center' }}></Column>
            <Column header="Encuestas Participantes" body={encuestaParticipantesBody} style={{ width: '10%', textAlign: 'center' }}></Column>
            <Column header="Encuesta Eficacia" body={encuestaBodyTemplate} style={{ width: '10%', textAlign: 'center' }}  ></Column>
            <Column header="Documentos" body={documentosBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            <Column header="Constancia Instructor" body={constanciaBodyTemplate} style={{ width: '10%', textAlign: 'center' }}></Column>
            <Column header="Editar" body={editarBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            <Column header="Eliminar" body={eliminarBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
        </DataTable>

        <DialogSUbidaDocumentos urlDoc = { capacitacion.cap_pdf_encuesta_eficacia } eliminarPDF= {eliminarPDF} header="Constancia de Participación" usuario={capacitacion.cap_nombre_Instructor} visible={visible} onChangeInputFile= {onChangeInputFile} onHide={() => setVisible(false)}/>
        <Toast ref={toast} />

        <Dialog header="Capacitación" footer={footer()} visible={visibleAgregar} modal={true} style={{width: '550px'}} onHide={() => setVisibleAgregar(false)}>
            <span className="p-float-label" style={{ marginTop: '30px' }}>
                <InputText id="cap" value={capacitacion.cap_nombre_cap} onChange={(e) => {
                    setCapacitacion({
                        ...capacitacion,
                        cap_nombre_cap: e.target.value
                    });
                }} style={{ width: '500px' }} maxLength= '255'/>
                <label htmlFor="cap">Nombre Capacitación</label>
            </span>

            <div className="field-radiobutton" style={{ marginTop: '20px' }}>
                <RadioButton inputId="int" name="int" value="Interno" onChange={(e) => changeRadio(e.value, true)} checked={capacitacion.cap_tipo_instructor === 'Interno'} />
                <label htmlFor="int" style={{ marginLeft: '5px' }}>Instructor Interno</label>
            </div>

            <Dropdown value={activo? {name: capacitacion.cap_nombre_Instructor, code: capacitacion.id_instructor} : null} disabled={!activo} options={docentesDepartamento} onChange={cambioEstado} optionLabel="name" placeholder="Docentes del Departamento" style={{ width: '500px', marginTop: '20px' }} />

            <div className="field-radiobutton" style={{ marginTop: '20px' }}>
                <RadioButton inputId="ext" name="ext" value="Externo" onChange={(e) => changeRadio(e.value, false)} checked={capacitacion.cap_tipo_instructor === 'Externo'} />
                <label htmlFor="ext" style={{ marginLeft: '5px' }}>Instructor Externo</label>
            </div>
            
            <InputText id="next" disabled={activo} value={!activo? capacitacion.cap_nombre_Instructor : ""} onChange={(e) => {
                setCapacitacion({
                    ...capacitacion,
                    cap_nombre_Instructor: e.target.value,
                    id_instructor: 0
                });
            }} style={{ width: '500px', marginTop: '20px' }} maxLength= '255'/>
            
            <div className="field col-12 md:col-4" style={{ marginTop: '20px' }}>
                <label htmlFor="icon" style={{ marginRight: '75px' }}>Fecha a Impartir:</label>
                <Calendar id="icon" value={capacitacion.cap_fecha_impartir} onChange={(e) => setCapacitacion({...capacitacion, cap_fecha_impartir: e.value})} showIcon />
            </div>
            
            <MultiSelect value={listaParticipantes} options={docentesDepartamento} onChange={(e) => setListaParticipantes(e.value)} optionLabel="name" placeholder="Selección de Participantes" maxSelectedLabels={1} style={{ width: '500px', marginTop: '20px' }}/>

        </Dialog>
    </div>;
};

export default CapacitacionesJefeDepartamento;
