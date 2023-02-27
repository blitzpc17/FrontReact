import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { QueryDocumentos } from '../../services/Fernando/ServicioDocumentosQuery';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';

const cookies = new Cookies();

const DocumentosSocialJefe = () => {
    const navigate = new useNavigate();

    const {depRegistro, nombreA, idserv} = new useParams();

    const servicioRegistro = parseInt(idserv);

    const [docQuery, setDocQuery] = useState([]);
    const DocsQuery = new QueryDocumentos();

    useEffect(() => {   
        if(!cookies.get('rolesUsuario').rol_jefe_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Documentos Alumno'){
                DocsQuery.search(servicioRegistro).then(data => setDocQuery(data));
            }
            else{
                navigate('/plataforma/menuvinculacion');
            }
        }  
                
    }, []); 


    const [etiqueta,setEtiqueta] = useState("No se ha aregado el documento");
    const vinculacion = "Departamento de Gestión Tecnológica y Vinculación";
    const [validacion,setValidacion] = useState(0);

    const renderTexto=(rowData)=>{      
        
        return(
            <div>
                <h4>Ver</h4>
            </div>
        )
    }

    const extraescolar =(rowData)=>{
        if(rowData.docsev_pdf_Const_extraescolar == null){
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
                        <a href={rowData.docsev_pdf_Const_extraescolar} target="_blank" style={{textDecorationLine : "none"}}>
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-help" />
                        </a>
                    </center>
                </div>
            )
        }
    }

    const vigencia =(rowData)=>{
        if(rowData.docsev_pdf_vigencia_imss == null){
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
                        <a href={rowData.docsev_pdf_vigencia_imss} target="_blank" style={{textDecorationLine : "none"}}>
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-help" />
                        </a> 
                    </center>                   
                </div>
            )
        }
    }

    const solicitud =(rowData)=>{
        if(rowData.docsev_pdf_formato_solicitud == null){
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
                        <a href={rowData.docsev_pdf_formato_solicitud} target="_blank" style={{textDecorationLine : "none"}}>
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-help" />
                        </a> 
                    </center>                   
                </div>
            )
        }
    }

    const cartaCompromiso =(rowData)=>{
        if(rowData.docsev_pdf_carta_compromiso == null){
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
                        <a href={rowData.docsev_pdf_carta_compromiso} target="_blank" style={{textDecorationLine : "none"}}>
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-help" />
                        </a>
                    </center>                    
                </div>                
            )
        }
    }

    const cartaPresentacion =(rowData)=>{
        let bandera;
        if(rowData.docsev_pdf_Const_extraescolar != null){
            if(rowData.docsev_pdf_vigencia_imss != null){
                if(rowData.docsev_pdf_formato_solicitud != null){
                    if(rowData.docsev_pdf_carta_compromiso != null){
                        bandera = true;
                    }
                }
            }
        }
        if(!bandera){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docsev_pdf_carta_presentacion== null){
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
                            <a href={rowData.docsev_pdf_carta_presentacion} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-help" />
                            </a>
                        </center>
                    </div>                
                )
            }
        }
    }

    //ServicioCarta
    const ServicioCarta =(rowData)=>{
        if(rowData.docsev_pdf_carta_liberacion == null){
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
                        <a href={rowData.docsev_pdf_constancia_liberacion} target="_blank" style={{textDecorationLine : "none"}}>
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-help" />
                        </a>
                    </center>                    
                </div>                
            )
        }
    }

    //ACADEMICO
    const cartaAcep=(rowData)=>{
        if(rowData.docsev_pdf_carta_presentacion == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            )
        }else{
            if(rowData.docsev_pdf_carta_aceptacion == null){
                return(
                    <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled/>
                )
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docsev_pdf_carta_aceptacion} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            }            
        }
        
    }

    const planT=(rowData)=>{
        if(rowData.docsev_pdf_carta_presentacion == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            )
        }else{
            if(rowData.docsev_pdf_plan_trabajo == null){
                return(<Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled/>)
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docsev_pdf_plan_trabajo} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            }
        }
        
    }
    const repBim=(rowData)=>{
        if(rowData.docsev_pdf_carta_presentacion == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            )
        }else{
            if(rowData.docsev_pdf_reporte_bimestral == null){
                return(<Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled/>)
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docsev_pdf_reporte_bimestral} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            }
        }
        
    }

    const bim1=(rowData)=>{
        if(rowData.docsev_pdf_carta_presentacion == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            )
        }else{
            if(rowData.docsev_pdf_bimestral_1 == null){
                return(<Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled/>)
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docsev_pdf_bimestral_1} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            }
        }
        
    }
    const bim2=(rowData)=>{
        if(rowData.docsev_pdf_carta_presentacion == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            )
        }else{
            if(rowData.docsev_pdf_bimestral_2 == null){
                return(<Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled/>)
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docsev_pdf_bimestral_2} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            }
        }
        
    }
    const bim3=(rowData)=>{
        if(rowData.docsev_pdf_carta_presentacion == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            )
        }else{
            if(rowData.docsev_pdf_bimestral_3 == null){
                return(<Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled/>)
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docsev_pdf_bimestral_3} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            }
        }
        
    }
    const repFinal=(rowData)=>{
        if(rowData.docsev_pdf_carta_presentacion == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            )
        }else{
            if(rowData.docsev_pdf_reporte_final == null){
                return(<Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled/>)
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docsev_pdf_reporte_final} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            }
        }
        
    }
    //TarjetA
    const TarjetA=(rowData)=>{
        if(rowData.docsev_pdf_carta_presentacion == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            )
        }else{
            if(rowData.docsev_pdf_tarjeta_control == null){
                return(<Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled/>)
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docsev_pdf_tarjeta_control} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            }
        }
        
    }
    const cartLib=(rowData)=>{
        if(rowData.docsev_pdf_carta_presentacion == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            )
        }else{
            if(rowData.docsev_pdf_carta_liberacion == null){
                return(<Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled/>)
            }else{
                return(
                    <div>
                        <center>
                            <a href={rowData.docsev_pdf_carta_liberacion} target="_blank" style={{textDecorationLine : "none"}}>
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
                <table>                    
                    <tbody>
                        <tr>                            
                            <td style={{paddingRight: '25rem'}}></td>
                            <td style={{paddingRight: '5rem'}}>
                                <div className="textoA">{"Documentos de "+nombreA}</div>  
                            </td>                                                        
                        </tr>
                    </tbody>        
                </table>
                <Accordion multiple activeIndex={[0,1]}>
                    <AccordionTab header={"Documentos "+vinculacion}>
                        <DataTable value={docQuery} responsiveLayout="scroll" showGridlines>
                            <Column field="id_Documentos_Servicio" header="Documento" body={renderTexto}></Column>
                            <Column field="docsev_pdf_Const_extraescolar" header="Constancia de extraescolares" body={extraescolar}></Column>
                            <Column field="docsev_pdf_vigencia_imss" header="Constancia de vigencia del IMSS" body={vigencia}></Column>
                            <Column field="docsev_pdf_formato_solicitud" header="Formato de solicitud (SII)" body={solicitud}></Column>
                            <Column field="docsev_pdf_carta_compromiso" header="Carta compromiso (SII)" body={cartaCompromiso}></Column>
                            <Column field="docsev_pdf_carta_presentacion" header="Carta de presentación " body={cartaPresentacion}></Column>
                            <Column field="docsev_pdf_carta_presentacion" header="Constancia de Servicio Social " body={ServicioCarta}></Column>
                        </DataTable>
                    </AccordionTab>
                    <AccordionTab header={"Documentos " + depRegistro}>
                        <DataTable value={docQuery} responsiveLayout="scroll" showGridlines>
                            <Column field="docsev_pdf_carta_aceptacion" header="Carta de aceptación" body={cartaAcep}></Column>                            
                            <Column field="docsev_pdf_plan_trabajo" header="Plan de Trabajo" body={planT}></Column>
                            <Column field="docsev_pdf_bimestral_1" header="Reporte y Evaluaciones 1" body={bim1}></Column>
                            <Column field="docsev_pdf_bimestral_2" header="Reporte y Evaluaciones 2" body={bim2}></Column>                            
                            <Column field="docsev_pdf_bimestral_3" header="Reporte y Evaluaciones 3" body={bim3}></Column>
                            <Column field="docsev_pdf_reporte_bimestral" header="Carta de Asignacion" body={repBim}></Column>       
                            <Column field="docsev_pdf_tarjeta_control" header="Tarjeta de Control" body={TarjetA}></Column>                                                 
                            <Column field="docsev_pdf_reporte_final" header="Reporte Final con evidencias" body={repFinal}></Column>                            
                            <Column field="docsev_pdf_carta_liberacion" header="Carta de Liberación" body={cartLib}></Column>
                            
                        </DataTable>
                    </AccordionTab>
                </Accordion>
            </Panel>                        
        </div>
    )
}

export default DocumentosSocialJefe
