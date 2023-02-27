import { Dialog } from 'primereact/dialog';
import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';

const ModalRetroalimentacion = (props) => {

    return (
        <div>
          
         
         <Dialog header={props.header} visible={props.visible} modal={props.modal} style={props.style}  onHide={props.onHide}>        
         <center><InputTextarea rows={5} cols={30} value={props.comentario} contentEditable={false}/></center>
         <br/>
         <br/>
         <center><label htmlFor="nom">Estado: {props.estado}</label></center>
         </Dialog>
        </div>
    )
}

export default ModalRetroalimentacion
