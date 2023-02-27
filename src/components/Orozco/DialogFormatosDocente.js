import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const DialogFormatosDocente = (props) => {

    const [formatos, setFormatos] = useState([]);

    useEffect(() => {
        datosTabla();
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/formatos/" + cookies.get('id_Departamento')).then(res => setFormatos(res.data));
    }

    const descargarBodyTemplate = (rowData) => {
        return <a href={rowData.frm_pdf_formato} download={rowData.frm_nombre} target={'_blank'} rel="noreferrer" style={{ textDecoration: 'none' }}><Button icon={rowData.frm_pdf_formato === null? "pi pi-times" : rowData.frm_pdf_formato.includes('\\Documentos')?"pi pi-cloud-download" : "pi pi-link" } disabled={rowData.frm_pdf_formato == null} className="p-button-rounded p-button-success" /></a>;
    }

    return <div>
        <Dialog header="Formatos de Documentación" visible={props.visible} modal={true} style={{width: '950px'}} onHide={props.onHide}>
            <DataTable value={formatos} responsiveLayout="scroll">
                <Column field="frm_nombre" header="Nombre Formato"></Column>
                <Column header="Descargar" body={descargarBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            </DataTable>
        </Dialog>
    </div>;
};

export default DialogFormatosDocente;
