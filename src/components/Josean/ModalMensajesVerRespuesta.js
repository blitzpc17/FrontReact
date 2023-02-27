import React from 'react'
import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';



const ModalMensajesVerRespuesta = (props) => {

    const [displayDialog, setDisplayDialog] = useState(false)


    /*-----------MODAL--------------*/
    const onHide = () => {
        setDisplayDialog(false);
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Ok"  onClick={() => onHide()} autoFocus />
            </div>
        );
    }
    /*-----------END MODAL--------------*/

    
    const botonVer = (rowData) => {
        
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info"  onClick={() => {setDisplayDialog(true) ; setMensaje(rowData)}}/>
            </>
            //</React.Fragment>
        );
    }

    const dynamicColumns = props.columnas.map((col,i) => {
        return <Column key={col.field} field={col.field} header={col.header} />;
    });
        
    const [mensaje, setMensaje] = useState({
     
      men_fecha_envio : "",
      men_asunto:"",
      men_detalles:"",
      men_respuesta:"",
      men_numero_contacto:"",
      men_correo_contacto:"",
      men_informacion:"",

    })

  
    const dialogFecha = ( data ) =>{
        let browserType = data;        
        return(
            browserType.slice(0,10)
        )
    }

    return (
        <div>
            <div className="card">
                
                <DataTable style={{width:'80vw'}} value={props.mensajes}  scrollHeight="620px"  responsiveLayout="scroll">
                    {dynamicColumns}
                    <Column header="Ver" body={botonVer} exportable={false} ></Column>
                </DataTable>
            </div>
            <div className="card">
                <Dialog header="Informacion" footer={renderFooter} position="center" onHide={onHide} visible={displayDialog} style={{ width: '50vw' }} modal={true} >
                        
                    <table>
                        <tbody>
                        <tr>
                            <td style={{paddingRight: '5rem'}}>
                                <h5>Fecha</h5>
                                <span className="p-input-icon-left">
                                    <i className="pi pi-calendar" />
                                    <InputText value={dialogFecha(mensaje.men_fecha_envio)} style={{ width:"300px" }} />
                                </span>

                                <h5>Asunto</h5>
                                <span className="p-input-icon-left">
                                    <i className="pi pi-paperclip" />
                                    <InputText value={mensaje.men_asunto}  style={{ width:"300px" }} />
                                </span>

                                <h5>Detalles</h5>
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputTextarea value={mensaje.men_detalles} rows={5} style={{ width:"300px" }} />
                                </span>

                                <h5>Respuesta</h5>
                                <span className="p-input-icon-left">
                                    <i className="pi pi-comments" />
                                    <InputText value={mensaje.men_respuesta} style={{ width:"300px" }} />
                                </span>
                            </td>    
                            <td>
                                <h4 style={{marginBottom:"2em"}}>Informacion de la Empresa</h4>
                                <h5>Numero de Contacto</h5>
                                <span className="p-input-icon-left">
                                    <i className="pi pi-phone" />
                                    <InputText value={mensaje.men_numero_contacto} style={{ width:"300px" }}   />
                                </span>

                                <h5>Correo de Contacto</h5>
                                <span className="p-input-icon-left">
                                    <i className="pi pi-at" />
                                    <InputText value={mensaje.men_correo_contacto}  style={{ width:"300px" }} />
                                </span>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                </Dialog>
            </div>
        </div>
    )
}

export default ModalMensajesVerRespuesta
