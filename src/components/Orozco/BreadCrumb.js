import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'primereact/button';
import "./BreadCrumb.css";
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const BreadCrumb = () => {
    const [deptname, setDeptname] = useState('Nombre Departamento');

    const { direcciones, actual, cambiarBread } = useContext(BreadCrumbContext);

    useEffect(() => {
        setDeptname(cookies.get('nombre_Departamento'));
    }, []);

    return (
        <div id="main">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '10px 0 0 20px'}}>
                <div>
                    <div className="site-name" style={{ fontSize: window.screen.width <= 1200 ? '.6em' : '1.2em' }}>{deptname.toUpperCase()}</div>
                    <table>
                        <tbody>
                            <tr>
                                {(window.screen.width <= 1200)?
                                    <td><Link to="/plataforma/menu" id="links" style={{ fontSize: '.55em' }} >Home</Link></td>
                                : <td><Link to="/plataforma/menu" id="links"><Button icon="pi pi-home" className="p-button-rounded p-button-outlined" fontSize='10px' onClick={() => cambiarBread([], 'na')} style={{color: 'black'}}/></Link></td>
                                }
                                
                                {direcciones.map((direccion, index) => {
                                    return <React.Fragment key={index}>
                                        <td><i className="pi pi-angle-right" style={{color: 'black'}}/></td>
                                        <td><Link to={direccion.url} style={{ fontSize: window.screen.width <= 1200 ? '.55em' : '1.1em', textAlign: 'center' }} id="links" onClick={() => cambiarBread(direcciones.slice(0,index), direccion.label)}>{direccion.label}</Link></td>
                                    </React.Fragment>
                                })}
                                {(actual !== 'na')?
                                    <>
                                        <td><i className="pi pi-angle-right" style={{color: 'black'}}/></td>
                                        <td><div className="final" style={{ fontSize: window.screen.width <= 1200 ? '.55em' : '1.1em', textAlign: 'center' }}>{actual}</div></td>
                                    </>
                                    : <></>}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default BreadCrumb

/*

                <div>
                    <Button icon="pi pi-sign-out" className="p-button-lg p-button-rounded p-button-text p-button-plain" style={{ color: 'white', marginTop: '15px', marginRight:'5px' }} onClick={cerrarSesion} tooltip='Cerrar Sesión' tooltipOptions={{position: 'left'}}/>
                </div>

    const cerrarSesion = () =>{

        cookies.remove('idUsuario', {path: "/"});
        cookies.remove('nombreUsuario', {path: "/"});
        cookies.remove('correoUsuario', {path: "/"});
        cookies.remove('id_Departamento', {path: "/"});
        cookies.remove('nombre_Departamento', {path: "/"});
        cookies.remove('rolesUsuario', {path: "/"});
        cookies.remove('id_Periodo', {path: "/"});
        cookies.remove('lblPeriodo', {path: "/"});
        cookies.remove('actualTemp', {path: "/"});
        cookies.remove('direccionesTemp', {path: "/"});

        navigate('/');
    }
*/