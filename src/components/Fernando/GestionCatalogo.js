import React, { useState, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const GestionCatalogo = (props) => {
    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const navigate = new useNavigate();

    const [curso, setCurso] = useState ({
        id_Curso:"",
        id_Departamento:"",
        id_Usuarios:"",
        curso_Nombre:"",
        curso_Tipo:"",
        curso_Cupo:"",
        curso_Horas:"",
        curso_Estado:"",
        curso_Visualizacion:"",
        curso_pdf_Temario:"",        
        curso_fecha_creacion:""
    })

    const [idCurso, setIdCurso] = useState(null);
    const [nombreCurso, setNombreCurso] = useState(null);
    const [tipo, setTipo] = useState(null);
    const [docente,setDocente] = useState(null);
    const [cupo,setCupo] = useState(null);
    const [horas,setHoras] = useState(null);
    const [pdf,setPdf] = useState(null);
    
    const cambioFecha = (rowData) =>{
        let browserType
        if(rowData.curso_fecha_creacion == null){
            browserType = "ERROR";             
        }
        else{
            browserType = rowData.curso_fecha_creacion;             
        }        
        return(
            browserType.slice(0,10)
        )
    }            
    const temario=(rowData)=>{
        return(
            <a href={rowData.curso_pdf_Temario} target="_blank" style={{textDecorationLine : "none"}}>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-success" /> 
            </a> 
        )
    }
    const gestion=(rowData)=>{        
        return(
            <Button icon="pi pi-info" className="p-button-rounded p-button-warning" 
                onClick={()=>{
                    setIdCurso(rowData.id_Curso);
                    setNombreCurso(rowData.curso_Nombre);
                    setTipo(rowData.curso_Tipo);
                    setDocente(rowData.curso_nombre_usuario);
                    setCupo(rowData.curso_Cupo);
                    setHoras(rowData.curso_Horas);
                    setPdf(rowData.curso_pdf_Temario);

                    cambiarBreadLocal('Instancias Cursos');
                    navigate('/plataforma/instanciascursos/'+rowData.id_Curso);
                }}
            />
        )
    } 
    
    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/gestioncursosvinculacion/' + props.departamento + '/' + props.idActiv });

        cambiarBread(direccionesTemp, lblActual);
    }

    var chek = false; 
    var [numero, setNumero] = useState(0);
   
    const booleanSwitch=(valor)=>{
        setNumero(valor ? 1:0);        
    }
    const falso=()=>{
        chek = false;
    }
    const objeto =(rowData)=>{ 
        chek = rowData.curso_Visualizacion == 1;                                
        return(
            <SwitchVisible
                valor={chek}                 
                cambio={booleanSwitch}  
                estado={falso} 
                idCurso={rowData} 
                guardar={props.visibilidad}          
            />
        )  
          
    }
    const mostrarEstado=(rowData)=>{
        return(
            rowData.curso_Estado ? "Disponible":"No Disponible"
        )
    }  
    return (
        <div >
            <Panel>
                <table border="0" > 
                    <tbody>
                        <tr>
                            <td style={{paddingRight: '25rem'}}></td>
                            <td style={{paddingRight: '5rem'}}>
                                <div className="textoA">{props.departamento}</div>
                                <div className="textoA">Catalogo de Servicios</div>                
                            </td>                            
                        </tr>
                    </tbody>
                </table>
                <br/>
                <DataTable value={props.value} responsiveLayout="stack" breakpoint="960px" scrollable selectionMode={props.selectionMode} selection={props.selection}>
                    <Column field="curso_fecha_creacion" header="Fecha de Creación" body={cambioFecha}></Column>
                    <Column field="curso_Nombre" header="Nombre del Servicio"></Column>
                    <Column field="curso_nombre_usuario" header="Docente que lo imparte"></Column>
                    <Column field="curso_Tipo" header="Tipo"></Column>
                    <Column field="curso_Cupo" header="Cupo"></Column>
                    <Column field="curso_Horas" header="Horas"></Column>
                    <Column field={mostrarEstado} header="Estado"></Column>
                    <Column body={temario} header="Temario"></Column>
                    <Column body={gestion} header="Gestion de Servicios"></Column>
                    <Column body={objeto} header="Visibilidad"></Column>
                </DataTable>
            </Panel>
        </div>
    )
}

export default GestionCatalogo;


function SwitchVisible  (props){
    const [checked1, setChecked1] = useState(props.valor);    
    const cambioVisibilidad=()=>{ 
        props.cambio(checked1)   
                                                   
    }
    const guardarVisibilidad=()=>{        
        const curso = {
            ...props.idCurso,
            ["curso_Visualizacion"]:checked1 ? 0:1            
        }

        props.guardar(curso);
    }
    return(
        <div >                        
            <InputSwitch 
            checked={checked1} 
            onChange={(e) => {setChecked1(e.value); cambioVisibilidad(); guardarVisibilidad()            
            }}
            />
        </div>
    )

}
