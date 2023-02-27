import React from 'react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import swal from 'sweetalert';
import { InputSwitch } from 'primereact/inputswitch';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';

import {ServicioConsultaCatalogo} from '../../services/Josean/ServicioConsultaCatalogo';
import { ServicioConsultaDocCatalogo } from '../../services/Josean/ServicioConsultaDocCatalogo';
import { ServicioCatalogo } from '../../services/Josean/ServicioCatalogo';
import { useNavigate } from 'react-router-dom';
import FileService from '../../services/FileService';


import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const Catalogo = () => {
    const navigate = new useNavigate();

    const [cursos, setCursos] = useState(null);
    const [visible, setVisible] = useState(false);
    const [nombre, setNombre] = useState("");
    const [docente, setDocente] = useState("");
    const [docentes, setDocentes] = useState(null);
    const [tipoc, setTipoc] = useState(null);
    const [cupo, setCupo] = useState(null);
    const [horas, setHoras] = useState(null);
    const [idCurso, setIdCurso] = useState(null);
    const [temario, setTemario] = useState(null);
    const [pdfframe, setPdfframe] = useState(null);
    const [fileselect, setFileselect] = useState(null);
    const [bandera, setBandera] = useState(false);

    const tipocurso = [
        {name:"Curso",code:1},
        {name:"Taller",code:2},
        {name:"Diplomado",code:3},
        {name:"Seminario",code:4},
        {name:"Asesoría",code:5},
        {name:"Consultoría",code:6},
        {name:"Estudios",code:7},
        {name:"Laboratorio",code:8},
    ]


    const cookiedep=cookies.get('id_Departamento');

    var servicioCatalogo = new ServicioCatalogo();
    var servicioconsCatalogo = new ServicioConsultaCatalogo();
    var servicioconsDocCatalogo = new ServicioConsultaDocCatalogo();
    var fileService = new FileService();
    const toast = useRef(null);

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Catálogo de Cursos'){
                servicioconsCatalogo.search(cookiedep).then(data => setCursos(data));
                servicioconsDocCatalogo.search(cookiedep).then(data => setDocentes(data));
            }
            else
                navigate('/plataforma/menudepartamental');
        }
      
    }, []);

    const visualizacion = (rowData) => {
        // 0 = Sin mostrar en el catalogo
        // 1 = Mostrando en el catalogo
        if(rowData.curso_Visualizacion === 0){
            return <Button label="Sin Mostrar" className="p-button-info p-button-text" style={{padding:0}} />
        }
        else{
            return <Button label="Mostrando" className="p-button-success p-button-text" style={{padding:0}} />
        }
     
    }

    const agregar = async(state,cursoswitch) => {

        if(state === 1){
            servicioCatalogo.save(cursoswitch).then(data => {
                setCursos(null);

                  servicioconsCatalogo.search(cookiedep).then(data => setCursos(data));
            });
        }
        else{
            if(nombre === null || nombre === "" ||
            docente === null ||
            tipoc === null ||
            cupo === null ||
            horas === null ){
                swal({
                    title: "¡Atención!",
                    text: "¡Rellena todos los campos!",
                    icon: "info",
                    button: "Aceptar",
                    timer: "3000"
                });

                setVisible(true);
            }
            else{

                if(tipoc === "Curso" && horas > 100){
                    swal({
                        title: "¡Atención!",
                        text: "¡El numero máximo de horas para un Curso es de 100!",
                        icon: "info",
                        button: "Aceptar",
                        timer: "3000"
                    });
                    setVisible(true);
                }
                else if(tipoc === "Taller" && horas > 200){
                    swal({
                        title: "¡Atención!",
                        text: "¡El numero máximo de horas para un Taller es de 200!",
                        icon: "info",
                        button: "Aceptar",
                        timer: "3000"
                    });
                    setVisible(true);
                }
                else if(tipoc === "Diplomado" && horas > 250){
                    swal({
                        title: "¡Atención!",
                        text: "¡El numero máximo de horas para un Diplomado es de 250!",
                        icon: "info",
                        button: "Aceptar",
                        timer: "3000"
                    });
                    setVisible(true);
                }
                else{
                    var archivoName = null;
                    if(fileselect !== null){
                        
                        var formdata = new FormData();
                        let ruta = 'CATÁLOGO DE SERVICIOS EXTERNOS\\' + cookies.get('nombre_Departamento') ;
                        
                        formdata.append('file', fileselect);
                        formdata.append('ruta', ruta);
                        formdata.append('nombrearch', nombre+"_"+fileselect.name);
            
                        await fileService.upload(formdata).then(data => {
                            //setPdfframe(data.message);
                            
                            if(data.status === 200){
                                //console.log(data.message);
                                
                                archivoName = data.message;
            
                            }else{
                                if(data.status === 501){
                                    toast.current.show({severity:'error', summary: '¡Atención!', detail:'No se ha podido agregar el Documento', life: 3000});
            
                                }
                            }
                        }).catch(error=>{
                            swal({
                            title: "¡Atención!",
                            text: 'El Achivo Rebasa el Limite de Tamaño Permitido',
                            icon: "error",
                            button: "Aceptar",
                            timer: "3000"
                          });
            
                        });  
                    }
                    
                    const curso = {
                        id_Curso: idCurso,
                        id_Departamento: cookiedep,
                        id_Usuarios: docente,
                        curso_Nombre: nombre,
                        curso_Tipo: tipoc,
                        curso_Cupo: cupo,
                        curso_Horas: horas,
                        curso_Estado: 0,
                        curso_Visualizacion: 0,
                        curso_pdf_Temario: archivoName,
                        curso_creado_por: null,
                        curso_fecha_creacion: null,
                        curso_actualizado_por: null,
                        curso_fecha_actualizacion: null
                    }
                    console.log(curso);
                    console.log(temario);

                    servicioCatalogo.save(curso).then(data => {
                        setCursos(null);

                        swal({
                            title: "¡Atención!",
                            text: "¡Se ha solicitado: "+ curso.curso_Tipo +"!",
                            icon: "success",
                            button: "Aceptar",
                            timer: "3000"
                          });

                          servicioconsCatalogo.search(cookiedep).then(data => setCursos(data));
                    });
                }
            }
        }
        
    }

    var chek;
    var [numero, setNumero] = useState(0);

    const booleanSwitch=(valor)=>{
        setNumero(valor ? 1:0);        
    }
    const falso=()=>{
        chek = false;
    }

    const estado = (rowData) => {
        return(
            <SwitchVisible
                valor={rowData.curso_Estado == 1}                 
                cambio={booleanSwitch}  
                estado={falso} 
                datos={rowData} 
                agregar={agregar}       
            />
        )
    }


    const botonTemario = (rowData) => {
        if(rowData.curso_pdf_Temario != null){
            return (
                //<React.Fragment> Fragmento simplificado abajo
                <>
                    <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" onClick={() => { window.open(rowData.curso_pdf_Temario)}} />
                    
                </>
                //</React.Fragment>
            );
        }
        else{
            return (
                //<React.Fragment> Fragmento simplificado abajo
                <>
                    <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" disabled />
                    
                </>
                //</React.Fragment>
            );
        }
    }

    const botonModificar = (rowData) => {
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-pencil " className="p-button-rounded p-button-success" onClick={() => {setVisible(true) ; setIdCurso(rowData.id_Curso) ; setNombre(rowData.curso_Nombre) ; setDocente(rowData.id_Usuarios) ; setTipoc(rowData.curso_Tipo) ; setCupo(rowData.curso_Cupo) ; setHoras(rowData.curso_Horas) ; setTemario(rowData.curso_pdf_Temario) ; setFileselect(null) ; setPdfframe(rowData.curso_pdf_Temario) ; 
                if(rowData.curso_pdf_Temario != null){
                    setBandera(true);
                }
                else{
                    setBandera(false);
                }
                }} />
            </>
            //</React.Fragment>
        );
    }

    const onHide = () => {
        setVisible(false);
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Agregar" icon="pi pi-user-plus"  iconPos="left" style={{backgroundColor:"red", borderColor:"red"}} onClick={() => {setVisible(false) ; agregar(0,null)}}  />
            </div>
        );
    }

    

    const onChangeInputFile = (file) =>{
        setFileselect(file);
        swal({
            title: "¡Atención!",
            text: "¡Se ha Seleccionado el PDF: " + file.name + "!",
            icon: "success",
            button: "Aceptar",
            timer: "5000"
          });
    }

    const eliminarPDF = () =>{
        swal({
            title: "¿Deseas Eliminar el Archivo?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
            }).then((OK) => {
            if(OK){
                const curso = {
                    id_Curso: idCurso,
                    id_Departamento: cookiedep,
                    id_Usuarios: docente,
                    curso_Nombre: nombre,
                    curso_Tipo: tipoc,
                    curso_Cupo: cupo,
                    curso_Horas: horas,
                    curso_Estado: 0,
                    curso_Visualizacion: 0,
                    curso_pdf_Temario: null,
                    curso_creado_por: null,
                    curso_fecha_creacion: null,
                    curso_actualizado_por: null,
                    curso_fecha_actualizacion: null
                }
                console.log(curso);
                console.log(temario);
        
                
                if(temario != null)
                fileService.delete(temario).then(data => {
                    setPdfframe(null);
                    if(data.status === 200){

                        servicioCatalogo.save(curso).then(data => {
                            setTemario(null);        
                            swal({
                                title: "¡Atención!",
                                text: "¡Se ha Eliminado el Archivo!",
                                icon: "success",
                                button: "Aceptar",
                                timer: "3000"
                              });
                
                              servicioconsCatalogo.search(cookiedep).then(data => setCursos(data));
                        });
        
                    }else{
                        if(data.status === 501){
                            toast.current.show({severity:'error', summary: '¡Atención!', detail:data.message, life: 3000});
                            setTemario(null);
                        }
                    }
        
                });
            }
            else{
                swal({
                title: "¡Atención!",
                text: "¡No se ha Eliminado el Archivo!",
                icon: "info",
                button: "Aceptar",
                timer: "3000"
                });
            }
        });
        
    }

    return (
        <div className='card'> 
        <h1>Catálogo de Servicios Externos</h1>
                <div className="card" > 
                    <div style={{ display: "flex"}}>
                        <Button onClick={()=>{setVisible(true) ; setIdCurso(null) ; setNombre("") ; setDocente(null) ; setTipoc(null) ; setCupo(null) ;setFileselect(null); setHoras(null) ; setTemario(null) ; setPdfframe(null) ; setBandera(false)}} 
                        style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"red", borderColor:"red"}} label="Nuevo Servicio" icon="pi pi-file" iconPos="left" />
                    </div>
                        <DataTable value={cursos}  scrollHeight="533px"  responsiveLayout="scroll" >
                        <Column header="Nombre del Servicio"  field='curso_Nombre'  exportable={false} ></Column>
                        <Column header="Docente que lo imparte"  field='user_Nombre' exportable={false} ></Column>
                        <Column header="Tipo de Servicio" field='curso_Tipo' exportable={false} ></Column>
                        <Column header="Cupo" field='curso_Cupo' exportable={false} ></Column>
                        <Column header="Horas" field='curso_Horas' exportable={false} ></Column>
                        <Column header="Estado" body={estado} field='v_Estado' exportable={false} ></Column>
                        <Column header="Visualizacion" body={visualizacion} field='curso_Visualizacion' exportable={false} ></Column>
                        <Column header="Temario" body={botonTemario} field='curso_pdf_Temario' exportable={false} ></Column>
                        <Column header="Modificar" body={botonModificar} exportable={false} ></Column>
                        </DataTable>
                        
                </div>
