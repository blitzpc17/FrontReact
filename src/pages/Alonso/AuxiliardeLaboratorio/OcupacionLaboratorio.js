
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useState, useEffect } from 'react';
import { ServicioOcupacionLaboratorio } from '../../../services/Alonso/ServicioOcupacionLaboratorio';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
import swal from 'sweetalert';
import { MultiSelect } from 'primereact/multiselect';
import { CEAuxiliarLaboratorio } from '../../../services/ConsultasEspecificas/Alonso/CEAuxiliarLaboratorio';
import { Dropdown } from 'primereact/dropdown';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { CEJefeLaboratorio } from '../../../services/ConsultasEspecificas/Alonso/CEJefeLaboratorio';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const OcupacionLaboratorio = () => {
    const navigate = new useNavigate();

    const servicioOcupacionLaboratorio=new ServicioOcupacionLaboratorio();
    const cEAuxiliarLaboratorio=new CEAuxiliarLaboratorio();
    const cEJefeLaboratorio=new CEJefeLaboratorio();
    const [oculabs, setOculabs] = useState(null);
    const [visiblePP, setVisiblePP] = useState(false);
    const [visibleVP, setVisibleVP] = useState(false);
    const [visibleE, setVisibleE] = useState(false);
    const [checked1, setChecked1] = useState(false);
    const [date6, setDate6] = useState(null);
    const [validarPractica, setValidarPractica] = useState(null);
    const [seleccionPracticas, setSeleccionPracticas] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [selectFechaI, setSelectFechaI] = useState(new Date());
    const [selectFechaF, setSelectFechaF] = useState(null);
    const [selectHoraI, setSelectHoraI] = useState(null);
    const [selectHoraF, setSelectHoraF] = useState(null);
    const [selectHoraI2, setSelectHoraI2] = useState("00:00:00");
    const [selectHoraF2, setSelectHoraF2] = useState("23:59:59");
    const [fecha, setFecha] = useState(null);
    const [ocupacionIndividual, setOcupacionIndividual] = useState(null);
    const [estadisticos, setEstadisticos] = useState(null);
    const [nombreLaboratorio, setNombreLaboratorio] = useState("");

    //parametros de servicios
   const {idlab, gestlab} = new useParams();
    const idLaboratorio = parseInt(idlab);
    const gestionLaboratorio = parseInt(gestlab);
    
	//nuevos cambios para Eliminar
    const [visibleEP, setVisibleEP] = useState(false);
    const [pracEli, setPracEli] = useState(null);
    const [fechaEliminar, setFechaEliminar] = useState(null);
    const [fechaElimSelec, setfechaElimSelec] = useState(null);
    const [selectPracElim, setSelectPracElim] = useState(null);
   
	
    const estado = 2;
    const horas = [
        
        { name: '01:00:00', code: '1' },
        { name: '01:30:00', code: '2' },
        { name: '02:00:00', code: '3' },
        { name: '02:30:00', code: '4' },
        { name: '03:00:00', code: '5' },
        { name: '03:30:00', code: '6' },
        { name: '04:00:00', code: '7' },
        { name: '04:30:00', code: '8' },
        { name: '05:00:00', code: '9' },
        { name: '05:30:00', code: '10' },
        { name: '06:00:00', code: '11' },
        { name: '06:30:00', code: '12' },
        { name: '07:00:00', code: '13' },
        { name: '07:30:00', code: '14' },
        { name: '08:00:00', code: '15' },
        { name: '08:30:00', code: '16' },
        { name: '09:00:00', code: '17' },
        { name: '09:30:00', code: '18' },
        { name: '10:00:00', code: '19' },
        { name: '10:30:00', code: '20' },
        { name: '11:00:00', code: '21' },
        { name: '11:30:00', code: '22' },
        { name: '12:00:00', code: '23' },
        { name: '12:30:00', code: '24' },
        { name: '13:00:00', code: '25' },
        { name: '13:30:00', code: '26' },
        { name: '14:00:00', code: '27' },
        { name: '14:30:00', code: '28' },
        { name: '15:00:00', code: '29' },
        { name: '15:30:00', code: '30' },
        { name: '16:00:00', code: '31' },
        { name: '16:30:00', code: '32' },
        { name: '17:00:00', code: '33' },
        { name: '17:30:00', code: '34' },
        { name: '18:00:00', code: '35' },
        { name: '18:30:00', code: '36' },
        { name: '19:00:00', code: '37' },
        { name: '19:30:00', code: '38' },
        { name: '20:00:00', code: '39' },
        { name: '20:30:00', code: '40' },
        { name: '21:00:00', code: '41' },
        { name: '21:30:00', code: '42' },
        { name: '22:00:00', code: '43' },
        { name: '22:30:00', code: '44' },
        { name: '23:00:00', code: '45' },
        { name: '23:30:00', code: '46' },
        { name: '00:00:00', code: '47' },
        { name: '00:30:00', code: '48' }
    ];
    const getEstadoLabel = (estado) => {
        
        switch (estado) {
            case 0:
                return 'Programadas';
            case 1:
                return 'Realizadas';
    
            case 2:
                return  'No Realizadas';
    
            default:
                return 'No Realizadas';
        }
       
    }
    const footer=()=>{
      return  <Button label='Guardar Practica' onClick={()=>{guardarPractica()}}/> 
    }
    const footerVP=()=>{
        return  <Button label='Validar' onClick={()=>practicaRealizada()}/> 
      }
   const footerEP=()=>{
        return  <Button label='Eliminar' onClick={()=>{eliminarPracticas()}}/> 
      }
    const asignarFecha=(fecha)=>{
        let dia=fecha.getDate();
        let mes=fecha.getMonth()+1;
        let año=fecha.getFullYear();
    
        if(dia>0&&dia<10)
        dia="0"+dia;
        if(mes>0&&mes<10)
        mes="0"+mes;
      
    return año+"-"+mes+"-"+dia;
   
    }
    
    
  
    const guardarPractica=()=>{
       if(!titulo.trim()){
           swal({
            title: "¡Atención!",
            text: "¡Debe Ingresar un Titulo!",
            icon: "warning",
            button: "Aceptar",
            timer: "3000"
          });
 
       }else{
        
if(selectFechaI!=null&&selectFechaF!=null&&selectHoraI!=null&&selectHoraF!=null){
            const pract={
            id_ocupacionlaboratorio:null ,
            id_gestionlaboratorio: gestionLaboratorio,
            oculab_titulo: titulo+" (Sin Realizar)",
            oculab_estado: 2,
            oculab_fechahorainicio:checked1===true ?asignarFecha(selectFechaI)+"T"+selectHoraI:asignarFecha(selectFechaI)+"T"+selectHoraI2,
            oculab_fechahoratermino: checked1 ===true?asignarFecha(selectFechaF)+"T"+selectHoraF:asignarFecha(selectFechaF)+"T"+selectHoraF2
        };
           servicioOcupacionLaboratorio.save(pract).then(data=>{
           limpiarProgramarPrac();
            setVisiblePP(false);
            swal({
                title: "¡Atención!",
                text: "¡Practica Guardada!",
                icon: "success",
                button: "Aceptar",
                timer: "3000"
              });
              cEAuxiliarLaboratorio.getOcupacionAuxiliar(gestionLaboratorio).then(data=>{setOculabs(data);correcionFechaEliminar(data)});
              cEAuxiliarLaboratorio.getOcupacionIndividual(gestionLaboratorio).then(data=>setOcupacionIndividual(data)); 
              cEAuxiliarLaboratorio.getEstadisticoAuxiliar(gestionLaboratorio).then(data=>setEstadisticos(data));
        }); 
       }else{
        swal({
            title: "¡Atención!",
            text: "¡Falta Rango de Fechas o Horas",
            icon: "info",
            button: "Aceptar",
            timer: "3000"
          });
       }
       
       
       }
       
      
    }
    const validarPracticas=()=>{
        
      const  practicas=[{name:"",code:null}];
       
        for (const key in validarPractica) {
           practicas.push({name:validarPractica[key].oculab_titulo+" "+validarPractica[key].oculab_fechahorainicio,code:validarPractica[key].id_ocupacionlaboratorio})
        }
        practicas.shift();
        
        return practicas;
      
    }
    const buscarFecha=(fechatem)=>{
        setFecha(fechatem);
     
        cEAuxiliarLaboratorio.getValidarPractica(gestionLaboratorio,fechatem).then(data=>setValidarPractica(data));

      
    }
	const buscarFechaEliminar=()=>{
        
        let fecharecortada="";
        let fechatemp=fechaElimSelec;
        const  practicas=[{name:"",code:null}];
     for (const key in oculabs) {
        fecharecortada=oculabs[key].start.substring(0,10); 
        if(fechatemp==fecharecortada)
        {
           practicas.push({name:oculabs[key].title+" "+fecharecortada,code:oculabs[key].id}) 
            
        }
       
     }
     practicas.shift();
    
     
     return practicas;
    }
	  const eliminarPracticas=()=>{
        swal({
            title: "¿Deseas Eliminar la(s) Practica(s)?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
          }).then((OK) => {
            if(OK){
                if(selectPracElim!=null){
                    for (const key in selectPracElim) {
                          
                            eliminarPractica(selectPracElim[key].code);
                        
                    }
                    }else{
                        swal({
                            title: "¡Atención!",
                            text: "¡Seleccione Practica(s)!",
                            icon: "info",
                            button: "Aceptar",
                            timer: "3000"
                          });
                    }
            }else{
              swal({
                title: "¡Atención!",
                text: "¡No se han Eliminado las Practica(s)!",
                icon: "info",
                button: "Aceptar",
                timer: "3000"
              });
            }
      
          });
    }
	 const eliminarPractica=(id)=>{
        servicioOcupacionLaboratorio.delete(id).then(data=>{
            swal({
                title: "¡Atención!",
                text: "¡Practica(s) Eliminada(s)!",
                icon: "success",
                button: "Aceptar",
                timer: "3000"
            });
            setFechaEliminar(null);
            setfechaElimSelec(null);
            setSelectPracElim(null); 
           setVisibleEP(false);
                     setDate6(null) ;
                     setOculabs(null);
                     cEAuxiliarLaboratorio.getOcupacionAuxiliar(gestionLaboratorio).then(data=>{setOculabs(data);correcionFechaEliminar(data)});
                     cEAuxiliarLaboratorio.getValidarPractica(gestionLaboratorio,fecha).then(data=>setValidarPractica(data));
                     cEAuxiliarLaboratorio.getOcupacionIndividual(gestionLaboratorio).then(data=>setOcupacionIndividual(data)); 
                     cEAuxiliarLaboratorio.getEstadisticoAuxiliar(gestionLaboratorio).then(data=>setEstadisticos(data));
        })
    }
	const dateTemplateEliminar = (date) => {
         
        if (diasOcupadosEliminar(date.year,date.month,date.day)===1) {
            
            return (
                <strong style={{ textDecoration: 'line-through' }}>{date.day}</strong>
            );
        }

        return date.day;
    }
	  const diasOcupadosEliminar=(year,month,day)=>{
               
        let fechaComp=year+"-"+month+"-"+day;
       
        for (const iterator of pracEli) {
          
            if(iterator==fechaComp)
            return 1;
        }
        

 
    }
	const onChangeBuscarFechaEliminar=(e)=>{
       
        if(e.target.value!=null){
           
            setFechaEliminar(e.target.value);
            setfechaElimSelec(asignarFecha(e.target.value));
            
        }
           
        }
		 const correcionFechaEliminar=(data)=>{
       if(data!=null){
           const fechainicio=[];
       let fech="";
       
       for (const key in data) {
        fech=data[key].start.substring(0,10)
           fechainicio.push(fech);
          
       }
 
     
     const fechafinal=[];
      for (const iterator of fechainicio) {
          fechafinal.push(iterator.split("-"));
      }
       
   
      const fechaFinalActulizada=[];
      let tempfechames=0;
      let tempfechadia=0;
      for (let i = 0; i < fechafinal.length; i++) {
      for (let j = 0; j < fechafinal[i].length; j++) {
            
            tempfechames=parseInt(fechafinal[i][1])-1;
            tempfechadia=parseInt(fechafinal[i][2]);
             fechaFinalActulizada.push(fechafinal[i][0]+"-"+tempfechames+"-"+tempfechadia);
             
        }
          
      }
      const dataFecha=new Set(fechaFinalActulizada);
     let result=[...dataFecha];
     
       setPracEli(result);
       }
       
   }
		
    const practicaRealizada=()=>{
        
        if(seleccionPracticas!=null){
        for (const key in seleccionPracticas) {
            for (const i in validarPractica) {
               if (seleccionPracticas[key].code===validarPractica[i].id_ocupacionlaboratorio) {
                validarPractica[i].oculab_titulo= validarPractica[i].oculab_titulo.replace('Sin Realizar','Realizada');
                validarPractica[i].oculab_estado=1;
                validarPractica[i].oculab_fechahorainicio=correccionFecha(validarPractica[i].oculab_fechahorainicio);
                validarPractica[i].oculab_fechahoratermino =correccionFecha(validarPractica[i].oculab_fechahoratermino);
                
                
                
                guardarEstadoPractica(validarPractica[i]);
            }
            
            }
        }
        }else{
            swal({
                title: "¡Atención!",
                text: "¡Seleccione Practica(s)!",
                icon: "info",
                button: "Aceptar",
                timer: "3000"
              });
        }
        
    }
    const guardarEstadoPractica=(cmbpractica)=>{
        
            servicioOcupacionLaboratorio.save(cmbpractica).then(data=>{
             swal({
                 title: "¡Atención!",
                 text: "¡Practica Realizada(s)!",
                 icon: "success",
                 button: "Aceptar",
                 timer: "3000"
               });
                     setSeleccionPracticas(null);    
                     setDate6(null) ;
                     setOculabs(null);
                     cEAuxiliarLaboratorio.getOcupacionAuxiliar(gestionLaboratorio).then(data=>{setOculabs(data);correcionFechaEliminar(data)});
                     cEAuxiliarLaboratorio.getValidarPractica(gestionLaboratorio,fecha).then(data=>setValidarPractica(data));
                     cEAuxiliarLaboratorio.getOcupacionIndividual(gestionLaboratorio).then(data=>setOcupacionIndividual(data)); 
                     cEAuxiliarLaboratorio.getEstadisticoAuxiliar(gestionLaboratorio).then(data=>setEstadisticos(data));
         }); 
       
    }
    const correccionFecha=(cadena)=>{
        const ncadena=cadena.split(" ");
        

        return ncadena[0]+"T"+ncadena[1];
    }
   
    const onHoraChangeI = (e) => {
        setSelectHoraI(e.value);
        setSelectHoraI2(e.value.name); 
       
        
    }
    const onHoraChangeF = (e) => {
        setSelectHoraF(e.value);       
        setSelectHoraF2(e.value.name);
        
       
    }
    const verificarDia=(e)=>{
       controlHoras(e.value);
    }
    const controlHoras=(valor)=>{
        if(valor===true){
            document.getElementById('dropIni').style.display='none';
            document.getElementById('dropFin').style.display='none';
            setSelectHoraI("00:00:00");
            setSelectHoraF("23:59:00");
        }
        if(valor===false){
            document.getElementById('dropIni').style.display='block';
            document.getElementById('dropFin').style.display='block';
        }
    }
    const limpiarProgramarPrac=()=>{
        setTitulo("");
        setSelectHoraF(null);
        setSelectHoraI(null);
        setSelectFechaI(new Date());
        setSelectFechaF(null);
        setSelectHoraF2("23:59:59");
        setSelectHoraI2("00:00:00");
        setChecked1(false);
        controlHoras(false);
    }
    const dateTemplate = (date) => {
         
        if (diasOcupados(date.year,date.month,date.day)===1) {
            
            return (
                <strong style={{ textDecoration: 'line-through' }}>{date.day}</strong>
            );
        }

        return date.day;
    }
    const diasOcupados=(year,month,day)=>{
               
        let fechaComp=year+"-"+month+"-"+day;
           const unionFecha=[{fecha:""}];
           for (const key in ocupacionIndividual) {
              unionFecha.push({fecha:ocupacionIndividual[key].año+"-"+(ocupacionIndividual[key].mes-1)+"-"+ocupacionIndividual[key].dia})
           } 
           unionFecha.shift();
           

        for (const key in unionFecha) {
            if (unionFecha[key].fecha===fechaComp) {
            return 1;
                
            }
        }

 
    }
    const colorEstadistico=(rowData)=>{
        if(rowData.practicas===0){
            return   <h2 style={{color:'#FB8E02'}}>{rowData.total }</h2>
           }
        if(rowData.practicas===1){
         return   <h2 style={{color:'#2DDC04'}}>{rowData.total }</h2>
        }
        if(rowData.practicas===2){
          return  <h2 style={{color:'#FF0000'}}>{rowData.total }</h2>
        }
    }
   
    const onChangeBuscarFecha=(e)=>{
       
    if(e.target.value!=null){
        setDate6(e.target.value);
        buscarFecha(asignarFecha(e.target.value));
    }
       
    }
    useEffect(() => {

        if(!cookies.get('rolesUsuario').rol_auxiliar_laboratorio)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Ocupación de Laboratorio'){
                cEAuxiliarLaboratorio.getOcupacionAuxiliar(gestionLaboratorio).then(data=>{setOculabs(data);correcionFechaEliminar(data)});
                cEAuxiliarLaboratorio.getOcupacionIndividual(gestionLaboratorio).then(data=>setOcupacionIndividual(data)); 
                cEAuxiliarLaboratorio.getEstadisticoAuxiliar(gestionLaboratorio).then(data=>setEstadisticos(data));
                cEJefeLaboratorio.getNombreLabUser(idLaboratorio).then(data=>{setNombreLaboratorio(data[0].lab_nombre);})
            }
            else
                navigate('/plataforma/gestionauxiliarlab');
        } 
    
        
    }, [])
    return (
        <div>
           
            <center><h2>Ocupacion de {nombreLaboratorio}</h2></center>
            <div align="right"> 
            <table>
                <tbody>
                    <tr >
                        <td style={{padding:'10px 10px 20px'}} >
                          <Button label='Programar Practicas' onClick={()=>{setVisiblePP(true)}} />
                        </td>
                        <td style={{padding:'10px 10px 20px'}}>
                          <Button label='Validar Practicas' className="p-button-success" onClick={()=>{setVisibleVP(true)}}/>

                        </td>
                        <td style={{padding:'10px 10px 20px'}}>
                            <Button label='Eliminar Practicas' className='p-button-danger' onClick={()=>{setVisibleEP(true)}}></Button>
                        </td>

                        <td style={{padding:'10px 10px 20px'}}> 
                            <Button label='Estadisticas'className="p-button-warning" onClick={()=>{setVisibleE(true)}} />

                        </td>
                    </tr>
                </tbody>
                </table>       
       
            </div>             
            <FullCalendar events={oculabs} initialView='dayGridMonth' plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }} editable selectable selectMirror dayMaxEvents />
            <Dialog header="Programar Practica"  visible={visiblePP} footer={footer} modal={true} style={{width: '950px'}} onHide={()=>setVisiblePP(false)}>      
                        
                               <span className="p-input-icon-left"> <InputText  value={titulo} onChange={(e)=>setTitulo(e.target.value)} placeholder="Agrega un título" className="p-inputtext-lg p-d-block" size={72}/> <i className="pi pi-pencil" maxLength="255" /> </span>                                           
                   
                    <table>
                       <tbody>
                        
                           <tr>                         
                            <td><i className="pi pi-clock" style={{'fontSize': '2em'}}/> </td>
                            <td><Calendar id="icon" value={selectFechaI} onChange={(e) => {setSelectFechaI(e.value);setSelectFechaF(e.value)}} showIcon /></td>
                            <td><div id="dropIni"><Dropdown value={selectHoraI} options={horas} onChange={onHoraChangeI} optionLabel="name" placeholder="Seleccione hora" /></div>
                   </td>
                   <td> <i className="pi pi-arrow-right" style={{'fontSize': '2em'}}/> </td>
                            <td> <Calendar id="icon" value={selectFechaF} onChange={(e) => setSelectFechaF(e.value)} showIcon />
                   </td>
                            <td><div id="dropFin"><Dropdown value={selectHoraF} options={horas} onChange={onHoraChangeF} optionLabel="name" placeholder="Seleccione hora" /></div>
                       </td>
                       <td><label>Todo el Dia</label>  <InputSwitch  checked={checked1} onChange={(e) => {setChecked1(e.value);verificarDia(e)}} />        
                    
                    </td>
                        </tr>
                       </tbody>
                        
                    </table>

            </Dialog>

        <Dialog header="Validar Practicas"  visible={visibleVP} footer={footerVP} modal={true} style={{width: '750px'}} onHide={()=>setVisibleVP(false)}>

        <table  >
            <tbody>
                <tr>    
                <td style={{paddingLeft:'30px'}}>
                    <h4> <label>Seleccione una fecha: </label></h4>     
                                    <Calendar id="navigators" value={date6} onChange={(e) => {onChangeBuscarFecha(e)}}  dateTemplate={dateTemplate} showIcon />
                                    
                </td>
                <td></td>
                <td style={{paddingLeft:'30px'}}>
                    <h4> <label>Practicas: </label></h4>      
                                    <MultiSelect value={seleccionPracticas} options={validarPracticas()} onChange={(e) => setSeleccionPracticas(e.value)} optionLabel="name" placeholder="Seleccione Practica´s Realizada´s" maxSelectedLabels={1} />

                </td>
                
            </tr>
            </tbody>
            
        </table>

        </Dialog>
		  <Dialog header="Eliminar Practicas"  visible={visibleEP}  footer={footerEP} modal={true} style={{width: '800px'}} onHide={()=>setVisibleEP(false)}>
        <table  >
            <tbody>
                <tr>    
                <td style={{paddingLeft:'30px'}}>
                    <h4> <label>Seleccione una fecha: </label></h4>     
                    <Calendar id="navigators" value={fechaEliminar} onChange={(e) => {onChangeBuscarFechaEliminar(e)}}  dateTemplate={dateTemplateEliminar} showIcon />                                    
                </td>                
                <td>
                 </td>
                <td style={{paddingLeft:'30px'}}>
                    <h4> <label>Practicas: </label></h4>      
                        <MultiSelect value={selectPracElim} options={buscarFechaEliminar()} onChange={(e) => setSelectPracElim(e.value)} optionLabel="name" placeholder="Seleccione Practica(s) a Eliminar" maxSelectedLabels={1} />
                </td>             
            </tr>           
            </tbody>            
        </table>

        </Dialog>
        <Dialog header="Estadisticos"  visible={visibleE}  modal={true} style={{width: '650px'}} onHide={()=>setVisibleE(false)}>
        <div className='card'>
                <Panel>
                    <DataTable value={estadisticos}>
                      
                        <Column body={(rowData=>getEstadoLabel(rowData.practicas))} header='Practicas'/>                                  
                        <Column body={(rowData)=>colorEstadistico(rowData)} header='Total'/>                                           
                    </DataTable>              
                 </Panel>
           </div>
        </Dialog>
         </div>
    )
}

export default OcupacionLaboratorio
