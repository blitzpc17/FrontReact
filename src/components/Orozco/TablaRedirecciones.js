import React from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';

const TablaRedirecciones = (props) => {
    
    const actionBodyTemplate = (rowData, columna) => {
        return (
            <>
                <Button icon={columna.icon} className={columna.className} onClick={() => columna.accion(rowData)}/>
            </>
        );
    }
    
    return (
        <div>
            <Panel>
                <DataTable value={props.value}>
                    {props.columnas.map((columna, index) => {
                        if(!columna.redireccion)
                            return <Column key={index} field={columna.field} header={columna.header}></Column>
                        else{
                            return <Column key={index} body={(rowData) => actionBodyTemplate(rowData,columna)} header={columna.header}></Column>
                        }
                    })}
                    
                </DataTable>
            </Panel>
        </div>
    )
}

export default TablaRedirecciones