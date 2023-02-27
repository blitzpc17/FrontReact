import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import swal from 'sweetalert';
import { useNavigate, useParams } from 'react-router-dom';
import { ServicioDocumentosSocial } from '../../services/Josean/ServicioDocumentosSocial';
import { ServicioConsultaDocSer } from '../../services/Josean/ServicioConsultaDocSer';

import  FileService  from '../../services/FileService';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const DocumentosSocialJA = () => {
    const navigate = new useNavigate();

    var depRegistro = cookies.get("nombre_Departamento");

    const {nombreA, controlA, idserv} = new useParams();
    var servicioRegistro = parseInt(idserv);    

    const vinculacion = "Departamento de Gestión Tecnológica y Vinculación";

    var servicioDocSocial = new ServicioDocumentosSocial();
    var servicioconsDocSer = new ServicioConsultaDocSer();

    var SerDoc = new FileService();

    const [docQuery, setDocQuery] = useState([]);
    const [rowd, setRowd] = useState(null);
    

    useEffect(() => {    
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Documentos'){
                servicioconsDocSer.search(servicioRegistro).then(data => {setDocQuery(data) ;});
            }
            else
                navigate('/plataforma/menudepartamental');
        }
        

    }, []); 
	

    const guardarDoc= async(data)=>{
       
        //console.log(data[0]); 

        await servicioDocSocial.save(data).then(data => {
            setDocQuery(null);

            swal({
                title: "¡Atención!",
                text: "¡Documento Agregado con Exito!",
                icon: "success",
                button: "Aceptar",
                timer: "3000"
              });

              
            servicioconsDocSer.search(servicioRegistro).then(data => setDocQuery(data));            
          });
          
    }

    const [condicion,setCondicion] = useState(0);
    var validacion = 0;
    const [idValor, setIdValor] = useState(null);
    

    const onPdfChange=(e)=>{        
        let socialTemp;
        var opciones = switchNombreDoc();
        if(e.target.files.length !== 0){
            
        var formData = new FormData();
        formData.append('file',e.target.files[0]); 
        formData.append('ruta',cookies.get('lblPeriodo') +'\\DOCUMENTOS SERVICIO\\'+ cookies.get('nombre_Departamento') +'\\'+nombreA+'\\Social'); 
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
         });
            
        }        
      }

      
      const switchNombreDoc=()=>{
        let objReturn = {};
        switch(condicion){
            case 1:{    
                objReturn = {nombreArchivo : "Carta de Aceptacion.pdf", codeCampo : "docsev_pdf_carta_aceptacion"};                           
                setCondicion(0);
                return objReturn;
            }
            case 2:{
                objReturn = {nombreArchivo : "Plan de Trabajo.pdf", codeCampo : "docsev_pdf_plan_trabajo"};                           
                setCondicion(0);
                return objReturn;
            }
            case 3:{
                objReturn = {nombreArchivo : "Carta de Asignacion.pdf", codeCampo : "docsev_pdf_reporte_bimestral"};                           
                setCondicion(0);
                return objReturn;
            }
            case 4:{
                objReturn = {nombreArchivo : "Primer reporte y Evaluaciones.pdf", codeCampo : "docsev_pdf_bimestral_1"};                           
                setCondicion(0);
                return objReturn;
            }
            case 5:{
                objReturn = {nombreArchivo : "Segundo reporte y Evaluaciones.pdf", codeCampo : "docsev_pdf_bimestral_2"};                           
                setCondicion(0);
                return objReturn;
            }
            case 6:{
                objReturn = {nombreArchivo : "Tercer reporte y Evaluaciones.pdf", codeCampo : "docsev_pdf_bimestral_3"};                           
                setCondicion(0);
                return objReturn;
            }
            case 7:{
                objReturn = {nombreArchivo : "Informe Final con evidencias.pdf", codeCampo : "docsev_pdf_reporte_final"};                           
                setCondicion(0);
                return objReturn;
            }
            case 8:{
                objReturn = {nombreArchivo : "Carta de Liberacion.pdf", codeCampo : "docsev_pdf_carta_liberacion"};                           
                setCondicion(0);
                return objReturn;
            }
            case 9:{
                objReturn = {nombreArchivo : "Tarjeta de Control.pdf", codeCampo : "docsev_pdf_tarjeta_control"};                           
                setCondicion(0);
                return objReturn;
            }
            default:{
               
                break;
            }
        }   
      }


    const cartaPresentacion =(rowData)=>{

        if(rowData.docsev_pdf_carta_presentacion == null){
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
                            onClick={()=> { window.open(rowData.docsev_pdf_carta_presentacion)}}
                        />
                    </center>
                </div>                
            )
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
                    <div>
                        <center>
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" 
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
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" 
                                onClick={()=> {setCondicion(1); setRowd(rowData); document.getElementById("inputFile").click()}}
                            />
                            <br></br>
                            <br></br>
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
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" 
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
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" 
                                onClick={()=> {setCondicion(2); setRowd(rowData) ; document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
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
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" 
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
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" 
                                onClick={()=> {setCondicion(3); setRowd(rowData) ; document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
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
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" 
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
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" 
                                onClick={()=> {setCondicion(4); setRowd(rowData) ; document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
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
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" 
                                onClick={()=> {setCondicion(5); setRowd(rowData) ; document.getElementById("inputFile").click();}}
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
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" 
                                onClick={()=> {setCondicion(5); setRowd(rowData) ; document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
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
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" 
                                onClick={()=> {setCondicion(6); setRowd(rowData) ; document.getElementById("inputFile").click();}}
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
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" 
                                onClick={()=> {setCondicion(6); setRowd(rowData) ; document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docsev_pdf_bimestral_3} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            }
        }
    }

    const tarjetaControl=(rowData)=>{
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
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" 
                                onClick={()=> {setCondicion(9); setRowd(rowData) ; document.getElementById("inputFile").click();}}
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
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" 
                                onClick={()=> {setCondicion(9); setRowd(rowData) ; document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docsev_pdf_tarjeta_control} target="_blank" style={{textDecorationLine : "none"}}>
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
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" 
                                onClick={()=> {setCondicion(7); setRowd(rowData) ; document.getElementById("inputFile").click();}}
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
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" 
                                onClick={()=> {setCondicion(7); setRowd(rowData) ; document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
                            <a href={rowData.docsev_pdf_reporte_final} target="_blank" style={{textDecorationLine : "none"}}>
                                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />
                            </a>
                        </center>
                    </div>
                )
            }
        }
    }

    const cartLib=(rowData)=>{
        if(rowData.docsev_pdf_reporte_final == null ||
            rowData.docsev_pdf_carta_aceptacion == null ||
            rowData.docsev_pdf_plan_trabajo == null ||
            rowData.docsev_pdf_bimestral_1 == null ||
            rowData.docsev_pdf_bimestral_2 == null ||
            rowData.docsev_pdf_bimestral_3 == null ||
            rowData.docsev_pdf_reporte_bimestral == null ||
            rowData.docsev_pdf_tarjeta_control == null ||
            rowData.docsev_pdf_reporte_final == null){
            return(
                <div>
                    <center>
                        <h5>No disponible</h5>
                    </center>
                </div>
            ) 
        }else{
            if(rowData.docsev_pdf_carta_liberacion == null){
                return(
                    <div>
                        <center>
                            <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" 
                                onClick={()=> {setCondicion(8); setRowd(rowData) ; document.getElementById("inputFile").click();}}
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
                            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" 
                                onClick={()=> {setCondicion(8); setRowd(rowData) ; document.getElementById("inputFile").click();}}
                            />
                            <br></br>
                            <br></br>
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
                <h3>{"Documentos de "+nombreA}</h3>
                <h3>{controlA}</h3>
                <Accordion multiple activeIndex={[0,1]}>
                    <AccordionTab header={"Documentos "+vinculacion}>
                        <DataTable value={docQuery} responsiveLayout="scroll" showGridlines>
                            <Column field="docsev_pdf_carta_presentacion" header="Carta de presentación " body={cartaPresentacion}></Column>
                        </DataTable>
                    </AccordionTab>
                    <AccordionTab header={"Documentos " + depRegistro}>
                        <DataTable value={docQuery} responsiveLayout="scroll" showGridlines>
                            <Column field="docsev_pdf_carta_aceptacion" header="Carta de aceptación" body={cartaAcep}></Column>                            
                            <Column field="docsev_pdf_plan_trabajo" header="Plan de Trabajo" body={planT}></Column>                         
                            <Column field="docsev_pdf_reporte_bimestral" header="Carta de Asignación" body={repBim}></Column> 
                            <Column field="docsev_pdf_bimestral_1" header="Primer reporte y evaluaciones " body={bim1}></Column>   
                            <Column field="docsev_pdf_bimestral_2" header="Segundo reporte y evaluaciones " body={bim2}></Column>                            
                            <Column field="docsev_pdf_bimestral_3" header="Tercer reporte y evaluaciones " body={bim3}></Column>  
                            <Column field="docsev_pdf_tarjeta_control" header="Tarjeta de Control" body={tarjetaControl}></Column> 
                            <Column field="docsev_pdf_reporte_final" header="Informe Final con evidencias" body={repFinal}></Column>
                            <Column field="docsev_pdf_carta_liberacion" header="Carta de Liberación" body={cartLib}></Column>
                        </DataTable>
                    </AccordionTab>
                </Accordion>
            </Panel>
            <input type="file" id="inputFile" hidden accept=".pdf" onChange={onPdfChange}/>            
        </div>
    )
}

export default DocumentosSocialJA;
