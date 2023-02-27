import React, { useState, useEffect, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { ServicioPeriodos } from '../../services/Fernando/ServicioPeriodos';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const ServicioDepSec = (props) => {

    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const [periodos, setPeriodos] = useState([]);
    const servPeriodos = new ServicioPeriodos();

    useEffect(() => {
        
        if((props.usuario == 0 && !cookies.get('rolesUsuario').rol_jefe_oficina_servicio_social_vinculacion) || (props.usuario == 1 && !cookies.get('rolesUsuario').rol_jefe_vinculacion))
            navigate('/plataforma/menu');
        else{
            if(props.usuario == 0)
                cambiarBread([], 'Periodos de Gestión');
            servPeriodos.getAll().then(data => setPeriodos(data));
        }
    }, []); 

    const periodo=(rowData)=>{
        
        var  per="";
        switch(rowData.per_Mes_Inicio){
            case 1:{
                per+="Enero";
                break;
            }
            case 2:{
                per+="Febrero";
                break;
            }
            case 3:{
                per+="Marzo";
                break;
            }
            case 4:{
                per+="Abril";
                break;
            }
            case 5:{
                per+="Mayo";
                break;
            }
            case 6:{
                per+="Junio";
                break;
            }
            case 7:{
                per+="Julio";
                break;
            }
            case 8:{
                per+="Agosto";
                break;
            }
            case 9:{
                per+="Septiembre";
                break;
            }
            case 10:{
                per+="Octubre";
                break;
            }
            case 11:{
                per+="Noviembre";
                break;
            }
            case 12:{
                per+="Diciembre";
                break;
            }
            default:{
                per+="Error";
                break;
            }
        } 

        switch(rowData.per_Mes_Fin){
            case 1:{
                per+="-Enero";
                break;
            }
            case 2:{
                per+="-Febrero";
                break;
            }
            case 3:{
                per+="-Marzo";
                break;
            }
            case 4:{
                per+="-Abril";
                break;
            }
            case 5:{
                per+="-Mayo";
                break;
            }
            case 6:{
                per+="-Junio";
                break;
            }
            case 7:{
                per+="-Julio";
                break;
            }
            case 8:{
                per+="-Agosto";
                break;
            }
            case 9:{
                per+="-Septiembre";
                break;
            }
            case 10:{
                per+="-Octubre";
                break;
            }
            case 11:{
                per+="-Noviembre";
                break;
            }
            case 12:{
                per+="-Diciembre";
                break;
            }
            default:{
                per+="-Error";
                break;
            }
        } 
        return (
            per
        )
    }

    const meslbl = (mes) =>{
        switch(mes){
            case 1: return "ENE";
            case 2: return "FEB";
            case 3: return "MAR";
            case 4: return "ABR";
            case 5: return "MAY";
            case 6: return "JUN";
            case 7: return "JUL";
            case 8: return "AGO";
            case 9: return "SEP";
            case 10: return "OCT";
            case 11: return "NOV";
            case 12: return "DIC";
            default: return "Error";
        }
    }

    const estado =(rowData)=>{        
        if(rowData.per_Estado == 1){
            return("Cursando")
        }else{
            return("Cerrado")
        }
    }
    //----------------------Codigo------------------------------  
    const actionBodyTemplate = (rowData) => {
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-chevron-right" className="p-button-rounded p-button-info" onClick={() => cambiarBreadLocal(rowData)}/>
            </>
            //</React.Fragment>
        );
    }

    const cambiarBreadLocal = (rowData) => {
        cookies.set('id_Periodo', rowData.id_Periodo, {path: "/"});
        cookies.set('lblPeriodo',meslbl(rowData.per_Mes_Inicio) + ' - ' + meslbl(rowData.per_Mes_Fin) + ' ' + rowData.per_Year , {path: "/"});

        let direccionesTemp = direcciones;
        
        if(props.usuario == 0){
            direccionesTemp.push({ label: actual, url: '/plataforma/periodosocial' });
            cambiarBread(direccionesTemp, 'Departamentos');
            navigate('/plataforma/departamentosocial/'+rowData.id_Periodo);
        }
        else{
            direccionesTemp.push({ label: actual, url: '/plataforma/socialjefe' });
            cambiarBread(direccionesTemp, 'Departamentos');
            navigate('/plataforma/departamentosocialjefe/'+rowData.id_Periodo);
        } 
        
    }

    const getTitulo=()=>{
        if(props.usuario == 0){
           return(<h5>Jefe de oficina de servicio social y desarrollo comunitario</h5>);
        }else{
            return(<h3>Periodos de Gestión - Servicio Social</h3>);
        }
    }


    return (
        <div>
            <div className="card">
                <Panel>
                    <table border="0" >  
                        <tbody>                  
                            <tr>
                                <td style={{paddingLeft: '5rem'}}></td>
                                <td colSpan={2} style={{paddingLeft: '20rem'}}>                                
                                    <div className="textoA">{getTitulo()}</div>    
                                    <div className="textoA"></div>            
                                </td>                            
                            </tr>
                        </tbody>
                    </table>
                    <DataTable value={periodos}  size="small" scrollable  showGridlines >
                    <Column field="id_Periodo" body={periodo} header={"Periodo"} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    <Column field="per_Year" header={"Año"} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    <Column body={estado} header={"Estado"} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    <Column body={actionBodyTemplate} header={"Catalogo"} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </Panel>
            </div>
        </div>
    );
}
export default ServicioDepSec;
