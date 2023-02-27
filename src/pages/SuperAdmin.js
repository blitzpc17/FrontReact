import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import  Periodos  from './Josean/Periodos';
import  JefeDep from './Josean/JefeDep';
import  DialogDepartamento  from './Fernando/DialogDepartamento';

const cookies = new Cookies();

export const SuperAdmin = () => {
    const navigate = new useNavigate();
	const [vP, setVP] = useState(false);
	const [jd, setJd] = useState(false);
	const [dd, setDd] = useState(false);

    useEffect(() => {
        if(!cookies.get('superadmin'))
            navigate('/');
    }, []);

    const salir = () =>{
        cookies.remove('superadmin', {path: "/"});
        navigate('/');
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center', paddingBottom: window.screen.width <= 1200 ? '0px' : '40px' }}>ACCIONES ELEMENTALES</h1>
            <table style={{ width: '100%', textAlign: 'center', wordSpacing: '100' }}>
                <tbody>
                    {
                        window.screen.width <= 1200 ? 
                        <>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Gestión Usuarios" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-primary" style={{ width: '350px', height: '70px' }} onClick={ () => setJd(true) }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Gestión Periodos" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-success" style={{ width: '350px', height: '70px' }} onClick={() => setVP(true) }/></td>
                            </tr>
			    <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Gestión Departamentos" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-info" style={{ width: '350px', height: '70px' }} onClick={() => setDd(true) }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Salir" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-secondary" style={{ width: '350px', height: '70px' }} onClick={() => salir() }/></td>
                            </tr>
                            
                        </>
                        :
                        <>
                            <tr>
                                <td style={{ paddingBottom: '80px' }}><Button label="Gestión Usuarios" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-primary" style={{ width: '350px', height: '70px' }} onClick={ () => setJd(true)  }/></td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Gestión Periodos" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-help" style={{ width: '350px', height: '70px' }} onClick={ () => setVP(true)  }/></td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Gestión Departamentos" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-info" style={{ width: '350px', height: '70px' }} onClick={ () => setDd(true) }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '80px' }}><Button label="Salir" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-success" style={{ width: '350px', height: '70px' }} onClick={ () => salir()  }/></td>
                            </tr>
                        </>
                    }
                    
                </tbody>
		<Periodos visible={vP} onHide= { () => {setVP(false)}}/>
		<JefeDep visible={jd} onHide= { () => {setJd(false)}}/>
		<DialogDepartamento visible={dd} onHide= { () => {setDd(false)}}/>
            </table>
        </div>
    )
}
