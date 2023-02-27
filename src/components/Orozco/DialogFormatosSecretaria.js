import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Cookies from 'universal-cookie';
import { Toast } from 'primereact/toast';
import FileService from '../../services/FileService';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext';

const cookies = new Cookies();

const DialogFormatosSecretaria = (props) => {

    const [cargarVisible, setCargarVisible] = useState(false);
    const [formatos, setFormatos] = useState([]);
    const [formato, setFormato] = useState([]);
    const [tipo, setTipo] = useState(0);
    const [file, setFile] = useState(null);
    const [lbllink, setLbllink] = useState('');

    var fileService = new FileService();

    const toast = useRef(null);

    useEffect(() => {
        datosTabla();
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/formatos/" + cookies.get('id_Departamento')).then(res => setFormatos(res.data));
    }

    const verBodyTemplate = (rowData) => {
        return <a href={rowData.frm_pdf_formato} target={'_blank'} rel="noreferrer" style={{ textDecoration: 'none' }}><Button icon="pi pi-eye" disabled={rowData.frm_pdf_formato == null} className="p-button-rounded p-button-warning" /></a>;
    }

    const cargarBodyTemplate = (rowData) => {
        return <Button icon={rowData.frm_pdf_formato != null? "pi pi-sync" : "pi pi-cloud-upload"} className="p-button-rounded p-button-success" onClick={() => subirPdf(rowData)}/>;
    }

    const subirPdf = (rowData) =>{
        setFormato(rowData);
        setFile(null);
        setLbllink(rowData.frm_pdf_formato === null? '' : rowData.frm_pdf_formato.includes('/Documentos')? '' : rowData.frm_pdf_formato);
        setTipo(rowData.frm_pdf_formato === null? null : rowData.frm_pdf_formato.includes('/Documentos')? 0 : 1);
        setCargarVisible(true);
    }

    const onChangeInputFile = (file) =>{
        setFile(file);
    }

    const guardarDocumentoAlCargar = async() => {
        if(tipo === 0){

            if(file !== null){
                var formdata = new FormData();
                let ruta = 'FORMATOS\\' + cookies.get('nombre_Departamento');
                
                formdata.append('file', file);
                formdata.append('ruta', ruta);
                formdata.append('nombrearch', formato.frm_nombre + '.pdf');
                
                await fileService.upload(formdata).then(data => {
                    if(data.status === 200){
                        let objetoConDocumento = {
                            ...formato, 
                            frm_pdf_formato: data.message
                        }
    
                        axios.post("http://localhost:8080/api/v1/formatos/save", objetoConDocumento).then(res => {
                            
                            axios.get("http://localhost:8080/api/v1/formatos/" + cookies.get('id_Departamento')).then(res => setFormatos(res.data));
                            toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Agregado Correctamente', life: 3000});
                        });
    
                    }else{
                        if(data.status === 501){
                            toast.current.show({severity:'error', summary: '¡Atención!', detail:'No se ha podido agregar el Documento', life: 3000});
                        }
                    }

                    setCargarVisible(false);
                });
    
            }
        }else{
            if(lbllink !== ''){
                let objetoConDocumento = {
                    ...formato, 
                    frm_pdf_formato: lbllink
                }
    
                axios.post("http://localhost:8080/api/v1/formatos/save", objetoConDocumento).then(res => {
                    
                    axios.get("http://localhost:8080/api/v1/formatos/" + cookies.get('id_Departamento')).then(res => setFormatos(res.data));
                    toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Agregado Correctamente', life: 3000});
                    setCargarVisible(false);
                });
            }
            
        }
        
    }

    const eliminarBodyTemplate = (rowData) => {
        return <Button icon="pi pi-trash" disabled={rowData.frm_pdf_formato == null} className="p-button-rounded p-button-danger" onClick={() => eliminarPDF(rowData)}/>;
    }

    const eliminarPDF = async(rowData) =>{
        let objetoConDocumento = {
            ...rowData, 
            frm_pdf_formato: null
        }

        if(rowData.fmr_tipo.includes('/Documentos')){

            await fileService.delete(rowData.frm_pdf_formato).then(data => {

                if(data.status === 200){
                    axios.post("http://localhost:8080/api/v1/formatos/save", objetoConDocumento).then(res => {
                        axios.get("http://localhost:8080/api/v1/formatos/" + cookies.get('id_Departamento')).then(res => setFormatos(res.data));
                        toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Eliminado Correctamente', life: 3000});
                    });
                }else{
                    if(data.status === 501){
                        toast.current.show({severity:'error', summary: '¡Atención!', detail:data.message, life: 3000});
                    }
                }
    
            });
        }else{
            axios.post("http://localhost:8080/api/v1/formatos/save", objetoConDocumento).then(res => {
                axios.get("http://localhost:8080/api/v1/formatos/" + cookies.get('id_Departamento')).then(res => setFormatos(res.data));
                toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Eliminado Correctamente', life: 3000});
            });
        }
        
    }

    const footer = () =>{
        return(
            <div>
                <Button label="Guardar" icon="pi pi-check" onClick={() => guardarDocumentoAlCargar()} />
            </div>
        );
    }

    return <div>
        <Dialog header="Formatos de Documentación" visible={props.visible} modal={true} style={{width: '950px'}} onHide={props.onHide}>
            <DataTable value={formatos} responsiveLayout="scroll">
                <Column field="frm_nombre" header="Formato"></Column>
                <Column header="Ver" body={verBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
                <Column header="Cargar" body={cargarBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
                <Column header="Eliminar" body={eliminarBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            </DataTable>
        </Dialog>

        <Dialog header="Cargar Formatos" visible={cargarVisible} footer= {footer} modal={true} style={{width: '750px'}} onHide={()=> setCargarVisible(false)}>
            <table>
                <tbody>
                    <tr>
                        <td align='center' style={{width: '350px'}}>
                            <div className="field-radiobutton" style={{marginBottom: '10px'}}>
                                <RadioButton inputId="sformato" name="tipos" value={0} onChange={(e) => setTipo(e.value)} checked={tipo === 0} />
                                <label htmlFor="sformato">Subir Formato</label>
                            </div>
                            { (formato.frm_pdf_formato == null || !formato.frm_pdf_formato.includes('/Documentos')) ? <img src="/pdfs/pdfDefault.png" height='360px' width='280px' /> :  <iframe src={  formato.frm_pdf_formato } height='360px' width='280px'/> }
                            <Button label={(formato.frm_pdf_formato === null) ? "Subir" : "Cambiar"} className="p-button-success" icon="pi pi-cloud-upload" style={{width: '150px', marginTop: '20px'}} onClick={() => document.getElementById("inputFile").click()}/>
                        </td>
                            
                        <td align='center' style={{width: '300px'}}>
                            <div className="field-radiobutton" style={{marginBottom: '150px'}}>
                                <RadioButton inputId="sformato2" name="tipos" value={1} onChange={(e) => setTipo(e.value)} checked={tipo === 1} />
                                <label htmlFor="sformato2">Agregar Link a Documento</label>
                            </div>
                            <div style={{marginBottom: '30px'}}>Link Documento</div>
                            <InputText value={lbllink} onChange={(e) => setLbllink(e.target.value)} style={{marginBottom: '190px'}}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Dialog>

        <input type="file" id="inputFile" hidden accept=".pdf" onChange={(e) => onChangeInputFile(e.target.files[0])}/>
        <Toast ref={toast} />
    </div>;
};

export default DialogFormatosSecretaria;
