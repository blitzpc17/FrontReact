import React, { useState, useEffect,useContext} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { DepartamentoServicio } from '../../services/Fernando/DepartamentoServicio';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const InnDepartamentos =()=>{

	const navigate = new useNavigate();
	const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    useEffect(() => {
	if(!cookies.get('rolesUsuario').rol_jefe_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Proyectos de Innovación')
                deps.getAll().then(data => setDepartamentos(data));
            else
                navigate('/plataforma/periodosjefeinvestigacion');
        }
        

    }, []); 

    const [departamentos, setDepartamentos] = useState([]);
    const deps = new DepartamentoServicio();

    const actionBodyTemplate = (rowData) => {
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-chevron-right" className="p-button-rounded p-button-info" onClick={() => {
                    cambiarBreadLocal('Gestión Proyectos de innovación');
                    navigate('/plataforma/proyectosinnovacion/'+ rowData.dep_nombre + '/' + rowData.id_Departamento);
                }} />
            </>
            //</React.Fragment>
        );
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/innovacion' });

        cambiarBread(direccionesTemp, lblActual);
    }

    return(
        <div>
            <Panel>
                    <table >                    
                        <tbody>
                            <tr>
                                <td style={{paddingRight: '36rem'}}></td>
                                <td style={{paddingRight: '30rem'}}>                                
                                    <h1>Proyectos de Innovación</h1>           
                                </td>                            
                            </tr>
                        </tbody>
                    </table>
                <DataTable value={departamentos} responsiveLayout="scroll">
                    <Column field="dep_nombre" header="Departamento"></Column>
                    <Column body={actionBodyTemplate} header="Proyectos"></Column>
                </DataTable>
            </Panel>
        </div>
    )

}

export default InnDepartamentos;
