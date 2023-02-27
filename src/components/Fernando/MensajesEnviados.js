import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
const MensajesEnviados = (props) => {

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
    const [value1, setValue1] = useState('');
    
    
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
    return (
        <div>            
            <DataTable value={props.value}>
                <Column body={entrega} header=""></Column>
                <Column field="men_fecha_envio" header="Fecha"></Column>
                <Column field="men_asunto" header="Asunto"></Column>
                <Column body={renderCambioInfo} header="Información"></Column>
                <Column field={renderDetalles} header="Detalles"></Column>
            </DataTable>
            <Dialog header={props.encabezado} visible={displayBasic}  style={{ width: '50vw' }}  onHide={() => {setDisplayBasic(false)}}>
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
        </div>
    )
}

export default MensajesEnviados
