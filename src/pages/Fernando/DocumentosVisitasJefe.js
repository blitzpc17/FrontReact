import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { VisitasDocServicio } from '../../services/Fernando/VisitasDocServicio';
import { ServicioPeriodos } from '../../services/Fernando/ServicioPeriodos';
import { useNavigate, useParams } from 'react-router-dom';

import Cookies from 'universal-cookie';
const cookies = new Cookies();
const DocumentosVisitasJefe = ()=>{

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Documentos'){
                QueryDoc.search(idVisita).then(data => setValue(data)); 
                ServicioPer.getAll().then(data => setPeriodo(data)); 
            }
            else{
                navigate('/plataforma/menuvinculacion');
            }
        }
              
    }, []); 

    const navigate = new useNavigate();

    const {depRegistro, nombreA, idvis} = new useParams();

    const idPerrActual = parseInt(cookies.get('id_Periodo'));

    const idVisita = parseInt(idvis); 
  
    const lblPer = cookies.get('lblPeriodo');


    const [etiqueta,setEtiqueta] = useState("No se ha aregado el documento");
    const vinculacion = "Departamento de Gestión Tecnológica y Vinculación";
    const [periodo, setPeriodo] = useState([]);
    const ServicioPer = new ServicioPeriodos();

    const [value, setValue] = useState([]);
    const QueryDoc = new VisitasDocServicio();

   
    const [condicional, setCondicional] = useState(0);
    const [condicion,setCondicion] = useState(0);

    

    const renderTexto=(rowData)=>{ 
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
                                                setCondicional(100);
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
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-help" disabled/>
                    </center>
                </div>
            ) 
        }else{
            return(
                <div>
                    <center>
                        <a href={rowData.docvst_pdf_oficio_solicitud} target="_blank" style={{textDecorationLine : "none"}}>
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-help" />
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
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-help" disabled/>
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docvst_pdf_formato_oficio_solicitud} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-help" />
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
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-help" disabled/>
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docvst_pdf_formato_programa} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-help" />
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
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-help" disabled/>
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docvst_pdf_carta_agradecimientos} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-help" />
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
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-help" disabled/>
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docvst_pdf_formato_resultados_incidencias} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-help" />
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
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-help" disabled/>
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docvst_pdf_formato_lista_estudiantes} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-help" />
                            </a>
                        </center>
                    </div>
                )
            } 
        }
    }
    const constVisitas=(rowData)=>{
        if(condicional < 100){
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
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-help" disabled/>
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docvst_pdf_oficio_constancia} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-help" />
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

    return(
        <div>
            <Panel>
                <table border="0" >                    
                    <tbody>
                        <tr>                            
                            <td style={{paddingRight: '30rem'}}></td>
                            <td style={{paddingRight: '5rem'}}>
                                <div className="textoA">{"Documentos de "+nombreA}</div>                
                                <div className="textoA"><h6>{lblPer}</h6></div>
                            </td>                                                        
                        </tr>
                    </tbody>        
                </table>
                <Accordion multiple activeIndex={[0,1]}>
                    <AccordionTab header={"Documentos "+vinculacion}>
                        <DataTable value={value} responsiveLayout="scroll" showGridlines>
                            <Column field="id_documentos" header="Documento" body={renderTexto}></Column>
                            <Column field="docvst_pdf_oficio_solicitud" header="Oficio de solicitud" body={oficioSoli}></Column>
                            <Column field="docvst_pdf_formato_oficio_solicitud" header="Formato para oficio de solicitud" body={formOfSoli}></Column>
                            <Column field="docvst_pdf_formato_programa" header="Formato para programa" body={formPrograma}></Column>
                            <Column field="docvst_pdf_carta_agradecimientos;" header="Carta de presentación y agradecimiento" body={cartAgrad}></Column>
                            <Column field="docvst_pdf_carta_agradecimientos;" header="Formato de resultados e incidentes " body={Fincidentes}></Column>
                            <Column field="docvst_pdf_carta_agradecimientos;" header="Formato de lista de estudiantes" body={FLista}></Column>
                            <Column field="docvst_pdf_oficio_constancia" header="Oficio de constancia de visitas realizadas" body={constVisitas}></Column>
                        </DataTable>
                    </AccordionTab>
                    
                    <AccordionTab header={"Documentos " + depRegistro}>
                        <DataTable value={value} responsiveLayout="scroll" showGridlines>
                            <Column field="docvst_pdf_formato_solicitud" header="Formato de solicitud a visitas concentrado" body={visConcentrado}></Column>
                            <Column field="docvst_pdf_resultados_incidencias" header="Formato de resultados e incidencias en visita " body={resultadosIncidencias}></Column>
                            <Column field="docvst_pdf_lista_estudiantes" header="Lista de estudiantes que asistiran" body={listEstudiantes}></Column>                            
                            <Column field="docvst_pdf_evidencias" header="Evidencias " body={evidencias}></Column>
                        </DataTable>                        
                    </AccordionTab>
                </Accordion>
            </Panel> 
        </div>
    )
}

export default DocumentosVisitasJefe;