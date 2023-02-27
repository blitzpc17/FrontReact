import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import ModalMensajesVerRespuesta from './ModalMensajesVerRespuesta';



const TablaCRUD = (props) => {


    const dynamicColumns = props.columnas.map((col,i) => {
        return <Column key={col.field} field={col.field} header={col.header} />;
    });


    const botonInformacion = (rowData) => {
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-info" className="p-button-rounded p-button-info"  />
                
            </>
            //</React.Fragment><ModalMensajesVerRespuesta visible={displayDialog} />
        );
    }


    const abrirPdf = (rowData)  => {
        window.open(rowData.frm_pdf_Formato)
    }

    const botonVer = (rowData) => {

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

    /*Demostracion*/
    const [pdf, setPdf] = useState({
        id_Formato:null,
        frm_pdf_Formato:"",
    });
    
    /*Demostracion*/
    const onChangeInputFile = (e) =>{
        console.log(e.target.files[0].name);
        pdf.frm_pdf_Formato=e.target.files[0].name;
        console.log(pdf.frm_pdf_Formato)
        props.refrescarPag(pdf);
    }

    /*setPdf es Demostracion*/
    const botonModificar = (rowData) => {
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-pencil " className="p-button-rounded p-button-success" onClick={()=> {document.getElementById("inputFile").click() ; setPdf(rowData) ; }}/>
                
            </>
            //</React.Fragment>
        );
    }
    

    const botonEliminar = (rowData) => {
        
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => {props.metodoEliminarpdf(rowData)}} />
                
            </>
            //</React.Fragment>
        );
    }



    return (
        <div>
            <h1>TABLA CRUD</h1>
            <div className="card">
                <DataTable value={props.formatos}  scrollHeight="620px"  responsiveLayout="scroll" style={{width:'80vw'}} >
                {dynamicColumns}
                <Column header="Informacion" body={botonInformacion} exportable={false} ></Column>
                <Column header="Ver" body={botonVer} exportable={false} ></Column>
                <Column header="Modificar" body={botonModificar} exportable={false} ></Column>
                <Column header="Eliminar" body={botonEliminar} exportable={false}  ></Column>
                </DataTable>
                <input type="file" id="inputFile" hidden accept=".pdf" onChange={(e) => onChangeInputFile(e)}/>
            </div>
        </div>
    );
}

export default TablaCRUD

