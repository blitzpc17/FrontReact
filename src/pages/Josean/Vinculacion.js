import React from 'react'

import { useState, useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { ServicioConsultaP1 } from '../../services/Josean/ServicioConsultaP1';
import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const Vinculacion = () => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const [periodos, setPeriodos] = useState(null);

    var servicioconsP1 = new ServicioConsultaP1();

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Vinculación'){
                servicioconsP1.search().then(data => setPeriodos(data));
            }
            else
                navigate('/plataforma/menudepartamental');
        }
        
    }, []);

    const concat =(rowData) =>{
        let per = meslbl2(rowData.per_Mes_Inicio) + ' - ' + meslbl2(rowData.per_Mes_Fin) ;

        return(per);
    }

    const meslbl2 = (mes) =>{
        var per = '';
        switch(mes){
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
        return per;
    }

    const estado = (rowData) => {
        if(rowData.per_Estado === true){
            return (
                <>
                    <Button label='Cursando' className="p-button-rounded"></Button>
                </>
            );
        }else{
            return (
                <>
                    <Button label='Cerrado' className="p-button-rounded p-button-secondary"></Button>
                </>
            );
        }
    }

    const redireccionServicio = (rowData) => {
        return(
            <>
             <Button icon="pi pi-angle-right" className="p-button-rounded p-button-info" onClick={() => {
                cambiarBreadLocal('Servicio Social', rowData);
                navigate('/plataforma/serviciosocialdep' );
            }} />
            </>
        );
    }

    const redireccionEmpresas = (rowData) => {
        return(
            <>
             <Button icon="pi pi-angle-right" className="p-button-rounded p-button-success" onClick={() => {
                 cambiarBreadLocal('Docentes', rowData);
                 navigate('/plataforma/visitasempresasdep' );
            }} />
            </>
        );
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

    const cambiarBreadLocal = (lblActual, rowData) => {
        cookies.set('id_Periodo', rowData.id_Periodo, {path: "/"});
        cookies.set('lblPeriodo',meslbl(rowData.per_Mes_Inicio) + ' - ' + meslbl(rowData.per_Mes_Fin) + ' ' + rowData.per_Year , {path: "/"});

        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/vinculaciondep' });

        cambiarBread(direccionesTemp, lblActual);
    }
    

    return (
        <div>
            <div className="card" >      
                    <DataTable value={periodos} scrollable scrollHeight="67vh"  responsiveLayout="scroll">
                    <Column header="Periodo" body={concat} exportable={false} ></Column>
                    <Column header="Año" field='per_Year' exportable={false} ></Column>
                    <Column header="Estado" body={estado} exportable={false} ></Column>
                    <Column header="Servicio Social" body={redireccionServicio} exportable={false} ></Column>
                    <Column header="Visitas a Empresas" body={redireccionEmpresas} exportable={false} ></Column>
                    </DataTable>
            </div>
        </div>
    );
}

export default Vinculacion