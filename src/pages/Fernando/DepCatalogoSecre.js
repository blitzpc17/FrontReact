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

const DepCatalogoSecre = () => {

    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const [departamento, setDepartamento] = useState([]);
    const ServicioDep = new DepartamentoServicio();

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_oficina_servicio_externos_vinculacion)
            navigate('/plataforma/menu');
        else{
            cambiarBread([], 'Cursos por Departamento');
            ServicioDep.getAll().then(data => setDepartamento(data));
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
                cambiarBreadLocal('Gestión Cursos');
                navigate('/plataforma/gestioncursosvinculacion/'+rowData.dep_nombre + '/' + rowData.id_Departamento);
            }} />
            </>
            //</React.Fragment>
        );
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/serviciosexternos' });

        cambiarBread(direccionesTemp, lblActual);
    }


    return (
        <div>
            <div className="card">
                <Panel>
                    <table border="0" >                    
                        <tbody>
                            <tr>
                                <td style={{paddingRight: '30rem'}}></td>
                                <td style={{paddingRight: '5rem'}}>
                                    <div className="textoA">Jefe de Oficina de Servicios Externos</div>
                                    <div className="textoA">Catalogo de Servicios</div>                
                                </td>                            
                            </tr>
                        </tbody>
                    </table>
                    <DataTable value={departamento}  size="small" scrollable  showGridlines >
                    {dynamicColumns}
                    <Column body={actionBodyTemplate} header={"Servicios"} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </Panel>
            </div>
        </div>
    );
}

export default DepCatalogoSecre
