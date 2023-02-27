import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import './estilos/tablaA.css';
import { PrimeIcons } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import '././estilos/mensajeModal.css';
const MensajesRecividos = (props) => {    
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
    const cambioFecha = (rowData) =>{
        let browserType = rowData.men_fecha_envio;        
        return(
            browserType.slice(0,10)
        )
    }
    const dialogFecha = (men_fecha_envio ) =>{
        let browserType = men_fecha_envio;        
        return(
            browserType.slice(0,10)
        )
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
    
    const renderDetalles = (rowData) => {        
        mensaje.men_estado_visto = 1; 
        return(
            <Button icon="pi pi-info" 
            className="p-button-rounded p-button-warning" 
            onClick={() => {setValue1('');setDisplayBasic(true); setMensaje(rowData);}}/>                
            
        )
    }
    const renderCambioVisto = (rowData)=>{        
        if(rowData.men_estado_visto == 1){
            return(
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info" />                
            )
        }  
        if(rowData.men_estado_visto == 0){
            return(
                <Button icon="pi pi-eye" className="p-button-rounded p-button-secondary" />   
            )
        }
    }
    const borrar = () =>{
        setValue1("");
    }
    const asignarRespuesta=()=>{
        mensaje.men_respuesta = value1;         
    }
    const guardarRespuesta = () => {            
                     
        return(<Button 
            label="Guardar"  
            className="pi pi-save"                        
            onClick={() => {asignarRespuesta(); props.metodoRespuesta(mensaje); setDisplayBasic(false); borrar();}}            
        />
        )           
    }
    
    return (
        <div>
            <DataTable value={props.value}   scrollable scrollHeight="500px" size="small" selectionMode={props.selectionMode} selection={props.selection}>                        
                    {props.columnas.map((columna, index) => {                                                                                    
                        if(columna.field == "informacion"){
                            return <Column key={index} style={{ minWidth: '8rem', textAlign: 'center' }}  header={columna.header} body={renderCambioInfo}></Column>
                        }
                        if(columna.field == "detalles"){
                                    return <Column key={index} style={{ minWidth: '8rem', textAlign: 'center' }} header={columna.header} field={renderDetalles}></Column>
                        }
                        if(columna.field == "visto"){                                
                            return <Column key={index} style={{ minWidth: '8rem', textAlign: 'center' }} header={columna.header}  body={renderCambioVisto}></Column>
                        }
                        if(columna.field =="men_fecha_envio"){
                            return <Column key={index} style={{ minWidth: '8rem', textAlign: 'center' }} field={columna.field} header={columna.header} body={cambioFecha}></Column> 
                        }
                        else{                                
                            return <Column key={index} style={{ minWidth: '8rem', textAlign: 'center' }} field={columna.field} header={columna.header}></Column> 
                        }                            
                    })} 
            </DataTable>
            <Dialog header={props.encabezado} visible={displayBasic}  style={{ width: '50vw' }} footer={guardarRespuesta(value1)} onHide={() => {setDisplayBasic(false); props.actualizar(mensaje)} }>
                <table border="0">
                    <tbody>
                        <tr>
                            <td style={{paddingRight: '2rem'}}>
                                <table border="0"> 
                                    <tbody>
                                        <tr>
                                            <td><h5>Fecha:</h5></td>
                                                <td style={{padding: '1rem'}}>
                                                    <span className="p-float-label p-input-icon-left">  
                                                        <i className="pi pi-calendar" />
                                                        <InputText id="fecha" value={dialogFecha(mensaje.men_fecha_envio)}/>
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
                                                        <InputTextarea  id="detalles" value={mensaje.men_detalles} rows={5} cols={23}/>
                                                        <label htmlFor="detalles">Detalles</label>
                                                </span>                                            
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><h5>Respuesta:</h5></td>
                                            <td style={{padding: '1rem'}}>
                                                <span className="p-float-label p-input-icon-left">
                                                    <i className="pi pi-send" />
                                                    <InputText id="txtrespuesta" value={value1} onChange={(e) => {setValue1(e.target.value)}} maxLength="100"/>
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
                                        <tr>
                                            <td className="td" colSpan="2"><h3>Información de la empresa</h3></td>                                    
                                        </tr>
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
                    </tbody>
                </table> 
            </Dialog>
        </div>
    )
}

export default MensajesRecividos
