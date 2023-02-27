import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import swal from 'sweetalert';
import { ServicioPeriodos } from '../../services/Fernando/ServicioPeriodos';
import Cookies from 'universal-cookie';
import { VisitasDocServicio } from '../../services/Fernando/VisitasDocServicio';
import { DocumentosVisitasServicio } from '../../services/Fernando/DocumentosVisitasServicio';
import FileService from '../../services/FileService';
import { useNavigate, useParams } from 'react-router-dom';

const cookies = new Cookies();
const DocumentosVisitas = () => {
    const navigate = new useNavigate();

    const {depRegistro, nombreA, idvis} = new useParams();

   

    const idPerrActual = parseInt(cookies.get('id_Periodo'));

    const idVisita = parseInt(idvis); //Id de la visita del registro
    
    const etiqueta = "No se ha aregado el documento";
    const vinculacion = "Departamento de Gestión Tecnológica y Vinculación";
    const [condicion,setCondicion] = useState(0);

    const [visitas,setVisitas] = useState({
        id_Documentos_Visita:null,
        id_Visita:idVisita,
        docvst_pdf_oficio_solicitud:null, 
        docvst_pdf_formato_solicitud:null, 
        docvst_pdf_formato_oficio_solicitud:null, 
        docvst_pdf_formato_programa:null, 
        docvst_pdf_carta_agradecimientos:null, 
        docvst_pdf_resultados_incidencias:null, 
        docvst_pdf_lista_estudiantes:null, 
        docvst_pdf_evidencias:null, 
        docvst_pdf_oficio_constancia:null,
        docvst_pdf_formato_resultados_incidencias:null,
	    docvst_pdf_formato_lista_estudiantes:null
    });

    const [value, setValue] = useState([]);
    const QueryDoc = new VisitasDocServicio();

    const [periodo, setPeriodo] = useState([]);
    const ServicioPer = new ServicioPeriodos();

    //Servicio para guardar documentos
    const [DocGuardar, setDocGuardar] = useState([]);
    const SerDoc = new FileService();

    const [v, setV] = useState([]);
    const CreaDocs = new DocumentosVisitasServicio();

    useEffect(() => {

        QueryDoc.search(idVisita).then(data => setValue(data));
        ServicioPer.getAll().then(data => setPeriodo(data));

        if(!cookies.get('rolesUsuario').rol_secretaria_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Documentos'){
                QueryDoc.search(idVisita).then(data => setValue(data));
                ServicioPer.getAll().then(data => setPeriodo(data));
            }
            else{
                navigate('/plataforma/departamentosvisitas');
            }
        }
        
    }, []); 

    //Variable periodo
    var readonly = false;
    
    
    const onPdfChange=(e)=>{        
        let visitasTemp;
        var opciones = switchNombreDoc();
        if(e.target.files.length != 0){
            
        var formData = new FormData();
        formData.append('file',e.target.files[0]); 
        formData.append('ruta',cookies.get('lblPeriodo')+'\\'+depRegistro+'\\Visitas\\'+nombreA); 
        formData.append('nombrearch',opciones.nombreArchivo);                           
         SerDoc.upload(formData).then(data => {
             if(data.status === 200){ 
                    visitasTemp = {
                        ...visitas,
                        [opciones.codeCampo] : data.message
                    };
                       
                guardarDoc(visitasTemp);
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
         });
            
        } 
      }

      const switchNombreDoc=()=>{
        let objReturn = {};
        switch(condicion){
            case 1:{    
                objReturn = {nombreArchivo : "Oficio Solicitud Visitas.pdf", codeCampo : "docvst_pdf_oficio_solicitud"};                           
                setCondicion(0);
                return objReturn;
            }
            case 2:{
                objReturn = {nombreArchivo : "Formato Solicitud Visitas.pdf", codeCampo : "docvst_pdf_formato_oficio_solicitud"};                           
                setCondicion(0);
                return objReturn;
            }
            case 3:{
                objReturn = {nombreArchivo : "Formato Programa Visitas.pdf", codeCampo : "docvst_pdf_formato_programa"};                           
                setCondicion(0);
                return objReturn;
            }
            case 4:{
                objReturn = {nombreArchivo : "Carta Agradecimientos Visitas.pdf", codeCampo : "docvst_pdf_carta_agradecimientos"};                           
                setCondicion(0);
                return objReturn;
            }
            case 5:{//docvst_pdf_oficio_constancia
                objReturn = {nombreArchivo : "Oficio Contancias Visitas.pdf", codeCampo : "docvst_pdf_oficio_constancia"};                           
                setCondicion(0);
                return objReturn;
            }
            case 6:{//docvst_pdf_oficio_constancia
                objReturn = {nombreArchivo : "Formato de resultados e incidentes.pdf", codeCampo : "docvst_pdf_formato_resultados_incidencias"};                           
                setCondicion(0);
                return objReturn;
            }
            case 7:{//docvst_pdf_oficio_constancia
                objReturn = {nombreArchivo : "Formato Lista de estudiantes.pdf", codeCampo : "docvst_pdf_formato_lista_estudiantes"};                           
                setCondicion(0);
                return objReturn;
            }
            default:{
               
                break;
            }
        }   
      }
    const guardarDoc= async(data)=>{
       await CreaDocs.save(data).then(data=>{
           QueryDoc.search(idVisita).then(data => setValue(data));   
           
           swal({
            title: "¡Atención!",
            text: "¡Documento Agregado con Exito!",
            icon: "success",
            button: "Aceptar",
            timer: "3000"
          });
       })
       
    }
    
    const regresames =() =>{    
        let per="";                
        
        for (var i = 0; i < periodo.length; i++) {             
            per="";  
            if(periodo[i].id_Periodo = idPerrActual){
                switch(periodo[i].per_Mes_Inicio){
                    case 1:{
                        per+="Enero";
                        break;
                    }
                    case 2:{
                        per+="Febrero";
                        break;
                    }
                    case 3:{
                        per+="Marzo";
                        break;
                    }
                    case 4:{
                        per+="Abril";
                        break;
                    }
                    case 5:{
                        per+="Mayo";
                        break;
                    }
                    case 6:{
                        per+="Junio";
                        break;
                    }
                    case 7:{
                        per+="Julio";
                        break;
                    }
                    case 8:{
                        per+="Agosto";
                        break;
                    }
                    case 9:{
                        per+="Septiembre";
                        break;
                    }
                    case 10:{
                        per+="Octubre";
                        break;
                    }
                    case 11:{
                        per+="Noviembre";
                        break;
                    }
                    case 12:{
                        per+="Diciembre";
                        break;
                    }
                    default:{
                        per+="Error";
                        break;
                    }
                }
                switch(periodo[i].per_Mes_Fin){
                    case 1:{
                        per+="-Enero";
                        break;
                    }
                    case 2:{
                        per+="-Febrero";
                        break;
                    }
                    case 3:{
                        per+="-Marzo";
                        break;
                    }
                    case 4:{
                        per+="-Abril";
                        break;
                    }
                    case 5:{
                        per+="-Mayo";
                        break;
                    }
                    case 6:{
                        per+="-Junio";
                        break;
                    }
                    case 7:{
                        per+="-Julio";
                        break;
                    }
                    case 8:{
                        per+="-Agosto";
                        break;
                    }
                    case 9:{
                        per+="-Septiembre";
                        break;
                    }
                    case 10:{
                        per+="-Octubre";
                        break;
                    }
                    case 11:{
                        per+="-Noviembre";
                        break;
                    }
                    case 12:{
                        per+="-Diciembre";
                        break;
                    }
                    default:{
                        per+="-Error";
                        break;
                    }
                }    
                per+=" "+periodo[i].per_Year;

            }  
        } 
        return per;        
                
    }

    
    
    const renderTexto=(rowData)=>{ 
        visitas.id_Documentos_Visita = rowData.id_documentos;
        visitas.docvst_pdf_oficio_solicitud = rowData.docvst_pdf_oficio_solicitud;        
        visitas.docvst_pdf_formato_oficio_solicitud = rowData.docvst_pdf_formato_oficio_solicitud;
        visitas.docvst_pdf_formato_programa = rowData.docvst_pdf_formato_programa;
        visitas.docvst_pdf_carta_agradecimientos = rowData.docvst_pdf_carta_agradecimientos;
        visitas.docvst_pdf_oficio_constancia = rowData.docvst_pdf_oficio_constancia;
        visitas.docvst_pdf_formato_resultados_incidencias = rowData.docvst_pdf_formato_resultados_incidencias;
        visitas.docvst_pdf_formato_lista_estudiantes = rowData.docvst_pdf_formato_lista_estudiantes;
        //ACADEMICO
        visitas.docvst_pdf_formato_solicitud = rowData.docvst_pdf_formato_solicitud;
        visitas.docvst_pdf_resultados_incidencias = rowData.docvst_pdf_resultados_incidencias;
        visitas.docvst_pdf_lista_estudiantes = rowData.docvst_pdf_lista_estudiantes;
        visitas.docvst_pdf_evidencias = rowData.docvst_pdf_evidencias;

       
        return(
            <div>
                <h5>Editar</h5>
                <h5>Ver</h5>
            </div>            
        )
    }

    const oficioSoli=(rowData)=>{
        if(rowData.docvst_pdf_oficio_solicitud == null){
            return(
                <div>
                    <center>
                        <h5>{etiqueta}</h5>                
                        <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={readonly}
                            onClick={()=> { setCondicion(1);  document.getElementById("inputFile").click();                                                 
                        }}
                        />

                    </center>
                </div>
            ) 
        }else{
            return(
                <div>
                    <center>
                        <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" disabled={readonly}
                            onClick={()=> {setCondicion(1); document.getElementById("inputFile").click();}}
                        />
                        <br></br>
                        <br></br>
                        <a href={rowData.docvst_pdf_oficio_solicitud} target="_blank" style={{textDecorationLine : "none"}}>
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                        </a>
                    </center>
                </div>
            )
        }        
    }

    const formOfSoli=(rowData)=>{
        if(rowData.docvst_pdf_formato_solicitud == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_formato_oficio_solicitud == null){
                return(
                    <div>
                        <center>
                            <h5>{etiqueta}</h5>                
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={readonly}
                                onClick={()=> { setCondicion(2);  document.getElementById("inputFile").click();                                                 
                            }}
                            />
    
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" disabled={readonly}
                                onClick={()=> {setCondicion(2); document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docvst_pdf_formato_oficio_solicitud} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            } 
        }
    }

    const formPrograma=(rowData)=>{
        if(rowData.docvst_pdf_formato_solicitud == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_formato_programa == null){
                return(
                    <div>
                        <center>
                            <h5>{etiqueta}</h5>                
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={readonly}
                                onClick={()=> { setCondicion(3);  document.getElementById("inputFile").click();                                                 
                            }}
                            />
    
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" disabled={readonly}
                                onClick={()=> {setCondicion(3); document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docvst_pdf_formato_programa} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            } 
        }
    }

    const cartAgrad =(rowData)=>{
        if(rowData.docvst_pdf_formato_solicitud == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_carta_agradecimientos == null){
                return(
                    <div>
                        <center>
                            <h5>{etiqueta}</h5>                
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={readonly}
                                onClick={()=> { setCondicion(4);  document.getElementById("inputFile").click();                                                 
                            }}
                            />
    
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" disabled={readonly}
                                onClick={()=> {setCondicion(4); document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docvst_pdf_carta_agradecimientos} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            } 
        }
    }

    const Fincidentes =(rowData)=>{
        if(rowData.docvst_pdf_formato_solicitud == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_formato_resultados_incidencias == null){
                return(
                    <div>
                        <center>
                            <h5>{etiqueta}</h5>                
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={readonly}
                                onClick={()=> { setCondicion(6);  document.getElementById("inputFile").click();                                                 
                            }}
                            />
    
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" disabled={readonly}
                                onClick={()=> {setCondicion(6); document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docvst_pdf_formato_resultados_incidencias} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            } 
        }
    }

    const FLista =(rowData)=>{
        if(rowData.docvst_pdf_formato_solicitud == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_formato_lista_estudiantes == null){
                return(
                    <div>
                        <center>
                            <h5>{etiqueta}</h5>                
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={readonly}
                                onClick={()=> { setCondicion(7);  document.getElementById("inputFile").click();                                                 
                            }}
                            />
    
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" disabled={readonly}
                                onClick={()=> {setCondicion(7); document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docvst_pdf_formato_lista_estudiantes} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            } 
        }
    }

    const constVisitas=(rowData)=>{
        let ban = false;
        if(rowData.docvst_pdf_oficio_solicitud != null){
            if(rowData.docvst_pdf_formato_oficio_solicitud != null){
                if(rowData.docvst_pdf_formato_programa != null){
                    if(rowData.docvst_pdf_carta_agradecimientos != null){
                        if(rowData.docvst_pdf_formato_solicitud != null){
                            if(rowData.docvst_pdf_resultados_incidencias != null){
                                if(rowData.docvst_pdf_lista_estudiantes != null){
                                    if(rowData.docvst_pdf_evidencias != null){
                                        if(rowData.docvst_pdf_formato_resultados_incidencias != null){
                                            if(rowData.docvst_pdf_formato_lista_estudiantes != null){
                                                
                                                ban = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if(!ban){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docvst_pdf_oficio_constancia == null){
                return(
                    <div>
                        <center>
                            <h5>{etiqueta}</h5>                
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={readonly}
                                onClick={()=> { setCondicion(5);  document.getElementById("inputFile").click();                                                 
                            }}
                            />
    
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" disabled={readonly}
                                onClick={()=> {setCondicion(5); document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docvst_pdf_oficio_constancia} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            } 
        }
    }


    //ACADEMICO
    const visConcentrado=(rowData)=>{
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
                            <h5>{etiqueta}</h5>                
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled/>
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docvst_pdf_formato_solicitud} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            } 
        }
    }

    const resultadosIncidencias=(rowData)=>{
        if(rowData.docvst_pdf_formato_solicitud == null){
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
                            <h5>{etiqueta}</h5>                
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled />    
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docvst_pdf_resultados_incidencias} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            } 
        }
    }

    const listEstudiantes =(rowData)=>{
        if(rowData.docvst_pdf_formato_solicitud == null){
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
                            <h5>{etiqueta}</h5>                
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled />    
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
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
        if(rowData.docvst_pdf_formato_solicitud == null){
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
                            <h5>{etiqueta}</h5>                
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled />    
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
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
        <div>
            <Panel>
                <table border="0" >                    
                    <tbody>
                        <tr>                            
                            <td style={{paddingRight: '30rem'}}></td>
                            <td style={{paddingRight: '5rem'}}>
                                <div className="textoA">{"Documentos de "+nombreA}</div>                
                                <div className="textoA"><h6>{regresames()}</h6></div>
                            </td>                                                        
                        </tr>
                    </tbody>        
                </table>
                <Accordion multiple activeIndex={[0,1]}>
                    <AccordionTab header={"Documentos "+vinculacion}>
                        <DataTable value={value} responsiveLayout="scroll" showGridlines>
                            <Column field="id_documentos" header="Documento" body={renderTexto}></Column>
                            <Column field="docvst_pdf_oficio_solicitud" header="Memorándum" body={oficioSoli}></Column>
                            <Column field="docvst_pdf_formato_oficio_solicitud" header="Oficio de solicitud de visitas a empresas " body={formOfSoli}></Column>
                            <Column field="docvst_pdf_formato_programa" header="Programa de Visitas a empresas " body={formPrograma}></Column>
                            <Column field="docvst_pdf_carta_agradecimientos;" header="Carta de presentación y agradecimiento" body={cartAgrad}></Column>
                            <Column field="docvst_pdf_carta_agradecimientos;" header="Formato de resultados e incidentes " body={Fincidentes}></Column>
                            <Column field="docvst_pdf_carta_agradecimientos;" header="Formato de lista de estudiantes" body={FLista}></Column>
                            <Column field="docvst_pdf_oficio_constancia" header="Oficio de constancia de visitas realizadas" body={constVisitas}></Column>
                        </DataTable>
                    </AccordionTab>
                    
                    <AccordionTab header={"Documentos " + depRegistro}>
                        <DataTable value={value} responsiveLayout="scroll" showGridlines>
                            <Column field="docvst_pdf_formato_solicitud" header="Formato de solicitud a visitas concentrado" body={visConcentrado}></Column>
                            <Column field="docvst_pdf_resultados_incidencias" header="Reporte de resultados e incidentes" body={resultadosIncidencias}></Column>
                            <Column field="docvst_pdf_lista_estudiantes" header="Lista autorizada de estudiantes que asistirá a la visita " body={listEstudiantes}></Column>                            
                            <Column field="docvst_pdf_evidencias" header="Evidencias " body={evidencias}></Column>
                        </DataTable>                        
                    </AccordionTab>
                </Accordion>
            </Panel>   
            <input type="file" id="inputFile" hidden accept=".pdf" onChange={(e)=> onPdfChange(e)}/>                                
        </div>
    )
}

export default DocumentosVisitas
