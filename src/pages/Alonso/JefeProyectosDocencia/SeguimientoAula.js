import React, {  useState, useEffect } from 'react';
import TablaVerModificarEliminar from '../../../components/Alonso/TablaVerModificarEliminar';
import { CEProyectosDocencia } from '../../../services/ConsultasEspecificas/Alonso/CEProyectosDocencia';
import { Button } from 'primereact/button';
import swal from 'sweetalert';
import { ServicioSeguimientoAula } from '../../../services/Alonso/ServicioSeguimientoAula';
import Cookies from 'universal-cookie';
import FileService from '../../../services/FileService';
import { useNavigate, useParams } from 'react-router-dom';

const cookies=new Cookies();

const SeguimientoAula = () => {
  const navigate = new useNavigate();
    const cEProyectosDocencia=new CEProyectosDocencia();
    const seguimientoAula=new ServicioSeguimientoAula();
    const fileService=new FileService();
    const [seguimientos, setSeguimientos] = useState(null);
    const [selectedSeguimiento, setSelectedSeguimiento] = useState(null);
    const [nombreDocente, setNombreDocente] = useState("");
    // Parametros para las consultas   
    const {iddocper} = new useParams();
    const docper = iddocper;
     const iddepartamento=parseInt(cookies.get('id_Departamento'));
    const [seguimiento, setSeguimiento] = useState({
      id_seguimiento: null,
      id_docper: null,
      id_formato: null,
      docgrp_pdf_documento:null
    });
    const camposSeguimientos=[
        { field:'id_formato',header:'#'   },
        { field: 'nombreseguimiento', header: 'Nombre Seguimiento' }
        
      ];

     
      const eliminarPdf=(data)=>{
       
          swal({
            title: "¿Deseas Eliminar el Documento?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
          }).then((OK) => {
            if(OK){
              seguimiento.id_seguimiento=data.id_seguimiento;
              seguimiento.id_docper=docper;
              seguimiento.id_formato=data.id_formato;                        
              
              fileService.delete(data.docgrp_pdf_documento).then(data=>{
               
                if(data.status===200){
                    swal({
                      title: "¡Atención!",
                      text: data.message,
                      icon: "success",
                      button: "Aceptar",
                      timer: "3000"
                    });
                    seguimiento.docgrp_pdf_documento=null;
                    seguimientoAula.save(seguimiento).then(data=>{
                       
                       setSeguimientos(null);
                        cEProyectosDocencia.getSeguimientosAula(docper,iddepartamento).then(data=>setSeguimientos(data))
                       
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
      const modificarDocumento=(archivo)=>{                                          
                  
            seguimiento.id_docper=docper;       
             seguimiento.docgrp_pdf_documento=archivo;               
                
                seguimientoAula.save(seguimiento).then(data=>{
                  swal({
                    title: "¡Atención!",
                    text: "¡Se ha Cambiado el Archivo!",
                    icon: "success",
                    button: "Aceptar",
                    timer: "3000"
                  });                     
                      setSeguimientos(null);
                      cEProyectosDocencia.getSeguimientosAula(docper,iddepartamento).then(data=>setSeguimientos(data))                             
                });
        
              
        }
       const  abrirExplorador=()=>{
          document.getElementById("pdfseguimientos").click();
        
         }
        const onPdfChange=(e)=>{
         
          if(e.target.files.length !== 0){ 
            var formData = new FormData();
            formData.append('file',e.target.files[0]); 
            formData.append('ruta',cookies.get('lblPeriodo')+'\\'+cookies.get('nombre_Departamento')+'\\'+nombreDocente+'\\Seguimiento al Aula'); 
            formData.append('nombrearch',e.target.files[0].name); 
            fileService.upload(formData).then(data=>{
              
                if(data.status===200){                
                   // pdfSeleccionado= data.message;
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
      const actionBodyTemplateV=(rowData) =>{
        return (      
            <>             
            {(rowData.docgrp_pdf_documento!=null)?<a href={rowData.docgrp_pdf_documento} target={'_blank'}  rel="noreferrer" style={{textDecorationLine : "none"}}> <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  /> </a>: <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  disabled/> }
            </>
        )}
        const actionBodyTemplateM=(rowData) =>{
          return (        
              <> 
               {(rowData.docgrp_pdf_documento!=null)?<Button icon="pi pi-sync"   className="p-button-rounded p-button-success p-mr-2" onClick={()=>{abrirExplorador();setSeguimiento(rowData)}} />:<Button icon="pi pi-cloud-upload"   className="p-button-rounded p-button-success p-mr-2" onClick={()=>{abrirExplorador();setSeguimiento(rowData)}}/>            }
                </>
          )}
         const actionBodyTemplateE=(rowData) =>{
            return (      
                <> 
                
                {(rowData.docgrp_pdf_documento!=null)? <Button  icon="pi pi-trash" className="p-button-rounded p-button-danger"  onClick={(e)=>{eliminarPdf(rowData)}} /> :<Button  icon="pi pi-trash" className="p-button-rounded p-button-danger"  disabled /> }
                  
                </>
            )}
            //Quitar los [] para renderizar la tabla
      useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_proyectos_docencia)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Seguimiento al Aula'){
              cEProyectosDocencia.getSeguimientosAula(docper,iddepartamento).then(data=>setSeguimientos(data))
              cEProyectosDocencia.getCNombreDocente(docper).then(data=>{setNombreDocente(data[0].docente)})
            }
            else
                navigate('/plataforma/periodosjefedocencia');
        }
          
        },[])

      
    return (
        <div>
          
           <input type="file" id="pdfseguimientos" hidden accept=".pdf" onChange={onPdfChange}></input>
            <TablaVerModificarEliminar titulo={"Seguimiento al Aula de "+ nombreDocente}  value={seguimientos} selectionMode="single" selection={selectedSeguimiento} scrollable scrollHeight="400px" onSelectionChange={e => setSelectedSeguimiento(e.value)}  value2={camposSeguimientos}  bodyV={actionBodyTemplateV} bodyM={actionBodyTemplateM} bodyE={actionBodyTemplateE}  /> 
        </div>
    )
}

export default SeguimientoAula
