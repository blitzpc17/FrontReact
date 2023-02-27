import React, { useState, useEffect, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import Cookies from 'universal-cookie';
import { DepartamentoServicio } from '../../services/Fernando/DepartamentoServicio';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const DepCatalogoJefe = () => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const [variable, setVariable] = useState([]);
    const variabilidad = new DepartamentoServicio();

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Departamentos')
                variabilidad.getAll().then(data => setVariable(data));
            else{
                navigate('/plataforma/menuvinculacion');
            }
        }
        
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
   //-----------------Columnas a modificar------------------------
        
   const columns = [
    {field: 'dep_nombre', header: 'Departamento'}       
    ];


    //----------------------Codigo------------------------------  



    const dynamicColumns = columns.map((col,i) => {
        return <Column key={col.field} field={col.field} header={col.header} />;
    });


    const actionBodyTemplate = (rowData) => {
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-chevron-right" className="p-button-rounded p-button-info" onClick={() => {
                    cambiarBreadLocal('Gestión de Cursos');
                    navigate('/plataforma/estadisticacursosjefe/'+ rowData.dep_nombre + '/' + rowData.id_Departamento);
                }} />
            </>
            //</React.Fragment>
        );
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/departamentoscursosjefe' });

        cambiarBread(direccionesTemp, lblActual);
    }

    return (
        <div>
            <div className="card">
                <Panel>
                    <table >                    
                        <tbody>
                            <tr>
                                <td style={{paddingRight: '36rem'}}></td>
                                <td style={{paddingRight: '30rem'}}>                                
                                    <div className="textoA">Catalogo de Servicios</div>    
                                    <div className="textoA"></div>            
                                </td>                            
                            </tr>
                        </tbody>
                    </table>
                    <DataTable value={variable}  size="small" scrollable  showGridlines >
                    {dynamicColumns}
                    <Column body={actionBodyTemplate} header={"Servicios"} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </Panel>
            </div>
        </div>
    );
}

export default DepCatalogoJefe
