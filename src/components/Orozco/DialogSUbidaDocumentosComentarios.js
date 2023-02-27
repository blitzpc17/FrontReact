import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';

const DialogSUbidaDocumentosComentarios = (props) => {
    
    const subirPdf = () =>{
        document.getElementById("inputFileDSC").click();
    }

    return (
        <div>
            <Dialog header={props.header} visible={props.visible} modal={true} style={{width: '900px'}} onHide={props.onHide}>

                <table>
                    <tbody>
                        <tr>
                            <td align='right' style={{width: '300px'}}>
                                { (props.urlDoc == null) ? <img src="/pdfs/pdfDefault.png" height='360px' width='280px' title='' /> :  <iframe src={ props.urlDoc } height='360px' width='280px'/> }
                            </td>

                            <td align='center' style={{width: '300px'}}>
                                <Button label={(props.urlDoc === null) ? "Subir" : "Cambiar"} className="p-button-success" icon="pi pi-cloud-upload" style={{width: '150px', marginTop: '20px'}} onClick={subirPdf}/>
                                <Button label="Eliminar" className="p-button-danger" icon="pi pi-trash" style={{width: '150px', marginTop: '20px', marginBottom: '60px'}} onClick={props.eliminarPDF}/>
                                <input type="file" id="inputFileDSC" hidden accept=".pdf" onChange={(e) => props.onChangeInputFile(e.target.files[0])}/>
                            </td>

                            <td align='center' style={{width: '350px'}}>
                                Comentarios
                                <InputTextarea rows={5} cols={30} value={props.comentario} contentEditable={false} style={{ marginBottom: '40px' }}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ marginTop: '10px' }}>
                    Estado: {props.estado}
                </div>
            </Dialog>
        </div>
    )
}

export default DialogSUbidaDocumentosComentarios;
