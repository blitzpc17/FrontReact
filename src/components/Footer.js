import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './Footer.css';
function Footer() {
    const [displayBasic, setDisplayBasic] = useState(null);
    const dialogFuncMap = {
        'displayBasic': setDisplayBasic        
    }
    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }
    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);
    }
    return (         
        <footer className='main-footer'>
            <Dialog header="PLATAFORMA DE GESTIÓN DOCUMENTAL DE SERVICIOS DOCENTES" visible={displayBasic} style={{ width: window.screen.width <= 1200 ? '100vw' : '50vw' }} onHide={() => onHide('displayBasic')}>
                <table border="0">
                    <tbody>
                        <tr>
                            <td> <img src="/tecLogo.jpg" height='300px' width='320px' /> </td>
                            {window.screen.width > 1200 ? 
                                <td style={{ paddingLeft: '20px', paddingBottom: '20px' }} key={1}>
                                    <h2 style={{ textAlign: 'center' }}>INSTITUTO TECNOLÓGICO DE TEHUACÁN</h2>
                                    <h3>DESARROLLADORES DE LA PLATAFORMA</h3>
                                    <li>FERNANDO MARTINEZ REYES</li>
                                    <li>JOSÉ DE JESÚS CARRERA OROZCO</li>
                                    <li>JOSÉ ANTONIO ARELLANO MONTALVO</li>
                                    <li>JESÚS ALONSO ROMERO HERRERA</li>  
                                
                                </td>
                                :
                                <></>
                            }
                        </tr>

                        {window.screen.width <= 1200 ? 
                            <tr key={1}>
                                <td>
                                    <h2 style={{ textAlign: 'center' }}>INSTITUTO TECNOLÓGICO DE TEHUACÁN</h2>
                                    <h3>DESARROLLADORES DE LA PLATAFORMA</h3>
                                    <li>FERNANDO MARTINEZ REYES</li>
                                    <li>JOSÉ DE JESÚS CARRERA OROZCO</li>
                                    <li>JOSÉ ANTONIO ARELLANO MONTALVO</li>
                                    <li>JESÚS ALONSO ROMERO HERRERA</li>  
                                </td>
                            
                            </tr>
                            :
                            <></>
                        }
                    </tbody>
                </table>        
            </Dialog> 
            <div>
                <table className='tablitaFooter' style={{ margin: '0 auto' }}>                
                    <tbody>
                        <tr>
                            <td>
                                <Button icon="pi pi-slack" className="p-button-lg p-button-rounded p-button-secondary" onClick={() => onClick('displayBasic')}/>                                  
                            </td>
                            <td>
                                <h4 className='p' style={{ fontSize: window.screen.width <= 1200 ? '.6em' : '1em' }}>PLATAFORMA DE GESTIÓN DOCUMENTAL DE SERVICIOS DOCENTES | INSTITUTO TECNOLOGICO DE TEHUACÁN</h4>
                            </td>
                        </tr>
                    </tbody>
                </table> 
            </div>
            
        </footer>
    );
}

export default Footer;
