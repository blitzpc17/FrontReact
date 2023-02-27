import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Panel } from 'primereact/panel';
import React, { useState, useEffect } from 'react';
import { CEJefeLaboratorio } from '../../../services/ConsultasEspecificas/Alonso/CEJefeLaboratorio';
import { ServicioSolicitudes } from '../../../services/Alonso/ServicioSolicitudes';
import swal from 'sweetalert';
import DialogSUbidaDocumentos from '../../../components/Orozco/DialogSUbidaDocumentos';
import { TabView, TabPanel } from 'primereact/tabview';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import FileService from '../../../services/FileService';

const cookies=new Cookies();

const ASolicitudes = () => {
  const navigate = new useNavigate();

    const cEJefeLaboratorio=new CEJefeLaboratorio();
    const servicioSolicitudes=new ServicioSolicitudes();   
    const cookies=new Cookies();
    const fileService=new FileService();  
    const [aSolicitudesAtendidas, setASolicitudesAtendidas  ] = useState(null);
     const [aSolicitudesPendientes, setASolicitudesPendientes  ] = useState(null);
    const [visibleSol, setVisibleSol] = useState(null);
    const [nombreLaboratorio, setNombreLaboratorio] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");

    //Parametros de servicios
    const {idlab, gestlab} = new useParams();
    const idLaboratorio = parseInt(idlab);
    const gestionLaboratorio = parseInt(gestlab);
    
    const [solicitud, setSolicitud] = useState({
        id_solicitud: null,
        id_gestionlaboratorio: gestionLaboratorio,
        soli_fecha: "",
        soli_asunto: "",
        soli_estado: null,
        soli_recibidas: null,
        soli_atendidas: null,
            });
    
    const getEstadoLabel = (status) => {
        switch (status) {
            case 1:
                return 'Atendida';

            case 2:
                return 'Pendiente';

            default:
                return 'Pendiente';
        }
    }
    
  const  renderRecibidas=(rowData)=>
   {
    return (
        <>

        {(rowData.soli_recibidas!=null)?<a href={rowData.soli_recibidas} target={'_blank'} rel="noreferrer" style={{textDecorationLine : "none"}}> <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  /> </a>: <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  disabled/> }
        </>
    )
   }
   
   const renderAtendidas=(rowData)=> {
    return (
        <>
    {(rowData.soli_estado!==2)?  <Button icon="pi pi-sync" className="p-button-rounded p-button-success p-mr-2"  onClick={()=>{setVisibleSol(true);setSolicitud(rowData)}}/>:<Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success p-mr-2"  onClick={()=>{setVisibleSol(true);setSolicitud(rowData)}}/>}
        </>
    )}
   const  renderEliminar=(rowData) =>{
      return (
          <>
          {(rowData.soli_estado===1)? <Button  icon="pi pi-trash" className="p-button-rounded p-button-danger"   onClick={()=>eliminarSolicitud(rowData)}/> :<Button  icon="pi pi-trash" className="p-button-rounded p-button-danger"  disabled /> }

          </>
      )}
  
  
    
    const onPdfChange=(file)=>{  
    
      var formData = new FormData();
      formData.append('file',file); 
      formData.append('ruta',cookies.get('lblPeriodo')+'\\'+cookies.get('nombre_Departamento')+'\\'+nombreUsuario+'\\Laboratorios\\'+nombreLaboratorio+'\\Solicitudes\\Atendidas'); 
      formData.append('nombrearch',file.name); 
      fileService.upload(formData).then(data=>{
        
          if(data.status===200){                                  
            respuestaSolicitud(data.message);
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
      
     
    }
    const respuestaSolicitud=(respuesta)=>{
       solicitud.soli_estado=1;           
        solicitud.soli_atendidas=respuesta;   
      
        servicioSolicitudes.save(solicitud).then(data=>{
            swal({
                title: "¡Atención!",
                text: "¡Solicitud Atendida",
                icon: "success",
                button: "Aceptar",
                timer: "3000"
              });
              
              setASolicitudesAtendidas(null);
              setASolicitudesPendientes(null);
             cEJefeLaboratorio.getJSolicitudes(gestionLaboratorio,"soli_estado desc, soli_fecha",1).then(data=>setASolicitudesAtendidas(data));
              cEJefeLaboratorio.getJSolicitudes(gestionLaboratorio,"soli_estado desc, soli_fecha",2).then(data=>setASolicitudesPendientes(data));
                        
        });
    }
    const eliminarAtendidas=async()=>{
      var bandera=false;
     await swal({
        title: "¿Deseas Eliminar el Archivo?",
        text: "¡Los cambios no se podrán recuperar!",
        icon: "warning",
        buttons: ["Cancelar","Aceptar"],
        dangerMode: true
      }).then((OK) => {
        if(OK){                        
          bandera=true;
         
        }else{
          swal({
            title: "¡Atención!",
            text: "¡No se ha Eliminado el Archivo!",
            icon: "info",
            button: "Aceptar",
            timer: "3000"
          });
       
        }        
      }); 
      if (bandera){
        fileService.delete(solicitud.soli_atendidas).then(data=>{
        
        if(data.status===200){
            swal({
              title: "¡Atención!",
              text: data.message,
              icon: "success",
              button: "Aceptar",
              timer: "3000"
            }); 
          solicitud.soli_estado=2;           
        solicitud.soli_atendidas=null;           
        servicioSolicitudes.save(solicitud).then(data=>{
          swal({
            title: "¡Atención!",
            text: "¡Se ha Eliminado la Respuesta a Solicitud!",
            icon: "success",
            button: "Aceptar",
            timer: "3000"
          });
          setASolicitudesAtendidas(null);
          setASolicitudesPendientes(null);
         cEJefeLaboratorio.getJSolicitudes(gestionLaboratorio,"soli_estado desc, soli_fecha",1).then(data=>setASolicitudesAtendidas(data));
          cEJefeLaboratorio.getJSolicitudes(gestionLaboratorio,"soli_estado desc, soli_fecha",2).then(data=>setASolicitudesPendientes(data));
                 
                        
        });
        }else{
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
      }   
      
    

      
    }
       
  const  eliminarSolicitud=(data)=>{
        
            if(data.soli_estado === 1){   
              swal({
                title: "¿Deseas Eliminar la Solicitud",
                text: "¡Los cambios no se podrán recuperar!",
                icon: "warning",
                buttons: ["Cancelar","Aceptar"],
                dangerMode: true
              }).then((OK) => {
                if(OK){                                  
               
                  servicioSolicitudes.delete(data.id_solicitud).then(data=>{
                    swal({
                      title: "¡Atención!",
                      text: "¡Se ha Eliminado la Solicitud!",
                      icon: "success",
                      button: "Aceptar",
                      timer: "3000"
                    });
                    setASolicitudesAtendidas(null);
                    setASolicitudesPendientes(null);
                   cEJefeLaboratorio.getJSolicitudes(gestionLaboratorio,"soli_estado desc, soli_fecha",1).then(data=>setASolicitudesAtendidas(data));
                    cEJefeLaboratorio.getJSolicitudes(gestionLaboratorio,"soli_estado desc, soli_fecha",2).then(data=>setASolicitudesPendientes(data));
                           
                  });
                  
                }else{
                  swal({
                    title: "¡Atención!",
                    text: "¡No se ha Eliminado la Solicitud!",
                    icon: "info",
                    button: "Aceptar",
                    timer: "3000"
                  });
                }          
              });          
            }
          }
		   const rowTemplate = (rowData) => {
            return aSolicitudesAtendidas.indexOf(rowData) + 1;
        }
        const rowTemplate2 = (rowData) => {
          return aSolicitudesPendientes.indexOf(rowData) + 1;
      }
 
     useEffect(() => {  
        if(!cookies.get('rolesUsuario').rol_auxiliar_laboratorio)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Solicitudes'){
              cEJefeLaboratorio.getJSolicitudes(gestionLaboratorio,"soli_estado desc, soli_fecha",1).then(data=>setASolicitudesAtendidas(data));
              cEJefeLaboratorio.getJSolicitudes(gestionLaboratorio,"soli_estado desc, soli_fecha",2).then(data=>setASolicitudesPendientes(data));
              cEJefeLaboratorio.getNombreLabUser(idLaboratorio).then(data=>{setNombreLaboratorio(data[0].lab_nombre);setNombreUsuario(data[0].user_nombre)})
            }
            else
                navigate('/plataforma/gestionauxiliarlab');
        }      
         
     
    }, [])
        return (
        <div>
          
          <center><h2>Solicitudes de {nombreLaboratorio}</h2></center>                        
                <div className="card">
                
                <TabView>
                    <TabPanel header="Pendientes">
                    <Panel>
                <DataTable value={aSolicitudesPendientes}  responsiveLayout="scroll"scrollable scrollHeight="400px">
                    <Column body={rowTemplate2} header={"#"}/>
                    <Column field={"soli_fecha"} header={"Fecha"}></Column>
                    <Column field={"soli_asunto"} header={"Asunto"}></Column>   
                    <Column body={(rowData)=>getEstadoLabel(rowData.soli_estado)} header={"Estado"}  ></Column>  
                    <Column body={renderRecibidas} header={"Recibidas"}></Column> 
                    <Column body={renderAtendidas} header={"Respuesta"}></Column> 
                    {/* <Column body={renderEliminar} header={"Eliminar Solicitud"}></Column>                                         */}
                </DataTable>

            </Panel>
                    </TabPanel>
                      
                    <TabPanel header="Atendidas">
                    <Panel>
                <DataTable value={aSolicitudesAtendidas}  responsiveLayout="scroll"scrollable scrollHeight="400px">
                    <Column body={rowTemplate} header={"#"}/>
                    <Column field={"soli_fecha"} header={"Fecha"}></Column>
                    <Column field={"soli_asunto"} header={"Asunto"}></Column>   
                    <Column body={(rowData)=>getEstadoLabel(rowData.soli_estado)} header={"Estado"}  ></Column>  
                    <Column body={renderRecibidas} header={"Recibidas"}></Column> 
                    <Column body={renderAtendidas} header={"Respuesta"}></Column> 
                    {/* <Column body={renderEliminar} header={"Eliminar Solicitud"}></Column>                                         */}
                </DataTable>

            </Panel>
                     </TabPanel>
                 
                </TabView>
            </div>
           
            <DialogSUbidaDocumentos header={"Subir Respuesta"} usuario={"Asunto: "+solicitud.soli_asunto} visible={visibleSol}  style={{width: '700px'}}  onHide={()=>setVisibleSol(false)} onChangeInputFile={onPdfChange} urlDoc={solicitud.soli_atendidas} eliminarPDF={eliminarAtendidas}/>
          
        </div>
    )
}

export default ASolicitudes
