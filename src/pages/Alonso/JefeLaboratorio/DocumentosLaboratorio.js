/* eslint-disable jsx-a11y/anchor-is-valid */
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { Component,useState, useEffect } from 'react';
import { CEJefeLaboratorio } from '../../../services/ConsultasEspecificas/Alonso/CEJefeLaboratorio';
import { ServicioDocumentoLaboratorio } from '../../../services/Alonso/ServicioDocumentoLaboratorio';
import { Button } from 'primereact/button';
import swal from 'sweetalert';
import { Panel } from 'primereact/panel';
import ModalRetroalimentacion from '../../../components/Alonso/ModalRetroalimentacion';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import FileService from '../../../services/FileService';

const cookies=new Cookies();

const DocumentosLaboratorio = () => {
    const navigate = new useNavigate();
    
    const cEJefeLaboratorio=new CEJefeLaboratorio();
    const servicioDocumentoLaboratorio=new ServicioDocumentoLaboratorio();
    const fileService=new FileService();
    const [documentos, setDocumentos] = useState(null);
    const [visible, setVisible] = useState(false);
 const [nombreLaboratorio, setNombreLaboratorio] = useState("");

     //PARAMETROS DE CONSULTAS
    const {idlab, gestlab} = new useParams();
    const idLaboratorio = parseInt(idlab);
    const gestionlaboratorio = parseInt(gestlab);
    const idDepartamento = parseInt(cookies.get('id_Departamento'));
    
    
    const [retroalimentacion, setRetroalimentacion] = useState({
        id_documentolaboratorio: null,
        id_gestionlaboratorio: gestionlaboratorio,
        id_formato: null,
        doclab_pdf: null,
        doclab_estado:null ,
        doclab_retroalimentacion: null
    });
   const actionBodyTemplateV=(rowData)=> {
        return (
            <>
    
            {(rowData.doclab_pdf!=null)?<a href={rowData.doclab_pdf}  target={'_blank'} rel="noreferrer" style={{textDecorationLine : "none"}}> <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  /> </a>: <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  disabled/> }
            </>
        )}
      const  actionBodyTemplateM=(rowData) =>{
          return (
              <>
                {(rowData.doclab_pdf!=null)? <Button icon="pi pi-sync" className="p-button-rounded p-button-success p-mr-2" onClick={()=>{subirPdf();setRetroalimentacion(rowData)}} />:<Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success p-mr-2" onClick={()=>{subirPdf();setRetroalimentacion(rowData)}}  />
}
              </>
          )}
        const  actionBodyTemplateE=(rowData)=> {
            return (
                <>
                {(rowData.doclab_pdf!=null)? <Button  icon="pi pi-trash" className="p-button-rounded p-button-danger"  onClick={()=>{eliminarPdf(rowData); }} /> :<Button  icon="pi pi-trash" className="p-button-rounded p-button-danger"  disabled /> }
    
                </>
            )}
            const renderDetalles=(rowData)=>
    {
     return(<>
      {(rowData.doclab_retroalimentacion!=null)?<Button label={getEstado(rowData.doclab_estado)}  className="p-button-link" onClick={(e) => {setVisible(true); setRetroalimentacion(rowData)}}/>:<label style={{paddingLeft: '15px' }}>{getEstado(rowData.doclab_estado)}</label>}
     </>)   
  
    
    }
    const getEstado = (estado) => {
        
        switch (estado) {
            case 1:
                return   'Completo';
    
            case 2:
                return   'Incompleto';
            
            case 3:
                return   'Subido';

            default:
                return   'Sin Subir';
        }
       
    }
    const onPdfChange=(e)=>{
        
        if(e.target.files.length !== 0){               
            var formData = new FormData();
            formData.append('file',e.target.files[0]); 
            formData.append('ruta',cookies.get('lblPeriodo')+'\\'+cookies.get('nombre_Departamento')+'\\'+cookies.get('nombreUsuario')+'\\Laboratorios\\'+nombreLaboratorio+'\\Documentos'); 
            formData.append('nombrearch',e.target.files[0].name); 
            fileService.upload(formData).then(data=>{
     
                if(data.status===200){                                  
                   modificarDocumento(data.message);
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
        
    }
    const modificarDocumento=(pdf)=>{
        retroalimentacion.id_gestionlaboratorio= gestionlaboratorio;           
        retroalimentacion.doclab_pdf=pdf;
        retroalimentacion.doclab_estado=3;
       
        servicioDocumentoLaboratorio.save(retroalimentacion).then(data=>{
            
            swal({
              title: "¡Atención!",
              text: "¡Se ha Modificado el Documento!",
              icon: "success",
              button: "Aceptar",
              timer: "3000"
            });
           setDocumentos(null);
           cEJefeLaboratorio.getDocumentosLaboratorios(gestionlaboratorio,idDepartamento).then(data=>setDocumentos(data));
          });
    }
    const eliminarPdf=(rowData)=>{
      
        
       retroalimentacion.id_documentolaboratorio= rowData.id_documentolaboratorio;
       retroalimentacion.id_gestionlaboratorio= rowData.id_gestionlaboratorio;
       retroalimentacion.id_formato= rowData.id_formato;
       retroalimentacion.doclab_pdf= rowData.doclab_pdf;
       retroalimentacion.doclab_estado=rowData.doclab_estado ;
       retroalimentacion.doclab_retroalimentacion= rowData.doclab_retroalimentacion;
       
        
            swal({
              title: "¿Deseas Eliminar el Documento?",
              text: "¡Los cambios no se podrán recuperar!",
              icon: "warning",
              buttons: ["Cancelar","Aceptar"],
              dangerMode: true
            }).then((OK) => {
              if(OK){
                fileService.delete(retroalimentacion.doclab_pdf).then(data=>{
               
                    if(data.status===200){
                        swal({
                          title: "¡Atención!",
                          text: data.message,
                          icon: "success",
                          button: "Aceptar",
                          timer: "3000"
                        }); 
               eliminaCampoPdf();
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
    const eliminaCampoPdf=()=>{
       retroalimentacion.doclab_pdf=null;
        retroalimentacion.doclab_estado=0;   

        servicioDocumentoLaboratorio.save(retroalimentacion).then(data=>{         
         setDocumentos(null);
         cEJefeLaboratorio.getDocumentosLaboratorios(gestionlaboratorio,idDepartamento).then(data=>setDocumentos(data));         
        });
    }
    const subirPdf = () =>{
        document.getElementById("pdfdoclab").click();
    }
    
    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_laboratorio)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Gestión de Documentos'){
                cEJefeLaboratorio.getDocumentosLaboratorios(gestionlaboratorio,idDepartamento).then(data=>setDocumentos(data));
                cEJefeLaboratorio.getNombreLabUser(idLaboratorio).then(data=>{setNombreLaboratorio(data[0].lab_nombre);})
            }
            else
                navigate('/plataforma/gestionjefelaboratorio');
        }
        
        
    }, []);

    const rowTemplate = (rowData) => {
        return documentos.indexOf(rowData) + 1;
    }

    return (
        <div>
           
            <center><h2>Documentos de {nombreLaboratorio}</h2></center>
            <div className="card">
                <Panel>
                <DataTable value={documentos} scrollable scrollHeight="400px">
                    <Column header={"#"} body={rowTemplate}></Column>
                    <Column field='frm_nombre' header={"Formato"}></Column>
                    <Column body={renderDetalles} header={"Estado"}></Column>
                    <Column body={actionBodyTemplateV} header={"Ver"}/>
                    <Column body={actionBodyTemplateM} header={"Modificar"}/>
                    <Column body={actionBodyTemplateE} header={"Eliminar"}/>
                </DataTable>
            </Panel>
            </div>
            
            
            <input type="file" id="pdfdoclab" hidden accept=".pdf" onChange={(e)=>{onPdfChange(e)}}></input>
          
         <ModalRetroalimentacion header={"COMENTARIO DOCUMENTO"}  visible={visible} modal={true} style={{width: '500px'}}  onHide={()=>setVisible(false)} comentario={retroalimentacion.doclab_retroalimentacion} estado={getEstado(retroalimentacion.doclab_estado)}/> 
        </div>
    )
}


export default DocumentosLaboratorio
