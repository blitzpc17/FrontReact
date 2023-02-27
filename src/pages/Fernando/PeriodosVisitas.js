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

const PeriodosVisitas = (props) => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const [periodos, setPeriodos] = useState([]);
    const servPeriodos = new ServicioPeriodos();

    const usuario = props.dif;//Generar al iniciar sesion 0 - secretaria
    
    useEffect(() => {
        if((usuario == 0 && !cookies.get('rolesUsuario').rol_secretaria_vinculacion) || (usuario == 1 && !cookies.get('rolesUsuario').rol_jefe_vinculacion))
            navigate('/plataforma/menu');
        else{
            if(usuario == 0)
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

    const estado =(rowData)=>{        
        if(rowData.per_Estado == 1){
            return("Cursando")
        }else{
            return("Cerrado")
        }
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

    //----------------------Codigo------------------------------  
    const actionBodyTemplate = (rowData) => {
        return (           
                <center>
                    <Button icon="pi pi-chevron-right" className="p-button-rounded p-button-success" onClick={() => {
                        cambiarBreadLocal(rowData);
                    }} />
                </center>            
        );
    }

    const cambiarBreadLocal = (rowData) => {
        cookies.set('id_Periodo', rowData.id_Periodo, {path: "/"});
        cookies.set('lblPeriodo',meslbl(rowData.per_Mes_Inicio) + ' - ' + meslbl(rowData.per_Mes_Fin) + ' ' + rowData.per_Year , {path: "/"});

        let direccionesTemp = direcciones;
        if(usuario == 0)
            direccionesTemp.push({ label: actual, url: '/plataforma/periodosvisitas' });
        else
            direccionesTemp.push({ label: actual, url: '/plataforma/periodosvisitasjefe' });

        cambiarBread(direccionesTemp, 'Departamentos');

        if(usuario == 0)
            navigate('/plataforma/departamentosvisitas');
        else
            navigate('/plataforma/departamentosvisitasjefe');
        
    }


    const getTitulo=()=>{
        if(usuario == 0){
           return(<h5>Secretaria Departamento de Gestión Tecnológica y Vinculación</h5>);
        }else{
            return(<h3>Periodos de Gestión - Visitas a Empresas</h3>);
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
                    <Column body={actionBodyTemplate} header={"Visitas a Empresas"} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </Panel>
            </div>
        </div>
    );
}

export default PeriodosVisitas
