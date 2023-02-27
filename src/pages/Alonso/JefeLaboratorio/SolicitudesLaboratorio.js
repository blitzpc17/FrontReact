import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Panel } from 'primereact/panel';
import React, {  useState, useEffect } from 'react';
import { CEJefeLaboratorio } from '../../../services/ConsultasEspecificas/Alonso/CEJefeLaboratorio';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ServicioSolicitudes } from '../../../services/Alonso/ServicioSolicitudes';
import { TabView, TabPanel } from 'primereact/tabview';
import swal from 'sweetalert';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import FileService from '../../../services/FileService';

const cookies=new Cookies();

const SolicitudesLaboratorio = () => {
    const navigate = new useNavigate();

    const cEJefeLaboratorio=new CEJefeLaboratorio();
    const servicioSolicitudes=new ServicioSolicitudes();   
    const fileService=new FileService();
    const [jSolicitudesAtendidas, setJSolicitudesAtendidas  ] = useState(null);
    const [jSolicitudesPendientes, setJSolicitudesPendientes  ] = useState(null);
    const [visible, setVisible] = useState(false);
    const [pdf, setPdf] = useState(null);
    const [asunto, setAsunto] = useState("");
    const [nombreLaboratorio, setNombreLaboratorio] = useState("");
   
    //parametros consultas 
    const {idlab, gestlab} = new useParams();
    const idLaboratorio = parseInt(idlab);
    const gestionLaboratorio = parseInt(gestlab);
    
    const [solicitud, setSolicitud] = useState({
        id_solicitud: null,
        id_gestionlaboratorio: gestionLaboratorio,
        soli_fecha: "",
        soli_asunto: "",
        soli_estado: 2,
        soli_recibidas: null,
        soli_atendidas: null,
            })
    const renderVer=(rowData)=>{
      return <a href={rowData.soli_recibidas}  target={'_blank'} rel="noreferrer" style={{textDecorationLine : "none"}}> <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  /> </a>
   
    }

    const footer=()=>{
      return  <Button label='Enviar' onClick={()=>{validarSolicitud()}}/>
    }
    
    const renderRespuesta=(rowData)=>{
        return (
        <>
        {(rowData.soli_atendidas != null)?<a href={rowData.soli_atendidas} download={rowData.soli_atendidas} style={{textDecorationLine : "none"}}>
        <Button icon="pi pi-cloud-download" className="p-button-rounded p-button-success"  />
         </a>  : <Button icon="pi pi-cloud-download" className="p-button-rounded p-button-success" disabled /> }              
        </>)
    }
    
    const onPdfChange=(e)=>{
        //let pdfSeleccionado=null;
        if(e.target.files.length !== 0){  
            var formData = new FormData();
            formData.append('file',e.target.files[0]); 
            formData.append('ruta',cookies.get('lblPeriodo')+'\\'+cookies.get('nombre_Departamento')+'\\'+cookies.get('nombreUsuario')+'\\Laboratorios\\'+nombreLaboratorio+'\\Solicitudes\\Pendientes'); 
            formData.append('nombrearch',e.target.files[0].name); 
            fileService.upload(formData).then(data=>{
        
                if(data.status===200){                
                   // pdfSeleccionado= data.message;
                    setPdf(data.message);
                     swal({
                    title: "¡Atención!",
                    text: "¡Exito al Subir!",
                    icon: "success",
                    button: "Aceptar",
                    timer: "3000"
          });
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
            }).catch(error=>swal({
        title: "¡Atención!",
        text: 'El Achivo Rebasa el Limite de Tamaño Permitido',
        icon: "error",
        button: "Aceptar",
        timer: "3000"
      }));           
        // setPdf("/"+e.target.files[0].name);                                                              
        
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
        
        solicitud.soli_fecha=fecha;
    }
    const getEstadoIFinal = (estado) => {
        
        switch (estado) {
            case 1:
                return   'Atendida';
    
            case 2:
                return   'Pendiente';
    
            default:
                return   'Pendiente';
        }
       
    }
    const subirPdf = () =>{
        document.getElementById("pdfsolilab").click();
    }
    const guardarPdf=()=>{ 
      
        if(!asunto.trim()){
            swal({
                title: "¡Atención!",
                text: "¡Ingrese un Asunto!",
                icon: "warning",
                button: "Aceptar",
                timer: "3000"
              });
        }else{
 
        asignarFecha();
                solicitud.soli_asunto=asunto;
                solicitud.soli_recibidas=pdf;   
               
                servicioSolicitudes.save(solicitud).then(data=>{
                    swal({
                        title: "¡Atención!",
                        text: "¡Solicitud Enviada",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                    });
                    setVisible(false);
                    setJSolicitudesAtendidas(null);
                    setJSolicitudesPendientes(null);
                    cEJefeLaboratorio.getJSolicitudes(gestionLaboratorio,"soli_estado, soli_fecha desc",1).then(data=>setJSolicitudesAtendidas(data));
                cEJefeLaboratorio.getJSolicitudes(gestionLaboratorio,"soli_estado, soli_fecha desc",2).then(data=>setJSolicitudesPendientes(data));
                    limpiarSolicitud();
                    
                });
        
        }
       
        
    }
   const limpiarSolicitud=()=>{
        setSolicitud({
            id_solicitud: null,
            id_gestionlaboratorio: gestionLaboratorio,
            soli_fecha: "",
            soli_asunto: "",
            soli_estado: 2,
            soli_recibidas: null,
            soli_atendidas: null,
                })
                setAsunto("");
setPdf(null);

    }
    const eliminarPdf=()=>{
      
        if(pdf != null){   
            swal({
              title: "¿Deseas Eliminar el Documento?",
              text: "¡Los cambios no se podrán recuperar!",
              icon: "warning",
              buttons: ["Cancelar","Aceptar"],
              dangerMode: true
            }).then((OK) => {
              if(OK){
               setPdf(null);                
              }else{
                swal({
                  title: "¡Atención!",
                  text: "¡No se ha Eliminado el Documento!",
                  icon: "info",
                  button: "Aceptar",
                  timer: "3000"
                });
              }        
            });        
          }        
    }
   const  validarSolicitud=()=>{
        if( pdf==null)
        { swal({
            title: "¡Atención!",
            text: "¡Debe Subir Evidencia!",
            icon: "info",
            button: "Aceptar",
            timer: "3000"
          });
        }else{
            guardarPdf();
           
        }
    }
   const rowTemplate = (rowData) => {
        return jSolicitudesAtendidas.indexOf(rowData) + 1;
    }
    const rowTemplate2 = (rowData) => {
        return jSolicitudesPendientes.indexOf(rowData) + 1;
    }
      useEffect(() => {     
        if(!cookies.get('rolesUsuario').rol_jefe_laboratorio)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Solicitudes'){
                cEJefeLaboratorio.getJSolicitudes(gestionLaboratorio,"soli_estado, soli_fecha desc",1).then(data=>setJSolicitudesAtendidas(data));
                cEJefeLaboratorio.getJSolicitudes(gestionLaboratorio,"soli_estado, soli_fecha desc",2).then(data=>setJSolicitudesPendientes(data));                 
                cEJefeLaboratorio.getNombreLabUser(idLaboratorio).then(data=>{setNombreLaboratorio(data[0].lab_nombre);})
            }
            else
                navigate('/plataforma/gestionjefelaboratorio');
        }
        
        
       
    }, [])
    return (
        <div>
           
            <center><h2>Solicitudes de {nombreLaboratorio}</h2></center>            
            <div className="card">
                <div align="right">
                     <Button label='Nueva Solicitud' onClick={()=>setVisible(true)}/>
                </div>
                <TabView>
                    <TabPanel header="Atendidas">
                    <Panel>
                    <DataTable value={jSolicitudesAtendidas} scrollable scrollHeight="400px">
                    <Column body={rowTemplate} header={"#"}></Column>
                    <Column field={"soli_fecha"} header={"Fecha"}></Column>
                    <Column field={"soli_asunto"} header={"Asunto"}></Column>   
                    <Column body={(rowData)=>getEstadoIFinal(rowData.soli_estado)} header={"Estado"}></Column>         
                    <Column body={renderVer} header={"Ver Solicitud"}></Column>    
                    <Column body={renderRespuesta} header={"Respuesta"}></Column>           
                </DataTable> 

            </Panel>
                    </TabPanel>
                      
                    <TabPanel header="Pendientes">
                    <Panel>
                    <DataTable value={jSolicitudesPendientes} scrollable scrollHeight="400px">
                    <Column body={rowTemplate2} header={"#"}></Column>
                    <Column field={"soli_fecha"} header={"Fecha"}></Column>
                    <Column field={"soli_asunto"} header={"Asunto"}></Column>   
                    <Column body={(rowData)=>getEstadoIFinal(rowData.soli_estado)} header={"Estado"}></Column>         
                    <Column body={renderVer} header={"Ver Solicitud"}></Column>    
                    <Column body={renderRespuesta} header={"Respuesta"}></Column>           
                </DataTable> 

            </Panel>
                     </TabPanel>
                 
                </TabView>
            </div>
            <Dialog header="Nueva Solicitud"  visible={visible} footer={footer} modal={true} style={{width: '850px'}} onHide={()=>setVisible(false)}>
<table>
    <tr>
        <td style={{paddingLeft:'80px'}}> <InputText value={asunto} onChange={(e)=>{setAsunto(e.target.value)}} placeholder="Asunto"  className="p-inputtext-lg p-d-block" size={55} maxLength="255"/></td>
    </tr>
</table>
<table>
    <tr>       
        <td align='right' style={{width: '370px'}}>          
       
        <td style={{paddingTop: '20px'}}/>
        { (pdf == null) ? <img src="/pdfDefault.png" alt="" height='340px' width='280px' /> :  <iframe title="NSolicitudJ" src={  pdf } height='335px' width='280px'/> }          
        </td>        
        <td align='center' style={{width: '300px'}}>                     
            <td style={{paddingTop: '20px'}}/>
             <Button label={(pdf === null) ? "Subir" : "Cambiar"} className="p-button-success" icon="pi pi-cloud-upload" style={{width: '150px'}} onClick={subirPdf}/> 
            <td style={{paddingTop: '20px'}}/>
           {(pdf != null)?<Button label="Eliminar" className="p-button-danger" icon="pi pi-trash" style={{width: '150px'}} onClick={eliminarPdf}/>:<Button label="Eliminar" className="p-button-danger" icon="pi pi-trash" style={{width: '150px'}} disabled/>} 
            <td style={{paddingTop: '20px'}}/>            
              <input type="file" id="pdfsolilab" hidden accept=".pdf" onChange={(e)=>{onPdfChange(e)}}></input>
            <td style={{paddingTop: '60px'}}/>
        </td>       
    </tr>
</table>

</Dialog>
        </div>
    )
}



export default SolicitudesLaboratorio
