import React, { useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const MensajesDep = (props) => {    

    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const renderMensajes=(rowData)=>{
        return(
            <Button className="p-button-rounded p-button-success" 
            icon="pi pi-arrow-right"
            onClick={()=>{                
                cambiarBreadLocal(rowData);          
            }}
            />
        )
    }

    const cambiarBreadLocal = (rowData) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/mensajesvinculacion' });

        cambiarBread(direccionesTemp, 'Gestión Mensajes');

        navigate('/plataforma/gestionmensajes/' + rowData.id_Departamento + '/' + rowData.dep_nombre);
        
    }
    return (
        <div className="card">            
            <Panel>                
                <table border="0" >                    
                    <tbody>
                        <tr>
                            <td style={{paddingRight: '30rem'}}></td>
                            <td style={{paddingRight: '5rem'}}>
                                <div className="textoA">MENSAJES POR DEPARTAMENTO</div>                
                            </td>
                            <td>
                                <Button 
                                    label="Nuevo" 
                                    className="p-button-warning"
                                    onClick={() => {props.ver()}}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br/>
                <DataTable value={props.value}  size="small" scrollable  showGridlines >
                    <Column field="dep_nombre" header="Departamento" ></Column>
                    <Column body={renderMensajes} header="Mensajes" ></Column>                    
                </DataTable>
            </Panel>
        </div>
        
    )
}

export default MensajesDep
