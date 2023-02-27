import React, { useState, useEffect, useContext } from 'react';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ServicioPeriodos } from '../../services/Fernando/ServicioPeriodos';
import { Button } from 'primereact/button';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const PeriodosInvestigacion=()=>{
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const [value, setValue] = useState([]);
    const periodosGet = new ServicioPeriodos();

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_desarrollo_academico_departamental)
            navigate('/plataforma/menu');
        else{
            cambiarBread([], 'Periodos de Gestión');
            periodosGet.getAll().then(data => setValue(data));
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

    const cambiarBreadLocal = (lblActual, rowData) => {
        cookies.set('id_Periodo', rowData.id_Periodo, {path: "/"});
        cookies.set('lblPeriodo',meslbl(rowData.per_Mes_Inicio) + ' - ' + meslbl(rowData.per_Mes_Fin) + ' ' + rowData.per_Year , {path: "/"});

        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/periodosjefeinvestigacion' });

        cambiarBread(direccionesTemp, lblActual);
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
    const convocatorias = (rowData) => {
        return (    
            <Button icon="pi pi-chevron-right" className="p-button-rounded p-button-info" onClick={() => {
                cambiarBreadLocal('Convocatorias', rowData);
                navigate('/plataforma/convocatorias/'+rowData.id_Periodo);
            }} />
        );
    }
    const docencia = (rowData) => {
        return (    
            <Button icon="pi pi-chevron-right" className="p-button-rounded p-button-success" onClick={() => {
                cambiarBreadLocal('Estadístico Docencia', rowData);
                navigate('/plataforma/estadisticodocencia/'+rowData.id_Periodo);
            }} />
        );
    }
    const desTec = (rowData) => {
        return (    
            <Button icon="pi pi-chevron-right" className="p-button-rounded p-button-warning" onClick={() => {
                cambiarBreadLocal('Estadístico Desarrollo Tecnológico', rowData);
                navigate('/plataforma/estadisticotecnologico/'+rowData.id_Periodo);
            }} />
        );
    }

    return(
        <div>
            <center>
                <h1>Periodos de Gestión</h1>
            </center>
            <Panel>
                <DataTable value={value} responsiveLayout="scroll">
                    <Column field="id_Periodo" body={periodo} header={"Periodo"} exportable={false}  style={{ width: '20%'}}></Column>
                    <Column field="per_Year" header={"Año"} exportable={false} style={{ width: '20%'}}></Column>
                    <Column body={estado} header={"Estado"} exportable={false} style={{ width: '10%'}}></Column>
                    <Column body={convocatorias} header={"Convocatorias"} exportable={false} style={{ width: '10%'}}></Column>
                    <Column body={docencia} header={"Estadistico Docencia"} exportable={false} style={{ width: '15%'}}></Column>
                    <Column body={desTec} header={"Estadistico Desarrollo Tecnologico"} exportable={false} style={{ width: '15%'}}></Column>
                </DataTable>
            </Panel>
        </div>
    )
}

export default PeriodosInvestigacion;