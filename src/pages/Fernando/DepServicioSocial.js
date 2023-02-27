import React, { useState, useEffect, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { ProcesosDepSocial } from '../../services/Fernando/SocialProsesos';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const DepServicioSocial = (props) => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    /* Necesita un valor para designar el titulo y la redireccion entre jefe del dep y jefe del servicio social */
    const {idPeriodo} = new useParams();

    const idPer = parseInt(idPeriodo);

    const [departamentos, setDepartamentos] = useState([]);
    const SocialProcesos  = new ProcesosDepSocial();

    useEffect(() => {
        if((props.usuario == 0 && !cookies.get('rolesUsuario').rol_jefe_oficina_servicio_social_vinculacion) || (props.usuario == 1 && !cookies.get('rolesUsuario').rol_jefe_vinculacion))
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Departamentos')
                SocialProcesos.search(idPer).then(data => setDepartamentos(data));
            else{
                if(props.usuario == 0)
                    navigate('/plataforma/periodosocial');
                else
                    navigate('/plataforma/menuvinculacion');
            }
        }
        
    }, []);

    const redireccion=(rowData)=>{
        var x = rowData.serv_prosesos + "  Procesos";
        let id = rowData.id_Departamento;
        let nombre = rowData.serv_nombre_departamento
        return(
            <Button label={x} className="p-button-link" 
                onClick={() =>{
                    if(props.usuario == 0){
                        //ServicioInstancias
                        cambiarBreadLocal('Instancias Social');
                        navigate('/plataforma/departamentosocial/'+ nombre + '/' + id);
                    }else{
                        cambiarBreadLocal('Instancias Social');
                        navigate('/plataforma/instanciasocialjefe/'+ nombre + '/' + id);
                    }
                }}
            />
        )
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        if(props.usuario == 0)
            direccionesTemp.push({ label: actual, url: '/plataforma/departamentosocial/' + idPer });
        else
            direccionesTemp.push({ label: actual, url: '/plataforma/departamentosocialjefe/' + idPer });

        cambiarBread(direccionesTemp, lblActual);
    }

    const titulo=()=>{
        if(props.usuario == 0){
            return(
                <h1>Jefe de Oficina de Servicio Social y Desarrollo Comunitario</h1>
            )
        }else{
            return(
                <div>
                    <table border="0">
                        <tbody>
                            <td style={{paddingLeft: '15rem'}}></td>
                            <td>
                                <h1 className='textoB'>Periodos de Gestión</h1>
                                <h2>Servicio Social</h2>
                            </td>
                        </tbody>
                    </table>
                </div>
            )
        }
    }
    return (
        <div>
            <Panel>
                    <table border="0" >                    
                        <tbody>
                            <tr>
                                <td style={{paddingLeft: '20rem'}}></td>
                                <td >                                
                                    {titulo()}          
                                </td>                            
                            </tr>
                        </tbody>
                    </table>
                    <DataTable value={departamentos}  size="small" scrollable  showGridlines >
                        <Column field="serv_nombre_departamento" header={"Departamento"} exportable={false} style={{ minWidth: '8rem' }}></Column>                        
                        <Column field="serv_prosesos" body={redireccion} header={"Procesos"} exportable={false} style={{ minWidth: '8rem' }}></Column>                    
                    </DataTable>
                </Panel>
        </div>
    )
}

export default DepServicioSocial
