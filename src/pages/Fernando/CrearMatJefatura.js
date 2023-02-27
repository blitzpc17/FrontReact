import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MaterialJefServicio } from '../../services/Fernando/MaterialJefServicio';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import swal from 'sweetalert';
import { MaterialJefQ } from '../../services/Fernando/MaterialJefQ';
const CrearMatJefatura=()=>{

    const [depRegistro, setDepRegistro] = useState(3);

    const [value, setValue] = useState([]);
    const matJef = new MaterialJefServicio();

    const valueGet = new MaterialJefQ();

    useEffect(() => {
        valueGet.search(depRegistro).then(data => setValue(data));
    }, []);

    //Dialog
    const [objeto, setObjeto] = useState({
        id_Material:null, 
        id_Departamento:depRegistro, 
        mtr_Nombre:null, 
        mtr_Enlace:null, 
        mtr_creado_por:null, 
        mtr_fecha_creacion:null, 
        mtr_actualizado_por:null, 
        mtr_fecha_actualizacion:null
    });
    const [nomMat, setNomMat] = useState('');
    const [enlace, setEnlace] = useState('');
    const [displayBasic, setDisplayBasic] = useState(false);
    const dialogFuncMap = {
        'displayBasic': setDisplayBasic
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
        setEnlace('');
        setNomMat('');
    }

    const guardarMat=(data)=>{       

        matJef.save(data).then(data => {  
            valueGet.search(depRegistro).then(data => setValue(data));
        });
        swal({
            title: "¡Atención!",
            text: "¡Registro Guardado!",
            icon: "success",
            button: "Aceptar",
            timer: "3000"
        });  
        objeto.id_Material=null;
    }

    

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Guardar" className="p-button-info" 
                    onClick={() => {
                        objeto.mtr_Nombre = nomMat; 
                        objeto.mtr_Enlace = enlace;
                        guardarMat(objeto);
                        onHide(name);
                    }}
                />
            </div>
        );
    }
    //Dialog
    const GetEnlace=(rowData)=>{
        return(
            <a href={rowData.mtr_enlace} target="_blank" style={{textDecorationLine : "none"}}>
                <Button icon="pi pi-external-link" className="p-button-rounded p-button-help" />
            </a>
        )
    }
    const modificar=(rowData)=>{
        return(
            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" 
            onClick={()=>{
                objeto.id_Material = rowData.id_material;
                setNomMat(rowData.mtr_nombre);
                setEnlace(rowData.mtr_enlace);
                setDisplayBasic(true);
            }}
            />
        )
    }

    const eliminarMaterial=(data)=>{
        matJef.delete(data).then(data => {  
            valueGet.search(depRegistro).then(data => setValue(data));
        });
        swal({
            title: "¡Atención!",
            text: "¡Registro Eliminado!",
            icon: "success",
            button: "Aceptar",
            timer: "3000"
        });  
    }
    const eliminar=(rowData)=>{
        return(
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger"             
            onClick={()=>{eliminarMaterial(rowData.id_material);
            console.log(rowData);
            }}/>
        )
    }
    return(
        <div>
            <center>
                <div><h1>Material de Jefatura</h1></div>
            </center>
            <center>
                <div><Button icon="pi pi-book" label="Crear Material" className="p-button-info" 
                    onClick={()=>{setDisplayBasic(true);}}
                /></div>
            </center>
            <br></br>
            <Panel>
                <DataTable value={value} responsiveLayout="scroll">
                    <Column field="id_material" header="#"></Column>
                    <Column field="mtr_nombre" header="Titulo"></Column>
                    <Column header="Ver" body={GetEnlace}></Column>
                    <Column header="Editar" body={modificar}></Column>
                    <Column header="Eliminar" body={eliminar}></Column>
                </DataTable>
            </Panel>

            <Dialog header="Material de Jefatura" visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
            <center>
                    <div>
                        <table>
                            <tbody>
                                <tr>                                    
                                    <td style={{padding: '1rem', paddingRight: '2rem'}}><h4>Nombre del Material:</h4></td>
                                    <td>
                                    <span className="p-input-icon-left p-float-label">
                                        <i className="pi pi-external-link"/>
                                        <InputText id="nombre" value={nomMat} onChange={(e) => setNomMat(e.target.value)} style={{ width: '400px'}} maxLength="255"/>
                                        <label htmlFor="nombre">Nombre del Material</label>
                                    </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{padding: '1rem', paddingRight: '2rem'}}><h4>Enlace:</h4></td>
                                    <td>
                                    <span className="p-input-icon-left p-float-label">
                                        <i className="pi pi-link"/>
                                        <InputText id="link" value={enlace} onChange={(e) => setEnlace(e.target.value)} style={{ width: '400px'}} maxLength="255"/>
                                        <label htmlFor="link">Ejem: enlacematerial.com</label>
                                    </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </center>
            </Dialog>
        </div>
    )
}

export default CrearMatJefatura;
