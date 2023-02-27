import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState, useEffect, useContext } from 'react';
import { ServicioPeriodo } from '../../../services/Alonso/ServicioPeriodo';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../../context/BreadCrumbContext';

const cookies = new Cookies();

const PeriodosAuxiliar = () => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const servicioPeriodo=new ServicioPeriodo();
    const [periodos, setPeriodos] = useState(null);
   
    const concat =(rowData) =>{
        let per = meslbl(rowData.per_Mes_Inicio) + ' - ' + meslbl(rowData.per_Mes_Fin) ;

        return(per);
    }
    const estado = (rowData) => {
        if(rowData.per_Estado === true){
            return (
                <>
                   <label>Cursando</label> 
                </>
            );
        }else{
            return (
                <>
                 <label>Cerrado</label> 
                </>
            );
        }
    }

    const renderGestionLaboratorios=(rowData)=>{
        return (
            <>
            <div style={{paddingLeft:'100px'}}> 
            <Button icon= "pi pi-chevron-circle-right" className="p-button-rounded p-button-info" onClick={() => {
                cambiarBreadLocal('Laboratorios', rowData);
                navigate('/plataforma/laboratoriosauxiliar/'+rowData.id_Periodo);
            }}/>
            </div>
             
            </>
        );
    }

    const cambiarBreadLocal = (lblActual, rowData) => {
        cookies.set('id_Periodo', rowData.id_Periodo, {path: "/"});
        cookies.set('lblPeriodo',meslbl(rowData.per_Mes_Inicio) + ' - ' + meslbl(rowData.per_Mes_Fin) + ' ' + rowData.per_Year , {path: "/"});

        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/gestionauxiliarlab' });

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

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_auxiliar_laboratorio)
            navigate('/plataforma/menu');
        else{
            cambiarBread([], 'Periodos de Gestión');
            servicioPeriodo.getAll().then(data=>setPeriodos(data))
        }
    }, [])
        
  return (
    <div>
       
       <center><h2>Periodos de Gestion de Laboratorios Auxiliar </h2></center> 
        <DataTable value={periodos} scrollable scrollHeight="480px"  responsiveLayout="scroll" >
    <Column body={concat} header='Periodo'></Column>
    <Column field='per_Year' header='Año'></Column>
    <Column body={estado} header='Estado'></Column>
    <Column body={renderGestionLaboratorios} header='Gestión Laboratorios Auxiliar'></Column>
    </DataTable>
    </div>
   
  )
}

export default PeriodosAuxiliar