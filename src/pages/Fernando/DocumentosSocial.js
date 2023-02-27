import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import swal from 'sweetalert';
import { QueryDocumentos } from '../../services/Fernando/ServicioDocumentosQuery';
import { DocSocialServicio } from '../../services/Fernando/DocSocialServicio';
import FileService from '../../services/FileService';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';

const cookies = new Cookies();

const DocumentosSocial = () => {   
    
    const navigate = new useNavigate();

    useEffect(() => {   
        if(!cookies.get('rolesUsuario').rol_jefe_oficina_servicio_social_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Documentos Alumno'){
                DocsQuery.search(servicioRegistro).then(data => setDocQuery(data));
            }
            else{
                navigate('/plataforma/periodosocial');
            }
        } 
                
    }, []); 

    //Variable periodos

    var readonly = false;
    
    const {depRegistro, nombreA, idserv} = new useParams();

    //

    const servicioRegistro = parseInt(idserv);

    
    const [etiqueta,setEtiqueta] = useState("No se ha aregado el documento");
    const vinculacion = "Departamento de Gestión Tecnológica y Vinculación";

    const [docQuery, setDocQuery] = useState([]);
    const DocsQuery = new QueryDocumentos();

    const socialDocumentos = new DocSocialServicio();

    //Servicio para guardar documentos
    const SerDoc = new FileService();

    
	

    const guardarDoc=async(data)=>{
        await socialDocumentos.save(data).then(data => {
            DocsQuery.search(servicioRegistro).then(data => setDocQuery(data));            
          })
          swal({
            title: "¡Atención!",
            text: "¡Documento Agregado con Exito!",
            icon: "success",
            button: "Aceptar",
            timer: "3000"
          });
    }

    const [condicion,setCondicion] = useState(0);
    var validacion = 0;
    const [idValor, setIdValor] = useState(null);
    const [social,setSocial] = useState({
        id_Documentos_Servicio:null,
        id_Servicio:servicioRegistro,
        docsev_pdf_Const_extraescolar:null,
        docsev_pdf_vigencia_imss:null,
        docsev_pdf_formato_solicitud:null,
        docsev_pdf_carta_compromiso:null,
        docsev_pdf_carta_presentacion:null,
        docsev_pdf_carta_aceptacion:null,
        docsev_pdf_plan_trabajo:null,
        docsev_pdf_reporte_bimestral:null,
        docsev_pdf_bimestral_1:null,
        docsev_pdf_bimestral_2:null,
        docsev_pdf_bimestral_3:null,
        docsev_pdf_reporte_final:null,
        docsev_pdf_carta_liberacion:null,
        docsev_pdf_tarjeta_control:null,
        docsev_pdf_constancia_liberacion:null
    });

    const onPdfChange=(e)=>{        
        let socialTemp;
        var opciones = switchNombreDoc();
        if(e.target.files.length != 0){
            
        var formData = new FormData();
        formData.append('file',e.target.files[0]); 
        formData.append('ruta',cookies.get('lblPeriodo') +'\\'+depRegistro+'\\SERVICIO SOCIAL\\'+nombreA); 
        formData.append('nombrearch',opciones.nombreArchivo);                           
         SerDoc.upload(formData).then(data => {
             if(data.status === 200){ 
                    socialTemp = {
                        ...social,
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
         });
            
        }        
      }
      const switchNombreDoc=()=>{
        let objReturn = {};
        switch(condicion){
            case 1:{    
                objReturn = {nombreArchivo : "Constancia Extraescolar Social.pdf", codeCampo : "docsev_pdf_Const_extraescolar"};                           
                setCondicion(0);
                return objReturn;
            }
            case 2:{
                objReturn = {nombreArchivo : "Vigencia IMMS Social.pdf", codeCampo : "docsev_pdf_vigencia_imss"};                           
                setCondicion(0);
                return objReturn;
            }
            case 3:{
                objReturn = {nombreArchivo : "Formato Solicitud Social.pdf", codeCampo : "docsev_pdf_formato_solicitud"};                           
                setCondicion(0);
                return objReturn;
            }
            case 4:{
                objReturn = {nombreArchivo : "Carta Compromiso Social.pdf", codeCampo : "docsev_pdf_carta_compromiso"};                           
                setCondicion(0);
                return objReturn;
            }
            case 5:{//docvst_pdf_oficio_constancia
                objReturn = {nombreArchivo : "Carta Prsentacion Social.pdf", codeCampo : "docsev_pdf_carta_presentacion"};                           
                setCondicion(0);
                return objReturn;
            }
            case 6:{//docvst_pdf_oficio_constancia
                objReturn = {nombreArchivo : "Constancia de Servicio Social.pdf", codeCampo : "docsev_pdf_constancia_liberacion"};                           
                setCondicion(0);
                return objReturn;
            }
            default:{
               
                break;
            }
        }   
      }

    const renderTexto=(rowData)=>{
        social.id_Documentos_Servicio = rowData.id_documentos_servicio; 
        social.docsev_pdf_Const_extraescolar = rowData.docsev_pdf_Const_extraescolar;
        social.docsev_pdf_vigencia_imss = rowData.docsev_pdf_vigencia_imss;
        social.docsev_pdf_formato_solicitud = rowData.docsev_pdf_formato_solicitud;
        social.docsev_pdf_carta_compromiso = rowData.docsev_pdf_carta_compromiso;
        social.docsev_pdf_carta_presentacion = rowData.docsev_pdf_carta_presentacion;
        social.docsev_pdf_carta_liberacion = rowData.docsev_pdf_carta_liberacion;
        if(rowData.docsev_pdf_Const_extraescolar != null){
            if(rowData.docsev_pdf_vigencia_imss != null){
                if(rowData.docsev_pdf_formato_solicitud != null){
                    if(rowData.docsev_pdf_carta_compromiso != null){
                        validacion = 5;
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
    const extraescolar =(rowData)=>{
        if(rowData.docsev_pdf_Const_extraescolar == null){
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
                        <a href={rowData.docsev_pdf_Const_extraescolar} target="_blank" style={{textDecorationLine : "none"}}>
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
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
                        <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={readonly}
                            onClick={()=> {setCondicion(2); document.getElementById("inputFile").click();                            
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
                            onClick={()=> {setCondicion(2); document.getElementById("inputFile").click(); }}
                        />
                        <br></br>
                        <br></br>
                        <a href={rowData.docsev_pdf_vigencia_imss} target="_blank" style={{textDecorationLine : "none"}}>
                            <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
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
                        <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={readonly}
                            onClick={()=> {setCondicion(3);  document.getElementById("inputFile").click();}}
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
                        <a href={rowData.docsev_pdf_formato_solicitud} target="_blank" style={{textDecorationLine : "none"}}>
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
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
                        <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success"  disabled={readonly}
                            onClick={()=> {setCondicion(4); document.getElementById("inputFile").click();}}
                        />
                    </center>
                </div>
            ) 
        }else{
            return(
                <div>
                    <center>
                        <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success"  disabled={readonly}
                            onClick={()=> {setCondicion(4); document.getElementById("inputFile").click();}}
                        />
                        <br></br>
                        <br></br>
                        <a href={rowData.docsev_pdf_carta_compromiso} target="_blank" style={{textDecorationLine : "none"}}>
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                        </a>
                    </center>                    
                </div>                
            )
        }
    }
    const cartaPresentacion =(rowData)=>{
        if(validacion != 5){
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
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={readonly}
                                onClick={()=> {setCondicion(5); document.getElementById("inputFile").click();}}
                            />
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success"  disabled={readonly}
                                onClick={()=> {setCondicion(5); document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docsev_pdf_carta_presentacion} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>                
                )
            }
        }
    }
    
    const ServicioCarta =(rowData)=>{
        if(rowData.docsev_pdf_carta_liberacion == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docsev_pdf_constancia_liberacion == null){
                return(
                    <div>
                        <center>
                            <h5>{etiqueta}</h5>
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" disabled={readonly}
                                onClick={()=> {setCondicion(6); document.getElementById("inputFile").click();}}
                            />
                        </center>
                    </div>
                ) 
            }else{
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success"  disabled={readonly}
                                onClick={()=> {setCondicion(6); document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docsev_pdf_constancia_liberacion} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>                
                )
            }
        }
    }


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
    //

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
                <table border="0" >                    
                    <tbody>
                        <tr>                            
                            <td style={{paddingRight: '25rem'}}></td>
                            <td style={{paddingRight: '5rem'}}>
                                <div className="textoA">{"Documentos de "+nombreA}</div> 
                            </td>                                                        
                        </tr>
                    </tbody>                        
                </table>
                <br></br>
                <br></br>
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
            <input type="file" id="inputFile" hidden accept=".pdf" onChange={onPdfChange}/>            
        </div>
    )
}

export default DocumentosSocial;
