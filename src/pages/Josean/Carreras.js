import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import swal from 'sweetalert';
 
import { ServicioCarreras } from '../../services/Josean/ServicioCarreras';

import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const Carreras = () => {
    const navigate = new useNavigate();

    const [carreras, setCarreras] = useState(null);
    const [nombre, setNombre] = useState("");
    const [visible, setVisible] = useState(false);
    const [idCarrera, setIdCarrera] = useState(null);

    var cookiedep=cookies.get('id_Departamento');

    var servicioCarreras = new ServicioCarreras();

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Carreras'){
                servicioCarreras.searchByDep(cookiedep).then(data =>{
                    setCarreras(data);
                });
            }
            else
                navigate('/plataforma/menudepartamental');
        }
        
    }, []);

    const onHide = () => {
        setVisible(false);
    }

    const agregar = () => {

        if(nombre ===null || nombre === ""){

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

                const carrera= {
                    id_Carrera : idCarrera,
                    id_Departamento: cookiedep,
                    car_Nombre : nombre,
                    car_creado_por : null,
                    car_fecha_creacion : null,
                    car_actualizado_por : null,
                    car_fecha_actualizacion : null
                }
    
                save(carrera)
            }
        }
        
    

    const save = (carrera) => {

        servicioCarreras.comprobarCarrera(carrera.id_Departamento,carrera.car_Nombre).then(data => {
            if(data.car_Nombre !== undefined){
                swal({
                    title: "¡Atención!",
                    text: "¡Ya existe la Carrera!",
                    icon: "warning",
                    button: "Aceptar",
                    timer: "3000"
                });

                setVisible(true);
            }
            else{

                servicioCarreras.save(carrera).then((data) =>{
    
                    setCarreras(null);
        
                    swal({
                        title: "¡Atención!",
                        text: "¡Se ha agregado la Carrera con Exito!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                      });
        
        
                      servicioCarreras.searchByDep(cookiedep).then(data =>{
                        setCarreras(data);
                    });
                });
                
            }
        });
    }

    const eliminar =(rowData) =>{

        swal({
            title: "¿Deseas Eliminar la Carrera?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
          }).then((OK) => {
      
            if(OK){
      
                console.log(rowData);

                servicioCarreras.delete(rowData.id_Carrera).then((data) =>{
                    setCarreras(null);

                    swal({
                        title: "¡Atención!",
                        text: "¡Se ha Eliminado la Carrera!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                        });

                        servicioCarreras.searchByDep(cookiedep).then(data => {setCarreras(data)})
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
                <Button icon="pi pi-pencil " className="p-button-rounded p-button-success" onClick={() => {setVisible(true) ; setIdCarrera(rowData.id_Carrera) ; setNombre(rowData.car_Nombre)}} />
            </>
            //</React.Fragment>
        );
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Agregar" icon="pi pi-user-plus"  iconPos="left" style={{backgroundColor:"red", borderColor:"red"}} onClick={() => {setVisible(false) ; agregar()}}  />
            </div>
        );
    }

    return (
        <div className="card" >
                <h1>Carreras</h1>
                <div className="card" >
                    <div style={{ display: "flex"}}>
                        <Button onClick={()=>{setVisible(true) ; setNombre("") ; setIdCarrera(null)}} 
                        style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"blue", borderColor:"blue"}} label="Nueva Carrera" icon="pi pi-file" iconPos="left" />
                    </div>
                    
                        <DataTable value={carreras}  scrollHeight="480px"  responsiveLayout="scroll" >
                        <Column header="Nombre" value={nombre} field='car_Nombre'  exportable={false} ></Column>
                        <Column header="Modificar" body={botonModificar} exportable={false} ></Column>
                        <Column header="Eliminar" body={botonEliminar} exportable={false}  ></Column>
                        </DataTable>
                </div>
           
            
                <Dialog header="Agregar Carrera" visible={visible} onHide={onHide} modal={true}  footer={renderFooter}>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                    <h5>Nombre</h5>
                                    <InputText  type="text" 
                                    value={nombre} onChange={(e) => {setNombre(e.target.value)}} style={{width:"15em"}}  />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Dialog>
            
        </div>
    )
}

export default Carreras;
