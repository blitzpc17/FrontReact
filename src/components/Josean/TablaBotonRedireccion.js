import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ServicioPersona } from '../../services/ServicioPersona';
import { ServicioPeriodos} from '../../services/Josean/ServicioPeriodos';



const TablaBotonRedireccion = () => {


    const [periodos, setPeriodos] = useState([]);
    const servicioPeriodos = new ServicioPeriodos();



    useEffect(() => {
        //servicioPersona.getAll().then(data => setPersonas(data));
        servicioPeriodos.getAll().then(data => setPeriodos(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps



    const actionBodyTemplate = (rowData) => {
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-chevron-right" className="p-button-rounded p-button-info" onClick={() => {}} />
            </>
            //</React.Fragment>
        );
    }

    const concat =(rowData) =>{
        console.log("hola periodos");
        let per="";

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

        return(per);
    }


    return (
        <div>
            <div className="card">
                <DataTable value={periodos} scrollable scrollHeight="650px">
                <Column body={concat} style={{paddingLeft:"5em"}} header="Periodo" exportable={false} ></Column>
                <Column field='per_Year' style={{paddingLeft:"10em"}} header="Año" exportable={false} ></Column>
                <Column body={actionBodyTemplate} style={{paddingLeft:"10em"}} header="Ir" exportable={false} ></Column>
                </DataTable>
            </div>
        </div>
    );
}

export default TablaBotonRedireccion;
