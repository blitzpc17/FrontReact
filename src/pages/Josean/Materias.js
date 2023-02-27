import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ServicioMaterias } from '../../services/Josean/ServicioMaterias';

import swal from 'sweetalert';
import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const Materias = (props) => {

    const [visible, setVisible] = useState(false);
    const [matnombre, setMatnombre] = useState("");
    const [matclave, setMatclave] = useState("");
    const [idmateria, setIdmateria] = useState(null);
    const [materias, setMaterias] = useState();
    const [estado, setEstado] = useState(false);

    var cookiedep=cookies.get('id_Departamento');

    var servicioMaterias= new ServicioMaterias();

    const onHide = () => {
    
        setVisible(false);
   }

   useEffect(() => {
    servicioMaterias.searchByDep(cookiedep).then(data => setMaterias(data));  
   }, [])


   const botonModificar = (rowData) => {
    return (
        //<React.Fragment> Fragmento simplificado abajo
        <>
            <Button icon="pi pi-pencil " className="p-button-rounded p-button-success" onClick={()=> {
                setVisible(true) ; setMatnombre(rowData.mat_Nombre) ; setMatclave(rowData.mat_Clave) ; setIdmateria(rowData.id_Materia) ; setEstado(true)}} />
            
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

const agregarMateria = () => {

    if(matnombre ===null || matnombre === "" || 
        matclave === null || matclave === "" ){

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

            const materia ={
    
                id_Materia: idmateria,
                id_Departamento: cookiedep,
                mat_Clave: matclave,
                mat_Nombre: matnombre,
                mat_creado_por: null,
                mat_fecha_creacion: null,
                mat_actualizado_por: null,
                mat_fecha_actualizacion: null
                
            }
        
            agregar(materia,estado);
          
        }
    }


    const agregar=(materia,estado)=>{

        if(estado){
            
            servicioMaterias.comprobarMat(materia.id_Departamento,materia.mat_Clave).then(mat => {
                if(materia.id_Materia === mat.id_Materia){
                    servicioMaterias.save(materia).then(data=>{
                        setMaterias(null);
                
                        swal({
                            title: "¡Atención!",
                            text: "¡Se ha agregado la Materia con Exito!",
                            icon: "success",
                            button: "Aceptar",
                            timer: "3000"
                        });
                    
                        servicioMaterias.searchByDep(cookiedep).then( data => {setMaterias(data)});
                    
                    });
                }
                else{
                    servicioMaterias.comprobarMat(materia.id_Departamento,materia.mat_Clave).then(data => {
                        if(data.id_Materia !== undefined){
                            swal({
                                title: "¡Atención!",
                                text: "¡Ya existe dicha materia!",
                                icon: "warning",
                                button: "Aceptar",
                                timer: "3000"
                            });

                            setVisible(true);
                        }
                        else{
                            servicioMaterias.save(materia).then(data=>{
                                setMaterias(null);
                        
                                swal({
                                    title: "¡Atención!",
                                    text: "¡Se ha agregado la Materia con Exito!",
                                    icon: "success",
                                    button: "Aceptar",
                                    timer: "3000"
                                });
                            
                                servicioMaterias.searchByDep(cookiedep).then( data => {setMaterias(data)});
                            
                            });
                        }
                    }) 
                }
            })
        }
        else{
            servicioMaterias.comprobarMat(materia.id_Departamento,materia.mat_Clave).then(mat => {
                if(mat.mat_Clave !== undefined){
                    swal({
                        title: "¡Atención!",
                        text: "¡Ya existe dicha materia!",
                        icon: "warning",
                        button: "Aceptar",
                        timer: "3000"
                    });

                    setVisible(true);
                }
                else{
                    servicioMaterias.save(materia).then(data=>{
                        setMaterias(null);
                
                        swal({
                            title: "¡Atención!",
                            text: "¡Se ha agregado la Materia con Exito!",
                            icon: "success",
                            button: "Aceptar",
                            timer: "3000"
                        });
                    
                        servicioMaterias.searchByDep(cookiedep).then( data => {setMaterias(data)});
                    
                    });
                }
            });
        }
    }

    const eliminar=(data)=>{
        swal({
            title: "¿Deseas Eliminar la Materia?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
          }).then((OK) => {
      
            if(OK){
      
              console.log(data);
      
              servicioMaterias.delete(data.id_Materia).then(data=>{
             
                  swal({
                    title: "¡Atención!",
                    text: "¡Se ha Eliminado la Materia!",
                    icon: "success",
                    button: "Aceptar",
                    timer: "3000"
                  });
                
                  servicioMaterias.searchByDep(cookiedep).then( data => {setMaterias(data)});
                
              });
              
            }else{
              swal({
                title: "¡Atención!",
                text: "¡No se ha Eliminado la Materia!",
                icon: "info",
                button: "Aceptar",
                timer: "3000"
              });
            }
      
          });
    }

   const renderFooter = () => {
    return(
        <>

         <div style={{ display: "flex"}}>
             <Button style={{marginLeft: "auto", backgroundColor:"green", borderColor:"green", marginTop:"1.5em"}} label="Agregar" icon="pi pi-book" iconPos="left" 
             onClick={() => {setVisible(false) ; agregarMateria();}}></Button>
         </div>
        
            </>
        )
    }



    return (
        <Dialog header="Convocatorias" visible={props.visible} modal={true} style={{width: '95%'}} onHide={props.onHide}>
            <div>
                <h1>Materias</h1>
                <div className="card" >
                    <div style={{ display: "flex"}}>
                        <Button onClick={()=>{setVisible(true) ; setMatclave("") ; setMatnombre("") ; setEstado(false); setIdmateria(null)}} 
                        style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"green", borderColor:"green"}} label="Nueva Materia" icon="pi pi-book" iconPos="left" />
                    </div>
                    <div className="card" >
                        <DataTable value={materias}  scrollHeight="480px"  responsiveLayout="scroll">
                        <Column header="Materia" field='mat_Nombre' exportable={false} ></Column>
                        <Column header="Clave" field='mat_Clave'  exportable={false} ></Column>
                        <Column header="Modificar" body={botonModificar} exportable={false} ></Column>
                        <Column header="Eliminar" body={botonEliminar} exportable={false}  ></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <div className="card" >
                <Dialog header="Agregar Materia" visible={visible} onHide={onHide} modal={true} footer={renderFooter}>
                
                            <div style={{paddingRight: '5rem' , paddingLeft: '5rem'}}>
                               
                                <h5>Nombre de la Materia</h5>
                                <InputText value={matnombre}  type="text" style={{width:'15em'}}
                                onChange={(e) => {setMatnombre(e.target.value)}  }/>
                      

                                <h5>Clave de la Materia</h5>
                                <InputText value={matclave}  type="text"  style={{width:'15em'}}
                                onChange={(e) => {setMatclave(e.target.value)}  }/>
                                
                            </div>
                </Dialog>
            </div>
        </Dialog>
    )
}

export default Materias