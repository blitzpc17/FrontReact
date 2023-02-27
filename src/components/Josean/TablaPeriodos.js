import React from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';


const TablaPeriodos = (props) => {

    const [checked, setChecked] = useState(false);
    const [visible, setVisible] = useState(false);
    const [mesini, setMesini] = useState(null);
    const [mesfin, setMesfin] = useState(null);
    const [year, setYear] = useState("");
    const [idperiodo, setIdperiodo] = useState(null);


    const meses = [
        {name:"Enero", code: 1},
        {name:"Febrero", code: 2},
        {name:"Marzo", code: 3},
        {name:"Abril", code: 4},
        {name:"Mayo", code: 5},
        {name:"Junio", code: 6},
        {name:"Julio", code: 7},
        {name:"Agosto", code: 8},
        {name:"Septiembre", code: 9},
        {name:"Octubre", code: 10},
        {name:"Noviembre", code: 11},
        {name:"Diciembre", code: 12}
    ]



    const botonModificar = (rowData) => {


        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-pencil " className="p-button-rounded p-button-success" onClick={()=> {setVisible(true) ;
                setMesini(regresames(rowData.per_Mes_Inicio));setMesfin(regresames(rowData.per_Mes_Fin)); setYear(rowData.per_Year); setIdperiodo(rowData.id_Periodo) ;console.log(rowData) ; }} />
                
            </>
            //</React.Fragment>
        );
    }

    const regresames =(nummes) =>{
        
        let per="";

        switch(nummes){
            case 1:{
                per+="Enero";
                break;
            }
            case 2:{
                per+="Febrero";
                break;
            }
            case 3:{
                per+="Marzo";
                break;
            }
            case 4:{
                per+="Abril";
                break;
            }
            case 5:{
                per+="Mayo";
                break;
            }
            case 6:{
                per+="Junio";
                break;
            }
            case 7:{
                per+="Julio";
                break;
            }
            case 8:{
                per+="Agosto";
                break;
            }
            case 9:{
                per+="Septiembre";
                break;
            }
            case 10:{
                per+="Octubre";
                break;
            }
            case 11:{
                per+="Noviembre";
                break;
            }
            case 12:{
                per+="Diciembre";
                break;
            }
            default:{
                per+="Error";
                break;
            }
        }


        return({name: per, code: nummes});
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

   
    var chek;
    var [numero, setNumero] = useState(0);

    const booleanSwitch=(valor)=>{
        setNumero(valor ? 1:0);        
    }
    const falso=()=>{
        chek = false;
    }

    const estado = (rowData) => {

        return(
            <SwitchVisible
                valor={rowData.per_Estado == 1}                 
                cambio={booleanSwitch}  
                estado={falso} 
                datos={rowData} 
                guardar={props.agregar}        
            />
        )
        
    }

    const concat =(rowData) =>{
        console.log("hola periodos");
        let per="";

        switch(rowData.per_Mes_Inicio){
            case 1:{
                per+="Enero";
                break;
            }
            case 2:{
                per+="Febrero";
                break;
            }
            case 3:{
                per+="Marzo";
                break;
            }
            case 4:{
                per+="Abril";
                break;
            }
            case 5:{
                per+="Mayo";
                break;
            }
            case 6:{
                per+="Junio";
                break;
            }
            case 7:{
                per+="Julio";
                break;
            }
            case 8:{
                per+="Agosto";
                break;
            }
            case 9:{
                per+="Septiembre";
                break;
            }
            case 10:{
                per+="Octubre";
                break;
            }
            case 11:{
                per+="Noviembre";
                break;
            }
            case 12:{
                per+="Diciembre";
                break;
            }
            default:{
                per+="Error";
                break;
            }
        }

        switch(rowData.per_Mes_Fin){
            case 1:{
                per+="-Enero";
                break;
            }
            case 2:{
                per+="-Febrero";
                break;
            }
            case 3:{
                per+="-Marzo";
                break;
            }
            case 4:{
                per+="-Abril";
                break;
            }
            case 5:{
                per+="-Mayo";
                break;
            }
            case 6:{
                per+="-Junio";
                break;
            }
            case 7:{
                per+="-Julio";
                break;
            }
            case 8:{
                per+="-Agosto";
                break;
            }
            case 9:{
                per+="-Septiembre";
                break;
            }
            case 10:{
                per+="-Octubre";
                break;
            }
            case 11:{
                per+="-Noviembre";
                break;
            }
            case 12:{
                per+="-Diciembre";
                break;
            }
            default:{
                per+="-Error";
                break;
            }
        }

        return(per);
    }

  
    


   const onHide = () => {
    
        setVisible(false);
        setMesini(null) ; 
        setMesfin(null) ; 
        setYear("")
   }

   const asignarDatos = () =>{

        const periodo ={
    
            id_Periodo: idperiodo,
            per_Mes_Inicio: mesini.code,
            per_Mes_Fin: mesfin.code,
            per_Year: year,
            per_Estado: true,
            per_lbl_Periodo: "NO",
            per_creado_por: "",
            per_fecha_creacion: null,
            per_actualizado_por: "",
            per_fecha_actualizacion: null
        }

        props.agregar(periodo,1);
   }

   const renderFooter = () => {
       return(
           <>

            <div style={{ display: "flex"}}>
                <Button style={{marginLeft: "auto", backgroundColor:"purple", borderColor:"purple", marginTop:"1.5em"}} label="Agregar" icon="pi pi-calendar-plus" iconPos="left" 
                onClick={() => {setVisible(false) ; asignarDatos()}}></Button>
            </div>
           
           </>
       )
   }
   

    return (

        <div>
            <div>
                <h1>Periodos</h1>
                <div className="card" >
                    <div style={{ display: "flex"}}>
                        <Button onClick={()=>{setVisible(true) ;setMesini("Selecciona un Mes");setMesfin("Selecciona un Mes");setYear(""); setIdperiodo(null)}} 
                        style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"purple", borderColor:"purple"}} label="Nuevo Periodo" icon="pi pi-calendar-plus" iconPos="left" />
                    </div>
                    <div className="card" >
                        <DataTable value={props.periodos} scrollable scrollHeight="480px"  responsiveLayout="scroll" style={{width:'80vw'}} >
                        <Column header="Periodo" body={concat}  exportable={false} ></Column>
                        <Column header="Año" field='per_Year'  exportable={false} ></Column>
                        <Column header="Estado" field='per_Estado' body={estado} exportable={false} ></Column>
                        <Column header="Modificar" body={botonModificar} exportable={false} ></Column>
                        <Column header="Eliminar" body={botonEliminar} exportable={false}  ></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <div className="card" >
                <Dialog header="Agregar Periodo" visible={visible} onHide={onHide} modal={true} footer={renderFooter}>
                    <table>
                        <tbody>
                        <tr>
                            <td style={{paddingRight: '5rem'}}>
                                <h5>Mes de Inicio</h5>
                                    <Dropdown value={mesini} options={meses} onChange={(e) => {setMesini(e.target.value)}} optionLabel="name"
                                    placeholder="Selecciona un Mes" style={{width:"15em"}} />
                                
                                <h5>Mes de Termino</h5>
                                    <Dropdown value={mesfin} options={meses} onChange={(e) => {setMesfin(e.target.value)}} optionLabel="name"
                                    placeholder="Selecciona un Mes" style={{width:"15em"}}  />
                                

                                <h5>Año</h5>
                                    <InputText  type="text" 
                                    onKeyPress={(event) => {if (!/[0-9]/.test(event.key)) {event.preventDefault()}}} 
                                    value={year} onChange={(e) => {setYear(e.target.value)}} style={{width:"15em"}}  />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Dialog>
            </div>
            
            
        </div>
    )
}

export default TablaPeriodos

function SwitchVisible  (props){
    const [checked1, setChecked1] = useState(props.valor);    

    const cambioVisibilidad=()=>{ 
        props.cambio(checked1)                                   
    }

    const guardarVisibilidad=()=>{        
        const periodo = {
            ...props.datos,
            "per_Estado":checked1 ? 0:1            
        }

        props.guardar(periodo,2);
    }
    return(
        <div >                        
            <InputSwitch 
            checked={checked1} 
            onChange={(e) => {setChecked1(e.value); cambioVisibilidad(); guardarVisibilidad()          
            }}
            />
        </div>
    )

}
