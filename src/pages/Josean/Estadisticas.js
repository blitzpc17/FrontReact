import React from 'react'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Estadisticas = (props) => {

    const [registro, setRegistro] = useState([]);


    useEffect(() => {
        datosPeriodo();
    }, []);

    const datosPeriodo = async () => {
        await axios.get("http://localhost:8080/api/v1/secretaria/estadistico/1/" + cookies.get('id_Departamento')).then(res => setRegistro(res.data));
    }

    const reportefinalBody = (rowData) => {
        if(rowData.reporteFinal !== null){
            return(
                <>
                <Button label="Subido" className="p-button-success p-button-text" />
                </>
            );
        }
        else{
            return(
                <>
                <Button label="Sin Subir" className="p-button-text p-button-plain" />
                </>
            );
        }
    }

    const liberacionBody = (rowData) => {
        if(rowData.reporteFinal !== null){
            if(rowData.liberacion !== null){
                return(
                    <>
                    <Button label="Liberado" className="p-button-success p-button-text" />
                    </>
                );
            }
            else{
                return(
                    <>
                    <Button label="Pendiente" className="p-button-text p-button-warning" />
                    </>
                );
            }
        }
        else{
            return(
                <>
                <Button label="N/A" className="p-button-text p-button-plain" />
                </>
            );
        }
    }

    return (
        <div className="card">
            <Dialog visible={props.visible} header="Estadisticas" onHide={props.onHide}>
                <DataTable value={registro} scrollable scrollHeight="29vw"  responsiveLayout="scroll" style={{width: '950px'}}>
                    <Column header="Nombre del Docente" field="nombreDocente" exportable={false} ></Column>
                    <Column header="Reporte Final" field="reporteFinal" body={reportefinalBody} exportable={false}></Column>
                    <Column header="Numero de Documentos" field="numDocumentos" exportable={false}></Column>
                    <Column header="Liberacion" field="liberacion" body={liberacionBody} exportable={false}></Column>
                </DataTable>
            </Dialog>
        </div>
    )
}

export default Estadisticas
