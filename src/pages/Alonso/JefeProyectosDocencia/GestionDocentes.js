import React, {  useState, useEffect, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import swal from 'sweetalert';
import { CEProyectosDocencia } from '../../../services/ConsultasEspecificas/Alonso/CEProyectosDocencia';
import { ServicioDocentePeriodo } from '../../../services/Alonso/ServicioDocentePeriodo';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../../context/BreadCrumbContext';

const GestionDocentes = () => {
    const navigate = new useNavigate();
    const { cambiarBread, actual, direcciones } = useContext(BreadCrumbContext);
    const cEProyectosDocencia=new CEProyectosDocencia();
    const docentePeriodo=new ServicioDocentePeriodo();
    const cookies=new Cookies();
    const [docentes, setDocentes] = useState(null);
    const [estadosDocencia, setEstadosDocencia] = useState(null);
    const [estadosGrupos, setEstadosGrupos] = useState(null);
   
    const [visible, setVisible] = useState(false);
    //parametros para las consultas
    const departamento = parseInt(cookies.get('id_Departamento'));
    const periodo = parseInt(cookies.get('id_Periodo'));
    const [reporteFinal, setReporteFinal] = useState({
        id_docper: null,
        id_usuarios: null,
        id_periodo: periodo,  
        docper_pdf_horario:"",
        docper_pdf_liberacionact:"",  
        docper_pdf_reportefinal: "",
        docper_estado_reportefinal: 0,
        docper_retroalimentacion_reportefinal: ""
    });
    const tiposEstados = [
        { name: 'Sin Subir', code: 0 },
        { name: 'Completo', code: 1 },
        { name: 'Incompleto', code: 2 },
        { name: 'Subido', code: 3 }
    ];
    const getEstadoLabel = (estado) => {
        
        switch (estado) {
            case 1:
                return  { name: 'Completo', code: 1 };

            case 2:
                return  { name: 'Incompleto', code: 2 };

            case 3:
                return  { name: 'Subido', code: 3 };
            default:
                return  { name: 'Sin Subir', code: 0 };
        }
       
    }
   
    
    const footer=()=>{
    return <Button label={"Guardar Cambios"} onClick={()=>{retroReporteFinal()}}/>
    }   
    const renderVerReporte=(rowData)=>{
        return    <><center>{(rowData.docper_estado_reportefinal!==1)? <Button  className="p-button-raised p-button-rounded"  icon= "pi pi-chevron-circle-right"style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"#D28BFF", borderColor:"#D28BFF",}} onClick={(e)=>{setVisible(true);setReporteFinal(rowData)}} />: <Button icon= "pi pi-chevron-circle-right" className="p-button-rounded p-button-help" onClick={(e)=>{setVisible(true);setReporteFinal(rowData)}}/>}</center></>     
    }
    
    const handleInputChange=(event)=>{
        
        if([event.target.id]=="docper_estado_reportefinal"){
            if(event.target.value.code===3||event.target.value.code===0){
                alertaEstado();                
            }
            else{
                 setReporteFinal({
                ...reporteFinal,
                [event.target.id]:event.target.value.code
            });
            }
           
           
        }else{
            setReporteFinal({
                ...reporteFinal,
                [event.target.id]:event.target.value
            });
        }
    }
    const retroReporteFinal=()=>{
     

        let objtemp = {
            ...reporteFinal, notify: 1
        };

        docentePeriodo.save(objtemp).then(data=>{
            swal({
                title: "¡Atención!",
                text: "¡Se ha Retroalimentado el Reporte!",
                icon: "success",
                button: "Aceptar",
                timer: "3000"
            });
            setVisible(false);
            setDocentes(null);
            cEProyectosDocencia.getCosultaDocentes(departamento,periodo).then(data=>setDocentes(data));
        });
       
    }
   
    const renderGrupos=(rowData)=>
    {
     return   <center>{(verificarEstadosGrps(rowData.id_docper)!==1)?<Button onClick={() => {cambiarBreadLocal('Grupos');
     navigate('/plataforma/gruposjefedocencia/'+rowData.id_docper);}} className="p-button-rounded" style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"#80BBFF", borderColor:"#80BBFF"}} icon= "pi pi-chevron-circle-right"/>:<Button  className="p-button-rounded p-button-information"  icon= "pi pi-chevron-circle-right" onClick={() => {cambiarBreadLocal('Grupos');
     navigate('/plataforma/gruposjefedocencia/'+rowData.id_docper);}}/>}</center>
    }
    const renderActividades=(rowData)=>
    {
     return  <center>{(verificarEstadoAct(rowData.id_docper)!==1)?<Button onClick={() => {cambiarBreadLocal('Actividades en Apoyo a la Docencia');
     navigate('/plataforma/actividadesjefedocencia/'+rowData.id_docper);}} className="p-button-rounded"style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"#8BD879", borderColor:"#8BD879"}}  icon= "pi pi-chevron-circle-right"/>:<Button  className="p-button-rounded p-button-success"  icon= "pi pi-chevron-circle-right" onClick={() => {cambiarBreadLocal('Actividades en Apoyo a la Docencia');
     navigate('/plataforma/actividadesjefedocencia/'+rowData.id_docper);}}/>} </center>
    }
    const renderSeguimientos=(rowData)=>
    {
        return   <center><Button onClick={() => {cambiarBreadLocal('Seguimiento al Aula');
        navigate('/plataforma/seguimientojefedocencia/'+rowData.id_docper);}} className="p-button-rounded p-button-warning"  icon= "pi pi-chevron-circle-right" /></center> 
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/gestionjefedocencia' });

        cambiarBread(direccionesTemp, lblActual);
    }

    const verificarEstadoAct=(us)=>{                
        let contEstados=0;
        let contCompleto=0;
        
        for (const key in estadosDocencia) {
            if (estadosDocencia[key].id_docper===us) {
                contEstados++;                
            }
            if(estadosDocencia[key].id_docper===us&&estadosDocencia[key].actdoc_estadocomentario===1){
                contCompleto++;
            }

        }
         
        if(contEstados===contCompleto){
           if(contEstados===0)
            return 0;
            else
            return 1;
           
        }
        else{
            return 0;
            
        }
        
    }
    const verificarEstadosGrps=(us)=>{
        let contEstados=0;
        let contCompleto=0;
        
        for (const key in estadosGrupos) {
            if (estadosGrupos[key].id_docper===us) {
                contEstados++;                
            }
            if(estadosGrupos[key].id_docper===us&&estadosGrupos[key].docgrp_estadocomentario===1){
                contCompleto++;
            }

        }
         
        if(contEstados===contCompleto){
           if(contEstados===0)
            return 0;
            else
            return 1;
           
        }
        else{
            return 0;
            
        }
    }
    const alertaEstado=()=>{
        swal({
            title: "¡Atención!",
            text: "¡No se puede seleccionar esa opcion!",
            icon: "warning",
            button: "Aceptar",
            timer: "3000"
          });
    }
    

    const verificarDocPer=(data)=>{
        const   tempDocPer={
              id_docper: null,
              id_usuarios: null,
              id_periodo: periodo,  
              docper_pdf_horario:"",
              docper_pdf_liberacionact:"",  
              docper_pdf_reportefinal: "",
              docper_estado_reportefinal: 0,
              docper_retroalimentacion_reportefinal: ""
          }
          for (const key in data) {
              if(data[key].id_docper==0){
                  tempDocPer.id_usuarios= data[key].id_usuarios;
              tempDocPer.id_docper= null;             
              tempDocPer.docper_pdf_horario=data[key].docper_pdf_horario;
              tempDocPer.docper_pdf_liberacionact=data[key].docper_pdf_liberacionact;  
              tempDocPer.docper_pdf_reportefinal= data[key].docper_pdf_reportefinal;
              tempDocPer.docper_estado_reportefinal= data[key].docper_estado_reportefinal;
              tempDocPer.docper_retroalimentacion_reportefinal= data[key].docper_retroalimentacion_reportefinal;
  
              docentePeriodo.save(tempDocPer).then(data=>{
                 
              }); 
              }
             
          }
 cEProyectosDocencia.getCosultaDocentes(departamento,periodo).then(data=>setDocentes(data));
      }
	   const rowTemplate = (rowData) => {
        return docentes.indexOf(rowData) + 1;
    }
     useEffect(() => {

        if(!cookies.get('rolesUsuario').rol_jefe_proyectos_docencia)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Gestión Docentes'){
                docentePeriodo.getAll().then(data=>{
     
            cEProyectosDocencia.getCosultaDocentes(departamento,periodo).then(data=>verificarDocPer(data));
        
    })
                cEProyectosDocencia.getEstadoDocencia(departamento,periodo).then(data=>setEstadosDocencia(data));
                cEProyectosDocencia.getEstadoGrupos(departamento,periodo).then(data=>setEstadosGrupos(data));
            }
            else
                navigate('/plataforma/periodosjefedocencia');
        }
      
    }, [])
    return (
        <div>  
            
            <center><h2>Gestión de Docentes</h2></center>
           <div className='card'>
                <Panel>
                    <DataTable value={docentes} scrollable scrollHeight="400px">
                           <Column body={rowTemplate}  header='#'/>
                            <Column field='nombredocente' header='Nombre Docente'/>                                
                            <Column body={renderVerReporte} header={"Reporte Final"} ></Column>
                            <Column body={renderGrupos} header={"Gestión de Grupos"} ></Column>
                            <Column body={renderActividades} header={"Actividades en Apoyo a la Docencia"} ></Column>
                            <Column body={renderSeguimientos} header={"Seguimiento al Aula"} ></Column>                                                                                             
                    </DataTable>        
                </Panel>
           </div>
         
            <Dialog  header={"Reporte Final"} footer={footer} visible={visible} modal={true} style={{width: '850px'}}  onHide={()=>setVisible(false)}>
           <table>
               <tbody>
                   <tr>
                   <td style={{padding:'10px 30px'}}>
                    { (reporteFinal.docper_pdf_reportefinal === null) ? <img src="/pdfDefault.png" alt="" height='340px' width='280px' /> :  <iframe title="RFinalD" src={  reporteFinal.docper_pdf_reportefinal }  height='335px' width='280px'/> }                       
                    </td> 
                    <td style={{padding: '10px 30px'}}>
                        <table>
                            <tbody>
                                <tr>
                                    <td >
                                        <h4>Docente:</h4>
                                        </td>
                                    <td style={{paddingLeft: '5px'}}>
                                        <h4>{reporteFinal.nombredocente}</h4>
                                    </td> 
                                </tr>
                            </tbody>
                        </table>
                       
                          <td style={{padding: '10px 80px' }}><h4 >Comentarios:</h4></td>  
                         
                    <InputTextarea id="docper_retroalimentacion_reportefinal" rows={5} cols={30}   onChange={handleInputChange}   value={reporteFinal.docper_retroalimentacion_reportefinal}  maxLength="255" />                    
                    </td>             
                   </tr>
                   <tr>                                            
                       <td style={{padding: '5px 120px'}}>                           
                           {(reporteFinal.docper_pdf_reportefinal!=null)?<a href={reporteFinal.docper_pdf_reportefinal} target={'_blank'} rel="noreferrer" style={{textDecorationLine : "none"}}> <Button label="Ver" className="p-button-success" /> </a>:<Button label="Ver" className="p-button-success" disabled/>}
                       </td>
                   </tr>
                   <tr>
                       <td>
                           <td style={{paddingLeft:'30px'}}>
                           <h4>Estado:</h4>
                                
                           </td>
                           <td style={{paddingLeft:'10px'}}>
                                 <Dropdown id="docper_estado_reportefinal" value={getEstadoLabel(reporteFinal.docper_estado_reportefinal)} options={tiposEstados} onChange={handleInputChange} optionLabel="name" placeholder="Seleccionar Estado" disabled={reporteFinal.docper_estado_reportefinal===0}/>
                            </td>                 
                       </td>
                   </tr>
               </tbody>
           </table>            
            </Dialog>
        </div>
    )
}

export default GestionDocentes
