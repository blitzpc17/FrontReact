import React, { useState, useEffect , useContext} from 'react';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import swal from 'sweetalert';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ServicioDocumentosVisitas } from '../../services/Josean/ServicioDocumentosVisitas';
import { ServicioConsultaDocVisitas } from '../../services/Josean/ServicioConsultaDocVisitas';

import  FileService  from '../../services/FileService';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const DocumentosVisitasJA = () => {   
    const navigate = new useNavigate(); 

    const vinculacion = "Departamento de Gestión Tecnológica y Vinculación";
    const depRegistro = cookies.get("nombre_Departamento");

    
    const { readonly } = useContext(BreadCrumbContext);
	
   
    const {nombreA, idvis} = new useParams();
    var servicioRegistro = parseInt(idvis);


    var servicioDocVisitas = new ServicioDocumentosVisitas();
    var servicioconsDocVisitas = new ServicioConsultaDocVisitas();

    var SerDoc = new FileService();

    const [docQuery, setDocQuery] = useState([]);
    const [rowd, setRowd] = useState(null);
    

    useEffect(() => {    
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Documentos'){
                servicioconsDocVisitas.search(servicioRegistro).then(data => {setDocQuery(data) ; });
            }
            else
                navigate('/plataforma/menudepartamental');
        }
        
      
    }, []); 
	


    const guardarDoc= async(data)=>{
    

        await servicioDocVisitas.save(data).then(data => {
            setDocQuery(null);

            swal({
                title: "¡Atención!",
                text: "¡Documento Agregado con Exito!",
                icon: "success",
                button: "Aceptar",
                timer: "3000"
              });

              
              servicioconsDocVisitas.search(servicioRegistro).then(data => setDocQuery(data));            
          });
          
    }

    const [condicion,setCondicion] = useState(0);


    const onPdfChange=(e)=>{        
        let socialTemp;
        var opciones = switchNombreDoc();
        if(e.target.files.length !== 0){
            
        var formData = new FormData();
        formData.append('file',e.target.files[0]); 

        formData.append('ruta',cookies.get('lblPeriodo') +'\\DOCUMENTOS VISITAS\\'+ cookies.get('nombre_Departamento') +'\\'+nombreA+'\\Social'); 
        formData.append('nombrearch',opciones.nombreArchivo);    

         SerDoc.upload(formData).then(data => {

             if(data.status === 200){ 

                socialTemp = {
                    ...rowd,
                    [opciones.codeCampo] : data.message
                };
           
                guardarDoc(socialTemp);   
                             
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
         }).catch(error=>swal({

            title: "¡Atención!",
            
            text: 'El Achivo Rebasa el Limite de Tamaño Permitido',
            
            icon: "error",
            
            button: "Aceptar",
            
            timer: "3000"
            
            }));
            
        }        
      }

      
      const switchNombreDoc=()=>{
        let objReturn = {};
        switch(condicion){
            case 1:{    
                objReturn = {nombreArchivo : "Formato de Solicitud a Visitas Concretado.pdf", codeCampo : "docvst_pdf_formato_solicitud"};                           
                setCondicion(0);
                return objReturn;
            }
            case 2:{
                objReturn = {nombreArchivo : "Reporte de Resultados e Incidentes.pdf", codeCampo : "docvst_pdf_resultados_incidencias"};                           
                setCondicion(0);
                return objReturn;
            }
            case 3:{
                objReturn = {nombreArchivo : "Lista Autorizada de Estudiantes que asistirá a la Visita.pdf", codeCampo : "docvst_pdf_lista_estudiantes"};                           
                setCondicion(0);
                return objReturn;
            }
            case 4:{
                objReturn = {nombreArchivo : "Evidencias.pdf", codeCampo : "docvst_pdf_evidencias"};                           
                setCondicion(0);
                return objReturn;
            }
            default:{
               
                break;
            }
        }   
      }


    const oficioSolicitud =(rowData)=>{

        if(rowData.docvst_pdf_oficio_solicitud == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            return(
                <div>
                    <center>
                    <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"
                            onClick={()=> { window.open(rowData.docvst_pdf_oficio_solicitud)}}
                        />
                    </center>
                </div>                
            )
        }
    }

   
    const formatoOfiSoli =(rowData)=>{

        if(rowData.docvst_pdf_formato_solicitud == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_formato_oficio_solicitud != null){
                return(
                    <div>
                        <center>
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"
                                onClick={()=> { window.open(rowData.docvst_pdf_formato_oficio_solicitud)}}
                            />
                        </center>
                    </div>                
                )
            }
            else{
                return(
                    <div>
                        <center>
                            <h5>Sin Subir</h5>
                        </center>
                    </div>
                ) 
            }
            
        }
    }

    const formatoPrograma =(rowData)=>{

        if(rowData.docvst_pdf_formato_solicitud == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_formato_programa != null){
                return(
                    <div>
                        <center>
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"
                                onClick={()=> { window.open(rowData.docvst_pdf_formato_programa)}}
                            />
                        </center>
                    </div>                
                )
            }
            else{
                return(
                    <div>
                        <center>
                            <h5>Sin subir</h5>
                        </center>
                    </div>
                ) 
            }
            
        }
    }

    const formatoCarta =(rowData)=>{

        if(rowData.docvst_pdf_formato_solicitud == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_carta_agradecimientos != null){
                return(
                    <div>
                        <center>
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"
                                onClick={()=> { window.open(rowData.docvst_pdf_carta_agradecimientos)}}
                            />
                        </center>
                    </div>                
                )
            }
            else{
                return(
                    <div>
                        <center>
                            <h5>Sin Subir</h5>
                        </center>
                    </div>
                ) 
            }
           
        }
    }

    const formatoReporte =(rowData)=>{
        if(rowData.docvst_pdf_formato_solicitud == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_formato_resultados_incidencias != null){
                return(
                    <div>
                        <center>
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"
                                onClick={()=> { window.open(rowData.docvst_pdf_formato_resultados_incidencias)}}
                            />
                        </center>
                    </div>                
                )
            }
            else{
                return(
                    <div>
                        <center>
                            <h5>Sin Subir</h5>
                        </center>
                    </div>
                ) 
            }
           
        }
    }

    const formatoLista =(rowData)=>{
        if(rowData.docvst_pdf_formato_solicitud == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_formato_lista_estudiantes != null){
                return(
                    <div>
                        <center>
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"
                                onClick={()=> { window.open(rowData.docvst_pdf_formato_lista_estudiantes)}}
                            />
                        </center>
                    </div>                
                )
            }
            else{
                return(
                    <div>
                        <center>
                            <h5>Sin Subir</h5>
                        </center>
                    </div>
                ) 
            }
           
        }
   
    }


    const oficioConstancias =(rowData)=>{

        if(rowData.docvst_pdf_evidencias == null ||
            rowData.docvst_pdf_resultados_incidencias == null ||
            rowData.docvst_pdf_lista_estudiantes == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_oficio_constancia != null){
                return(
                    <div>
                        <center>
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"
                                onClick={()=> { window.open(rowData.docvst_pdf_oficio_constancia)}}
                            />
                        </center>
                    </div>                
                )
            }
            else{
                return(
                    <div>
                        <center>
                            <h5>Sin subir</h5>
                        </center>
                    </div>
                )  
            }
           
        }
    }

    const formatoSoli=(rowData)=>{
        if(rowData.docvst_pdf_oficio_solicitud == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_formato_solicitud == null){
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={false}
                                onClick={()=> {setCondicion(1) ; setRowd(rowData) ; console.log(rowData) ; document.getElementById("inputFile").click()}}
                            />
                            <br></br>
                            <br></br>
                                <h5>Sin subir</h5>
                        </center>
                    </div>
                )
            }
            else{
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" disabled={false}
                                onClick={()=> {setCondicion(1); setRowd(rowData); document.getElementById("inputFile").click()}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docvst_pdf_formato_solicitud} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            }
        }
    }

    const formatoRes=(rowData)=>{
        if(rowData.docvst_pdf_formato_oficio_solicitud == null ||
            rowData.docvst_pdf_formato_programa == null || 
            rowData.docvst_pdf_carta_agradecimientos == null ||
            rowData.docvst_pdf_formato_resultados_incidencias == null ||
            rowData.docvst_pdf_formato_lista_estudiantes == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_resultados_incidencias == null){
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={false}
                                onClick={()=> {setCondicion(2);  setRowd(rowData) ; document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                             <h5>Sin subir</h5>
                        </center>
                    </div>
                )
            }
            else{
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" disabled={false}
                                onClick={()=> {setCondicion(2); setRowd(rowData) ; document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docvst_pdf_resultados_incidencias} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            }
        }
    }

    const listAutorizada=(rowData)=>{
        if(rowData.docvst_pdf_formato_oficio_solicitud == null ||
            rowData.docvst_pdf_formato_programa == null || 
            rowData.docvst_pdf_carta_agradecimientos == null ||
            rowData.docvst_pdf_formato_resultados_incidencias == null ||
            rowData.docvst_pdf_formato_lista_estudiantes == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_lista_estudiantes == null){
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={false}
                                onClick={()=> {setCondicion(3); setRowd(rowData) ; document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                                   <h5>Sin subir</h5>
                        </center>
                    </div>
                )
            }
            else{
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" disabled={false}
                                onClick={()=> {setCondicion(3); setRowd(rowData) ; document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docvst_pdf_lista_estudiantes} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            }
        }
        
    }

    const evidencias=(rowData)=>{
        if(rowData.docvst_pdf_formato_oficio_solicitud == null ||
            rowData.docvst_pdf_formato_programa == null || 
            rowData.docvst_pdf_carta_agradecimientos == null ||
            rowData.docvst_pdf_formato_resultados_incidencias == null ||
            rowData.docvst_pdf_formato_lista_estudiantes == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_evidencias == null){
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={false}
                                onClick={()=> {setCondicion(4); setRowd(rowData) ; document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                                     <h5>Sin subir</h5>
                        </center>
                    </div>
                )
            }
            else{
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" disabled={false}
                                onClick={()=> {setCondicion(4); setRowd(rowData) ; document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docvst_pdf_evidencias} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            }
        }
    }



    return (
        <div className="card">
            <Panel>
                <h3>{"Documentos de "+nombreA}</h3>

                <Accordion multiple activeIndex={[0,1]}>
                    <AccordionTab header={"Documentos "+vinculacion}>
                        <DataTable value={docQuery} responsiveLayout="scroll" showGridlines>
                            <Column field="docvst_pdf_oficio_solicitud" header="Memorándum" body={oficioSolicitud}></Column>
                            <Column field="docvst_pdf_formato_oficio_solicitud" header="Oficio de solicitud de visitas a empresas" body={formatoOfiSoli}></Column>
                            <Column field="docvst_pdf_formato_programa" header="Programa de Visitas a empresas" body={formatoPrograma}></Column>
                            <Column field="docvst_pdf_carta_agradecimientos" header="Carta de presentación y agradecimiento" body={formatoCarta}></Column>
                            <Column field="docvst_pdf_formato_resultados_incidencias" header="Formato reporte de resultados e incidencias" body={formatoReporte}></Column>
                            <Column field="docvst_pdf_formato_lista_estudiantes" header="Formato lista autorizada de estudiantes que asistirá a la visita" body={formatoLista}></Column>
                            <Column field="docvst_pdf_oficio_constancia" header="Oficio de constancia de visitas realizadas" body={oficioConstancias}></Column>
                        </DataTable>
                    </AccordionTab>
                    <AccordionTab header={"Documentos " + depRegistro}>
                        <DataTable value={docQuery} responsiveLayout="scroll" showGridlines>
                            <Column field="docvst_pdf_formato_solicitud" header="Formato de solicitud a visitas concentrado" body={formatoSoli}></Column>                            
                            <Column field="docvst_pdf_resultados_incidencias" header="Reporte de resultados e incidentes" body={formatoRes}></Column>
                            <Column field="docvst_pdf_lista_estudiantes" header="Lista autorizada de estudiantes que asistirá a la visita" body={listAutorizada}></Column>                            
                            <Column field="docvst_pdf_evidencias" header="Evidencias" body={evidencias}></Column>   
                        </DataTable>
                    </AccordionTab>
                </Accordion>
            </Panel>
            <input type="file" id="inputFile" hidden accept=".pdf" onChange={onPdfChange}/>            
        </div>
    )
}

export default DocumentosVisitasJA;
