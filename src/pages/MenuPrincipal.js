import React, { useEffect, useContext } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import BreadCrumbContext from '../context/BreadCrumbContext';

const cookies = new Cookies();

export const MenuPrincipal = () => {

    const navigate = new useNavigate();
    
    const { cambiarBread } = useContext(BreadCrumbContext);

    var rolesCompleto = {
        ...cookies.get('rolesUsuario')
    };

    var agregados = 0;
    var elemento1;
    var elemento2;
    var elemento3;
    var elemento4;
    var elementotemp;
    
    useEffect(() => {
        
        cambiarBread([], 'na');
    }, []);

    var funcionesRoles = [
        {
            idRol: 'rol_docente',
            labelRol: 'Gestión de Docencia',
            iconRol: 'pi pi-users',
            claseRol: 'p-button-lg p-button-primary',
            funcRol: () => {
                navigate('/plataforma/gestiondocencia');
            }
        },
        {
            idRol: 'rol_jefe_departamento',
            labelRol: 'Jefe de Departamento',
            iconRol: 'pi pi-user',
            claseRol: 'p-button-lg p-button-secondary',
            funcRol: () => {
                navigate('/plataforma/menudepartamental');
            }
        },
        {
            idRol: 'rol_desarrollo_academico_departamental',
            labelRol: 'Investigación de Proyectos',
            iconRol: 'pi pi-briefcase',
            claseRol: 'p-button-lg p-button-success',
            funcRol: () => {
                navigate('/plataforma/periodosjefeinvestigacion');
            }
        },
        {
            idRol: 'rol_jefe_desarrollo_academico',
            labelRol: 'Desarrollo Académico',
            iconRol: 'pi pi-book',
            claseRol: 'p-button-lg p-button-info',
            funcRol: () => {
                navigate('/plataforma/periodosdesarrollo');
            }
        },
        {
            idRol: 'rol_jefe_laboratorio',
            labelRol: 'Jefe Laboratorio',
            iconRol: 'pi pi-building',
            claseRol: 'p-button-lg p-button-warning',
            funcRol: () => {
                navigate('/plataforma/gestionjefelaboratorio');
            }
        },
        {
            idRol: 'rol_jefe_oficina_servicio_externos_vinculacion',
            labelRol: 'Servicios Externos',
            iconRol: 'pi pi-comments',
            claseRol: 'p-button-lg p-button-help',
            funcRol: () => {
                navigate('/plataforma/serviciosexternos');
            }
        },
        {
            idRol: 'rol_jefe_oficina_servicio_social_vinculacion',
            labelRol: 'Servicio Social',
            iconRol: 'pi pi-send',
            claseRol: 'p-button-lg p-button-danger',
            funcRol: () => {
                navigate('/plataforma/periodosocial');
            }
        },
        {
            idRol: 'rol_jefe_vinculacion',
            labelRol: 'Jefe Vinculación',
            iconRol: 'pi pi-link',
            claseRol: 'p-button-lg p-button-primary',
            funcRol: () => {
                navigate('/plataforma/menuvinculacion');
            }
        },
        {
            idRol: 'rol_secretaria_departamento',
            labelRol: 'Secretaria Departamental',
            iconRol: 'pi pi-pencil',
            claseRol: 'p-button-lg p-button-info',
            funcRol: () => {
                navigate('/plataforma/periodosecretaria');
            }
        },
        {
            idRol: 'rol_secretaria_vinculacion',
            labelRol: 'Secretaria Vinculación',
            iconRol: 'pi pi-inbox',
            claseRol: 'p-button-lg p-button-success',
            funcRol: () => {
                navigate('/plataforma/periodosvisitas');
            }
        },
        {
            idRol: 'rol_jefe_proyectos_docencia',
            labelRol: 'Proyectos de Docencia',
            iconRol: 'pi pi-book',
            claseRol: 'p-button-lg p-button-secondary',
            funcRol: () => {
                navigate('/plataforma/periodosjefedocencia');
            }
        },
        {
            idRol: 'rol_auxiliar_laboratorio',
            labelRol: 'Auxiliar de Laboratorio',
            iconRol: 'pi pi-exclamation-triangle',
            claseRol: 'p-button-lg p-button-warning',
            funcRol: () => {
                navigate('/plataforma/gestionauxiliarlab');
            }
        },
        {
            idRol: 'rol_coordinador_vinculacion',
            labelRol: 'Coordinación Vinculación',
            iconRol: 'pi pi-link',
            claseRol: 'p-button-lg p-button-primary',
            funcRol: () => {
                navigate('/plataforma/coordinacionviculacion');
            }
        }
    ];

    return (
        <div>
            <h1 style={{ textAlign: 'center', paddingBottom: window.screen.width <= 1200? '0px' : '40px' }}>ROLES ASIGNADOS</h1>
            <table style={{ width: '100%', textAlign: 'center', wordSpacing: '100' }}>
                <tbody>
                    {funcionesRoles.map((funcionRol, index) => {
                        if(agregados === 0){
                            elemento1 = null;
                            elemento2 = null;
                            elemento3 = null;
                            elemento4 = null;
                        }

                        if(rolesCompleto[funcionRol.idRol]){
                            elementotemp = <td style={{ paddingBottom: window.screen.width <= 1200? '20px' : '80px' }}>
                                <Button key={index} label={ funcionRol.labelRol } icon={ funcionRol.iconRol } className={ funcionRol.claseRol } onClick={ () => funcionRol.funcRol() } style={{ width: '90%', height: '70px' }}/>
                            </td>;
                        }else{
                            elementotemp = 1;
                        }
                        
                        if(elementotemp !== 1){
                            switch(agregados){
                                case 0: elemento1 = elementotemp; break;
                                case 1: elemento2 = elementotemp; break;
                                case 2: elemento3 = elementotemp; break;
                                case 3: elemento4 = elementotemp; break;
                                default: elementotemp = null;
                            }
                            agregados++;
                        }
                        
                        if(agregados === 4 || index === 12){

                            agregados = 0;

                            if(window.screen.width > 1200)
                                return <tr key={index}>
                                    { elemento1 }
                                    { elemento2 }
                                    { elemento3 }
                                    { elemento4 }
                                </tr>
                            else
                            return <>
                                <tr key={index}>
                                    { elemento1 }
                                </tr>
                                <tr key={index+1}>
                                    { elemento2 }
                                </tr>
                                <tr key={index+2}>
                                    { elemento3 }
                                </tr>
                                <tr key={index+3}>
                                    { elemento4 }
                                </tr>
                            </>
                        }
                        index++;
                        return null;
                    })}
                </tbody>
            </table>
        </div>
    )
}
