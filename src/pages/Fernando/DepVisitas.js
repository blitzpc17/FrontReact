import React, { useState, useEffect, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { DepartamentoServicio } from '../../services/Fernando/DepartamentoServicio';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const DepVisitas = (props) => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    /* Necesita un valor para designar el titulo y la redireccion entre jefe del dep y jefe del servicio social */
    const user = props.dif;

    const [departamentos, setDepartamentos] = useState([]);    
    const SocialProcesos  = new DepartamentoServicio();

    
    useEffect(() => {
        if((props.usuario == 0 && !cookies.get('rolesUsuario').rol_secretaria_vinculacion) || (props.usuario == 1 && !cookies.get('rolesUsuario').rol_jefe_vinculacion))
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Departamentos')
                SocialProcesos.getAll().then(data => setDepartamentos(data));
            else{
                if(props.usuario == 0)
                    navigate('/plataforma/periodosvisitas');
                else
                    navigate('/plataforma/menuvinculacion');
            }
        }
        
    }, []);
    
    const redireccion=(rowData)=>{
        //rowData.dep_nombre
        //rowData.id_Departamento
        return(            
            <Button icon="pi pi-angle-right" className="p-button-rounded p-button-info"
                onClick={() =>{ 
                    if(user == 0){
                        cambiarBreadLocal('Visitas Docentes');
                        navigate('/plataforma/visitasdocente/'+ rowData.dep_nombre + '/' + rowData.id_Departamento);
                    }else{
                        cambiarBreadLocal('Visitas Docentes');
                        navigate('/plataforma/visitasdocentejefe/'+ rowData.dep_nombre + '/' + rowData.id_Departamento);
                    }
                }}
            />
        )
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        if(user == 0)
            direccionesTemp.push({ label: actual, url: '/plataforma/departamentosvisitas' });
        else
            direccionesTemp.push({ label: actual, url: '/plataforma/departamentosvisitasjefe' });

        cambiarBread(direccionesTemp, lblActual);
    }

    const titulo=()=>{
        if(user == 0){
            return(
                <center>
                    <h1>Departamento de Gestión Tecnológica y Vinculación</h1>
                    <h2>Visitas a Empresas</h2>
                </center>
            )
        }else{
            return(
                <center>
                    <h1 className='textoB'>Visitas a Empresas</h1>
                </center>
            )
        }
    }
    return (
        <div>
            <Panel>
                    <center>
                        <table border="0" >                    
                            <tbody>
                                <tr>
                                    <td style={{paddingLeft: '0rem'}}></td>
                                    <td >                                
                                        {titulo()}          
                                    </td>                            
                                </tr>
                            </tbody>
                        </table>
                    </center>
                    <DataTable value={departamentos}  size="small" scrollable  showGridlines >
                        <Column field="dep_nombre" header={"Departamento"} exportable={false} style={{ minWidth: '8rem' }}></Column>                        
                        <Column body={redireccion} header={"Docentes"} exportable={false} style={{ minWidth: '8rem' }}></Column>                    
                    </DataTable>
                </Panel>
        </div>
    )
}

export default DepVisitas
