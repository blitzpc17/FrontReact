import React from 'react'
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import swal from 'sweetalert';
import { ServicioCubiculos } from '../../services/Josean/ServicioCubiculos'
import { ServicioConsultaCubiculos } from '../../services/Josean/ServicioConsultaCubiculos';
import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const CubiculosJA = (props) => {

    const [cubiculos, setCubiculos] = useState();

    var servicioCubiculos= new ServicioCubiculos();
    var servicioconsCubiculos= new ServicioConsultaCubiculos();

    const cookiedep=cookies.get('id_Departamento');

    useEffect(() => {
        servicioconsCubiculos.search(cookiedep).then(data => {setCubiculos(data)});
        
    }, []);

    

    const estado = (rowData) =>{


        return(
            <DropDownVisible
                valor={rowData.cub_Estado}                   
                data={rowData}     
                guardar={save}
            />
        )
    
    }

    const save = (cubiculo) =>{

        servicioCubiculos.save(cubiculo).then(data => {

            setCubiculos(null);

            swal({
                title: "¡Atención!",
                text: "¡Se ha Guardado el Estado!",
                icon: "success",
                button: "Aceptar",
                timer: "3000"
              });
          
            
  
            servicioconsCubiculos.search(cookiedep).then( data => {setCubiculos(data)});

        });
    }

    const inventario = (rowData) =>{

        if(rowData.cub_Inventario!=null){
            return (
                //<React.Fragment> Fragmento simplificado abajo
                <>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" onClick={() => {window.open(rowData.cub_Inventario)}}/>
                </>
                //</React.Fragment>
            );
        }
        else{
            return (
                //<React.Fragment> Fragmento simplificado abajo
                <>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled/>
                </>
                //</React.Fragment>
            );
        }

    }



    const firma = (rowData) =>{
        
        if(rowData.cub_firmaaceptacion!=null){
            return (
                //<React.Fragment> Fragmento simplificado abajo
                <>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" onClick={() => {window.open(rowData.cub_firmaaceptacion)}}/>
                </>
                //</React.Fragment>
            );
        }
        else{
            return (
                //<React.Fragment> Fragmento simplificado abajo
                <>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled/>
                </>
                //</React.Fragment>
            );
        }

    }


    return (
        <div className='card'> 
            <Dialog header="Cubículos" visible={props.visible} modal={true} style={{width: '950px'}} onHide={props.onHide}>
                <div className="card" > 
                        <DataTable value={cubiculos}  scrollHeight="480px"  responsiveLayout="scroll">
                        <Column header="Nombre"  field='cub_Nombre'  exportable={false} ></Column>
                        <Column header="A Cargo"  field='user_Nombre' exportable={false} ></Column>
                        <Column header="Estado" body={estado} field='cub_Estado' exportable={false} ></Column>
                        <Column header="Inventario" body={inventario} field='cub_Inventario' exportable={false} ></Column>
                        <Column header="Firma de Aceptacion" body={firma} field='cub_firmaaceptacion' exportable={false} ></Column>
                        </DataTable>
                </div>
            </Dialog>
            
        </div>
    )
}

export default CubiculosJA


function DropDownVisible(props){
    const [estado, setEstado] = useState(props.valor);

    const states =[
        {name:"--Sin Responder--", code: 0},
        {name:"Aceptado", code: 1},
        {name:"Rechazado", code: 2},
    ]

    const agregar = (value) =>{
        
        if(value ===0){
            swal({
                title: "¡Atención!",
                text: "¡No se puede seleccionar esa opción!",
                icon: "warning",
                button: "Aceptar",
                timer: "3000"
              });

            
        }
        else{
            setEstado(value);

            const drop={
                id_Cubiculo: props.data.id_Cubiculo,
                id_Usuarios: props.data.id_Usuarios,
                cub_Nombre: props.data.cub_Nombre,
                cub_Estado: value,
                cub_Inventario: props.data.cub_Inventario,
                cub_firmaaceptacion: props.data.cub_firmaaceptacion,
                cub_creado_por: null,
                cub_fecha_creacion: null,
                cub_actualizado_por: null,
                cub_fecha_actualizacion: null
            }
    
            props.guardar(drop);
        }
    }
  

    
     if(props.data.cub_Estado === 0){
        return (
        //<React.Fragment> Fragmento simplificado abajo
        <>
        <Dropdown value={estado} optionValue='code' options={states} onChange={(e) => {agregar(e.target.value)}} optionLabel="name" placeholder="--Sin responder--" style={{width:"10em" ,backgroundColor:"var(--yellow-500)"}}/>
        </>
        //</React.Fragment>
        );   
     }
    else if(props.data.cub_Estado === 2){
        return (
        //<React.Fragment> Fragmento simplificado abajo
        <>
        <Dropdown value={estado} optionValue='code' options={states} onChange={(e) => {agregar(e.target.value)}} optionLabel="name" placeholder="--Sin responder--" style={{width:"10em" ,backgroundColor:"red"}}/>
        </>
        //</React.Fragment>
    );    
    }else{
        return (
        //<React.Fragment> Fragmento simplificado abajo
        <>
        <Dropdown value={estado} optionValue='code' options={states} onChange={(e) => {agregar(e.target.value)}} optionLabel="name" placeholder="--Sin responder--" style={{width:"10em" , backgroundColor:"var(--green-500)"}}/>
        </>
        //</React.Fragment>
    ); 
    }
    
} 
