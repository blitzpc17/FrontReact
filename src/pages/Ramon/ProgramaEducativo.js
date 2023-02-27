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
import { ServicioProgramaEducativo } from '../../services/Ramon/ServicioProgramaEducativo';

import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const ProgramaEducativo = () => {
    const navigate = new useNavigate();

    const [visible, setVisible] = useState(false);

    const [documentos, setDocumentos] = useState(null);
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [fecha, setFecha] = useState("");
    const [enlace, setEnlace] = useState("");
    const [id, setId] = useState("");
    const [btntitle, setbtntitle] = useState("")

    var cookiedep=cookies.get('id_Departamento');

    var servicioCarreras = new ServicioCarreras();
    var servicioPrograma = new ServicioProgramaEducativo;

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Programa Educativo'){
               /* servicioCarreras.searchByDep(cookiedep).then(data =>{
                    console.log(data)
                    setCarreras(data);
                });*/

               listar();
            }
            else
                navigate('/plataforma/menudepartamental');
        }
        
    }, []);

    const onHide = () => {
        setVisible(false);
    }

    function listar() {
        return servicioPrograma.getAll().then(data => {
            setDocumentos(data);
        });
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
/*
                const carrera= {
                    id_Carrera : idCarrera,
                    id_Departamento: cookiedep,
                    car_Nombre : nombre,
                    car_creado_por : null,
                    car_fecha_creacion : null,
                    car_actualizado_por : null,
                    car_fecha_actualizacion : null
                }
    
                save(carrera)*/

                const documento = {
                    id: id,
                    tipo:tipo,
                    nombre:nombre,
                    fecha:"2023-02-16",
                    enlace:enlace
                }

                save(documento)
            }
        }
        
    

    const save = (documento) => {

        /*servicioPrograma.comprobarPrograma(documento.id, documento.tipo, documento.nombre, documento.fecha).then(data => {
            if(data.tipo !== undefined){
                swal({
                    title: "¡Atención!",
                    text: "¡Ya existe el tipo de documento!",
                    icon: "warning",
                    button: "Aceptar",
                    timer: "3000"
                });

                setVisible(true);
            }
            else{

                servicioPrograma.save(documento).then((data) =>{
    
                    setDocumentos(null);
        
                    swal({
                        title: "¡Atención!",
                        text: "¡Se ha agregado el tipo de documento con Exito!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                      });
        
        
                 
                });
                
            }
            
        });*/
        servicioPrograma.save(documento).then((data)=>{
            setDocumentos(null);
        
                    swal({
                        title: "¡Atención!",
                        text: "¡Se ha agregado el tipo de documento con Exito!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                      });
                      
                    listar();
        });
    }

    const eliminar =(rowData) =>{

        swal({
            title: "¿Deseas Eliminar este tipo de documento?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
          }).then((OK) => {
      
            if(OK){

                servicioPrograma.delete(rowData.id).then((data) =>{
                    setDocumentos(null)

                    swal({
                        title: "¡Atención!",
                        text: "¡Se ha Eliminado el tipo de documento!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                        });

                       // servicioCarreras.searchByDep(cookiedep).then(data => {setCarreras(data)})
                       listar();

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
            <>
                <Button icon="pi pi-pencil " className="p-button-rounded p-button-success" onClick={() => {setVisible(true) ; setId(rowData.id) ; setNombre(rowData.nombre) ; setEnlace(rowData.enlace) ; setTipo(rowData.tipo) ; setbtntitle("Modificar") }} />
            </>
        );
    }

    const botonVer = (rowData) => {
        return (
            <>
                <Button icon="pi pi-list" className="p-button-rounded p-button-primary" onClick={() => {setVisible(true) ; setId(rowData.id) ; setNombre(rowData.nombre) ; setEnlace(rowData.enlace) ; setTipo(rowData.tipo)}} />
            </>
        );
    }


    const renderFooter = () => {
        return (
            <div>
                <Button label={btntitle}   className='p-button-rounded p-button-primary' onClick={() => {setVisible(false) ; agregar()}}  />
                <Button label="Cancelar"  className='p-button-rounded p-button-secondary' onClick={() => {setVisible(false)}}  />
            </div>
        );
    }

    return (
        <div className="card" >
                <h1>Programa Educativo</h1>
                <div className="card" >
                    <div style={{ display: "flex"}}>
                        <Button onClick={()=>{setVisible(true) ; setNombre("") ; setId("") ; setbtntitle("Agregar") ; setEnlace("") ; setTipo("") ;}} 
                        style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"blue", borderColor:"blue"}} label="Agregar" icon="pi pi-file" iconPos="left" />
                    </div>
                    
                        <DataTable value={documentos}  scrollHeight="480px"  responsiveLayout="scroll" >
                        <Column header="Tipo de Documento" value={tipo} field='tipo'  exportable={false} ></Column> 
                        <Column header="Fecha" value={fecha} field='fecha'  exportable={false} ></Column>
                        <Column header="Nombre del Documento" value={nombre} field='nombre'  exportable={false} ></Column>
                        <Column header="Ver" body={botonVer} exportable={false} ></Column>
                        <Column header="Modificar" body={botonModificar} exportable={false} ></Column>
                        <Column header="Eliminar" body={botonEliminar} exportable={false}  ></Column>
                        </DataTable>
                </div>
           
            
                <Dialog header="Nuevo tipo documento" visible={visible} style={{ width:'50vw'}} onHide={onHide} modal={true}  footer={renderFooter}>
                    <table>
                        <tbody>
                        <tr>
                            <td>                                  
                                    <h5>Nombre del documento</h5>
                                    <InputText  type="text" 
                                    value={nombre} onChange={(e) => {setNombre(e.target.value)}} style={{width:"100%"}}  />                                    

                            </td>                           
                        </tr>
                        <tr>
                        <td>                                
                                    <h5>Tipo de documento</h5>
                                    <InputText  type="text" 
                                    value={tipo} onChange={(e) => {setTipo(e.target.value)}} style={{width:"100%"}}  />                                    
                            </td>
                        </tr>
                        <tr>
                            
                        <td>
                                    <h5>Agregar enlace:</h5>
                                    <InputText  type="text" 
                                    value={enlace} onChange={(e) => {setEnlace(e.target.value)}} style={{width:"100%"}}  />
                            </td>
                        </tr>

                        </tbody>
                    </table>
                    <InputText type="hidden" value = {id} />
                </Dialog>
            
        </div>
    )
}

export default ProgramaEducativo;
