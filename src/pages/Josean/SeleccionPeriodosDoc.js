import React from 'react';

import { useState, useContext } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import {ServicioConsultaPeriodosDoc} from '../../services/Josean/ServicioConsultaPeriodosDoc';
import { ServicioGestionLaboratorio } from '../../services/Josean/ServicioGestionLaboratorio';

import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const SeleccionPeriodos = () => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread , setReadonly} = useContext(BreadCrumbContext);

    const [periodos, setPeriodos] = useState(null);

    var servicioconsPeriodos = new ServicioConsultaPeriodosDoc();
    var servicioGestionLaboratorio = new ServicioGestionLaboratorio();

    const [namelab, setNamelab] = useState(null);

    const {idlab} = new useParams();
    var cookielab = parseInt(idlab);//id laboratorio que se le manda a la pagina desde Laboratorios

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Periodos de Gestión'){
                servicioconsPeriodos.search(cookielab).then(data => setPeriodos(data));
                axios.get("http://localhost:8080/api/v1/laboratorios/find/" + cookielab).then(res => setNamelab(res.data.lab_Nombre));
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

    const save = (rowData) => {
        console.log(rowData);
        
        if(rowData.id_gestionlaboratorio===0){
            
            const gestion = {
                id_gestionlaboratorio: null,
                id_periodo: rowData.id_Periodo,
                id_laboratorio: cookielab,
                geslab_inventarioinicial: null,
                geslab_inventariofinal: null,
                geslab_inventarioinicialestado: 0,
                geslab_inventarioinicialcomentario: null,
                geslab_inventariofinalestado: 0,
                geslab_inventariofinalcomentario: null
            }

            servicioGestionLaboratorio.save(gestion).then(data => {
                
                creacookies(rowData);
                //Redireccion a DocumentosLaboratorio se manda data.id_gestionlaboratorio
            });
            
        }
        else{
            creacookies(rowData);
            //Redireccion a DocumentosLaboratorio se manda rowData.id_gestionlaboratorio
        }
    }

    const creacookies = (rowData) => {
        cambiarBreadLocal('Documentos', rowData);
        navigate('/plataforma/documentoslabdep/' + rowData.id_Laboratorio + '/' + rowData.id_gestionlaboratorio);
    }

    const botonRedireccion = (rowData) => {
            return (
                //<React.Fragment> Fragmento simplificado abajo
                <>
                    <Button icon="pi pi-angle-right" className="p-button-rounded p-button-info" onClick={() => {save(rowData)}} />
                    
                </>
                //</React.Fragment>
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
        direccionesTemp.push({ label: actual, url: '/plataforma/periodosgestionlab/' + cookielab });

		setReadonly(!rowData.per_Estado);
        cambiarBread(direccionesTemp, lblActual);
    }

    return (
        <div>
            <div className="card" >    
                    <h1>Documentos por periodo del {namelab}</h1>    
                    <DataTable value={periodos} scrollable scrollHeight="480px"  responsiveLayout="scroll" >
                    <Column header="Periodo" body={concat} exportable={false} ></Column>
                    <Column header="Año" field='per_Year' exportable={false} ></Column>
                    <Column header="Estado" body={estado} exportable={false} ></Column>
                    <Column header="Seleccionar" body={botonRedireccion} exportable={false} ></Column>
                    </DataTable>
            </div>
        </div>
    );
};

export default SeleccionPeriodos;