<Toast ref={toast}/>
                <Dialog header="Agregar Servicio" visible={visible} onHide={onHide} modal={true} footer={renderFooter}>
                    <table>
                        <tbody>
                        <tr>
                            <td style={{paddingRight: '5rem'}}>

                                    <h5>Nombre del Servicio</h5>
                                    <InputText  type="text" 
                                    value={nombre} onChange={(e) => {setNombre(e.target.value)}} style={{width:"15em"}}  />


                                    <h5>Docente que lo imparte</h5>
                                    <Dropdown value={docente} optionValue='id_Usuarios' options={docentes} onChange={(e) => {setDocente(e.value)}} optionLabel="user_Nombre"
                                    placeholder="Seleccione una opcion" style={{width:"15em"}} />

                                    <h5>Tipo de Servicio</h5>
                                    <Dropdown value={tipoc} optionValue='name' options={tipocurso} onChange={(e) => {setTipoc(e.value)}} optionLabel="name"
                                    placeholder="Seleccione una opcion" style={{width:"15em"}} />

                                    
                                    <h5>Cupo</h5>
                                    <InputNumber inputId="minmax-buttons" value={cupo} style={{width:"15em"}} onValueChange={(e) => setCupo(e.value)} mode="decimal" showButtons min={0} max={500} /> 

                            </td>
                            <td style={{paddingRight: '5rem'}}>
                                 
                                    <h5>Horas del servicio</h5>
                                    <InputNumber inputId="minmax-buttons" value={horas} style={{width:"15em"}} onValueChange={(e) => setHoras(e.value)} mode="decimal" showButtons min={0} max={500} /> 
                                    

                                    <h5>Temario</h5>
                                    {(bandera === true)?  
                                        <iframe id="iframe"
                                            title="Inline Frame PDF"
                                            width="210"
                                            height="280"
                                            src={pdfframe}
                                            style={{marginBottom:"1em"}}
                                        ></iframe>
                                        : <p></p>
                                    }
                                   
                                    <br/>    
                                    <Button icon="pi pi-cloud-upload" style={{marginRight:"1em"}} onClick={() => {document.getElementById("inputFileJosean").click()}} className="p-button-rounded p-button-success" />

                                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => {eliminarPDF()}}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <input type="file" id="inputFileJosean" hidden accept=".pdf" onChange={(e) => onChangeInputFile(e.target.files[0])}/>
                </Dialog>
               
            
        </div>
        
    );
};

export default Catalogo;


function SwitchVisible  (props){
    const [checked1, setChecked1] = useState(props.valor);    

    const cambioVisibilidad=()=>{ 
        props.cambio(checked1)                                   
    }

    const guardarVisibilidad=()=>{        
        const curso = {
            ...props.datos,
            "curso_Estado":checked1 ? 0:1            
        }

        props.agregar(1,curso);
    }
    return(
        <div >                        
            <InputSwitch 
            checked={checked1}
            onChange={(e) => {setChecked1(e.value); cambioVisibilidad(); guardarVisibilidad()          
            }}
            />
        </div>
    )

}
