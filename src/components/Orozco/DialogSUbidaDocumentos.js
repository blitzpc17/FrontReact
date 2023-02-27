import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import swal from 'sweetalert';

const DialogSUbidaDocumentos = (props) => {

    const subirPdf = () =>{
        document.getElementById("inputFileDSD").click();
    }

    const eliminar = () =>{
        swal({
            title: "¿Deseas Eliminar el Archivo?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
        }).then((OK) => {
            if(OK){
                props.eliminarPDF();
            }else{
                swal({
                    title: "¡Atención!",
                    text: "¡No se ha Eliminado el Archivo!",
                    icon: "info",
                    button: "Aceptar",
                    timer: "3000"
                });
            }
        });
    }

    return (
        <div>
            <Dialog header="Gestión de Documentos" visible={props.visible} modal={true} style={{width: '750px'}} onHide={props.onHide}>

                <table>
                    <tbody>
                        <tr>
                            <td align='right' style={{width: '370px'}}>
                                { (props.urlDoc == null) ? <img src="/pdfs/pdfDefault.png" height='360px' width='280px' /> :  <iframe src={  props.urlDoc } height='360px' width='280px'/> }
                            </td>

                            <td align='center' style={{width: '300px'}}>
                                <h2 align='center'>{props.header}</h2>
                                <h3 align='center'>{props.usuario}</h3>
                                <Button label={(props.urlDoc === null) ? "Subir" : "Cambiar"} className="p-button-success" icon="pi pi-cloud-upload" style={{width: '150px', marginTop: '20px'}} onClick={subirPdf}/>
                                <Button label="Eliminar" className="p-button-danger" disabled= { (props.urlDoc === null)? true : false } icon="pi pi-trash" style={{width: '150px', marginTop: '20px', marginBottom: '60px'}} onClick={eliminar}/>
                                <input type="file" id="inputFileDSD" hidden accept=".pdf" onChange={(e) => props.onChangeInputFile(e.target.files[0])}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Dialog>
        </div>
    )
}

export default DialogSUbidaDocumentos;
