import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { SpeedDial } from 'primereact/speeddial';
import { Tooltip } from 'primereact/tooltip';
import './SpeedDial.css';
import DialogFormatosSecretaria from '../components/Orozco/DialogFormatosSecretaria';
import DialogMaterialJefatura from '../components/Orozco/DialogMaterialJefatura';
import DialogConvocatorias from '../components/Orozco/DialogConvocatorias';
import DialogFormatosDocente from '../components/Orozco/DialogFormatosDocente';
import DialogNotificaciones from '../components/Orozco/DialogNotificaciones';
import DialogMaterialJefe from '../components/Orozco/DialogMaterialJefe';
import Cubiculos from '../pages/Alonso/AuxiliardeLaboratorio/Cubiculos';
import GestionCubiculo from '../pages/Alonso/AuxiliardeLaboratorio/GestionCubiculo';
import Estadisticas from '../pages/Josean/Estadisticas';
import CubiculosJA from '../pages/Josean/Cubiculos';
import { useNavigate } from 'react-router-dom';
import Materias from '../pages/Josean/Materias';

const cookies = new Cookies();

const SpeedDialAdicionalesRoles = () => {

    const navigate = new useNavigate();

    const [visible, setVisible] = useState({
        formDoc: false,
        material: false,
        conv: false,
        noti: false,
        formSecre: false,
        matJefe: false,
        cubi: false,
        jcubi: false,
        est: false,
        jdcubi: false,
        materiasSec: false
    });

    var ban = true;
    
    var items = [{
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => {
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
    }];

    let roles = cookies.get('rolesUsuario');

    if(roles.rol_docente){

        if(!roles.rol_secretaria_departamento){
            items.push({
                label: 'Formatos',
                icon: 'pi pi-file-pdf',
                command: () => {
                    setVisible({
                        ...visible,
                        formDoc: true
                    });
                }
            });
        }

        if(!roles.rol_desarrollo_academico_departamental){
            items.push({
                label: 'Material de Jefatura',
                icon: 'pi pi-video',
                command: () => {
                    setVisible({
                        ...visible,
                        mat: true
                    });
                }
            });
        }
        
        items.push({
            label: 'Convocatorias',
            icon: 'pi pi-th-large',
            command: () => {
                setVisible({
                    ...visible,
                    conv: true
                });
            }
        });

        items.push({
            label: 'Notificaciones',
            icon: 'pi pi-bell',
            command: () => {
                setVisible({
                    ...visible,
                    noti: true
                });
            }
        });

        if(!roles.rol_auxiliar_laboratorio){
            items.push({
                label: 'Cubículos',
                icon: 'pi pi-box',
                command: () => {
                    setVisible({
                        ...visible,
                        cubi: true
                    });
                }
            });
        }
        
        ban = true;
    }

    if(roles.rol_secretaria_departamento){
        items.push({
            label: 'Formatos',
            icon: 'pi pi-file-pdf',
            command: () => {
                setVisible({
                    ...visible,
                    formSecre: true
                });
            }
        });

        items.push({
            label: 'Materias',
            icon: 'pi pi-book',
            command: () => {
                setVisible({
                    ...visible,
                    materiasSec: true
                });
            }
        });

        ban = true;
    }

    if(roles.rol_desarrollo_academico_departamental){
        items.push({
            label: 'Material de Jefatura',
            icon: 'pi pi-video',
            command: () => {
                setVisible({
                    ...visible,
                    matJefe: true
                });
            }
        });

        ban = true;
    }

    if(roles.rol_auxiliar_laboratorio){
        items.push({
            label: 'Cubículos',
            icon: 'pi pi-box',
            command: () => {
                setVisible({
                    ...visible,
                    jcubi: true
                });
            }
        });

        ban = true;
    }

    if(roles.rol_jefe_departamento){
         items.push({
             label: 'Estadísticas Documentación Docentes',
             icon: 'pi pi-chart-bar',
             command: () => {
                 setVisible({
                     ...visible,
                     est: true
                 });
             }
         });

        items.push({
            label: 'Gestión Cubículos',
            icon: 'pi pi-microsoft',
            command: () => {
                setVisible({
                    ...visible,
                    jdcubi: true
                });
            }
        });

        ban = true;
    }

    return <div>
        {
            ban? <div>
                <div className="speeddial-tooltip-demo" style={{ position: 'fixed', bottom: '85px', right: '15px', zIndex: '1' }}>
                    <Tooltip target=".speeddial-tooltip-demo .speeddial-right .p-speeddial-action" position="left" />
                    <SpeedDial model={items} direction="up" className="speeddial-right" buttonClassName="p-button-info" />
                </div>

                <DialogFormatosDocente visible={visible.formDoc} onHide={() => setVisible({ ...visible, formDoc: false })} />
                <DialogFormatosSecretaria visible={visible.formSecre} onHide={() => setVisible({ ...visible, formSecre: false })} />
                <DialogMaterialJefatura visible={visible.mat} onHide={() => setVisible({ ...visible, mat: false })} />
                <DialogConvocatorias visible={visible.conv} onHide={() => setVisible({ ...visible, conv: false })} />
                <DialogNotificaciones visible={visible.noti} onHide={() => setVisible({ ...visible, noti: false })} />
                <DialogMaterialJefe visible={visible.matJefe} onHide={() => setVisible({ ...visible, matJefe: false })}/>
                <Cubiculos visible={visible.jcubi} onHide={() => setVisible({ ...visible, jcubi: false })}/>
                <GestionCubiculo visible={visible.cubi} onHide={() => setVisible({ ...visible, cubi: false })}/>
                <Estadisticas visible={visible.est} onHide={() => setVisible({ ...visible, est: false })}/>
                <CubiculosJA visible={visible.jdcubi} onHide={() => setVisible({ ...visible, jdcubi: false })}/>
                <Materias visible={visible.materiasSec} onHide={() => setVisible({ ...visible, materiasSec: false })}/>
            </div>:<div></div>
        }
        
    </div>;
};

export default SpeedDialAdicionalesRoles;
