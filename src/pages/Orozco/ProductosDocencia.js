import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import ModalRetroalimentacion from '../../components/Alonso/ModalRetroalimentacion';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText  } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import swal from 'sweetalert';
import FileService from '../../services/FileService';

const cookies = new Cookies();

const ProductosDocencia = () => {

    const navigate = new useNavigate();

    const toast = useRef(null);

    const [productosDocencia, setProductosDocencia] = useState([]);
    const [visible, setVisible] = useState(false);
    const [comment, setComment] = useState('Sin Comentario');
    const [estadoDoc, setEstadoDoc] = useState(0);
    const [visibleAgregar, setVisibleAgregar] = useState(false);
    const [productoDocencia, setProductoDocencia] = useState({
        "id_productos_docencia": null,
        "id_docper": null,
        "prodoc_nombre_producto": '',
        "prodoc_procedencia": '',
        "prodoc_estado": 0,
        "prodoc_pdf_producto": null,
        "prodoc_comentario": null,
        "prodoc_retroalimentacion": 0
    });
    const [file, setFile] = useState(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [docSeleccionado, setDocSeleccionado] = useState('Nombre del Archivo');
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);

    const productos = [
        { name: 'Residencia', code: 'Residencia' },
        { name: 'Tesis', code: 'Tesis' },
        { name: 'Artículo', code: 'Artículo' },
        { name: 'Prototipo', code: 'Prototipo' },
        { name: 'Proyectos de Investigación', code: 'Proyectos de Investigación' },
        { name: 'Otro', code: 'Otro' }
    ];

    const estadoProductos = [
        { name: 'En Proceso', code: 0 },
        { name: 'Terminado', code: 1 }
    ];

    const {iddocper} = new useParams();

    const fileService = new FileService();

    useEffect(() => {

        if(!cookies.get('idUsuario')){
            navigate('/');
        }else{
            if(!cookies.get('rolesUsuario').rol_docente)
                navigate('/plataforma/menu');
            else{
                if(cookies.get('actualTemp') === 'Productos Docencia')
                    datosTabla();
                else
                    navigate('/plataforma/gestiondocencia');
            }
        }
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/productosdocencia/" + iddocper + "/" + cookies.get('idUsuario')).then(res => setProductosDocencia(res.data));
    }

    const verBodyTemplate = (rowData) => {
        return <a href={rowData.prodoc_pdf_producto} target={'_blank'} rel="noreferrer" style={{ textDecoration: 'none' }}><Button icon="pi pi-eye" disabled={rowData.prodoc_pdf_producto == null} className="p-button-rounded p-button-warning" /></a>;
    }

    const editarBodyTemplate = (rowData) => {
        return <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editarProducto(rowData)}/>;
    }

    const editarProducto = (rowData) =>{
        setProductoDocencia(rowData);
        setVisibleAgregar(true);
        setProductoSeleccionado({ name: rowData.prodoc_nombre_producto, code: rowData.prodoc_nombre_producto });
        setEstadoSeleccionado({ name: getEstadoProd(rowData), code: rowData.prodoc_estado });
        setFile(null);
        if(rowData.prodoc_pdf_producto != null){
            var arrayDeCadenas = rowData.prodoc_pdf_producto.split('\\');
            setDocSeleccionado(arrayDeCadenas[arrayDeCadenas.length -1]);
        }else{
            setDocSeleccionado('Nombre del Archivo');
        }
    }

    const eliminarBodyTemplate = (rowData) => {
        return <Button icon="pi pi-trash" disabled={rowData.prodoc_pdf_producto == null} className="p-button-rounded p-button-danger" onClick={() => eliminarProd(rowData)} />;
    }

    const eliminarProd = (rowData) => {
        swal({
            title: "¿Deseas Eliminar el Documento del Producto?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
        }).then((OK) => {
            if(OK){
                eliminarPDF(rowData);
            }else{
                swal({
                    title: "¡Atención!",
                    text: "¡No se ha Eliminado el Producto!",
                    icon: "info",
                    button: "Aceptar",
                    timer: "3000"
                });
            }
        });
    }

    const eliminarPDF = async(rowData) =>{
        let objetoConDocumento = {
            ...rowData,
            prodoc_pdf_producto: null,
            prodoc_retroalimentacion: 0
        }

        await fileService.delete(rowData.prodoc_pdf_producto).then(data => {

            if(data.status === 200){
                axios.post("http://localhost:8080/api/v1/productosdocencia/save", objetoConDocumento).then(res => {
                    axios.get("http://localhost:8080/api/v1/productosdocencia/" + iddocper + "/" + cookies.get('idUsuario')).then(res => setProductosDocencia(res.data));
                    toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Eliminado Correctamente', life: 3000});
                });
            }else{
                if(data.status === 501){
                    toast.current.show({severity:'error', summary: '¡Atención!', detail:data.message, life: 3000});
                }
            }

        });
    }

    const estadoBodyTemplate = (rowData) => {
        if(rowData.prodoc_comentario != null){
            return <Button label={getEstado(rowData.prodoc_retroalimentacion)} className="p-button-link" onClick={() => {
                setVisible(true);
                setComment(rowData.prodoc_comentario);
                setEstadoDoc(rowData.prodoc_retroalimentacion);
            }}/>;
        }else{
            return <div>&nbsp;&nbsp;&nbsp;&nbsp;{getEstado(rowData.prodoc_retroalimentacion)}</div>;
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

    const footer = () => {
        return <Button label="Guardar Cambios" className="p-button p-button-info" onClick={() => guardarProducto()} />;  
    }

    const guardarProducto = async() => {
        if(productoSeleccionado !== null && estadoSeleccionado !== null && productoDocencia.prodoc_procedencia !== ''){
            
            var productoGuardar ={
                ...productoDocencia,
                prodoc_nombre_producto: productoSeleccionado.name,
                id_docper: parseInt(iddocper),
                prodoc_estado: estadoSeleccionado.code
            };

            await axios.post("http://localhost:8080/api/v1/productosdocencia/save", productoGuardar).then(res => {
                productoGuardar = res.data;
            });

            if(file !== null){

                var formdata = new FormData();
                let ruta = cookies.get('lblPeriodo') + '\\' + cookies.get('nombre_Departamento') + '\\' + cookies.get('nombreUsuario') + '\\PRODUCTOS\\DOCENCIA';
                
                formdata.append('file', file);
                formdata.append('ruta', ruta);
                formdata.append('nombrearch', productoGuardar.prodoc_nombre_producto + ' - ' + productoGuardar.id_productos_docencia + '.pdf');
                
                await fileService.upload(formdata).then(data => {
                    if(data.status === 200){
                        productoGuardar = {
                            ...productoGuardar,
                            prodoc_pdf_producto: data.message,
                            prodoc_retroalimentacion: 3
                        };

                        axios.post("http://localhost:8080/api/v1/productosdocencia/save", productoGuardar).then(res => {
                            swal({
                                title: "¡Atención!",
                                text: "¡Producto Guardado Correctamente!",
                                icon: "success",
                                button: "Aceptar",
                                timer: "3000"
                            });
                        });
                    }else{
                        if(data.status === 501){
                            swal({
                                title: "¡Atención!",
                                text: data.message,
                                icon: "error",
                                button: "Aceptar",
                                timer: "3000"
                            });
                        }
                    }
                });
            }else{
                swal({
                    title: "¡Atención!",
                    text: "¡Producto Guardado Correctamente!",
                    icon: "success",
                    button: "Aceptar",
                    timer: "3000"
                });
            }
            
            setVisibleAgregar(false);
            axios.get("http://localhost:8080/api/v1/productosdocencia/" + iddocper + "/" + cookies.get('idUsuario')).then(res2 => setProductosDocencia(res2.data));
        }else{
            swal({
                title: "¡Atención!",
                text: "¡Llena correctamente el formulario!",
                icon: "error",
                button: "Aceptar",
                timer: "3000"
            });
        }
        
    }

    const cambioProducto = (e) =>{
        setProductoSeleccionado(e.value);
    }

    const cambioEstado = (e) =>{
        setEstadoSeleccionado(e.value);
    }

    const onChangeInputFile = (file) =>{
        setFile(file);
        setDocSeleccionado(file.name);
    }

    const subirPdf2 = () =>{
        document.getElementById("inputFile2").click();
    }

    const abrirDialogNuevo = () => {
        setProductoDocencia({
            "id_productos_docencia": null,
            "id_docper": null,
            "prodoc_nombre_producto": '',
            "prodoc_procedencia": '',
            "prodoc_estado": null,
            "prodoc_pdf_producto": null,
            "prodoc_comentario": null,
            "prodoc_retroalimentacion": 0
        });
        setVisibleAgregar(true);
        setProductoSeleccionado(null);
        setEstadoSeleccionado(null);
        setDocSeleccionado('Nombre del Archivo');
    }

    const getEstadoProd = (rowData) => {
        switch (rowData.prodoc_estado) {
            case 0:
                return   'En Proceso';
            default:
                return   'Terminado';
        }
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>PRODUCTOS DOCENCIA</h1>

            <div style={{ textAlign: 'right', marginBottom: '10px', marginTop: '10px' }}>
                <Button label='Agregar Producto' onClick={() => abrirDialogNuevo()} />
            </div>
            
            <DataTable value={productosDocencia} responsiveLayout="scroll">
                <Column field="prodoc_nombre_producto" header="Producto" style={{ width: '20%' }}></Column>
                <Column field="prodoc_procedencia" header="Procedencia" style={{ width: '35%' }}></Column>
                <Column header="Estado" body={getEstadoProd} style={{ width: '15%' }}></Column>
                <Column header="Estado" body={estadoBodyTemplate} style={{ width: '15%' }}></Column>
                <Column header="Editar" body={editarBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
                <Column header="Ver" body={verBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
                <Column header="Eliminar" body={eliminarBodyTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
            </DataTable>
            <input type="file" id="inputFile" hidden accept=".pdf"/>
            <ModalRetroalimentacion header={"COMENTARIO DOCUMENTO"}  visible={visible} modal={true} style={{width: '500px'}}  onHide={()=>setVisible(false)} comentario={comment} estado={getEstado(estadoDoc)}/>

            <Dialog header="Producto Docencia" footer={footer()} visible={visibleAgregar} modal={true} style={{width: '550px'}} onHide={() => setVisibleAgregar(false)}>
                <Dropdown value={productoSeleccionado} options={productos} onChange={cambioProducto} optionLabel="name" placeholder="Producto" style={{ width: '500px' }} />

                <span className="p-float-label" style={{ marginTop: '30px' }}>
                    <InputText id="proc" value={productoDocencia.prodoc_procedencia} onChange={(e) => {
                        setProductoDocencia({
                            ...productoDocencia,
                            prodoc_procedencia: e.target.value
                        });
                    }} style={{ width: '500px' }} maxLength= '255'/>
                    <label htmlFor="proc">Procedencia</label>
                </span>
                <Dropdown value={estadoSeleccionado} options={estadoProductos} onChange={cambioEstado} optionLabel="name" placeholder="Estado" style={{ width: '500px', marginTop: '30px' }} />
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <p style={{ fontSize: 'small'}}>{docSeleccionado}</p>
                    <Button label="Seleccionar Archivo" icon="pi pi-upload" className="p-button-sm p-button-success" onClick={subirPdf2}/>
                </div>
                <input type="file" id="inputFile2" hidden accept=".pdf" onChange={(e) => onChangeInputFile(e.target.files[0])}/>
            </Dialog>

            <Toast ref={toast} />
        </div>
    )
}

export default ProductosDocencia
