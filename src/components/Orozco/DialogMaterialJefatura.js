import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from "axios";
import Cookies from 'universal-cookie';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const cookies = new Cookies();

const DialogMaterialJefatura = (props) => {

    const [material, setMaterial] = useState([]);

    useEffect(() => {
        datosTabla();
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/materialjefatura/"+ cookies.get('id_Departamento')).then(res => setMaterial(res.data));
    }

    const verBodyTemplate = (rowData) => {
        return <a href={rowData.mtr_enlace} target={'_blank'} rel="noreferrer" style={{ textDecoration: 'none' }}><Button icon="pi pi-link" disabled={rowData.mtr_enlace == null} className="p-button-rounded p-button-warning" /></a>;
    }

    return <div>
        <Dialog header="Material Jefatura" visible={props.visible} modal={true} style={{width: '950px'}} onHide={props.onHide}>
            <DataTable value={material} responsiveLayout="scroll">
                <Column field="mtr_nombre" header="Material Jefatura"></Column>
                <Column header="Ver" body={verBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            </DataTable>
        </Dialog>
    </div>;
};

export default DialogMaterialJefatura;
