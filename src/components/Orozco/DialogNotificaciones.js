import React, { useState, useEffect, useContext, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from "axios";
import Cookies from 'universal-cookie';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { Toast } from 'primereact/toast';

const cookies = new Cookies();

const DialogNotificaciones = (props) => {

    const navigate = new useNavigate();

    const [notificaciones, setNotificaciones] = useState([]);

    const { cambiarBread } = useContext(BreadCrumbContext);

    const toast = useRef(null);

    useEffect(() => {
        datosTabla();
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/materiasgrupos/notificaciones/"+ cookies.get('idUsuario')).then(res => setNotificaciones(res.data));
    }

    const verBodyTemplate = (rowData) => {
        return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-warning" onClick={() => redireccionar(rowData)}/>;
    }

    const redireccionar = (rowData) => {
        let direcciones = [];
        direcciones.push({ label: 'Periodos de Gestión', url: '/plataforma/gestiondocencia' });

        var procedenciaRow = rowData.ir.split('/');

        var lblActual = '';

        switch(procedenciaRow[0]){
            case 'menudocencia':
                lblActual = 'Gestión de Docencia';
                actualizarVista(rowData.id, 'docenteperiodo');
            break;
            case 'documentosgrupos':
                lblActual = rowData.procedencia;
                direcciones.push({ label: 'Gestión de Docencia', url: '/plataforma/menudocencia/' + rowData.id_periodo });
                direcciones.push({ label: 'Grupos', url: '/plataforma/grupos/' + rowData.id_DocPer });
                actualizarVista(rowData.id, 'documentosgrupos');
            break;
            case 'actividadesapoyo':
                lblActual = 'Actividades en Apoyo a la Docencia';
                direcciones.push({ label: 'Gestión de Docencia', url: '/plataforma/menudocencia/' + rowData.id_periodo });
                actualizarVista(rowData.id, 'seleccionapoyo');
            break;
            case 'productosdesarrollo':
                lblActual = 'Productos Desarrollo Tecnológico';
                direcciones.push({ label: 'Gestión de Docencia', url: '/plataforma/menudocencia/' + rowData.id_periodo });
                actualizarVista(rowData.id, 'productosdestec');
            break;
            case 'productosdocencia':
                lblActual = 'Productos Docencia';
                direcciones.push({ label: 'Gestión de Docencia', url: '/plataforma/menudocencia/' + rowData.id_periodo });
                actualizarVista(rowData.id, 'productosdocencia');
            break;
            default:
                direcciones = [];
                lblActual = 'na';
        }

        cambiarBread(direcciones, lblActual);
        navigate('/plataforma/' + rowData.ir);
        props.onHide();
    }

    const actualizarVista = async(id, servicio) => {
        var data = null;
        await axios.get("http://localhost:8080/api/v1/" + servicio + "/find/"+ id).then(res => {
            data = {
                ...res.data,
                notify: 0
            }
        });

        if(data.id_docper !== null){
            await axios.post("http://localhost:8080/api/v1/" + servicio + "/save", data).then(res => {
                toast.current.show({severity:'info', summary: '¡Atención!', detail:'Notificación Vista', life: 3000});
            });
        }
    }

    const getEstado = (estado) => {
        switch (estado) {
            case 1:
                return   'Completo';
            case 2:
                return   'Incompleto';
            case 3:
                return   'Subido';
            default:
                return   'Sin Subir';
        }
    }

    return <div>
        <Dialog header="Notificaciones" visible={props.visible} modal={true} style={{width: '950px'}} onHide={props.onHide}>
            <DataTable value={notificaciones} responsiveLayout="scroll">
                <Column field="row" header="#"></Column>
                <Column field="nombre" header="Nombre Archivo"></Column>
                <Column field="procedencia" header="Procedencia"></Column>
                <Column header="Estado" body={rowData => getEstado( rowData.estado)}></Column>
                <Column header="Ir" body={verBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            </DataTable>
        </Dialog>

        <Toast ref={toast} />
    </div>;
};

export default DialogNotificaciones;
