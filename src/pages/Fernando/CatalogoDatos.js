import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InfoCurso } from '../../services/Fernando/InfoServicioCurso';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const CatalogoDatos = (props) => {

    const navigate = new useNavigate();

    const {depName, idcurso} = new useParams();

    const idCursoFinal = parseInt(idcurso);

    const [instancia, setInstancia] = useState([]);
    const infCurso = new InfoCurso();

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Instancias Cursos')
                infCurso.search(idCursoFinal).then(data => setInstancia(data));
            else{
                navigate('/plataforma/menuvinculacion');
            }
        }
         //Necesita id de un curso
    }, []); 

    const renderTemario=(rowData)=>{        
        return(
            <a href={rowData.inst_Temario} target="_blank" style={{textDecorationLine : "none"}}>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />   
            </a>
                
        )
    }
    return (
        <div>
            <Panel>
                <table border="0" ><tbody>
                    <tr>
                        <td style={{paddingRight: '35rem'}}></td>
                        <td style={{paddingRight: '25rem'}}>
                            <div className="textoA">Departamento de {depName}</div>
                            <div className="textoA">Catalogo de Servicios</div>                
                        </td>                            
                    </tr>
                </tbody></table>
                <br/>
                <div className="card">
                    <DataTable value={instancia} responsiveLayout="scroll">
                        <Column field="id_Instancia" header="#"></Column>
                        <Column field="inst_Nombre_Curso" header="Nombre Servicio"></Column>
                        <Column field="inst_docente_imparte" header="Docente que lo Imparte"></Column>
                        <Column field="inst_Tipo" header="Tipo de Servicio"></Column>
                        <Column field="inst_Cupo" header="Cupo"></Column>
                        <Column field="inst_Horas" header="Horas"></Column>
                        <Column field="inst_Empresa" header="Empresa a Impartir"></Column>
                        <Column field="inst_Asistentes" header="No. de Asistentes"></Column>
                        <Column field="inst_Periodo" header="Periodo en que se Impartio"></Column>
                        <Column field={renderTemario} header="Temario"></Column>                        
                    </DataTable>
                </div>
            </Panel>
        </div>
    )
}

export default CatalogoDatos
