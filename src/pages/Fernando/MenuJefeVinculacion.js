import React, { useEffect, useContext } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const MenuJefeVinculacion = () => {

    const navigate = new useNavigate();

    const {idPeriodo} = new useParams();

    const { cambiarBread, actual, direcciones } = useContext(BreadCrumbContext);

    const cambiarBreadLocal = (lblActual, donde) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/menuvinculacion' });

        cambiarBread(direccionesTemp, lblActual);

        navigate('/plataforma/'+ donde);
    }

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_vinculacion)
            navigate('/plataforma/menu');
        else{
            cambiarBread([], 'Vinculación');
        }
    }, []);

    return (
        <div>
            <h1 style={{ textAlign: 'center', paddingBottom: window.screen.width <= 1200 ? '0px' :'40px' }}>GESTIÓN DE PROCESOS</h1>
            <table style={{ width: '100%', textAlign: 'center', wordSpacing: '100' }}>
                <tbody>
                    {
                        window.screen.width <= 1200 ? 
                        <>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Configuración Roles" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-info" style={{ width: '100%', height: '70px' }} onClick={ () => cambiarBreadLocal('Configuración de Roles', 'rolesvinculacion') }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Servicio Social" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-help" style={{ width: '100%', height: '70px' }} onClick={ () => cambiarBreadLocal('Servicio Social', 'socialjefe') }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Visitas a Empresas" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-primary" style={{ width: '100%', height: '70px' }} onClick={ () => cambiarBreadLocal('Periodos Visitas', 'periodosvisitasjefe') }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Cursos Externos" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-success" style={{ width: '100%', height: '70px' }} onClick={() => cambiarBreadLocal('Departamentos', 'departamentoscursosjefe') }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Mensajes" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-warning" style={{ width: '100%', height: '70px' }} onClick={() => cambiarBreadLocal('Mensajes', 'mensajesvinculacion') }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Proyectos de Innovación" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-secondary" style={{ width: '100%', height: '70px' }} onClick={() => cambiarBreadLocal('Proyectos de Innovación', 'innovacion') }/></td>
                            </tr>
                        </>
                        :
                        <>
                            <tr>
                                <td style={{ paddingBottom: '80px' }}><Button label="Configuración Roles" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-info" style={{ width: '350px', height: '70px' }} onClick={ () => cambiarBreadLocal('Configuración de Roles', 'rolesvinculacion') }/></td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Servicio Social" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-help" style={{ width: '350px', height: '70px' }} onClick={ () => cambiarBreadLocal('Servicio Social', 'socialjefe') }/></td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Visitas a Empresas" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-primary" style={{ width: '350px', height: '70px' }} onClick={ () => cambiarBreadLocal('Periodos Visitas', 'periodosvisitasjefe') }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '80px' }}><Button label="Cursos Externos" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-success" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Departamentos', 'departamentoscursosjefe') }/></td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Mensajes" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-warning" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Mensajes', 'mensajesvinculacion') }/></td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Proyectos de Innovación" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-secondary" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Proyectos de Innovación', 'innovacion') }/></td>
                            </tr>
                        </>
                    }
                    
                </tbody>
            </table>
        </div>
    )
}

export default MenuJefeVinculacion
