import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const Grupos = () => {

    const navigate = new useNavigate();

    const [grupos, setGrupos] = useState([]);

    const { direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const {iddocper} = new useParams();

    useEffect(() => {

        if(!cookies.get('idUsuario')){
            navigate('/');
        }else{
            if(!cookies.get('rolesUsuario').rol_docente)
                navigate('/plataforma/menu');
            else{
                if(cookies.get('actualTemp') === 'Grupos')
                    datosTabla();
                else
                    navigate('/plataforma/gestiondocencia');
            }
        }
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/materiasgrupos/" + iddocper).then(res => setGrupos(res.data));
    }

    const documentosBodyTemplate = (rowData) => {
        return <Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-success" onClick={() => redireccionDocumentos(rowData)}/>;
    }

    const redireccionDocumentos = (rowData) => {
        var addDirecciones = direcciones;
        addDirecciones.push({ label: 'Grupos', url: '/plataforma/grupos/' + iddocper });
        
        cambiarBread(addDirecciones, rowData.nombre + ' Grupo ' + rowData.grupo);

        navigate('/plataforma/documentosgrupos/'+rowData.id_grupo);
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>GRUPOS</h1>
            <DataTable value={grupos} responsiveLayout="scroll">
                <Column field="rowmg" header="#" style={{ width: '10%' }}></Column>
                <Column field="clave" header="Clave Materia" style={{ width: '30%' }}></Column>
                <Column field="nombre" header="Materia" style={{ width: '40%' }}  ></Column>
                <Column field="grupo" header="Grupo" style={{ width: '15%' }}></Column>
                <Column header="Documentos" body={documentosBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            </DataTable>
        </div>
    )
}

export default Grupos
