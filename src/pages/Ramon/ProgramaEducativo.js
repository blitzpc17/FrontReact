import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';

import swal from 'sweetalert';
import moment from 'moment/moment';
 
import { ServicioProgramaEducativo } from '../../services/Ramon/ServicioProgramaEducativo';

import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const ProgramaEducativo = () => {
    const navigate = new useNavigate();

    const [visible, setVisible] = useState(false);

    const [documentos, setDocumentos] = useState(null);
    const [reportes, setReportes] = useState(null);
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [fecha, setFecha] = useState("");
    const [enlace, setEnlace] = useState("");
    const [departamentoId, setDepartamentoId] = useState("");
    const [txtbtnfile, settxtbtnfile] = useState("");
    const [fileselect, setFileselect] = useState(null);
    const [urlArchivo, seturlArchivo] = useState(null);
    const path_base = "/Documentos/Prueba/";
    const [id, setId] = useState("");
    const [btntitle, setbtntitle] = useState("")

    var cookiedep=cookies.get('id_Departamento');

    var servicioPrograma = new ServicioProgramaEducativo;
    //variables reporteria
    const [visibleReporteria, setVisibleReporteria] = useState(false)
    const [nombreFormato, setNombreFormato] = useState("");
    const [tipoFormato, setTipoFormato] = useState("");
    const [nombreLaboratorio, setNombreLaboratorio] = useState("");
    const [nombreDepartamento, setNombreDepartamento] = useState("");
    const [encargado, setEncargado] = useState("");
    const meses = [
        {
            "Mes":"Enero",
            "ShortName":"Ene"
        },
        {
            "Mes":"Febrero",
            "ShortName":"Feb"
        },
        {
            "Mes":"Marzo",
            "ShortName":"Mar"
        },
        {
            "Mes":"Abril",
            "ShortName":"Abr"
        },
        {
            "Mes":"Mayo",
            "ShortName":"May"
        },
        {
            "Mes":"Junio",
            "ShortName":"Jun"
        },
        {
            "Mes":"Julio",
            "ShortName":"Jul"
        },
        {
            "Mes":"Agosto",
            "ShortName":"Ago"
        },
        {
            "Mes":"Septiembre",
            "ShortName":"Sep"
        },
        {
            "Mes":"Octubre",
            "ShortName":"Oct"
        },
        {
            "Mes":"Noviembre",
            "ShortName":"Nov"
        },
        {
            "Mes":"Diciembre",
            "ShortName":"Dic"
        }    
    ]


    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Programa Educativo'){
               listar();
            }
            else
                navigate('/plataforma/menudepartamental');
        }
        
    }, []);

    const onHide = () => {
        setVisible(false);
        setVisibleReporteria(false);
    }

    const speriodo = (rowData)=>{
        return `${meses[rowData.mesInicial-1].ShortName} - ${meses[rowData.mesFinal-1].ShortName} ${rowData.anio}`
    }

    function listar() {
        setDepartamentoId(cookiedep)
        servicioPrograma.ListarDocumentosPorDepto(cookiedep).then(data => {
            setDocumentos(data);
        });

        servicioPrograma.ListarReportesLaboratorio(cookiedep).then(data =>{
            setReportes(data);
        });
    }

    const agregar = () => {

        if(nombre === null || nombre === "")
        
        {

            swal({
                title: "¡Atención!",
                text: "¡Rellena todos los campos!",
                icon: "warning",
                button: "Aceptar",
                timer: "3000"
              });
              setVisible(true);
        }
        else{   

                let formdata = new FormData();
                formdata.append('id', id)
                formdata.append('tipo', tipo)
                formdata.append('nombre', nombre)
                formdata.append('fecha', moment().format('YYYY-MM-DD'))
                formdata.append('enlace', enlace)
                formdata.append('id_Departamento', departamentoId)
                formdata.append('file', fileselect)

                save(formdata)
            }
        }
        
    

    const save = (documento) => {
        servicioPrograma.save(documento).then((data)=>{
            setDocumentos(null);
        
                    swal({
                        title: "¡Atención!",
                        text: "¡Se ha agregado el tipo de documento con Exito!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                      });
                      
                    listar();
        });
    }

    const eliminar =(rowData) =>{

        swal({
            title: "¿Deseas Eliminar este tipo de documento?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
          }).then((OK) => {
      
            if(OK){

                servicioPrograma.delete(rowData.id).then((data) =>{
                    setDocumentos(null)

                    swal({
                        title: "¡Atención!",
                        text: "¡Se ha Eliminado el tipo de documento!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                        });

                       listar();

                    });
                }else{
                swal({
                    title: "¡Atención!",
                    text: "¡No se ha Eliminado el Registro!",
                    icon: "info",
                    button: "Aceptar",
                    timer: "3000"
                });
                }
        
            });
    }


    const botonEliminar = (rowData) => {
        
        return (
            <>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => {eliminar(rowData)}} />
                
            </>
        );
    }

    const botonModificar = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil " className="p-button-rounded p-button-success" onClick={() => {setVisible(true) ; setId(rowData.id) ; setNombre(rowData.nombre) ; setEnlace(rowData.enlace) ; setTipo(rowData.tipo) ; setbtntitle("Modificar") ; seturlArchivo(path_base+"/"+rowData.ruta_archivo ); settxtbtnfile(rowData.ruta_archivo+"\nCambiar archivo"); setFileselect(null)  }} />
            </>
        );
    }

    const botonVer = (rowData) => {
        return (
            <>
                <Link to={rowData.enlace?rowData.enlace:'/Documentos/Prueba/'+rowData.ruta_archivo} target="_blank"><Button icon="pi pi-download" className="p-button-rounded p-button-danger" /></Link>
            </>
        );
    }


    const renderFooter = () => {
        return (
            <div>
                <Button label={btntitle}   className='p-button-rounded p-button-primary' onClick={() => {setVisible(false) ; agregar() ; }}  />
                <Button label="Cancelar"  className='p-button-rounded p-button-secondary' onClick={() => {setVisible(false) ; setbtntitle("Cargar Archivo"); setFileselect(null); seturlArchivo(null); }}  />
            </div>
        );
    }

    const renderFooterReporteria = () => {
        return (
            <div>
                <Button label="Cerrar"  className='p-button-rounded p-button-secondary' onClick={() => {setVisibleReporteria(false) ;}}  />
            </div>
        );
    }


    const selectFileUpload = (file) =>{
        const objUrl = URL.createObjectURL(file)
        seturlArchivo(objUrl)

    };


    const botonDescarga = (rowData) => {        
        return (
            <div>
                <Link to={rowData.rutaArchivo} target="_blank"  ><Button icon="pi pi-download" className='p-button-rounded p-button-danger'/></Link>
            </div>
        );
    };

    const fieldFechaDocumento = (rowData) => {
        return (
            <div>
                {moment(rowData.fecha).format('DD-MM-YYYY')}
            </div>
        );
    }

  
    return (
        <div className="card" >
                <h1>Programa Educativo</h1>
                <div className="card" >
                    <div style={{ display: "flex", justifyContent: "flex-end"}}>
                        <Button onClick={()=>{setVisible(true) ; setNombre("") ; setId("") ; setbtntitle("Agregar") ; setEnlace("") ; setTipo("") ; settxtbtnfile("Cargar Archivo"); setFileselect(null); seturlArchivo("")}} 
                        style={{  marginBottom:"1em", marginRight:"1em", backgroundColor:"blue", borderColor:"blue"}} label="Agregar" icon="pi pi-file" iconPos="left" />
                        <Button onClick={()=>{ setVisibleReporteria(true);  }} 
                        style={{ marginBottom:"1em", backgroundColor:"#FF5733", borderColor:"#FF5733"}} label="Ver Reportería" icon="pi pi-file" iconPos="left" />
                    </div>
                    
                        <DataTable value={documentos}  scrollHeight="480px"  responsiveLayout="scroll" >
                            <Column header="Tipo de Documento" value={tipo} field='tipo'  exportable={false} ></Column> 
                            <Column header="Fecha" body={fieldFechaDocumento}  exportable={false} ></Column>
                            <Column header="Nombre del Documento" value={nombre} field='nombre'  exportable={false} ></Column>
                            <Column header="Ver" body={botonVer} exportable={false} ></Column>
                            <Column header="Modificar" body={botonModificar} exportable={false} ></Column>
                            <Column header="Eliminar" body={botonEliminar} exportable={false}  ></Column>
                        </DataTable>
                </div>
           
            
                <Dialog header="Nuevo documento" visible={visible} style={{ width:'80vw'}} onHide={onHide} modal={true}  footer={renderFooter}>
                    <div style={{ width:"100%", display:"flex"}}>
                        <div style={{width:"35%", heigth:"100vh", padding:"1rem", display:"flex", justifyContent:"center", alignItems:"center"}}>
                        <table style={{width:"100%"}}>
                            <tbody>
                            <tr>
                                <td>                                  
                                        <h5>Nombre del documento</h5>
                                        <InputText  type="text" 
                                        value={nombre} onChange={(e) => {setNombre(e.target.value)}} style={{width:"100%"}}  />                                    

                                </td>                           
                            </tr>
                            <tr>
                                <td>                                
                                        <h5>Tipo de documento</h5>
                                        <InputText  type="text" 
                                        value={tipo} onChange={(e) => {setTipo(e.target.value)}} style={{width:"100%"}}  />                                    
                                </td>
                            </tr>
                            <tr>                            
                                <td>
                                        <h5>Agregar enlace:</h5>
                                        <InputText  type="text" 
                                        value={enlace} onChange={(e) => {setEnlace(e.target.value==null?'':e.target.value)}} style={{width:"100%"}}  />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h5>Cargar archivo</h5>
                                    <Button label={txtbtnfile} onClick={() => {document.getElementById("inputFileR").click()}} />
                                 
                                </td>
                                   
                            </tr>


                            </tbody>
                        </table>
                        <InputText type="hidden" value = {id} />
                        <input type="file" id="inputFileR" hidden accept=".pdf" onChange={(e) => {settxtbtnfile(e.target.files[0].name) ; setFileselect(e.target.files[0]) ; selectFileUpload(e.target.files[0]);  /* setRutaArchivo(nombre+".pdf")*/}}/>
                        </div>
                        <div style={{width:"65%"}}>

                            <iframe id="iframe"
                                title={txtbtnfile}                                      
                                src={urlArchivo}
                                style={{width:"100%", height:"100%"}} 
                            ></iframe>
                      
        

        
                        </div>
                    </div>
                  
                
                </Dialog>


                <Dialog header="Reportería de laboratorios" visible={visibleReporteria} style={{ width:'80vw'}} onHide={onHide} modal={true}  footer={renderFooterReporteria}>
                    <div style={{ width:"100%"}}>
                        <DataTable value={reportes}  scrollHeight="480px"  responsiveLayout="scroll" tableStyle={{width:'100%'}}>
                            <Column header="Periodo" body={speriodo} exportable={false} ></Column> 
                            <Column header="Formato" value={nombreFormato} field='nombreFormato'  exportable={false} ></Column> 
                            <Column header="Tipo" value={ tipoFormato} field='tipoFormato'  exportable={false} ></Column>
                            <Column header="Departamento" value={nombreDepartamento} field='nombreDepartamento'  exportable={false} ></Column>
                            <Column header="Laboratorio" value={nombreLaboratorio} field='nombreLaboratorio'  exportable={false} ></Column>
                            <Column header="Encargado" value={encargado} field='encargado'  exportable={false} ></Column>
                            <Column header="Archivo" body={botonDescarga}  exportable={false} ></Column>
                        </DataTable>

                    </div>
                </Dialog>
            
        </div>
    )
}

export default ProgramaEducativo;
