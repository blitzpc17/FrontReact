import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Button } from 'primereact/button';
import axios from "axios";
import { Dialog } from 'primereact/dialog';
import { InputText  } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import "../../components/Orozco/BreadCrumb.css";
import Footer from '../../components/Footer';
import swal from 'sweetalert';
import { Accordion, AccordionTab } from 'primereact/accordion';

const cookies = new Cookies();

export const CatalogoCursos = () => {

   const [departamentosCursos, setDepartamentosCursos] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [visible, setVisible] = useState(false);
    const [activoBtn, setActivoBtn] = useState(false);
    const [activeIndex, setActiveIndex] = useState([0]);
    const [cursosOpciones, setCursosOpciones] = useState([]);
    const [formulario, setFormulario] = useState({
        iddep: 0,
        dep_nombre: '',
        curso: '',
        correo: '',
        empresa: '',
        mensaje: ''
    });
    
    useEffect(() => {
        if(!cookies.get('indexAccordion')){
            cookies.set('indexAccordion', [0], {path: "/"});
            setActiveIndex([0]);
        }else{
            setActiveIndex(cookies.get('indexAccordion'));
        }
        obtenerCursos();
    }, []);

    const obtenerCursos = async() =>{
        let deps = [];
        var arregloFinal = [];
        var objTemp = {};
        var departamentosTemp = [];

        await axios.get("http://localhost:8080/api/v1/departamento/academicos").then(res => { deps = res.data });

        for (let index = 0; index < deps.length; index++) {
            const dep = deps[index];
            let cursos = [];

            await axios.get("http://localhost:8080/api/v1/catalogo_cursos/mostrar/" + dep.id_Departamento).then(res => cursos = res.data);

            objTemp = {
                id: dep.id_Departamento,
                nombre: dep.dep_nombre.toUpperCase(),
                cursos: cursos
            };

            arregloFinal.push(objTemp);

            departamentosTemp.push({ iddep: dep.id_Departamento, dep_nombre: dep.dep_nombre.toUpperCase() });
        }

        setDepartamentos(departamentosTemp);
        setDepartamentosCursos(arregloFinal);
    }

    const header = (
        <img alt="Card" src="../tecnm.png" onError={(e) => e.target.src='../tecnm.png'} height= {'28%'} width={'80%'}/>
    );

    const cambiarAccordion = (index) =>{
        cookies.set('indexAccordion', index, {path: "/"});
        setActiveIndex(index);
    }

    const cambiarCursos = async(dep) =>{
        var formTemp = { ...formulario, iddep: dep.iddep, dep_nombre: dep.dep_nombre, curso: '' };
        setFormulario(formTemp);

        await axios.get("http://localhost:8080//api/v1/catalogo_cursos/mostrar/" + dep.iddep).then(res => {
            if(res.data.length !== 0){
                var cursosTemp = [];

                res.data.forEach(curso => {
                    cursosTemp.push({ curso: curso.curso_Nombre });
                });
                setCursosOpciones(cursosTemp);
            }
            else
                setCursosOpciones([]);
        });

    }

    const abrirFormBtn = async(departamentoCurso, curso) =>{
        await axios.get("http://localhost:8080//api/v1/catalogo_cursos/mostrar/" + departamentoCurso.id).then(res => {
            if(res.data.length !== 0){
                var cursosTemp = [];

                res.data.forEach(curso => {
                    cursosTemp.push({ curso: curso.curso_Nombre });
                });
                setCursosOpciones(cursosTemp);
            }
            else
                setCursosOpciones([]);
        });

        setVisible(true);
        setFormulario({
            iddep: departamentoCurso.id,
            dep_nombre: departamentoCurso.nombre,
            curso: curso.curso_Nombre,
            correo: '',
            empresa: '',
            mensaje: ''
        });
    }

    const mandarMensaje = async() =>{
        if(formulario.dep_nombre !== ''){
            if(formulario.curso !== ''){
                if(formulario.correo !== '' && formulario.empresa !== '' && formulario.mensaje !== ''){
                    setActivoBtn(true);
                    await axios.post("http://localhost:8080/api/v1/formcatalogo/formulario", formulario).then(res => {
                        swal({
                            title: "¡Atención!",
                            text: "¡Correo Enviado Correctamente!",
                            icon: "success",
                            button: "Aceptar",
                            timer: "3000"
                        });
                        setActivoBtn(false);
                    });
                }else{
                    swal({
                        title: "¡Atención!",
                        text: "¡Llena todos los Campos!",
                        icon: "warning",
                        button: "Aceptar",
                        timer: "3000"
                    });
                }
            }else{
                swal({
                    title: "¡Atención!",
                    text: "¡Selecciona el Curso de tu interés!",
                    icon: "warning",
                    button: "Aceptar",
                    timer: "3000"
                });
            }
        }else{
            swal({
                title: "¡Atención!",
                text: "¡Selecciona el Área de tu interés!",
                icon: "warning",
                button: "Aceptar",
                timer: "3000"
            });
        }
    }

    return (
        <div>
            <BreadImprovisado onClick={() => {
                setVisible(true);
                setFormulario({
                    iddep: 0,
                    dep_nombre: '',
                    curso: '',
                    correo: '',
                    empresa: '',
                    mensaje: ''
                });
            }}/>
            <div style={{ marginTop: '135px' }}></div>
            
            <Accordion multiple activeIndex={activeIndex} onTabChange={(e) => cambiarAccordion(e.index)}>
                {departamentosCursos.map((departamentoCurso, index) => {
                    //if(departamentoCurso.cursos.length !== 0)
                    return (
                        <AccordionTab header={departamentoCurso.nombre} key={index}>
                            <table style={{ width: '100%', textAlign: 'center', wordSpacing: '100', borderSpacing: '0px 20px' }}>
                                <thead>
                                    <tr>
                                        <th><p style={{ fontSize: '1.2em' }}>INFORMACIÓN GENERAL</p></th>
                                        {window.screen.width > 600 ? <th><p style={{ fontSize: '1.2em' }}>DOCUMENTACIÓN</p></th> : <></>}
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                        {departamentoCurso.cursos.map((curso, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <tr style={{ marginBottom: '60px' }}>
                                                        <td>
                                                            <h2>{curso.curso_Nombre}</h2>
                                                            <h3>{"Docente: " + curso.curso_creado_por}</h3>
                                                            <h3>{"Tipo: " + curso.curso_Tipo}</h3>
                                                            <h3>{"No. Máximo de Asistentes: " + curso.curso_Cupo}</h3>
                                                            <h3>{"Duración: " + curso.curso_Horas}</h3>
                                                            <Button icon='pi pi-info' className="p-button-rounded p-button-info" style={{ textAlign: 'right' ,marginLeft: '65%' }} onClick={() => abrirFormBtn(departamentoCurso, curso)}/>
                                                        </td>
                                                        {window.screen.width > 600 ? <Temariotd urlDoc={curso.curso_pdf_Temario} index={index} /> : <></>}
                                                    </tr>
                                                    {window.screen.width <= 600 ? <Temariotr urlDoc={curso.curso_pdf_Temario} index={index} /> : <></>}
                                                </React.Fragment>
                                                
                                            )
                                        })}
                                </tbody>
                            </table>
                        </AccordionTab>
                    )
                })}
            </Accordion>
            <div style={{ marginTop: '70px' }}></div>
            <Footer/>

            <Dialog header={header} visible={visible} modal={true} style={{width: window.screen.width <= 1200 ? '100vw' : '33vw' }} onHide={() => setVisible(false)}>
                {/* <h3 style={{ textAlign: 'center' }}>FORMULARIO DE CONTACTO</h3> */}
                <span className="p-float-label" style={{ marginTop: '30px' }}>
                    <InputText id="email" value={formulario.correo} onChange={(e) => {
                        setFormulario({ ...formulario, correo: e.target.value });
                    }} style={{ width: '100%' }} maxLength= '255'/>
                    <label htmlFor="email">Correo Electrónico</label>
                </span>

                <Dropdown value={{ iddep: formulario.iddep, dep_nombre: formulario.dep_nombre }} options={departamentos} onChange={(e) => cambiarCursos(e.target.value)} optionLabel="dep_nombre" placeholder="Área de Insterés" style={{ width: '100%', marginTop: '20px' }} panelStyle= {{ fontSize: window.screen.width <= 1200 ? '.6em' : '.9em' }} />

                <Dropdown value={{ curso: formulario.curso }} options={cursosOpciones} onChange={(e) => setFormulario({ ...formulario, curso: e.target.value.curso })} optionLabel="curso" placeholder="Curso de Interés" style={{ width: '100%', marginTop: '20px' }} panelStyle= {{ fontSize: window.screen.width <= 1200 ? '.6em' : '.9em' }} />

                <span className="p-float-label" style={{ marginTop: '40px' }}>
                    <InputText id="empresa" value={formulario.empresa} onChange={(e) => {
                        setFormulario({ ...formulario, empresa: e.target.value });
                    }} style={{ width: '100%' }} maxLength= '255'/>
                    <label htmlFor="empresa">Nombre de la Empresa</label>
                </span>

                <span className="p-float-label" style={{ marginTop: '40px' }}>
                    <InputText id="mensaje" value={formulario.mensaje} onChange={(e) => {
                        setFormulario({ ...formulario, mensaje: e.target.value });
                    }} style={{ width: '100%' }} maxLength= '255'/>
                    <label htmlFor="mensaje">Mensaje</label>
                </span>
                
                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                    <Button label="Enviar" icon="pi pi-send" className="p-button-sm p-button-success" onClick={() => mandarMensaje()} disabled={activoBtn}/>
                </div>
            </Dialog>
        </div>
    )
}

