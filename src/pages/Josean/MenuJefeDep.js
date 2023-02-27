import React, { useEffect, useContext } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const MenuJefeDep = () => {

    const navigate = new useNavigate();

    const { cambiarBread, actual, direcciones } = useContext(BreadCrumbContext);

    const cambiarBreadLocal = (lblActual, donde) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/menudepartamental' });

        cambiarBread(direccionesTemp, lblActual);

        navigate('/plataforma/' + donde);
    }

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            cambiarBread([], 'Menú Departamental');
        }
    }, []);

    return (
        <div>
            <h1 style={{ textAlign: 'center', paddingBottom: window.screen.width <= 1200 ? '0px' : '40px' }}>GESTIÓN DEPARTAMENTAL</h1>
            <table style={{ width: '100%', textAlign: 'center', wordSpacing: '100' }}>
                <tbody>
                    {
                        window.screen.width <= 1200 ? 
                        <>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Gestión Usuarios" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-primary" style={{ width: '350px', height: '70px' }} onClick={ () => cambiarBreadLocal('Usuarios', 'usuarios') }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Catálogo de Cursos" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-success" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Catálogo de Cursos', 'catalogocursos')}/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Gestión Laboratorios" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-help" style={{ width: '350px', height: '70px' }} onClick={ () => cambiarBreadLocal('Laboratorios', 'laboratorios') }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Gestión Formatos" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-danger" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Formatos', 'formatos')}/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Gestión Actividades A. D." icon="pi pi-chevron-circle-right" className="p-button-lg p-button-warning" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Actividades Apoyo Docencia', 'actividadesad')}/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Gestión Carreras" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-info" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Carreras', 'carreras')}/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Gestión Vinculación" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-secondary" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Vinculación', 'vinculaciondep')}/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '20px' }}><Button label="Capacitaciones" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-primary" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Periodos Desarrollo Académico', 'periodoscapacitacionesdep')}/></td>
                            </tr>
                        </>
                        :
                        <>
                            <tr>
                                <td style={{ paddingBottom: '80px' }}><Button label="Gestión Usuarios" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-primary" style={{ width: '350px', height: '70px' }} onClick={ () => cambiarBreadLocal('Usuarios', 'usuarios') }/></td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Catálogo de Cursos" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-success" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Catálogo de Cursos', 'catalogocursos')}/></td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Gestión Laboratorios" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-help" style={{ width: '350px', height: '70px' }} onClick={ () => cambiarBreadLocal('Laboratorios', 'laboratorios') }/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '80px' }}><Button label="Gestión Formatos" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-danger" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Formatos', 'formatos')}/></td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Gestión Actividades A. D." icon="pi pi-chevron-circle-right" className="p-button-lg p-button-warning" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Actividades Apoyo Docencia', 'actividadesad')}/></td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Gestión Carreras" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-info" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Carreras', 'carreras')}/></td>
                            </tr>
                            <tr>
                                <td style={{ paddingBottom: '80px' }}><Button label="Gestión Vinculación" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-secondary" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Vinculación', 'vinculaciondep')}/></td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Capacitaciones" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-primary" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Periodos Desarrollo Académico', 'periodoscapacitacionesdep')}/></td>
                                <td style={{ paddingBottom: '80px' }}><Button label="Soporte Institucional" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-success" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Soporte Institucional', 'soporteinstitucional')}/></td>
                                
                                
                            </tr>
                        </>
                    }
                    
                </tbody>
            </table>
        </div>
    )
}

export default MenuJefeDep
