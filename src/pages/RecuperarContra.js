import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { UsuarioService } from '../services/UsuarioService';
import { Toast } from 'primereact/toast';
import Cookies from 'universal-cookie';
import { Link, useNavigate } from 'react-router-dom';

export const RecuperarContra = () => {

    const [correo, setCorreo] = useState('');
    const [espera, setEspera] = useState(false)
    var usuarioService = new UsuarioService();
    var cookies = new Cookies();
    const navigate = new useNavigate();
    const toast = useRef(null);

    const header = (
        <Link to='/'><img alt="Card" src="images/usercard.png" onError={(e) => e.target.src='../tecnm.png'} /></Link>
    );

    const footer = (
        <span>
            <Button label="Enviar enlace de reestablecimiento de contraseña" icon="pi pi-link" disabled={espera} onClick={() => {
                enviarCorreo();
            }}/>
        </span>
    );

    useEffect(() => {
        //console.log(cookies.get('idUsuario'));
        if(cookies.get('idUsuario')){
            navigate('/plataforma/menu');
        }
    }, []);

    const enviarCorreo = async() =>{
        setEspera(true);
        await usuarioService.recuperar(correo).then(data => {
            if(data.id_Usuarios != null){
                toast.current.show({severity:'success', summary: '¡Atención!', detail:'¡Correo de Reestablecimiento Enviado!', life: 3000});
            }else{
                toast.current.show({severity:'error', summary: '¡Atención!', detail:'¡No es un correo válido!', life: 3000});
            }
        });
        setEspera(false);
    }

    return (
        <>
            <div><Toast ref={toast} /></div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                <div style={{ textAlign: 'center'}}>
                    <Card subTitle="REESTABLECER CONTRASEÑA" style={{ width: '25em' }} footer={footer} header={header}>
                        <div>
                            <span className="p-input-icon-left">
                                <i className="pi pi-envelope" />
                                <InputText value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo electrónico" />
                            </span>
                        </div>
                    </Card>
                </div>
                
            </div>
        </>
        
    )
}
