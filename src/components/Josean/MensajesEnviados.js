import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { InputMask } from 'primereact/inputmask';
import swal from 'sweetalert';

import { EnviadosServicio } from '../../services/Josean/EnviadosServicio';
import { ServicioMensajes } from '../../services/Josean/ServicioMensajes';
import axios from "axios";
import { Toast } from 'primereact/toast';
import FileService from '../../services/FileService';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

const MensajesEnviados = (props) => {

    var cookiedep=cookies.get('id_Departamento');
    var cookiename=cookies.get('nombre_Departamento');
    const [depavinculacion, setDepavinculacion] = useState(0);

    var servicioMensajes = new ServicioMensajes();
    var mensajesEnv = new EnviadosServicio();

    const [visible, setVisible] = useState(false);

    const [mensaje, setMensaje] = useState({
        id_Mensajes:"",
        id_departamento:"",
        men_fecha_envio: "",
        men_asunto: "",
        men_detalles: "",
        men_numero_contacto: "",
        men_correo_contacto: "",
        men_respuesta: "",
        men_estado_visto:"",
        men_estado_envio:"",
        men_informacion:"",
        men_nombre_departamento:""
    });

    const [displayBasic, setDisplayBasic] = useState(false);
    const [position, setPosition] = useState('center');

    const [opcion, setOpcion] = useState(null);
    const [documento, setDocumento] = useState("");
    const [enlace, setEnlace] = useState("");
    const [estadoDoc, setEstadoDoc] = useState(true)
    const [estadoEnlace, setEstadoEnlace] = useState(true);
    const [asunto, setAsunto] = useState("");
    const [detalles, setDetalles] = useState("");
    const [numerocon, setNumerocon] = useState("");
    const [correocon, setCorreocon] = useState("");
    const [fileSelect, setFileSelect] = useState(null);
    const [mensajesenv, setMensajesenv] = useState(null);



    useEffect(() => {
        buildSegCompareObj();
        
    }, []);

    const buildSegCompareObj = async() =>{
        let regtemp = 8;
        await axios.get("http://localhost:8080/api/v1/departamento/vinculacion" ).then(res => {
          	regtemp = res.data.id_Departamento;
		setDepavinculacion(res.data.id_Departamento);
        });
        await mensajesEnv.search(cookiedep,regtemp).then(data => setMensajesenv(data));
      }
    

    var fileService = new FileService();
    const toast = useRef(null);
    
    
    const dialogFuncMap = {
        'displayBasic': setDisplayBasic        
    }
    
    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }
    const onClick = (position) => {
       
        if (position) {
            setPosition(position);
        }
    }

    const agregar = () => {
        if(asunto === null ||
            detalles === null ||
            opcion === null){
                swal({
                    title: "¡Atención!",
                    text: "¡Rellena todos los campos!",
                    icon: "warning",
                    button: "Aceptar",
                    timer: "3000"
                  });
                  setVisible(true);
        }
        else if(documento === "" && enlace === ""){
            swal({
                title: "¡Atención!",
                text: "¡Seleccione un documento o enlace!",
                icon: "warning",
                button: "Aceptar",
                timer: "3000"
              });
              setVisible(true);
        }
        else{
            if(documento !== ""){
                console.log("Proceso Guardar Documento");

                var archivoName = null;
                var formdata = new FormData();
                let ruta = 'VINCULACIÓN\\DOCUMENTOS MENSAJES\\' + cookiename ;
                
                formdata.append('file', fileSelect);
                formdata.append('ruta', ruta);
                formdata.append('nombrearch', fileSelect.name);
    
                fileService.upload(formdata).then(data => {
                    //setPdfframe(data.message);
                    
                    if(data.status === 200){
                        //console.log(data.message);
                        
                        archivoName = data.message;

                        const mensaje = {
                            id_Mensajes: null,
                            id_Departamento: cookiedep,
                            men_fecha_envio: new Date(),
                            men_asunto: asunto,
                            men_detalles: detalles,
                            men_numero_contacto: numerocon,
                            men_correo_contacto: correocon,
                            men_respuesta: null,
                            men_estado_visto: 0,
                            men_estado_envio: 0,
                            men_informacion: archivoName,
                            men_tipo_informacion: 1,
                            men_nombre_departamento: cookiename,
                            men_remitente: cookiedep,
                            men_destinatario: depavinculacion
                        }
        
                        console.log(mensaje);
                        servicioMensajes.save(mensaje).then(data => {
                            setMensajesenv(null)

                            swal({
                                title: "¡Atención!",
                                text: "¡Mensaje enviado con Exito!",
                                icon: "success",
                                button: "Aceptar",
                                timer: "3000"
                              });

                            mensajesEnv.search(cookiedep,depavinculacion).then(data => setMensajesenv(data));
                        });
    
                    }else{
                        if(data.status === 501){
                            toast.current.show({severity:'error', summary: '¡Atención!', detail:'No se ha podido agregar el Documento', life: 3000});
    
                        }
                    }
                }).catch(error=>{
                    swal({
                    title: "¡Atención!",
                    text: 'El Achivo Rebasa el Limite de Tamaño Permitido',
                    icon: "error",
                    button: "Aceptar",
                    timer: "3000"
                    });
    
                });  

                
            }
            else{
                console.log("Proceso Guardar Enlace");

                const mensaje = {
                    id_Mensajes: null,
                    id_Departamento: cookiedep,
                    men_fecha_envio: new Date(),
                    men_asunto: asunto,
                    men_detalles: detalles,
                    men_numero_contacto: numerocon,
                    men_correo_contacto: correocon,
                    men_respuesta: null,
                    men_estado_visto: 0,
                    men_estado_envio: 0,
                    men_informacion: enlace,
                    men_tipo_informacion: 0,
                    men_nombre_departamento: cookiename,
                    men_remitente: cookiedep,
                    men_destinatario: depavinculacion
                }

                console.log(mensaje);
                servicioMensajes.save(mensaje).then(data => {
                    setMensajesenv(null)

                    swal({
                        title: "¡Atención!",
                        text: "¡Mensaje enviado con Exito!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                      });

                    mensajesEnv.search(cookiedep,depavinculacion).then(data => setMensajesenv(data));
                });
    
            }
        }
    }

    const entrega=(rowData)=>{
       
        if(rowData.men_respuesta != null ){
            return(
                <Button icon="pi pi-check" className="p-button-rounded p-button-success" disabled />                
            )
        }else{
            if(rowData.men_estado_visto ==1){
                return(
                    <Button icon="pi pi-check" className="p-button-rounded p-button-primary" disabled />
                )
            }else{
                return(
                    <Button icon="pi pi-check" className="p-button-rounded p-button-secondary" disabled />
                )
            }
        }
        
    }
    const renderCambioInfo = (rowData)=>{                        
        
        if(rowData.men_tipo_informacion == 1){            
            if(rowData.men_informacion != ""){
                return(
                    <a href={rowData.men_informacion} target="_blank" style={{textDecorationLine : "none"}}>
                    <Button icon="pi pi-cloud" className="p-button-rounded p-button-success" /> 
                </a>             
                )
            }
            else{
                return(<Button icon="pi pi-cloud" className="p-button-rounded p-button-success" disabled/> )
            }
        }  
        if(rowData.men_tipo_informacion == 0){
           if(rowData.men_informacion != ""){
            return(
                <a href={rowData.men_informacion} target="_blank" style={{textDecorationLine : "none"}}>
                <Button icon="pi pi-link" className="p-button-rounded p-button-success" />   
            </a>
            )
           }else{
                return(<Button icon="pi pi-link" className="p-button-rounded p-button-success" disabled/> )                
           }
        }
        
    }
    const changeRespuesta=(respuesta)=>{
        if(respuesta == null){
            return respuesta = " ";
        }else{
            if(respuesta == ""){
                return respuesta = " ";
            }else{
                return respuesta;
            }
        }
    }
    const renderDetalles=(rowData)=>{
        
        return(
            <Button icon="pi pi-info" 
            className="p-button-rounded p-button-warning" 
            onClick={() => {setDisplayBasic(true); setMensaje(rowData);}}
            />            
        )        
    }

    const renderFooter=(rowData)=>{
        
        return(
            <Button label="Enviar" icon="pi pi-check" onClick={() => {setVisible(false)  ;agregar()}}/>         
        )        
    }

    
    const onChangeInputFile=(file)=>{        
        
            setDocumento(file.name);
            setFileSelect(file);

    }


    return (
        <div>    
              <div style={{ display: "flex"}}>
                <Button onClick={()=>{setVisible(true) ; setAsunto("") ; setDetalles("") ; setDocumento("") ; setEnlace("") ; setNumerocon("") ; setCorreocon("") ; setOpcion(null) ; setEstadoDoc(true) ; setEstadoEnlace(true)}}
                style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"purple", borderColor:"purple"}} label="Nuevo Mensaje" icon="pi pi-comments" iconPos="left" />
              </div>                
            <DataTable value={mensajesenv}>
                <Column body={entrega} header=""></Column>
                <Column field="men_fecha_envio" header="Fecha"></Column>
                <Column field="men_asunto" header="Asunto"></Column>
                <Column body={renderCambioInfo} header="Información"></Column>
                <Column field={renderDetalles} header="Detalles"></Column>
            </DataTable>
            
            <Dialog  visible={displayBasic}  style={{ width: '50vw' }}  onHide={() => {setDisplayBasic(false)}}>
                <table border="0">
                    <tbody>
                        <tr>
                            <td style={{paddingRight: '2rem'}}>
                                <table> 
                                    <tbody>
                                        <tr>
                                            <td><h5>Fecha:</h5></td>
                                            <td style={{padding: '1rem'}}>
                                                <span className="p-float-label p-input-icon-left">  
                                                    <i className="pi pi-calendar" />                                                  
                                                    <InputText id="fecha" value={mensaje.men_fecha_envio}/>                                                        
                                                    <label htmlFor="fecha">Fecha</label>
                                                </span>                                                
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><h5>Asunto:</h5></td>
                                            <td style={{padding: '1rem'}}>
                                                <span className="p-float-label p-input-icon-left">
                                                    <i className="pi pi-info-circle" />                                                  
                                                    <InputText id="asunto" value={mensaje.men_asunto}/>
                                                    <label htmlFor="asunto">Asunto</label>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><h5>Detalles:</h5></td>
                                            <td style={{padding: '1rem'}}>
                                                <span className="p-float-label">                                                    
                                                        <InputTextarea  id="detalles" rows={5} cols={23} value={mensaje.men_detalles}/>
                                                        <label htmlFor="detalles">Detalles</label>
                                                </span>                                            
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><h5>Respuesta:</h5></td>
                                            <td style={{padding: '1rem'}}>
                                                <span className="p-float-label p-input-icon-left">
                                                    <i className="pi pi-send" />                                                  
                                                    <InputText id="txtrespuesta" value={changeRespuesta(mensaje.men_respuesta)}/>
                                                    <label htmlFor="txtrespuesta">Respuesta</label>
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td> 
                            <td>
                                <table className="tablaContacto" > 
                                    <tbody>
                                        <tr><td className="td" colSpan="2"><h3>Información de la empresa</h3></td></tr>
                                        <tr>
                                            <td colSpan="2">
                                                <h5>Numero de contacto:</h5>
                                                <span className="p-float-label p-input-icon-left">
                                                        <i className="pi pi-phone" />  
                                                        <InputText id="numeroContacto" value={mensaje.men_numero_contacto}/>
                                                        <label htmlFor="numeroContacto">Numero de Contacto</label>
                                                </span>                                             
                                            </td>                        
                                        </tr>
                                        <tr>
                                            <td colSpan="2">
                                                <h5>Correo de contacto:</h5>
                                                <span className="p-float-label p-input-icon-left">
                                                        <i className="pi pi-at" />
                                                    <InputText id="correoContacto" value={mensaje.men_correo_contacto}/>
                                                    <label htmlFor="correoContacto">Correo de Contacto</label>
                                                </span>
                                            </td>
                                        </tr>                 
                                    </tbody>
                                </table>                            
                            </td>               
                        </tr>                                       
                        </tbody></table> 

            </Dialog>
            <Dialog visible={visible} header="Nuevo Mensaje" style={{ width: '50vw' }} footer={renderFooter}  onHide={() => {setVisible(false)}}>
                
                <table border="0" style={{paddingTop: '2em'}}>
                    <tbody>
                        <tr >
                            <td style={{paddingRight: '1em'}}>
                                <table> 
                                    <tbody>
                                        <tr>
                                            <td><h5>Asunto:</h5></td>
                                            <td style={{padding: '1rem'}}>
                                                <span className="p-float-label p-input-icon-left">
                                                    <i className="pi pi-info-circle" />                                                  
                                                    <InputText id="asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)}/>
                                                    <label htmlFor="asunto">Asunto</label>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><h5>Detalles:</h5></td>
                                            <td style={{padding: '1rem'}}>
                                                <span className="p-float-label">                                                    
                                                        <InputTextarea  id="detalles" rows={5} cols={23} value={detalles} onChange={(e) => setDetalles(e.target.value)}/>
                                                        <label htmlFor="detalles">Detalles</label>
                                                </span>                                            
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="field-radiobutton">
                                                    <RadioButton   name="Documento" value="documento" onChange={(e) => {setOpcion(e.target.value) ; setEstadoEnlace(true) ; setEstadoDoc(false) ; setEnlace("")}} checked={opcion === 'documento'} />
                                                   
                                                    <label htmlFor="documento">Documento</label>
                                                </div>
                                            </td>
                                            <td style={{padding: '1rem'}}>                     
                                                <div className="p-inputgroup">
                                                    <InputText disabled value={documento}/>
                                                    <Button icon="pi pi-cloud-upload" className="p-button-success" onClick={() =>{document.getElementById("inputFile").click()}} disabled={estadoDoc}/>
                                                </div>
                                            </td>
                                        
                                        
                                            
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="field-radiobutton">
                                                    <RadioButton  name="Enlace" value="enlace" onChange={(e) => {setOpcion(e.value) ; setEstadoDoc(true) ; setEstadoEnlace(false) ; setDocumento("")}} checked={opcion === 'enlace'} />
                                                   
                                                    <label htmlFor="enlace" >Enlace</label>
                                                </div>
                                            </td>
                                            <td style={{padding: '1rem'}}>                                             
                                                    <InputText  onChange={(e) => setEnlace(e.target.value)} value={enlace} disabled={estadoEnlace}/>
                                            </td>
                                        </tr>
                                        
                                    </tbody>
                                </table>
                            </td> 
                            <td>
                                <table className="tablaContacto" > 
                                    <tbody>
                                        <tr><td className="td" colSpan="2"><h3>Información de la empresa</h3></td></tr>
                                        <tr>
                                            <td colSpan="2">
                                                <h5>Numero de contacto:</h5>
                                                <span className="p-float-label p-input-icon-left">
                                                        <i className="pi pi-phone" />  
                                                        <InputMask id="numeroContacto" mask="(999) 999-9999" value={numerocon} onChange={(e) => setNumerocon(e.target.value)}></InputMask>
                                                        <label htmlFor="numeroContacto">Numero de Contacto</label>
                                                </span>                                             
                                            </td>                        
                                        </tr>
                                        <tr>
                                            <td colSpan="2">
                                                <h5>Correo de contacto:</h5>
                                                <span className="p-float-label p-input-icon-left">
                                                        <i className="pi pi-at" />
                                                    <InputText id="correoContacto" value={correocon} onChange={(e) => setCorreocon(e.target.value)}/>
                                                    <label htmlFor="correoContacto">Correo de Contacto</label>
                                                </span>
                                            </td>
                                        </tr>                 
                                    </tbody>
                                </table>                            
                            </td>               
                        </tr>                                       
                        </tbody></table> 
            </Dialog>
             <input type="file" id="inputFile" hidden accept=".pdf" onChange={(e) => onChangeInputFile(e.target.files[0])}/>
             <Toast ref={toast}/>
        </div>
    )
}

export default MensajesEnviados
