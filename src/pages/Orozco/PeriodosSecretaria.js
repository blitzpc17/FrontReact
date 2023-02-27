import React, { useEffect, useState, useContext } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from "axios";
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const PeriodosSecretaria = () => {
    const navigate = new useNavigate();

    const [periodos, setPeriodos] = useState([]);

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_secretaria_departamento)
            navigate('/plataforma/menu');
        else{
            cambiarBread([], 'Periodos de Gestión');
            datosPeriodo();
        }
    }, []);

    const datosPeriodo = async () => {
        await axios.get("http://localhost:8080/api/v1/periodos/all").then(res => setPeriodos(res.data));
    }

    const redireccionTemplate = (rowData) => {
        return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-success" onClick={() => cambiarBreadLocal(rowData)}/>;
    }

    const concat =(rowData) =>{
        let per = meslbl(rowData.per_Mes_Inicio) + ' - ' + meslbl(rowData.per_Mes_Fin) ;

        return(per);
    }

    const cambiarBreadLocal = (rowData) => {
        cookies.set('id_Periodo', rowData.id_Periodo, {path: "/"});
        cookies.set('lblPeriodo',meslbl(rowData.per_Mes_Inicio) + ' - ' + meslbl(rowData.per_Mes_Fin) + ' ' + rowData.per_Year , {path: "/"});

        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/periodosecretaria' });

        cambiarBread(direccionesTemp, 'Gestión de Docentes');

        navigate('/plataforma/gestiondocentes/'+rowData.id_Periodo)
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

    return <div>
        <h1 style={{ textAlign: 'center' }}>PERIODOS DE GESTIÓN</h1>
        <DataTable value={periodos} responsiveLayout="scroll">
            <Column header="Periodo" body={concat} style={{ width: '49%' }}></Column>
            <Column field="per_Year" header="Año" style={{ width: '20%' }}></Column>
            <Column header="Estado" body={estado} style={{ width: '20%' }}  ></Column>
            <Column header="Gestión Docentes" body={ redireccionTemplate } style={{ width: '11%', textAlign: 'center' }}></Column>
        </DataTable>
    </div>;
};

export default PeriodosSecretaria;
