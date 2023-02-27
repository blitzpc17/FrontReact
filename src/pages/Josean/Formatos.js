import React from 'react'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { ServicioFormatos } from '../../services/Josean/ServicioFormatos';

import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const Formatos = () => {
    const navigate = new useNavigate();

    const [formatos, setFormatos] = useState();
    const [visible, setVisible] = useState(false);
    const [nombre, setNombre] = useState("");
    const [clave, setClave] = useState("");
    const [tipo, setTipo] = useState("");
    const [idFormato, setIdFormato] = useState(null);

    var servicioFormatos = new ServicioFormatos();

    var cookiedep=cookies.get('id_Departamento');

    const tipoformato = [
        {name:"Academico"},
        {name:"Laboratorio"},
        {name:"Capacitaciones"},
        {name:"Seguimiento al Aula"},
        
    ]

    const agregar = () => {

        if(nombre ===null || nombre === "" || 
        clave === null || clave === "" || 
        tipo === null || tipo === "-- Tipo Formato --"){

            swal({
                title: "¡Atención!",
                text: "¡Rellena todos los campos!",
                icon: "warning",
                button: "Aceptar",
                timer: "3000"
              });
              setVisible(true);
        }
        else{

            const formato= {
                id_formato: idFormato,
                id_departamento: cookiedep,
                frm_clave: clave,
                frm_nombre: nombre,
                fmr_tipo: tipo.name,
            }

            servicioFormatos.save(formato).then((data) =>{

                setFormatos(null);

                swal({
                    title: "¡Atención!",
                    text: "¡Se ha agregado el Formato con Exito!",
                    icon: "success",
                    button: "Aceptar",
                    timer: "3000"
                  });


                  servicioFormatos.deps(cookiedep).then(data =>{
                    setFormatos(data);
                });
            });
        }
        
    }

    const eliminar =(rowData) =>{

        swal({
            title: "¿Deseas Eliminar el Formato?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
          }).then((OK) => {
      
            if(OK){
      
                console.log(rowData);

                servicioFormatos.delete(rowData.id_formato).then((data) =>{
                    setFormatos(null);

                    swal({
                        title: "¡Atención!",
                        text: "¡Se ha Eliminado el Formato!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                        });

                        servicioFormatos.deps(cookiedep).then(data => {setFormatos(data)})
                    });
                }else{
                swal({
                    title: "¡Atención!",
                    text: "¡No se ha Eliminado el Registro!",
                    icon: "info",
                    button: "Aceptar",
                    timer: "3000"
                });
                }
        
            });
    }

    const botonEliminar = (rowData) => {
        
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => {eliminar(rowData)}} />
                
            </>
            //</React.Fragment>
        );
    }

    const botonModificar = (rowData) => {
        
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-pencil " className="p-button-rounded p-button-success" onClick={() => {setVisible(true) ; setNombre(rowData.frm_nombre) ; setClave(rowData.frm_clave) ; setTipo(regresatipo(rowData.fmr_tipo)) ; setIdFormato(rowData.id_formato)}} />
            </>
            //</React.Fragment>
        );
    }

    const botonVer = (rowData) => {
        if(rowData.frm_pdf_formato != null){
            return (
                //<React.Fragment> Fragmento simplificado abajo
                <>
                    <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" onClick={() => { window.open(rowData.frm_pdf_formato)}} />
                    
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


    const regresatipo = (data) => {
        return {name: data}
    }

    const onHide = () => {
        setVisible(false);
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Agregar" icon="pi pi-user-plus"  iconPos="left" style={{backgroundColor:"red", borderColor:"red"}} onClick={() => {setVisible(false) ; agregar()}}  />
            </div>
        );
    }

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Formatos'){
                servicioFormatos.deps(cookiedep).then(data =>{
                    setFormatos(data);
                });
            }
            else
                navigate('/plataforma/menudepartamental');
        }
        
    }, []);

    return (
        <div className="card" >
                <h1>Formatos</h1>
                <div className="card" >
                    <div style={{ display: "flex"}}>
                        <Button onClick={()=>{setVisible(true) ; setNombre("") ; setClave("") ; setIdFormato(null) ; setTipo("-- Tipo Formato --")}} 
                        style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"red", borderColor:"red"}} label="Nuevo Formato" icon="pi pi-file" iconPos="left" />
                    </div>
                    
                        <DataTable value={formatos}  scrollHeight="480px"  responsiveLayout="scroll" >
                        <Column header="Formato" value={nombre} field='frm_nombre'  exportable={false} ></Column>
                        <Column header="Clave ISO" value={clave} field='frm_clave' exportable={false} ></Column>
                        <Column header="Tipo" value={tipo} field='fmr_tipo' exportable={false} ></Column>
                        <Column header="Ver Formato" body={botonVer} exportable={false} ></Column>
                        <Column header="Modificar" body={botonModificar} exportable={false} ></Column>
                        <Column header="Eliminar" body={botonEliminar} exportable={false}  ></Column>
                        </DataTable>
                </div>
           
            
                <Dialog header="Agregar Formato" visible={visible} onHide={onHide} modal={true} footer={renderFooter}>
                    <table>
                        <tbody>
                        <tr>
                            <td style={{paddingRight: '5rem'}}>

                                    <h5>Nombre</h5>
                                    <InputText  type="text" 
                                    value={nombre} onChange={(e) => {setNombre(e.target.value)}} style={{width:"15em"}}  />

                                    <h5>Clave ISO</h5>
                                    <InputText  type="text" 
                                    value={clave} onChange={(e) => {setClave(e.target.value)}} style={{width:"15em"}}  />

                                    <h5>Tipo de Formato</h5>
                                    <Dropdown value={tipo} options={tipoformato} onChange={(e) => {setTipo(e.target.value)}} optionLabel="name"
                                    placeholder="-- Tipo Formato --" style={{width:"15em"}} />

                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Dialog>
            
        </div>
    )
}

export default Formatos
