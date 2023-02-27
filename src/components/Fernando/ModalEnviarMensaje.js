import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { RadioButton } from 'primereact/radiobutton';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { DepartamentoServicio } from '../../services/Fernando/DepartamentoServicio';
import swal from 'sweetalert';
import FileService from '../../services/FileService';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const ModalEnviarMensaje = (props) => {

    const [depas , setDepas] = useState(null);
    const departamentoServicio = new DepartamentoServicio();
    const [documento, setDocumento] = useState("");
    const [enlace, setEnlace] = useState("");   
    const [informacionR, setInformacionR] = useState(null);
    const [selectDepa, setSelectDepa] = useState(null);

    const fileService=new FileService();
    const [documentoOriginal, setDocumentoOriginal] = useState("");
 
    const [mensaje, setMensaje] = useState({
        id_Mensajes:null,
        id_Departamento:props.valordep,
        men_fecha_envio:"",
        men_asunto:"",
        men_detalles:"",    
        men_numero_contacto:null,
        men_correo_contacto:"",
        men_informacion:"",
        men_estado_visto :0,
        men_estado_envio:1 ,
        men_tipo_informacion:1,
        men_remitente:props.valordep,
	    men_destinatario:0
    });
    const [verDocumento, setverDocumento] = useState(true);
    const [verEnlace, setVerEnlace] = useState(true);        
    const DocumentoVer = (props) => { 
        return(<div>
               <span className="p-input-icon-left">
                                    <i className="pi pi-file-pdf" />
                                   <InputText  
                                  // id="men_informacion"                                     
                                    
                                    value={documentoOriginal} onChange={(e)=>{setDocumentoOriginal(e.value)}}  disabled={props.v}/></span>   
            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success p-mr-2" onClick={abrirExplorador} disabled={props.v} />
               </div>   );
          
                   
       }
    const EnlaceVer=(props)=>
    { 
        return(
            <div>
                <span className="p-input-icon-left">
                    <i className="pi pi-link" />   
                    <InputText   
                        id="men_informacion"                                                                          
                        value={enlace} onChange={handleInputChange}  disabled={props.v} 
                    />
                </span>                                              
            </div>
        );           
   }
   
   const footer = () => {  
        return<Button icon="pi pi-send" label="Enviar"  onClick={() => {enviarMensajes()}} />
    }
    const limpiarMensaje=()=>{
       setMensaje({
            id_Mensajes:null,
            id_Departamento:props.valordep,
            men_fecha_envio:"",
            men_asunto:"",
            men_detalles:"",    
            men_numero_contacto:"",
            men_correo_contacto:"",
            men_informacion:"",
            men_estado_visto :0,
            men_estado_envio:0 ,
            men_tipo_informacion:1 ,
            men_remitente:props.valordep,
	        men_destinatario:0
        });
        setSelectDepa(null);
        setverDocumento(true);
        setVerEnlace(true);
        setInformacionR(null);
        setEnlace("");
        setDocumento("");
        setDocumentoOriginal("");
    }
    const handleInputChange=(event)=>{
        setMensaje({
          ...mensaje,
            [event.target.id]:event.target.value
        });
        if([event.target.id]=="men_informacion"){
            setEnlace(event.target.value);
            
        }
    }
    const asignarDepartamento=()=>{
        const depasfinal=[{
            name:"",code:null
        }];
        if(depas!=null){
            for (const i in depas) {
                depasfinal.push({name:depas[i].dep_nombre,code:depas[i].id_Departamento});
            }
            depasfinal.shift(); 
            
    
        }
        return depasfinal;
    }
    const enviarMensajes=()=>{
   
        if(selectDepa!=null){
            asignarFecha();
       
            validarTipoInformacion();
       
        const update=selectDepa.map((value)=>{ return value.code;});
        for (const item of update) {
            /*mensaje.id_Departamento=item;*/            
            mensaje.men_destinatario=item; 
            props.enviarMsg(mensaje);
        }
        limpiarMensaje();
        }else{
            swal({
            title:"¡Atencion!",
            text:"¡No se ha elegido destinatario!",
            icon:"info",
            button:"Aceptar",
            timer:"3000"       
            });
        }  

    }
    const asignarFecha=()=>{
        let f = new Date();    
        let fecha=f.getFullYear();
        let mes=(f.getMonth() +1);
        let dia=f.getDate();
    
        
        if(mes>0&&mes<10){
            fecha+="-0"+mes;
        }
        else{
            fecha+="-"+mes;
        }
        
        if(dia>0&&dia<10){
            fecha+="-0"+dia;
        }
        else{
            fecha+="-"+dia;
        }
        
        mensaje.men_fecha_envio=fecha;
    }
    const validarTipoInformacion=()=>{
    
        if(verDocumento==true){
            if(enlace!=null){            
            mensaje.men_tipo_informacion=0;  
            }else{console.log("sin enlace");}
            
        }else if(verEnlace==true){
            if(documento!=null){
                mensaje.men_informacion=documento;
                mensaje.men_tipo_informacion=1;
            }else{console.log("sin documento");}
            
        }
        
    }
    useEffect(() => {
        departamentoServicio.getAll().then(data=>setDepas(data));
        
    }, []);
  
    const abrirExplorador=()=>{
        document.getElementById("archivopdf").click();
        
    }
    const onArchivoChange=(e)=>{
        if(e.target.files.length != 0)
        {   
            var formData = new FormData();
            formData.append('file',e.target.files[0]); 
            formData.append('ruta','\\VINCULACIÓN\\DOCUMENTOS MENSAJES\\' + cookies.get('nombre_Departamento')); 
            formData.append('nombrearch',e.target.files[0].name); 
            fileService.upload(formData).then(data=>{
               console.log(data.message);
                if(data.status===200){                
                    setDocumento(data.message);
                    setDocumentoOriginal(e.target.files[0].name);
                }
                else{
                    if(data.status === 501){
                        swal({
                            title: "¡Atención!",
                            text: data.message,
                            icon: "error",
                            button: "Aceptar",
                            timer: "3000"
                          });
                     }
                }
            })
    //        console.log(e.target.files[0]);
            //setDocumento("/"+e.target.files[0].name);
        }
        
      }
    return (       
        <div>       
            <Dialog header= "Nuevo Mensaje" footer={footer(mensaje)} visible={props.visible} modal={props.modal} style={props.style}  onHide={props.onHide}>
                
                    <table  >
                        <tbody>
                             <tr >    
                            <th >
                                <label htmlFor="destinatario">Destinatario:</label></th>                 
                            <th >                                                                                                    
                                <MultiSelect value={selectDepa} options={asignarDepartamento()} onChange={(e)=>{setSelectDepa(e.value)}} optionLabel="name" placeholder="Seleccione un departamento" maxSelectedLabels={2}  />                                                
                            </th>                        
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="asunto">Asunto :</label>
                            </th>
                            <th>
                                <span className="p-input-icon-left">
                                <i className="pi pi-users" />
                                <InputText 
                                id="men_asunto"
                                value={mensaje.men_asunto}            
                                onChange={handleInputChange}                                 
                                /></span>
                            </th>                        
                        </tr>
                        <tr>
                            <th>           
                                <label htmlFor="detalles">Detalles :</label>
                            </th>
                            <th>
                                <InputTextarea id="men_detalles" rows={5} cols={30}   onChange={handleInputChange}   value={mensaje.men_detalles}  /></th>
                            <th>
                                <label htmlFor="informacion">Información de la empresa</label><br/>
                                <br/>
                                <label htmlFor="numconta">Numero de contacto :</label>                                                            
                                  
                                  <span className="p-input-icon-left">
                                <i className="pi pi-phone" />
                               
                                    <InputMask id="men_numero_contacto" mask="(999) 999-9999" value={mensaje.men_numero_contacto} placeholder="(999) 999-9999"  onChange={handleInputChange} ></InputMask>

                                </span>
                            </th>
                        </tr>                        
                        <tr>
                            <th></th>
                            <th>                                
                            <RadioButton inputId="informacion1" name="informacion" value="documento" onChange={(e) => {setInformacionR(e.value);setverDocumento(false); setVerEnlace(true);setEnlace("") }}  checked={informacionR === 'documento'}                           
                             
                            />                            
                                <label htmlFor="documento">Documento :</label>                                                             
                                 <DocumentoVer
                                  v={verDocumento}/>

                                <input type="file" id="archivopdf"  accept=".pdf" hidden onChange={ onArchivoChange}></input>                                
                                
                            </th>
                             
                            <th>
                                <label htmlFor="numconta">Correo de contacto :</label>
                               
                                <span className="p-input-icon-left">
                                <i className="pi  pi-envelope" />   
                                  <InputText  
                                  id="men_correo_contacto"                                         
                                  onChange={handleInputChange} 
                                value={mensaje.men_correo_contacto} /></span>
                              
                            </th>
                        </tr>
                        <tr>
                            <th></th>
                            <th> 
                            <RadioButton inputId="informacion2" name="informacion" value="enlace" onChange={(e) => {setInformacionR(e.value);setverDocumento(true); setVerEnlace(false);setDocumento("")}} checked={informacionR === 'enlace'} 
                     />                                      
                                <label htmlFor="enlace">Enlace :</label><br/>                                                                                                                      
                                    <EnlaceVer v={verEnlace}/>
                            </th>
                        </tr>               
                        </tbody>
                              
                    </table>                                         
            </Dialog>                        
        </div>
    )
}

export default ModalEnviarMensaje
