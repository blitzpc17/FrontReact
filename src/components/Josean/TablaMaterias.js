import React from 'react'
import { useState } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import swal from 'sweetalert';

const TablaMaterias = (props) => {

    const [visible, setVisible] = useState(false);
    const [matnombre, setMatnombre] = useState("");
    const [matclave, setMatclave] = useState("");
    const [idmateria, setIdmateria] = useState(null);
    const [estado, setEstado] = useState(false);

    const onHide = () => {
    
        setVisible(false);
   }

   const botonModificar = (rowData) => {


    return (
        //<React.Fragment> Fragmento simplificado abajo
        <>
            <Button icon="pi pi-pencil " className="p-button-rounded p-button-success" onClick={()=> {
                setVisible(true) ; console.log(rowData) ; setMatnombre(rowData.mat_Nombre) ; setMatclave(rowData.mat_Clave) ; setIdmateria(rowData.id_Materia); setEstado(true)}} />
            
        </>
        //</React.Fragment>
    );
}


   const botonEliminar = (rowData) => {
        
    return (
        //<React.Fragment> Fragmento simplificado abajo
        <>
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => {props.eliminar(rowData)}} />
            
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
                id_Departamento: 2,
                mat_Clave: matclave,
                mat_Nombre: matnombre,
                mat_creado_por: null,
                mat_fecha_creacion: null,
                mat_actualizado_por: null,
                mat_fecha_actualizacion: null
                
            }
        
            props.agregar(materia,estado);
          
        }
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
        <div>
            <div>
                <h1>Materias</h1>
                <div className="card" >
                    <div style={{ display: "flex"}}>
                        <Button onClick={()=>{setVisible(true) ; setMatclave("") ; setMatnombre("") ; setEstado(false)}} 
                        style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"green", borderColor:"green"}} label="Nueva Materia" icon="pi pi-book" iconPos="left" />
                    </div>
                    <div className="card" >
                        <DataTable value={props.materias}  scrollHeight="480px"  responsiveLayout="scroll" style={{width:'80vw'}} >
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
            
            
        </div>
    )
}

export default TablaMaterias
