import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Panel } from 'primereact/panel';
import React, { useState, useEffect } from 'react';
import { CEAuxiliarLaboratorio } from '../../../services/ConsultasEspecificas/Alonso/CEAuxiliarLaboratorio';
import { ServicioCubiculo } from '../../../services/Alonso/ServicioCubiculo';
import { MultiSelect } from 'primereact/multiselect';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import swal from 'sweetalert';
import DialogSUbidaDocumentos from '../../../components/Orozco/DialogSUbidaDocumentos';
import Cookies from 'universal-cookie';
import FileService from '../../../services/FileService';


const Cubiculos = (props) => {
    const cEAuxiliarLaboratorio =new CEAuxiliarLaboratorio();
    const servicioCubiculo=new ServicioCubiculo();
    const cookies=new Cookies();
    const fileService=new FileService(); 
    const [cubiculos, setCubiculos] = useState(null);
    const [visible, setVisible] = useState(false);
    const [selectedUsuarios, setSelectedUsuarios] = useState(null);
    const [planta, setPlanta] = useState(null);
    const [value20, setValue20] = useState(1);
    const [usuarios, setUsuarios] = useState(null);
    const [idUsuario, setIdUsuario] = useState(null);
    const [idCubiculo, setIdCubiculo] = useState(null); 
  const [visibleInv, setVisibleInv] = useState(false);
  const [estado, setEstado] = useState(0);

  //parametros de servicios
  const departamento = parseInt(cookies.get('id_Departamento'));
 
    const [cubiculo, setCubiculo] = useState({
            id_cubiculo: null,
            id_usuarios: null,
            cub_nombre: null,
            cub_estado: null,
            cub_inventario: null,
            cub_firmaaceptacion: null
           
    });
    const getEstadoLabel = (estado) => {
        
        switch (estado) {
            case 1:
                return 'Aceptado';
    
            case 2:
                return  'Rechazado';
    
            default:
                return 'Sin Responder';
        }
       
    }
   
    const renderEliminar=(rowData)=> {
        return (
            <>
             {(rowData.cub_estado!==1)?<Button  icon="pi pi-trash" className="p-button-rounded p-button-danger"  onClick={()=>{eliminarFilaInventario(rowData.id_cubiculo)}} />:<Button  icon="pi pi-trash" className="p-button-rounded p-button-danger"   disabled/>} 
            </>
        )}
    const renderEditar=(rowData)=> {
        return (
            <>
             {(rowData.cub_estado!==2)?<Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-mr-2" onClick={()=>{setVisible(true);editarCubiculo(rowData)}} />:<Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-mr-2"  disabled/>} 
            </>
        )}
   const renderSubirInventario=(rowData)=> {
    return (
        <>
         {(rowData.cub_estado===1)?(rowData.cub_inventario!=null)?<Button icon="pi pi-sync" className="p-button-rounded p-button-success p-mr-2" onClick={()=>{setVisibleInv(true);setCubiculo(rowData)}} />:<Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success p-mr-2" onClick={()=>{setVisibleInv(true);setCubiculo(rowData)}} />:<Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success p-mr-2"   disabled/>} 
        </>
    )}
    const  renderFirmaAceptacion=(rowData)=>
   {
    return (
        <>

        {(rowData.cub_firmaaceptacion!=null)?<a href={rowData.cub_firmaaceptacion} target={'_blank'} rel="noreferrer" style={{textDecorationLine : "none"}}> <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  /> </a>: <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  disabled/> }
        </>
    )
   }
   const footer=()=>{
       return <Button label='Guardar' onClick={()=>{asignarUsuario()}}/>
   }
 
 
 
   const asignarUsuario=()=>{
       const temp={
        id_cubiculo: idCubiculo,
        id_usuarios: idUsuario,
        cub_nombre: planta+" "+value20,
        cub_estado: estado,
        cub_inventario: null,
        cub_firmaaceptacion: null
       };
       if(validarCubiculo()!=0){
        for (const key in selectedUsuarios) {
                 
                  temp.id_usuarios=selectedUsuarios[key].code;
                  if(estado===1){
                    cambioEstado(temp);
                  }else{
                    nuevoCubiculo(temp);
                  }
                  
              }
       }
      
   }
   const nuevoCubiculo=(temp)=>{
       
       servicioCubiculo.save(temp).then(data=>{
        swal({
            title: "¡Atención!",
            text: "¡Cubiculo Creado!",
            icon: "success",
            button: "Aceptar",
            timer: "3000"
          });
          setVisible(false);
            limpiarCubiculo();
            setCubiculos(null);                   
            cEAuxiliarLaboratorio.getCubiculosAuxiliar(departamento).then(data=>setCubiculos(data));
      
          
    });
   }
   const cambioEstado=(cubtemp)=>{
    swal({
              title: "¿Se Cambiara el Estado a Sin Responder",
              text: "¡Los cambios no se podrán recuperar!",
              icon: "warning",
              buttons: ["Cancelar","Aceptar"],
              dangerMode: true
            }).then((OK) => {
              if(OK){ 
				cubtemp.cub_estado=0;
				cubtemp.cub_inventario=null;
				cubtemp.cub_firmaaceptacion=null; 			  
                servicioCubiculo.save(cubtemp).then(data=>{
                  swal({
                    title: "¡Atención!",
                    text: "¡Se ha Actualizado el Cubiculo!",
                    icon: "success",
                    button: "Aceptar",
                    timer: "3000"
                  });      
                  setVisible(false);          
                  setCubiculos(null);                  
                  cEAuxiliarLaboratorio.getCubiculosAuxiliar(departamento).then(data=>setCubiculos(data));                                             
                });                
              }else{
                swal({
                  title: "¡Atención!",
                  text: "¡No se ha Cambiado el Estado!",
                  icon: "info",
                  button: "Aceptar",
                  timer: "3000"
                });
              }          
            });          
   }
   const limpiarCubiculo=()=>{
       setSelectedUsuarios(null);
       setPlanta(null);
       setValue20(1);
       setIdCubiculo(null);
       setIdUsuario(null);
       setEstado(0);
   }
   const editarCubiculo=(data)=>{
    let nomcub="";
    let arrayCadena=data.cub_nombre.split(" ");
    let nombreUsuario=[{name:"",code:null}];
    setIdCubiculo(data.id_cubiculo);
   setIdUsuario(data.id_usuarios);
   setEstado(data.cub_estado);  
    for (var i=0; i < arrayCadena.length-1; i++) {
         nomcub+=arrayCadena[i] + " ";       
     }
    
     if(nomcub==='Cubiculo Planta Alta '){
       setPlanta('Cubiculo Planta Alta');  
     }else if(nomcub==='Cubiculo Planta Baja '){
        setPlanta('Cubiculo Planta Baja');  
     }
     
     setValue20(parseInt(arrayCadena[3]));
     for (const key in usuarios) {
         if (data.id_usuarios===usuarios[key].code) {           
            nombreUsuario.push({name:usuarios[key].name,code:usuarios[key].code});
         
         }
     }
     nombreUsuario.shift();     
    setSelectedUsuarios(nombreUsuario);
   }


    const onPdfChange=(file)=>{
      
      var formData = new FormData();
      formData.append('file',file); 
      formData.append('ruta',cookies.get('nombre_Departamento')+'\\'+cubiculo.user_nombre+'\\'+cubiculo.cub_nombre+'\\Inventario'); 
      formData.append('nombrearch',file.name); 
      fileService.upload(formData).then(data=>{
         
          if(data.status===200){                                  
            subirInventario(data.message);
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

    const subirInventario=(inventario)=>{
        cubiculo.cub_inventario=inventario;
        servicioCubiculo.save(cubiculo).then(data=>{
            swal({
                title: "¡Atención!",
                text: "¡Se ha Subido Inventario!",
                icon: "success",
                button: "Aceptar",
                timer: "3000"
              });  
                 setCubiculos(null);
                 setUsuarios(null);
                 cEAuxiliarLaboratorio.getCubiculosAuxiliar(departamento).then(data=>setCubiculos(data));
                 cEAuxiliarLaboratorio.getAuxiliarUsuarios(departamento).then(data=>setUsuarios(data));
                     
        }) 
    }
    const eliminarInvetario=async()=>{     
     
      var bandera=false;
     await swal({
        title: "¿Deseas Eliminar el Archivo?",
        text: "¡Los cambios no se podrán recuperar!",
        icon: "warning",
        buttons: ["Cancelar","Aceptar"],
        dangerMode: true
      }).then((OK) => {
        if(OK){                        
          bandera=true;
         
        }else{
          swal({
            title: "¡Atención!",
            text: "¡No se ha Eliminado el Archivo!",
            icon: "info",
            button: "Aceptar",
            timer: "3000"
          });
       
        }        
      }); 


  if(bandera){
     fileService.delete(cubiculo.cub_inventario).then(data=>{
        
        if(data.status===200){
            swal({
              title: "¡Atención!",
              text: data.message,
              icon: "success",
              button: "Aceptar",
              timer: "3000"
            }); 
           cubiculo.cub_inventario=null;              
              
                servicioCubiculo.save(cubiculo).then(data=>{
                  
                  setCubiculos(null);
                  setUsuarios(null);
                  cEAuxiliarLaboratorio.getCubiculosAuxiliar(departamento).then(data=>setCubiculos(data));
                  cEAuxiliarLaboratorio.getAuxiliarUsuarios(departamento).then(data=>setUsuarios(data));
                 
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
      
  }
     
      
                   
    }
    const eliminarFilaInventario=(id)=>{
       
            swal({
              title: "¿Deseas Eliminar el Cubiculo",
              text: "¡Los cambios no se podrán recuperar!",
              icon: "warning",
              buttons: ["Cancelar","Aceptar"],
              dangerMode: true
            }).then((OK) => {
              if(OK){                                  
            
                servicioCubiculo.delete(id).then(data=>{
                  swal({
                    title: "¡Atención!",
                    text: "¡Se ha Eliminado el Cubiculo!",
                    icon: "success",
                    button: "Aceptar",
                    timer: "3000"
                  });
                
                  setCubiculos(null);
                  setUsuarios(null);
                  cEAuxiliarLaboratorio.getCubiculosAuxiliar(departamento).then(data=>setCubiculos(data));
                  cEAuxiliarLaboratorio.getAuxiliarUsuarios(departamento).then(data=>setUsuarios(data));
                 
               
                });
                
              }else{
                swal({
                  title: "¡Atención!",
                  text: "¡No se ha Eliminado el Cubiculo!",
                  icon: "info",
                  button: "Aceptar",
                  timer: "3000"
                });
              }          
            });          
          
          
    }
    const validarCubiculo=()=>{
      if(planta===null){
        swal({
          title: "¡Atención!",
          text: "¡Elija Planta Alta o Baja!",
          icon: "warning",
          button: "Aceptar",
          timer: "3000"
        });
        return 0
      }
      
      if(selectedUsuarios===null){
        swal({
          title: "¡Atención!",
          text: "¡Elija Usuario(s)!",
          icon: "warning",
          button: "Aceptar",
          timer: "3000"
        });  
        return 0
      }
      
    }
	  const rowTemplate = (rowData) => {
      return cubiculos.indexOf(rowData) + 1;
  }
    useEffect(() => {
        cEAuxiliarLaboratorio.getCubiculosAuxiliar(departamento).then(data=>setCubiculos(data));
        cEAuxiliarLaboratorio.getAuxiliarUsuarios(departamento).then(data=>setUsuarios(data));
    
    }, [])
    return (
        <div>
            <Dialog header="Cubículos" visible={props.visible} modal={true} style={{width: '950px'}} onHide={props.onHide}>
            <div className='card'>
              <div align="right">
                      <Button label='Nuevo Cubiculo' onClick={()=>{setVisible(true);limpiarCubiculo()}}/>
                  </div> 
                <Panel>            
                <DataTable value={cubiculos} scrollable scrollHeight="600px">
                    <Column body={rowTemplate } header={"#"}/>
                    <Column field='cub_nombre'header={"Nombre"}/>
                    <Column field='user_nombre'header={"A Cargo De "}/>
                    <Column body={(rowData)=>getEstadoLabel(rowData.cub_estado)}header={"Estado"}/>
                    <Column body={renderSubirInventario}header={"Subir Inventario"}/>
                    <Column  body={renderFirmaAceptacion} header={"Firma de Aceptación"}/>
                    <Column body={renderEditar}header={"Editar"}/>
                    <Column body={renderEliminar}header={"Eliminar"}/>
                </DataTable>
            </Panel>
            </div>
            
            
            <Dialog header="Nuevo Cubiculo"  visible={visible} footer={footer} modal={true} style={{width: '720px'}} onHide={()=>setVisible(false)} >


            <table>
              <tbody>
                   <tr>
                    <td style={{paddingLeft:'30px'}}><RadioButton  inputId="city1" name="city" value="Cubiculo Planta Alta" onChange={(e) => {setPlanta(e.value)}} checked={planta === 'Cubiculo Planta Alta'} />
                        <label htmlFor="city1">Cubiculo Planta Alta</label>
                        <br/>
                        <br/>
                        <RadioButton  inputId="city2" name="city" value="Cubiculo Planta Baja" onChange={(e) => {setPlanta(e.value)}} checked={planta === 'Cubiculo Planta Baja'} />
                        <label htmlFor="city2">Cubiculo Planta Baja</label>
                        </td>
                        
                    <td style={{paddingLeft:'30px'}}><InputNumber  inputId="vertical" value={value20} onValueChange={(e) => setValue20(e.value)} mode="decimal" showButtons buttonLayout="vertical" style={{width: '50px'}} min={1} max={100} />                              
                    </td>
                    <td>

                    </td>
                    <td style={{paddingLeft:'20px'}}>
                      <center><h4>A Cargo de:</h4></center>  
                    <MultiSelect value={selectedUsuarios} options={usuarios} onChange={(e) => setSelectedUsuarios(e.value)} optionLabel="name" placeholder="Seleccione Usuario(s)" maxSelectedLabels={1} />
        
                    </td>
                </tr>
              </tbody>
             
            </table>         
            </Dialog>
            <DialogSUbidaDocumentos header={"Subir Inventario"} usuario={cubiculo.user_nombre} visible={visibleInv} style={{width: '700px'}}  onHide={()=>setVisibleInv(false)} onChangeInputFile={onPdfChange} urlDoc={cubiculo.cub_inventario} eliminarPDF={eliminarInvetario}/>
          </Dialog>
        </div>
    )
}

export default Cubiculos
