import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import swal from 'sweetalert';
import moment from 'moment/moment';
 
import { ServicioProgramaEducativo } from '../../services/Ramon/ServicioProgramaEducativo';

import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const ProgramaEducativo = () => {
    const navigate = new useNavigate();

    const [visible, setVisible] = useState(false);

    const [documentos, setDocumentos] = useState(null);
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [fecha, setFecha] = useState("");
    const [enlace, setEnlace] = useState("");
    const [departamentoId, setDepartamentoId] = useState("");
   // const [rutaArchivo, setRutaArchivo] = useState("");
    const [txtbtnfile, settxtbtnfile] = useState("");
    const [fileselect, setFileselect] = useState(null);
    const [urlArchivo, seturlArchivo] = useState(null);
    const path_base = "/Documentos/Prueba/";


    const [id, setId] = useState("");
    const [btntitle, setbtntitle] = useState("")

    var cookiedep=cookies.get('id_Departamento');

    var servicioPrograma = new ServicioProgramaEducativo;

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
    }

    function listar() {
        setDepartamentoId(cookiedep)
        return servicioPrograma.ListarDocumentosPorDepto(cookiedep).then(data => {
            setDocumentos(data);
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
        console.log(documento)
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
                <Button icon="pi pi-list" className="p-button-rounded p-button-primary" onClick={() => {setVisible(true) ; setId(rowData.id) ; setNombre(rowData.nombre) ; setEnlace(rowData.enlace) ; setTipo(rowData.tipo)}} />
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


    const selectFileUpload = (file) =>{
        const objUrl = URL.createObjectURL(file)
        seturlArchivo(objUrl)

    };

    return (
        <div className="card" >
                <h1>Programa Educativo</h1>
                <div className="card" >
                    <div style={{ display: "flex"}}>
                        <Button onClick={()=>{setVisible(true) ; setNombre("") ; setId("") ; setbtntitle("Agregar") ; setEnlace("") ; setTipo("") ; settxtbtnfile("Cargar Archivo"); setFileselect(null); seturlArchivo("")}} 
                        style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"blue", borderColor:"blue"}} label="Agregar" icon="pi pi-file" iconPos="left" />
                    </div>
                    
                        <DataTable value={documentos}  scrollHeight="480px"  responsiveLayout="scroll" >
                            <Column header="Tipo de Documento" value={tipo} field='tipo'  exportable={false} ></Column> 
                            <Column header="Fecha" value={ moment(fecha).format('YYYY-MM-DD')} field='fecha'  exportable={false} ></Column>
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
                                        value={enlace} onChange={(e) => {setEnlace(e.target.value)}} style={{width:"100%"}}  />
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
            
        </div>
    )
}

export default ProgramaEducativo;
