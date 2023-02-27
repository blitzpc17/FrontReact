import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';



const TablaBotonVer = (props) => {


    const dynamicColumns = props.columnas.map((col,i) => {
        return <Column key={col.field} field={col.field} header={col.header} />;
    });

    

    const abrirPdf = (rowData)  => {
        window.open(rowData.frm_pdf_Formato)
    }

    const actionBodyTemplate = (rowData) => {
        
        if(rowData.frm_pdf_Formato!=null){
            return (
                //<React.Fragment> Fragmento simplificado abajo
                <>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" onClick={() => {abrirPdf(rowData)}}/>
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
        <div>
            <h1>TABLA BOTON VER</h1>
            <div className="card">
                <DataTable value={props.formatos} scrollable scrollHeight="650px">
                {dynamicColumns}
                <Column header="Ver" body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>
        </div>
    );
}
export default TablaBotonVer;





