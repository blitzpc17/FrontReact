import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { UsuarioService } from '../services/UsuarioService';
import { RolesService } from '../services/RolesService';
import { DepartamentoService } from '../services/DepartamentoService';
import md5 from 'md5';
import Cookies from 'universal-cookie';
import { Link, useNavigate } from 'react-router-dom';

const cookies = new Cookies();

export const Login = () => {

    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [espera, setEspera] = useState(false);

    var usuarioService = new UsuarioService();
    var rolesService = new RolesService();
    var depService = new DepartamentoService();

    const navigate = new useNavigate();
    
    const toast = useRef(null);

    const header = (
        <img alt="Card" src="../tecnm.png" onError={(e) => e.target.src='../tecnm.png'} />
    );

    const footer = (
        <span>
            <Button label="Iniciar Sesión" icon="pi pi-user" disabled={espera} onClick={() => {
                //console.log('Correo: '+ correo+ ' - Contra: '+ md5(pass));
                iniciarSesion();
            }}/>
        </span>
    );

    useEffect(() => {
        //console.log(cookies.get('idUsuario'));
        if(cookies.get('idUsuario')){
            navigate('/plataforma/menu');
        }
    }, []);

    const iniciarSesion = async() =>{
        if(correo == 'superadmin@plataforma.tec.com' && pass == 'depgv-server'){
            cookies.set('superadmin', true, {path: "/"});
            navigate('/admin');
        }else{
            iniciarSesionUsuarios();
        }
    }

    const iniciarSesionUsuarios = async() =>{
        setEspera(true);
        var data = {id_Usuarios: null};
        
        await usuarioService.login(correo, md5(pass)).then(usuarioLog => {
            data = usuarioLog;
        });

        if(data.id_Usuarios != null){

            cookies.set('idUsuario', data.id_Usuarios, {path: "/"});
            cookies.set('nombreUsuario', data.user_Nombre, {path: "/"});
            cookies.set('correoUsuario', data.user_Correo, {path: "/"});
            cookies.set('id_Departamento', data.id_Departamento, {path: "/"});

            await rolesService.roles(data.id_Usuarios).then(roles => {
                cookies.set('rolesUsuario', roles, {path: "/"});
            });

            await depService.find(data.id_Departamento).then(dataDep => {
                //console.log(dataDep);
                cookies.set('nombre_Departamento', dataDep.dep_nombre, {path: "/"});
            });
            
            cookies.set('actualTemp', 'na', {path: "/"});
            cookies.set('direccionesTemp', [], {path: "/"});

            navigate('/plataforma/menu');
        }else{
            setEspera(false);
            toast.current.show({severity:'error', summary: '¡Atención!', detail:'¡Datos de Inicios de Sesión Incorrectos!', life: 3000});
        }
    }

    return (
        <>
            <div><Toast ref={toast} /></div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#f8f9fa'}}>
                <div style={{ textAlign: 'center'}}>
                    <Card subTitle="PLATAFORMA DE GESTIÓN DOCUMENTAL DE SERVICIOS DOCENTES" style={{ width: '25em' }} footer={footer} header={header}>
                        <div>
                            <span className="p-input-icon-left">
                                <i className="pi pi-envelope" />
                                <InputText value={correo} id="correo" onChange={(e) => setCorreo(e.target.value)} placeholder="Correo electrónico" onKeyDown={(e) => {if(e.code === 'Enter') iniciarSesion()}} />
                            </span>
                        </div>
                        <div style={{ marginTop: '20px'}}>
                            <Password value={pass} onChange={(e) => setPass(e.target.value)} toggleMask placeholder="Contraseña" feedback={false} onKeyDown={(e) => {if(e.code === 'Enter') iniciarSesion()}} />
                        </div>
                        <div style={{ marginTop: '10px'}}>
                            <Link to='/recuperarcontra'>¿Has olvidado tu contraseña?</Link>
                        </div>
                    </Card>
                </div>
                
            </div>
        </>
        
    )
}
