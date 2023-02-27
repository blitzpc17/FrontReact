import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { UsuarioService } from '../services/UsuarioService';
import { ResetService } from '../services/ResetService';
import md5 from 'md5';
import Cookies from 'universal-cookie';
import { Link, useNavigate, useParams } from 'react-router-dom';

export const ReestablecerContra = () => {

    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [confirmpass, setConfirmpass] = useState('');
    const [usuario, setUsuario] = useState({
        id_Usuarios: null,
        id_Departamento: null,
        user_Nombre: null,
        user_Correo: null,
        user_Password: null,
        user_creado_por: null,
        user_fecha_creacion: null,
        user_actualizado_por: null,
        user_fecha_actualizacion: null
        });

    const [espera, setEspera] = useState(false)
    var usuarioService = new UsuarioService();
    var resetService = new ResetService();
    var cookies = new Cookies();
    const navigate = new useNavigate();
    const {idReset} = new useParams();
    const toast = useRef(null);

    const header = (
        <Link to='/'><img alt="Card" src="images/usercard.png" onError={(e) => e.target.src='../tecnm.png'} /></Link>
    );

    const footer = (
        <span>
            <Button label="Reestablecer Contraseña" icon="pi pi-user" disabled={espera} onClick={() => {
                iniciarSesion();
            }}/>
        </span>
    );

    useEffect(() => {
        //console.log(cookies.get('idUsuario'));
        if(cookies.get('idUsuario')){
            navigate('/plataforma/menu');
        }else{
            buscarreset();
        }
    }, []);

    const iniciarSesion = async() =>{
        setEspera(true);
        if(pass === confirmpass){
            var user = {
                id_Usuarios: usuario.id_Usuarios,
                id_Departamento: usuario.id_Departamento,
                user_Nombre: usuario.user_Nombre,
                user_Correo: usuario.user_Correo,
                user_Password: md5(pass),
                user_creado_por: usuario.user_creado_por,
                user_fecha_creacion: usuario.user_fecha_creacion,
                user_actualizado_por: usuario.user_actualizado_por,
                user_fecha_actualizacion: usuario.user_fecha_actualizacion
                };
            
            await usuarioService.save(user).then(data => {
                if(data.id_Usuarios != null){
                    toast.current.show({severity:'success', summary: '¡Atención!', detail:'¡Se ha reestablecido su contraseña!', life: 3000});
                    setTimeout(() => {  navigate('/'); }, 3000);
                }else{
                      toast.current.show({severity:'error', summary: '¡Atención!', detail:'¡Datos de Inicios de Sesión Incorrectos!', life: 3000});
                }
            });
        }else{
            setEspera(false);
            toast.current.show({severity:'error', summary: '¡Atención!', detail:'¡Las contraseñas no coinciden!', life: 3000});
        }
    }

    const buscarreset = async() =>{
        await resetService.find(idReset).then(data => {
            var fecha = new Date(data.fecha_reset);
            fecha.setHours(fecha.getHours() + 1);

            if(new Date() < fecha){
                setCorreo(data.user_Correo);
                usuarioService.find(data.id_usuario).then(user => {
                    setUsuario(user);
                });
            }else{
                navigate('/');
            }
        });
    }

    return (
        <>
            <div><Toast ref={toast} /></div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#f8f9fa'}}>
                <div style={{ textAlign: 'center'}}>
                    <Card subTitle="REESTABLECER CONTRASEÑA" style={{ width: '25em' }} footer={footer} header={header}>
                        <div>
                            <span className="p-input-icon-left">
                                <i className="pi pi-envelope" />
                                <InputText value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo electrónico" disabled />
                            </span>
                        </div>
                        <div style={{ marginTop: '20px'}}>
                            <Password value={pass} onChange={(e) => setPass(e.target.value)} toggleMask placeholder="Contraseña"/>
                        </div>
                        <div style={{ marginTop: '20px'}}>
                            <Password value={confirmpass} onChange={(e) => setConfirmpass(e.target.value)} toggleMask placeholder="Confirmar contraseña"/>
                        </div>
                    </Card>
                </div>
                
            </div>
        </>
        
    )
}
