import React, { useContext } from 'react';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import swal from 'sweetalert';
import { InputTextarea } from 'primereact/inputtextarea';
import { useNavigate, useParams } from 'react-router-dom';
import { ServicioConsultaDocLab }  from '../../services/Josean/ServicioConsultaDocLab';
import { ServicioDocumentosLab } from '../../services/Josean/ServicioDocumentosLab';

import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const DocumentosLaboratorioJ = () => {

    const navigate = new useNavigate();
    const { readonly } = useContext(BreadCrumbContext);

    const {idlab, idges} = new useParams();

    var idgest = parseInt(idges); //id gestion que se le manda a la pagina desde SeleccionPeriodos
    var cookiedep=cookies.get('id_Departamento');
    
    const [documentos, setDocumentos] = useState(null);
    const [namelab, setNamelab] = useState(null);


    var servicioconsDocLab = new ServicioConsultaDocLab();
    var servicioDocLab = new ServicioDocumentosLab();

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Documentos'){
console.log(readonly);
                servicioconsDocLab.search(idgest,cookiedep).then(data => {setDocumentos(data)} );
                axios.get("http://localhost:8080/api/v1/laboratorios/find/" + idlab).then(res => setNamelab(res.data.lab_Nombre));

            }
            else
                navigate('/plataforma/menudepartamental');
        }
      
    }, []);
    

    const botonVer = (rowData) => {
        if(rowData.doclab_pdf != null){
            return (
                //<React.Fragment> Fragmento simplificado abajo
                <>
                    <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" onClick={() => { window.open(rowData.doclab_pdf) }} />
                    
                </>
                //</React.Fragment>
            );
        }
        else{
            return (
                //<React.Fragment> Fragmento simplificado abajo
                <>
                    <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled />
                    
                </>
                //</React.Fragment>
            );
        }
    }

    
    const statuses = [
        { label: 'Sin Subir', value: 0 },
        { label: 'Completo', value: 1 },
        { label: 'Incompleto', value: 2 }
    ];
    
    const getStatusLabel = (status) => {
        switch (status) {
            case 0:
                return <Button label="Sin Subir" className="p-button-warning p-button-text" style={{padding:0}} />

            case 1:
                return <Button label="Completo" className="p-button-success p-button-text" style={{padding:0}} />

            case 2:
                return <Button label="Incompleto" className="p-button-danger p-button-text" style={{padding:0}} />

            default:
                return 'NA';
        }
    }

    const statusEditor = (options) => {
        if(options.rowData.doclab_Estado === 1){
            return (
                <Dropdown value={options.value} options={statuses} optionLabel="label" optionValue="value"
                    onChange={(e) => onChangeEstado(e,options)} placeholder="Sin Subir" style={{width:"10em" , backgroundColor:"var(--green-500)"}}
                    itemTemplate={(option) => {
                        return <span className={`product-badge status-${option.value}`}>{option.label}</span>
                    }} disabled={options.rowData.doclab_pdf === null} /> 
            );
        }
        else if(options.rowData.doclab_Estado === 2){
            return (
                <Dropdown value={options.value} options={statuses} optionLabel="label" optionValue="value"
                    onChange={(e) => onChangeEstado(e,options)} placeholder="Sin Subir" style={{width:"10em" , backgroundColor:"red"}}
                    itemTemplate={(option) => {
                        return <span className={`product-badge status-${option.value}`} >{option.label}</span>
                    }} disabled={options.rowData.doclab_pdf === null} /> 
            );
        }
        else{
            return (
                <Dropdown value={options.value} options={statuses} optionLabel="label" optionValue="value"
                    onChange={(e) => onChangeEstado(e,options)} placeholder="Sin Subir" style={{width:"10em" ,backgroundColor:"var(--yellow-500)"}}
                    itemTemplate={(option) => {
                        return <span className={`product-badge status-${option.value}`}>{option.label}</span>
                    }} disabled={options.rowData.doclab_pdf === null} /> 
            );
        }
        
    }

    const onChangeEstado=(e,options)=>{
       
        if(e.value===0){
            swal({
                title: "¡Atención!",
                text: "¡No se puede seleccionar esa opcion!",
                icon: "warning",
                button: "Aceptar",
                timer: "3000"
              });
        }else{
           options.editorCallback(e.value) 
        }
        
    }

    const statusBodyTemplate = (rowData) => {
        return getStatusLabel(rowData.doclab_Estado);
    }

    const onRowEditComplete = (e) => {
        let _documentos2 = [...documentos];
        let { newData, index } = e;

        _documentos2[index] = newData;

            agregar(newData);
            
    }

    const agregar = (newData) => {
       //console.log(newData);
        const doclab={

            id_documentolaboratorio: newData.id_documentolaboratorio,
            id_gestionlaboratorio: newData.id_gestionlaboratorio,
            id_formato: newData.id_Formato,
            doclab_pdf: newData.doclab_pdf,
            doclab_estado: newData.doclab_Estado,
            doclab_retroalimentacion: newData.doclab_Retroalimentacion
        }

        //console.log(doclab);
        

        servicioDocLab.save(doclab).then(data => {
            setDocumentos(null);

            swal({
                title: "¡Atención!",
                text: "¡Se han Guardado los Cambios!",
                icon: "success",
                button: "Aceptar",
                timer: "3000"
              });

              servicioconsDocLab.search(idgest,cookiedep).then(data => {setDocumentos(data)} );
        });
    }

    const textEditor = (options) => {
        return <InputTextarea type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} rows={2} cols={25} maxLength="255"/>;
    }

    return (
        <div>
            <h1>Documentos de {namelab}</h1>
            <h3>Periodo {cookies.get('lblPeriodo')}</h3>
            <div className="card" > 
                    <DataTable value={documentos} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete}  scrollHeight="480px"  responsiveLayout="scroll" >
                    <Column header="Formato" field='frm_Nombre'  exportable={false} ></Column>
                    <Column field="doclab_Estado" header="Estado" body={statusBodyTemplate} editor={(options) => statusEditor(options)} style={{ width: '20%' }}></Column>
                    <Column field="doclab_Retroalimentacion" header="Retroalimentacion" editor={(options) => textEditor(options)} style={{ width: '25%' }}></Column>
                    <Column header="Ver" body={botonVer} exportable={false} ></Column>
                    <Column rowEditor header="Editar" hidden={readonly} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    </DataTable>
            </div>
        </div>
    );
};

export default DocumentosLaboratorioJ;