const BreadImprovisado = (props) => {
    return(
        <div id="main">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '10px 0 0 20px'}}>
                <div>
                    <div className="site-name" style={{ fontSize: window.screen.width <= 1200 ? '.9em' : '1.4em' }}>CATÁLOGO DE CURSOS INSTITUTO TECNOLÓGICO DE TEHUACÁN</div>
                    
                </div>
                <div style={{ textAlign: 'right', marginTop: '30px', marginRight: '10px' }}>
                    <Button label='Información' icon='pi pi-info-circle' className={window.screen.width <= 1200 ? "p-button-info p-button-sm" : "p-button-info"} onClick={() => props.onClick()}/>
                </div>
            </div>
        </div>
    );
}

const Temariotd = (props) => {
    return(
        <td>
            { (props.urlDoc == null) ? <img src="/pdfs/pdfDefault.png" height='360px' width='280px' /> :  <iframe src={  props.urlDoc } height='360px' width='280px'/> }
            <br/>
            <Button label='Ver Temario' icon='pi pi-eye' disabled={props.urlDoc == null} onClick={() => window.open(props.urlDoc)} className="p-button-secondary" style={{ marginTop: '20px' }} />
        </td>
    )
}

const Temariotr = (props) => {
    return(
        <tr>
            <td>
                { (props.urlDoc == null) ? <img src="/pdfs/pdfDefault.png" height='360px' width='280px' /> :  <iframe src={  props.urlDoc } height='360px' width='280px'/> }
                <br/>
                <Button label='Ver Temario' icon='pi pi-eye' disabled={props.urlDoc == null} onClick={() => window.open(props.urlDoc)} className="p-button-secondary" style={{ marginTop: '20px' }} />
            </td>
        </tr>
    )
}
