import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Dialog } from 'primereact/dialog';
import { ServicioCubiculo } from '../../../services/Alonso/ServicioCubiculo';
import { CEAuxiliarLaboratorio } from '../../../services/ConsultasEspecificas/Alonso/CEAuxiliarLaboratorio';
import FileService from '../../../services/FileService';
import { Button } from 'primereact/button';
import DialogSUbidaDocumentos from '../../../components/Orozco/DialogSUbidaDocumentos';
import swal from 'sweetalert';

const GestionCubiculo = (props) => {
    const cEAuxiliarLaboratorio =new CEAuxiliarLaboratorio();
    const servicioCubiculo=new ServicioCubiculo();
    const cookies=new Cookies();
    const fileService=new FileService(); 
    //Parametros de consulta
    const idusuario = parseInt(cookies.get('idUsuario'));

    const [estado, setEstado] = useState(0);
    const [cubiculodocente, setCubiculodocente] = useState(null);
    const [visible, setVisible] = useState(false);
    const [cubiculo, setCubiculo] = useState({
        id_cubiculo: null,
        id_usuarios: null,
        cub_nombre: null,
        cub_estado: null,
        cub_inventario: null,
        cub_firmaaceptacion: null
       
});

    const renderInventario=(rowData)=>{
        return (
        <>
        <div style={{paddingLeft:'40px'}}>
           {(rowData.cub_inventario != null)?<a href={rowData.cub_inventario} download={rowData.cub_inventario} style={{textDecorationLine : "none"}}>
        <Button icon="pi pi-cloud-download" className="p-button-rounded p-button-success"  />
         </a>  : <Button icon="pi pi-cloud-download" className="p-button-rounded p-button-success" disabled /> } 
        </div>
                    
        </>)
    }
    const renderFirmaAceptacion=(rowData)=> {
        return (
            <>
            <div style={{paddingLeft:'80px'}}>
              {(rowData.cub_inventario!==null)? (rowData.cub_firmaaceptacion!==null)? <Button icon="pi pi-sync" className="p-button-rounded p-button-success p-mr-2"  onClick={()=>{setVisible(true);setCubiculo(rowData)}}/>:<Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success p-mr-2"  onClick={()=>{setVisible(true);setCubiculo(rowData)}}/>:<Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success p-mr-2"  disabled/>}
            </div>
      
            </>
        )}
        
        
        const Asignado=(props)=>{
         
            return(
                    <>
                        <DataTable value={cubiculodocente}>
                            <Column body={props.rowTemplate} header={"#"}/>
                            <Column field='cub_nombre'header={"Nombre"}/>
                            <Column field='user_nombre'header={"A Cargo De "}/>
                            <Column body={renderInventario} header='Descargar Inventario'/>
                            <Column body={renderFirmaAceptacion} header='Subir Firma de Aceptacion'/>
                        </DataTable>
                    </>
                  )
 
     
  
          }
          const SinAsignacion=()=>{
         
       return   (
       <>
       <center><h3 style={{padding:'100px 30px'}}>SIN CUBICULO</h3></center>
       </>
       )
    
            }
        
        const onPdfChange=(file)=>{

            var formData = new FormData();
            formData.append('file',file); 
            formData.append('ruta',cookies.get('nombre_Departamento')+'\\'+cubiculo.user_nombre+'\\'+cubiculo.cub_nombre+'\\Firma Aceptacion'); 
            formData.append('nombrearch',file.name); 
            fileService.upload(formData).then(data=>{
              
                if(data.status===200){                                  
                  guardarFirma(data.message);
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

        const guardarFirma=(firma)=>{
            cubiculo.cub_firmaaceptacion=firma;
           
servicioCubiculo.save(cubiculo).then(data=>{
    setCubiculodocente(null);
  
        cEAuxiliarLaboratorio.getDocenteCubiculo(idusuario,1).then(data=>{
          if(data.length==0 )
          setEstado(0);
          else
          setEstado(1);
          setCubiculodocente(data); 
       
     })
})
        }
        const eliminarFirma=async()=>{
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
       
       
         if(bandera){
           
            fileService.delete(cubiculo.cub_firmaaceptacion).then(data=>{
               
               if(data.status===200){
                   swal({
                     title: "¡Atención!",
                     text: data.message,
                     icon: "success",
                     button: "Aceptar",
                     timer: "3000"
                   }); 
                  cubiculo.cub_firmaaceptacion=null;              
                     
                       servicioCubiculo.save(cubiculo).then(data=>{
                        setCubiculodocente(null);
                       
                            cEAuxiliarLaboratorio.getDocenteCubiculo(idusuario,1).then(data=>{
                              if(data.length==0 )
                              setEstado(0);
                              else
                              setEstado(1);
                              setCubiculodocente(data); 
                        
                         })
                        
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
        
      
    useEffect(() => {
    cEAuxiliarLaboratorio.getDocenteCubiculo(idusuario,1).then(data=>{     
      if(data.length==0 )
      setEstado(0);
      else
      setEstado(1);
      setCubiculodocente(data); 
     
    })
    }, [])
    const rowTemplate=(rowData)=>{
      
      return cubiculodocente.indexOf(rowData)+1;
    }
  return (
    <div>
  
      <Dialog header="Cubículos" visible={props.visible} modal={true} style={{width: '950px'}} onHide={props.onHide}>                   
          {(estado!=0)?<Asignado rowTemplate={rowTemplate}/>:<SinAsignacion/>}
          <DialogSUbidaDocumentos header={"Subir Firma Aceptacion"} usuario={"Docente: "+cubiculo.user_nombre} visible={visible}  style={{width: '700px'}}  onHide={()=>setVisible(false)} onChangeInputFile={onPdfChange} urlDoc={cubiculo.cub_firmaaceptacion} eliminarPDF={eliminarFirma}/>
      </Dialog>
    </div>
   
  )
}

export default GestionCubiculo
