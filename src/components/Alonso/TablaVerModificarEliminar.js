import { DataTable } from 'primereact/datatable';
import React from 'react';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';
import { Panel } from 'primereact/panel';
const TablaVerModificarEliminar = (props) => {

        return (        
            <div>
                 <center><h2>{props.titulo}</h2></center>
             <Panel>
                <DataTable value={props.value} selectionMode={props.selectionMode} selection={props.selection} scrollable={props.scrollable} scrollHeight={props.scrollHeight} onSelectionChange={props.onSelectionChange}>                                         
                    { props.value2.map((d,index) => ( <Column  key={index} field={d.field} header={d.header}> </Column> ))  } 
                    <Column header="Ver" body={props.bodyV}></Column>                                            
                    <Column header="Modificar" body={props.bodyM}></Column>  
                    <Column header="Eliminar" body={props.bodyE}></Column>          
                </DataTable>     
             </Panel>
                
               
         </div>
        
    )       
    }
 


export default TablaVerModificarEliminar


 