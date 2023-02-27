import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from "axios";
import Cookies from 'universal-cookie';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';

const cookies = new Cookies();

const DialogConvocatorias = (props) => {

    const [convocatorias, setConvocatorias] = useState([]);
    const toast = useRef(null);

    useEffect(() => {
        datosTabla();
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/convocatorias/"+ cookies.get('id_Departamento') + '/' + cookies.get('idUsuario')).then(res => setConvocatorias(res.data));
    }

    const verBodyTemplate = (rowData) => {
        if(rowData.conv_Tipo === 1)
            return <a href={rowData.conv_pdf_Informacion} target={'_blank'} rel="noreferrer" style={{ textDecoration: 'none' }}><Button icon="pi pi-link" disabled={rowData.conv_pdf_Informacion == null} className="p-button-rounded p-button-success" /></a>;
        else
            return <a href={rowData.conv_pdf_Informacion} download= { rowData.conv_Nombre } target={'_blank'} rel="noreferrer" style={{ textDecoration: 'none' }}><Button icon="pi pi-cloud-download" disabled={rowData.conv_pdf_Informacion == null} className="p-button-rounded p-button-success" /></a>;
    }

    const checkBodyTemplate = (rowData) => {
        return <div className="field-checkbox">
            <Checkbox inputId="binary" checked={rowData.conv_Estado === 1}  onChange={e => cambiarInteres(e.checked, rowData)}/>
        </div>
    }

    const cambiarInteres = async(interes, rowData) => {
        let interesConvocatoria = {
            id_interes_convocatoria: rowData.id_Departamento === 0? null : rowData.id_Departamento,
            id_convocatoria: rowData.id_Convocatoria,
            id_usuarios: cookies.get('idUsuario'),
            interes: interes? 1 : 0
        };

        await axios.post("http://localhost:8080/api/v1/interesconvocatorias/save", interesConvocatoria).then(res => {
            toast.current.show({severity:'success', summary: '¡Atención!', detail:'Interés Guardado Correctamente', life: 3000});
        });

        await axios.get("http://localhost:8080/api/v1/convocatorias/"+ cookies.get('id_Departamento') + '/' + cookies.get('idUsuario')).then(res => setConvocatorias(res.data));
    }

    const fechaBodyTemplate = (rowData) => {
        let fecha = rowData.conv_Fecha_Expirar;
        return (fecha.substring(0,4) + '/' + fecha.substring(5,7) + '/' + fecha.substring(8,10));
    }

    return <div>
        <Dialog header="Convocatorias" visible={props.visible} modal={true} style={{width: '950px'}} onHide={props.onHide}>
            <DataTable value={convocatorias} responsiveLayout="scroll">
                <Column field="conv_Nombre" header="Convocatoria"></Column>
                <Column header="Fecha Expiración" body={fechaBodyTemplate} style={{ width: '19%', textAlign: 'center' }}></Column>
                <Column header="Interés" body={checkBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
                <Column header="Documentación" body={verBodyTemplate} style={{ width: '15%', textAlign: 'center' }}></Column>
            </DataTable>
        </Dialog>

        <Toast ref={toast} />
    </div>;
};

export default DialogConvocatorias;