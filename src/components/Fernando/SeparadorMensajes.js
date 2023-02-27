import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Panel } from 'primereact/panel';

const SeparadorMensajes = (props) => {
    return (
        <div>
            <div className="card">                
               <Panel>
                    <div className="textoA">{ "Mensajes " + props.titulo}</div>                     
                    <TabView className="tabview-custom">
                        <TabPanel header="Enviados" leftIcon="pi pi-send">
                            {props.enviados}                             
                        </TabPanel>
                        <TabPanel header="Recibidos" leftIcon="pi pi-bell">
                            {props.recibidos}                         
                        </TabPanel>                   
                    </TabView>
               </Panel>
            </div>
        </div>
    )
}

export default SeparadorMensajes
