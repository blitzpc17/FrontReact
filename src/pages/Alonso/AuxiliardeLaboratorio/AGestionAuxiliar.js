import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Panel } from 'primereact/panel';
import React, { useState, useEffect, useContext } from 'react';
import { CEAuxiliarLaboratorio } from '../../../services/ConsultasEspecificas/Alonso/CEAuxiliarLaboratorio';
import swal from 'sweetalert';
import { ServicioGestionLaboratorio } from '../../../services/Alonso/ServicioGestionLaboratorio';
import FileService from '../../../services/FileService';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbContext from '../../../context/BreadCrumbContext';

const cookies = new Cookies();

const AGestionAuxiliar = () => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const {idPeriodo} = new useParams();

   const cEAuxiliarLaboratorio =new CEAuxiliarLaboratorio();
   const servicioGestionLaboratorio=new ServicioGestionLaboratorio();
    const fileService=new FileService();

   const [gestionesLab, setGestionesLab] = useState(null);
   const [visibleI, setVisibleI] = useState(false);
   const [visibleF, setVisibleF] = useState(false);

   //parametros servicios
   const departamento = parseInt(cookies.get('id_Departamento'));
   const periodo = parseInt(idPeriodo);
   
   const [inventarios, setInventarios] = useState({
    id_gestionlaboratorio: null,
    id_periodo: periodo,
    id_laboratorio: null,
    geslab_inventarioinicial: null,
    geslab_inventariofinal: null,
    geslab_inventarioinicialestado: null,
    geslab_inventarioinicialcomentario: null,
    geslab_inventariofinalestado: null,
    geslab_inventariofinalcomentario: null
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
const getEstadoIFinal = (estado) => {
        
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
   const renderInventarioI=(rowData)=>{
    return  <center><Button icon= "pi pi-chevron-circle-right" className="p-button-rounded p-button-success" onClick={()=>{setInventarios(rowData);setVisibleI(true)}}/></center>  }

    const renderInventarioF=(rowData)=>{
    return  <center><Button icon= "pi pi-chevron-circle-right" className="p-button-rounded p-button-warning" onClick={()=>{setInventarios(rowData);setVisibleF(true)}} /></center>  }

    const renderSolicitudes=(rowData)=>{
    return  <center><Button icon= "pi pi-chevron-circle-right" className="p-button-rounded p-button-help" onClick={() => {
        cambiarBreadLocal('Solicitudes');
        navigate('/plataforma/solicitudesauxiliarlaboratorio/'+rowData.id_laboratorio+'/'+rowData.id_gestionlaboratorio);
    }}/></center>  }

    const renderOcupacion=(rowData)=>{
    return   <center><Button icon= "pi pi-chevron-circle-right" className="p-button-rounded p-button-info" onClick={() => {
        cambiarBreadLocal('Ocupación de Laboratorio');
        navigate('/plataforma/ocupacionlaboratorio/'+rowData.id_laboratorio+'/'+rowData.id_gestionlaboratorio);
    }}/></center> }


    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/laboratoriosauxiliar/' + periodo });
    
        cambiarBread(direccionesTemp, lblActual);
    }

const footerI=()=>{
    return <Button label={"Guardar Cambios"} onClick={()=>{guardarInventarioInicial()}}/>
    }
    const footerF=()=>{
        return <Button label={"Guardar Cambios"} onClick={()=>{setVisibleF(false)}}/>
        }
        const handleInputChange=(event)=>{               
            if(event.target.id==="geslab_inventariofinalestado")   {
                if(event.target.value.code===3||event.target.value.code===0){
                    alertaEstado();
                }else{
                     setInventarios({
                    ...inventarios,
                    [event.target.id]:event.target.value.code
                }); 
                }
               
            }else{
                setInventarios({
                    ...inventarios,
                    [event.target.id]:event.target.value
                }); 
            }
                              
        }
        const onPdfChange=(e)=>{
            
            if(e.target.files.length !== 0){     
                var formData = new FormData();
            formData.append('file',e.target.files[0]); 
            formData.append('ruta',cookies.get('lblPeriodo')+'\\'+cookies.get('nombre_Departamento')+'\\'+inventarios.user_nombre+'\\Laboratorios\\'+inventarios.lab_nombre+'\\Inventario Inicial'); 
            formData.append('nombrearch',e.target.files[0].name); 
            fileService.upload(formData).then(data=>{
            
                if(data.status===200){                                  
                    guardarPdf(data.message);
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
                       
        // guardarPdf(pdfSeleccionado);
          }
          const quitarPdf = (archivo) =>{
           
          
                swal({
                  title: "¿Deseas Eliminar el Documento?",
                  text: "¡Los cambios no se podrán recuperar!",
                  icon: "warning",
                  buttons: ["Cancelar","Aceptar"],
                  dangerMode: true
                }).then((OK) => {
                  if(OK){                                       
                    fileService.delete(archivo).then(data=>{
                        if(data.status===200){
                            swal({
                              title: "¡Atención!",
                              text: data.message,
                              icon: "success",
                              button: "Aceptar",
                              timer: "3000"
                            }); 
                            inventarios.geslab_inventarioinicialestado=0;
                            inventarios.geslab_inventarioinicial=null;
                            servicioGestionLaboratorio.save(inventarios).then(data=>{
                      
                     setGestionesLab(null);
                     cEAuxiliarLaboratorio.getGestionAuxiliar(departamento,periodo).then(data=>setGestionesLab(data));
                     
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
        const subirPdf = () =>{
            document.getElementById("pdfrepaux").click();
        }
        const guardarInventarioInicial=()=>{
           
                
                servicioGestionLaboratorio.save(inventarios).then(data=>{
                    swal({
                        title: "¡Atención!",
                        text: "¡Se ha Retroalimentado el Inventario Final!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                    });
                    setVisibleI(false)
                    setGestionesLab(null);
                    cEAuxiliarLaboratorio.getGestionAuxiliar(departamento,periodo).then(data=>setGestionesLab(data));
                });
            
            
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
        const guardarPdf=(pdf)=>{   
            inventarios.id_periodo=periodo;     
            inventarios.geslab_inventarioinicial=pdf; 
            inventarios.geslab_inventarioinicialestado=3;  
            servicioGestionLaboratorio.save(inventarios).then(data=>{
                swal({
                    title: "¡Atención!",
                    text: "¡Exito al Subir!",
                    icon: "success",
                    button: "Aceptar",
                    timer: "3000"
                  });
                  setGestionesLab(null);
                  cEAuxiliarLaboratorio.getGestionAuxiliar(departamento,periodo).then(data=>setGestionesLab(data));
            });
        }

       const verificarGestion=(data)=>{ 
           const tempGestion={
        id_gestionlaboratorio: null,
        id_periodo: periodo,
        id_laboratorio: null,
        geslab_inventarioinicial: null,
        geslab_inventariofinal: null,
        geslab_inventarioinicialestado: null,
        geslab_inventarioinicialcomentario: null,
        geslab_inventariofinalestado: null,
        geslab_inventariofinalcomentario: null
    }
for (const key in data) {
   
     if(data[key].id_gestionlaboratorio==0){
        tempGestion.id_gestionlaboratorio= null;                
        tempGestion.id_laboratorio=data[key].id_laboratorio;
        tempGestion.geslab_inventarioinicial=data[key].geslab_inventarioinicial;
        tempGestion.geslab_inventariofinal= data[key].geslab_inventariofinal;
        tempGestion.geslab_inventarioinicialestado= data[key].geslab_inventarioinicialestado;
        tempGestion.geslab_inventarioinicialcomentario= data[key].geslab_inventarioinicialcomentario;
        tempGestion.geslab_inventariofinalestado=data[key].geslab_inventariofinalestado;
        tempGestion.geslab_inventariofinalcomentario= data[key].geslab_inventariofinalcomentario;
            
        servicioGestionLaboratorio.save(tempGestion).then(data=>{})
     }
        
    
}
        cEAuxiliarLaboratorio.getGestionAuxiliar(departamento,periodo).then(data=>setGestionesLab(data));
   
    }
	 const rowTemplate = (rowData) => {
        return gestionesLab.indexOf(rowData) + 1;
    }
       
    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_auxiliar_laboratorio)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Laboratorios')
               servicioGestionLaboratorio.getAll().then(data=>{
           
            cEAuxiliarLaboratorio.getGestionAuxiliar(departamento,periodo).then(data=>verificarGestion(data));

           
       })
            else
                navigate('/plataforma/gestionauxiliarlab');
        }
        
    
       
    }, [])
    return (
        <div>
            <center><h2>Gestión de Laboratorios</h2></center>
           <div className='card'>
                <Panel>
                    <DataTable value={gestionesLab}>
                        <Column body={rowTemplate} header={"#"}/>
                        <Column field='lab_nombre' header={"Nombre de Laboratorio"}/>
                        <Column field='user_nombre' header={"Jefe de Laboratorio"}/>
                        <Column body={renderInventarioF} header={"Inventario Inicial"}/>
                        <Column body={renderInventarioI} header={"Inventario Final"}/>
                        <Column body={renderOcupacion} header={"Ocupación de Laboratorio"}/>
                        <Column body={renderSolicitudes} header={"Servicio de Solicitudes"}/>                        
                    </DataTable>
                </Panel>
           </div>

            
            
            <Dialog  header={"Inventario Final"} footer={footerI} visible={visibleI} modal={true} style={{width: '800px'}}  onHide={()=>setVisibleI(false)}>
            <table>
                <tbody> 
                    <tr >
                    <td style={{padding: '10px 30px'}}>
                    { (inventarios.geslab_inventariofinal === null) ? <img src="/pdfDefault.png" alt="" height='340px' width='280px' /> :  <iframe title="RFinalA" src={ inventarios.geslab_inventariofinal } height='335px' width='280px'/> }                       
                    </td>                      
                    <td  style={{padding: '10px 30px' }}>                       
                    <td >
                        <table>
                            <tbody>
                                <tr>
                                 <td><h4>Laboratorio:&nbsp;{inventarios.lab_nombre}</h4></td>
                               </tr>
                                <tr>
                                <td><h4>Jefe:&nbsp;{inventarios.user_nombre}</h4></td>                          
                         
                                </tr>
                            </tbody>
                        </table>
                         <td  style={{padding: '10px 80px' }}>
                          <h4>Comentarios:</h4>    
                        </td>                
                    <InputTextarea id="geslab_inventariofinalcomentario" rows={5} cols={30}   value={inventarios.geslab_inventariofinalcomentario}  onChange={handleInputChange}  maxLength="255" />                    
                    </td>
                     </td>                                
                </tr>                
                <tr>
                <td  style={{padding: '5px 120px' }}>{(inventarios.geslab_inventariofinal!=null)?<a href={inventarios.geslab_inventariofinal} target={'_blank'} rel="noreferrer" style={{textDecorationLine : "none"}}> <Button label="Ver" className="p-button-success" /> </a>:<Button label="Ver" className="p-button-success" disabled/>}</td>
                </tr>
                <tr>              
                     <td >  
                         <td  style={{paddingLeft: '30px' }}>
                            <h4>Estado:</h4> 
                         </td>
                           <td  style={{paddingLeft: '10px' }}>
                              <Dropdown id="geslab_inventariofinalestado" value={getEstadoLabel(inventarios.geslab_inventariofinalestado)} options={tiposEstados} onChange={handleInputChange} optionLabel="name" placeholder="Seleccionar Estado" disabled={inventarios.geslab_inventariofinalestado===0}/>                 
                             </td>                  
                        </td>            
                 </tr>
                </tbody>               
            </table>
            </Dialog>

            <Dialog header="Inventario Inicial"  visible={visibleF} footer={footerF} modal={true} style={{width: '900px'}} onHide={()=>setVisibleF(false)}>

<table>
    <tbody>
          <tr>
        <td style={{padding: '10px 10px'}}>
        { (inventarios.geslab_inventarioinicial=== null) ? <img src="/pdfDefault.png" alt="" height='340px' width='280px' /> :  <iframe title="RInicialA" src={ inventarios.geslab_inventarioinicial }  height='335px' width='280px'/> } 
       
           <h4 align='left'>Estado:&nbsp; {getEstadoIFinal(inventarios.geslab_inventarioinicialestado)}</h4> 
        </td>
        
        <td align='center' style={{width: '300px'}}>
                     
            <td style={{paddingTop: '150px'}}/>
            <Button label={(inventarios.geslab_inventarioinicial === null) ? "Subir" : "Cambiar"} className="p-button-success" icon="pi pi-cloud-upload" style={{width: '150px'}} onClick={subirPdf} />
            <td style={{paddingTop: '20px'}}/>
           {(inventarios.geslab_inventarioinicial != null)?<Button label="Eliminar" className="p-button-danger" icon="pi pi-trash" style={{width: '150px'}} onClick={()=>quitarPdf(inventarios.geslab_inventarioinicial)}/>:<Button label="Eliminar" className="p-button-danger" icon="pi pi-trash" style={{width: '150px'}} disabled/>} 
            <td style={{paddingTop: '20px'}}/>            
              <input type="file" id="pdfrepaux" hidden accept=".pdf" onChange={(e)=>{onPdfChange(e)}}></input>
            <td style={{paddingTop: '60px'}}/>
        </td>
        <table>
            <tbody>
                <tr >
                     <td ><h4>Laboratorio:&nbsp;{inventarios.lab_nombre}</h4></td>
                 </tr>
                <tr >
                    <td ><h4>Jefe:&nbsp;{inventarios.user_nombre}</h4></td>                                                   
                 </tr> 
            </tbody>
        </table>
        <table>
               <tbody>
                   <tr>                           
              <td align='center' >
            <h4 align='center'>Comentarios:</h4>
            <td />
            <InputTextarea id="docper_retroalimentacion" rows={5} cols={30} value={inventarios.geslab_inventarioinicialcomentario} disabled/>
        </td>  
            </tr> 
               </tbody>

           
        </table>
        
    </tr>
    </tbody>
  
</table>

</Dialog>

        </div>
    )
}

export default AGestionAuxiliar
