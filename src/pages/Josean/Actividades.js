import React from 'react'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { ServicioActividades } from '../../services/Josean/ServicioActividades';

import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const Actividades = () => {
    const navigate = new useNavigate();

    const cookiedep=cookies.get('id_Departamento');

    const [actividades, setActividades] = useState();
    const [nombre, setNombre] = useState("");
    const [visible, setVisible] = useState(false);
    const [clave, setClave] = useState("");
    const [idactividad, setIdactividad] = useState(null);

    var servicioActividades = new ServicioActividades();

    const onHide = () => {
        setVisible(false);
    }

    const agregar = () => {

        if(nombre === null || nombre === "" ||
        clave === null || clave === ""){
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

            const actividad ={
    
                id_Actividades_Docencia: idactividad,
                id_Departamento: cookiedep,
                actdoc_Nombre_Actividad: nombre,
                actdoc_Clave: clave,
                
            }

            servicioActividades.save(actividad).then((data) =>{

                setActividades(null);

                swal({
                    title: "¡Atención!",
                    text: "¡Se ha agregado la Actividad con Exito!",
                    icon: "success",
                    button: "Aceptar",
                    timer: "3000"
                  });


                  servicioActividades.deps(cookiedep).then(data =>{
                    setActividades(data);
                });
            });

        }
    }

    const eliminar =(rowData) =>{

        swal({
            title: "¿Deseas Eliminar la Actividad?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
          }).then((OK) => {
      
            if(OK){
      
                console.log(rowData);

                servicioActividades.delete(rowData.id_Actividades_Docencia).then((data) =>{
                    setActividades(null);

                    swal({
                        title: "¡Atención!",
                        text: "¡Se ha Eliminado la Actividad!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                        });

                        servicioActividades.deps(cookiedep).then(data => {setActividades(data)})
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

    const botonModificar = (rowData) => {


        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-pencil " className="p-button-rounded p-button-success" onClick={()=> {setVisible(true) ; setNombre(rowData.actdoc_Nombre_Actividad); setClave(rowData.actdoc_Clave); setIdactividad(rowData.id_Actividades_Docencia) ;console.log(rowData) ; }} />
                
            </>
            //</React.Fragment>
        );
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


    const renderFooter = () => {
        return (
            <div>
                <Button label="Agregar" icon="pi pi-copy"   iconPos="left"  style={{backgroundColor:"var(--orange-500)", borderColor:"var(--orange-500)"}} onClick={() => {setVisible(false) ; agregar()}}  />
            </div>
        );
    }

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Actividades Apoyo Docencia'){
                servicioActividades.deps(cookiedep).then(data =>{
                    setActividades(data);
                });
            }
            else
                navigate('/plataforma/menudepartamental');
        }
        
    }, []);


    return (
        <div className="card" >
                <h1>Actividades</h1>
                <div className="card" >
                    <div style={{ display: "flex"}}>
                        <Button onClick={()=>{setVisible(true) ; setNombre("") ; setClave("") ; setIdactividad(null)}} 
                        style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"var(--orange-500)", borderColor:"var(--orange-500)"}} label="Nueva Actividad" icon="pi pi-copy" iconPos="left" />
                    </div>
                    
                        <DataTable value={actividades}  scrollHeight="480px"  responsiveLayout="scroll" >
                        <Column header="Actividad" value={nombre} field='actdoc_Nombre_Actividad'  exportable={false} ></Column>
                        <Column header="Clave" value={clave} field='actdoc_Clave'  exportable={false} ></Column>
                        <Column header="Modificar" body={botonModificar} exportable={false} ></Column>
                        <Column header="Eliminar" body={botonEliminar} exportable={false}  ></Column>
                        </DataTable>
                </div>
           
            
                <Dialog header="Agregar Actividad" visible={visible} onHide={onHide} modal={true} footer={renderFooter}>
                    <table>
                        <tbody>
                        <tr>
                            <td style={{paddingRight: '5rem'}}>

                                    <h5>Actividad</h5>
                                    <InputText  type="text" 
                                    value={nombre} onChange={(e) => {setNombre(e.target.value)}} style={{width:"15em"}}  />

                                    <h5>Clave ISO</h5>
                                    <InputText  type="text" 
                                    value={clave} onChange={(e) => {setClave(e.target.value)}} style={{width:"15em"}}  />

                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Dialog>
            
        </div>
    )
}

export default Actividades
