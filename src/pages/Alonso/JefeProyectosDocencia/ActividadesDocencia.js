import React, {  useState, useEffect,useRef  } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { CEProyectosDocencia } from '../../../services/ConsultasEspecificas/Alonso/CEProyectosDocencia';
import { ServicioActividadDocencia } from '../../../services/Alonso/ServicioActividadDocencia';
import swal from 'sweetalert';
import { Panel } from 'primereact/panel';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';

const cookies=new Cookies();

const ActividadesDocencia = () => {
    const navigate = new useNavigate();
    const cEProyectosDocencia=new CEProyectosDocencia();
    const servicioActividadDocencia=new ServicioActividadDocencia();
    const [data, setData] = useState(null);
    const toast = useRef(null);
    const [nombreDocente, setNombreDocente] = useState("");
 // Parametros para las consultas
 const departamento = parseInt(cookies.get('id_Departamento'));
 const {iddocper} = new useParams();
 const docper = iddocper;
    const tiposEstados = [
        { label: 'Sin Subir', value: 0 },
        { label: 'Completo', value: 1 },
        { label: 'Incompleto', value: 2 },
        { label: 'Subido', value: 3 }
    ];


const getEstadoLabel = (status) => {
    switch (status) {
        case 1:
            return 'Completo';

        case 2:
            return 'Incompleto';
        case 3:
            return   'Subido';

        default:
            return 'Sin Subir';
    }
}

const onRowEditComplete = (e) => {
   
    let _data = [...data];
    let { newData, index } = e;

    _data[index] = newData;

    setData(_data);
   
guardarRetroalimentacion(newData);
    
    
}
const guardarRetroalimentacion=(retro)=>
{
    const temRetro={
        
        id_actividaddocenteperiodo: retro.id_actividaddocenteperiodo,
        id_docper: docper,
        id_actividades_docencia: retro.id_actividades_docencia,
        actdoc_estadocomentario: retro.actdoc_estadocomentario,
        actdoc_comentario: retro.actdoc_comentario,
        actdoc_pdf_actividad:retro.actdoc_pdf_actividad,
        notify: 1
    }
    servicioActividadDocencia.save(temRetro).then(data=>{
      showSuccess();
          setData(null);
          cEProyectosDocencia.getActividadesDocencia(departamento,docper).then(data=>setData(data))
    });
}
const retroalimentacion = (options) => {
    return <InputTextarea value={options.value} onChange={(e) => options.editorCallback(e.target.value)} rows={2} cols={25}  maxLength="255"/>;
}

const editorEstado = (options) => {
    return (
        <Dropdown value={options.value} options={tiposEstados} optionLabel="label" optionValue="value"
            onChange={(e) => onChangeEstado(e,options)} placeholder="Estado Documento"
            itemTemplate={(option) => {
                return <span className={`product-badge status-${option.value}`}>{option.label}</span>
            }} disabled={options.rowData.actdoc_estadocomentario === 0} />
    );
}
const onChangeEstado=(e,options)=>{
  
    if(e.value===3||e.value===0){
        alertaEstado();
    }else{
       options.editorCallback(e.value) 
    }
    
}
const estadoBodyTemplate = (estado) => {
    return getEstadoLabel(estado);
}

const actionBodyTemplate = (rowData) => {
    return (
        <>
                {(rowData.actdoc_pdf_actividad!=null)?<a href={rowData.actdoc_pdf_actividad} target={'_blank'} rel="noreferrer" style={{textDecorationLine : "none"}}> <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  /> </a>: <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  disabled/> }

        </>
    );
}
const showSuccess = () => {
    toast.current.show({severity:'success', summary: 'Retroalimentación', detail:'Guardada', life: 3000});
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
  const rowTemplate = (rowData) => {
    return data.indexOf(rowData) + 1;
}
useEffect(() => {
    if(!cookies.get('rolesUsuario').rol_jefe_proyectos_docencia)
        navigate('/plataforma/menu');
    else{
        if(cookies.get('actualTemp') === 'Actividades en Apoyo a la Docencia'){
            cEProyectosDocencia.getActividadesDocencia(departamento,docper).then(data=>setData(data));
            cEProyectosDocencia.getCNombreDocente(docper).then(data=>setNombreDocente(data[0].docente))
        }
        else
            navigate('/plataforma/periodosjefedocencia');
    }
    
}, []);
   //aqui termina componente
return (
    <div>
        <Toast ref={toast} />     
        <center><h2>Actividades en Apoyo a la Docencia de {nombreDocente}</h2></center>        
        <div className="card">
            <Panel>
                 <DataTable value={data} editMode="row"   dataKey="id" onRowEditComplete={onRowEditComplete} responsiveLayout="scroll">
            <Column body={rowTemplate} header={"ID"}></Column>
                    <Column field={"nombreactividad"} header={"Formato"}></Column>
                    <Column field={"actdoc_estadocomentario"} header={"Estado"} body={(rowData) => estadoBodyTemplate(rowData['actdoc_estadocomentario'])} editor={(options) => editorEstado(options)} style={{ width: '10%' }}></Column>
                    <Column field={"actdoc_comentario"} header={"Retroalimentacion"} editor={(options) => retroalimentacion(options)} style={{ width: '15%' }}></Column>                    
                    <Column body={(rowData) => actionBodyTemplate(rowData)} header={"Documento"}></Column>
                   
                <Column rowEditor headerStyle={{ width: '5%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
            </Panel>
           
        </div>
    </div>
)
}

export default ActividadesDocencia
