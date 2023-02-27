import React, { useState, useEffect, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Column } from 'primereact/column';

import Cookies from 'universal-cookie';
import { CursoCount } from '../../services/Fernando/CursoCountService';
import { useParams, useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const CatalogoEstadistica = () => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const {depName, iddep} = new useParams();

    const idActivo = parseInt(iddep);

    const [instanciar, setInstanciar] = useState([]);
    const count = new CursoCount(); 

    useEffect(() => {  
        if(!cookies.get('rolesUsuario').rol_jefe_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Gestión de Cursos')
                count.search(idActivo).then(data => setInstanciar(data));
            else{
                navigate('/plataforma/menuvinculacion');
            }
        }      
                 
     },[]);

    const disponibilidad=(rowData)=>{
        if(rowData.curso_Estado == 1){
            return(
                "Disponible"
            )
        }else{
            return(
                "No disponible"
            )
        }
    }

    const visualizacion=(rowData)=>{        
        if(rowData.curso_Visualizacion == 1){
            return(
                <Button icon="pi pi-eye" className="p-button-rounded p-button-success" />
            )
        }else{
            return(
                <Button icon="pi pi-eye-slash" className="p-button-rounded p-button-danger" />
            )
        }
    }
    const renderTemario=(rowData)=>{        
        return(
            <a href={rowData.inst_Temario} target="_blank" style={{textDecorationLine : "none"}}>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />   
            </a>
                
        )
    }
    const instancias=(rowData)=>{ 
        var x = "";
        var x = x + rowData.curso_cantidad_instancia + " Veces";
        return(
            <Button label={x} className="p-button-link" 
                onClick={()=>{
                    cambiarBreadLocal('Instancias Cursos');
                    navigate('/plataforma/infocursos/' + depName + '/' + rowData.id_Curso);
                }}
            />
        )
    }   

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/estadisticacursosjefe/' + depName + '/' + iddep });

        cambiarBread(direccionesTemp, lblActual);
    }

    return (
        <div>
            <Panel>
                <table> 
                    <tbody>                   
                        <tr>
                            <td style={{paddingRight: '25rem'}}></td>
                            <td style={{paddingRight: '5rem'}}>
                                <div className="textoA">{depName}</div>
                                <div className="textoA">Catalogo de Servicios</div>                
                            </td>                            
                        </tr>
                        <tr>
                            <td style={{paddingRight: '25rem'}}></td>
                            <td style={{paddingRight: '35rem'}}></td>
                            <td style={{paddingRight: '5rem'}}>
                                <div><Button label="Exportar Información" onClick={()=>{
                                  cambiarBreadLocal('Exportar Información');
                                  navigate('/plataforma/exportarcursos/'+ depName + '/' + iddep);
                                }}/></div>               
                            </td> 
                        </tr>
                    </tbody>
                </table>
                <br/>
                <DataTable value={instanciar} responsiveLayout="scroll">
                    <Column field="id_Curso" header="#"></Column>
                    <Column field="curso_Nombre_Curso" header="Nombre del Servicio"></Column>
                    <Column field="curso_Tipo" header="Tipo de Servicio"></Column>
                    <Column field={disponibilidad} header="Disponibilidad"></Column>
                    <Column field={visualizacion} header="Visibilidad"></Column>
                    <Column field={renderTemario} header="Temario"></Column>
                    <Column field={instancias} header="Veces Impartidas"></Column>
                </DataTable>
            </Panel>
        </div>
    )
}
export default CatalogoEstadistica;
