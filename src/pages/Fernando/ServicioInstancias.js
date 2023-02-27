import React, { useState, useEffect, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import swal from 'sweetalert';
import { Dropdown } from 'primereact/dropdown';
import { CarreraServicio } from '../../services/Fernando/CarrerasServicio';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import Cookies from 'universal-cookie';
import { ServicioServicios } from '../../services/Fernando/ServicioServicios';
import { DocSocialServicio } from '../../services/Fernando/DocSocialServicio';
import { DepsSocialService } from '../../services/Fernando/SocialDepsService';

const cookies = new Cookies();

const ServicioInstancias = (props) => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_oficina_servicio_social_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Instancias Social'){
                carreraService.search(idDepReg).then(data => setCarreras(data));
                serSocial.search(idDepReg,idPer).then(data => setValue(data));
                DocServ.getAll().then(data => setV(data));
                socialSave.getAll().then(data => setSave(data));
            }
            else{
                navigate('/plataforma/periodosocial');
            }
        }
        
    }, []);
    
    //Variable para periodos
    var readonly = false;
    //Variable para periodos

    const idPer = parseInt(cookies.get('id_Periodo'));

    const {depRegistro, iddep} = new useParams();

    const idDepReg = parseInt(iddep);

    const [documentacion,setDocumentacion] = useState({
        id_DocumentosServicio:null,
        id_Servicio:null,
        docsev_pdf_Const_extraescolar:null,
        docsev_pdf_vigencia_imss:null,
        docsev_pdf_formato_solicitud:null,
        docsev_pdf_carta_compromiso:null,
        docsev_pdf_carta_presentacion:null,
        docsev_pdf_carta_aceptacion:null,
        docsev_pdf_plan_trabajo:null,
        docsev_pdf_reporte_bimestral:null,
        docsev_pdf_bimestral_1:null,
        docsev_pdf_bimestral_2:null,
        docsev_pdf_bimestral_3:null,
        docsev_pdf_reporte_final:null,
        docsev_pdf_carta_liberacion:null
    });

    //Servicios
    const [carreras, setCarreras] = useState([]);
    const carreraService = new CarreraServicio();

    const [value, setValue] = useState([]);
    const serSocial = new DepsSocialService();

    const [save, setSave] = useState([]);
    const socialSave = new ServicioServicios();

    const [v, setV] = useState([]);
    const DocServ = new DocSocialServicio();
    //Servicios
    
    
    const [detValor,setDetValor] = useState(0);
    const guardar=(f)=>{
        documentacion.id_Servicio = f;
        DocServ.save(documentacion).then(data => {}) ;

    }
    const alta=(data)=>{
        socialSave.save(data).then(data => {           

            if(detValor == 0){
                guardar(data.id_Servicio);
            }            
            serSocial.search(idDepReg,idPer).then(data => setValue(data));
        }) 
             
        setDetValor(0);
        swal({
            title: "¡Atención!",
            text: "¡Registro Guardado!",
            icon: "success",
            button: "Aceptar",
            timer: "3000"
        });         
    }
    const [value2, setValue2] = useState(false);
    const [displayBasic, setDisplayBasic] = useState(false);
    const [noControl, setNoControl] = useState('');
    const [nombre, setNombre] = useState('');
    const [carrera, setCarrera] = useState('');
    const [social, setSocial] = useState({
          id_Servicio:null,
          id_Periodo:null,
          id_Usuarios:1,/* SIEMPRE DEBE SER 1 */
          id_Departamento:idDepReg,
          serv_no_Control:null,
          serv_nombre_Alumno:null,
          serv_Carrera:null,
          serv_creado_por:null,
          serv_fecha_creacion:null,
          serv_actualizado_por:null,
          serv_fecha_actualizacion:null
    });
    const carr=[{
        name:"",code:null
    }];
    const regresames =(nummes) =>{        
        let per=""; 
        for (var i = 0; i < carreras.length; i++) {             
            per="";           
            per = carreras[i].car_nombre;
            nummes=carreras[i].id_carrera;            
            carr.push({name:""+per,code:nummes});
        } 
        carr.shift(); 
        return carr;
    }

    const dialogFuncMap = {
        'displayBasic': setDisplayBasic
    }
    
    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
        setCarrera('');
        setNoControl('');
        setNombre('');
        setValue2('');
        social.serv_no_Control = null;
        social.serv_nombre_Alumno = null;
        social.serv_Carrera = null;
        social.id_Periodo = null;
        social.id_Servicio = null; 
        setDetValor(0);
    }
    const renderFooter = (name) => {
        return (
            <div>
                <Button 

                disabled={readonly}

                label="Agregar" 
                onClick={() => {
                    social.serv_no_Control = noControl;
                    social.serv_nombre_Alumno = nombre;
                    social.serv_Carrera = value2.name;
                    social.id_Periodo = idPer;
                    console.log(social.serv_Carrera);
                    if(social.serv_no_Control == "" || social.serv_no_Control == null){  
                        swal({
                            title:"¡Atencion!",
                            text:"Es necesario llenar todos los campos",
                            icon:"warning",
                            button:"Aceptar",
                            timer:"3000"
                          });                      
                    }else{
                        if(social.serv_nombre_Alumno == "" || social.serv_nombre_Alumno == null){
                            swal({
                                title:"¡Atencion!",
                                text:"Es necesario llenar todos los campos",
                                icon:"warning",
                                button:"Aceptar",
                                timer:"3000"
                              }); 
                        }else{
                            if(social.serv_Carrera == "" || social.serv_Carrera == null ){
                                swal({
                                    title:"¡Atencion!",
                                    text:"Es necesario llenar todos los campos",
                                    icon:"warning",
                                    button:"Aceptar",
                                    timer:"3000"
                                  });
                            }else{
                                alta(social);                                
                            }
                        }
                    }
                    
                    onHide(name);
                }} 
                />
            </div>
        );
    }

    const buscar=(variable)=>{ 
        for(var i=0; i<carr.length; i++){                        
            if(variable == carr[i].name){                                
                return (carr[i].code);
            }
        }
    }

    const doc=(rowData)=>{
        let nombre = rowData.serv_nombre_alumno;
        let control = rowData.serv_no_control;
        let conjunto = nombre + " - " + control;
        let servicioRegistro = rowData.id_Servicio;
        //idDepReg
        //depRegistro
        return(            
            <Button icon="pi pi-angle-right" className="p-button-rounded" 
                onClick={() => { 
                    cambiarBreadLocal('Documentos Alumno');
                    navigate('/plataforma/documentosalumno/'+ depRegistro + '/' + conjunto + '/' + servicioRegistro);                            
            }}
            />            
        )
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/departamentosocial/' + depRegistro + '/' + idDepReg });

        cambiarBread(direccionesTemp, lblActual);
    }

    const modificar=(rowData)=>{
        return(
            <Button 
            
            disabled={readonly}

            icon="pi pi-pencil"  
            className="p-button-rounded p-button-success" 
            onClick={() => {  
                setDetValor(1);                                               
                setNoControl(rowData.serv_no_control);
                setNombre(rowData.serv_nombre_alumno);
                var x = buscar(rowData.serv_carrera);
                setValue2({name:rowData.serv_carrera,code:x});
                social.id_Servicio = rowData.id_Servicio;            
                setDisplayBasic(true);                     
            }}
            />
        )
    }
    
    return (
        <div>
            
            <Panel>
            <center>
                <table border="0" >
                    <tbody>
                        <tr>
                            <td style={{paddingRight: '5rem'}} colSpan={2}>
                                <div className="textoA">Alumnos en Servicio Social</div>
                                <div className="textoA">{depRegistro}</div>
                            </td>                                                        
                        </tr>
                        <tr>
                            <td style={{paddingRight: '35rem'}}></td>                         
                            <td>
                                <Button                                 
                                    label="Agregar Servicio Social" 
                                    className="p-button-primary"
                                    icon="pi pi-book"
                                    
                                    disabled={readonly}
                                    
                                    onClick={() => {                                         
                                        setDisplayBasic(true);                     
                                    }}                                    
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </center>
            <br></br>
                <div className="card">
                    <DataTable value={value}  scrollable>
                        <Column field="serv_no_control" header="No.Control"></Column>
                        <Column field="serv_nombre_alumno" header="Nombre del Estudiante"></Column>
                        <Column field="serv_carrera" header="Carrera"></Column>
                        <Column field="" body={doc} header="Documentos"></Column>
                        <Column body={modificar} header="Editar"></Column>
                    </DataTable>
                </div>
            </Panel>            
                <Dialog header="Referencia Alumno" visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
                    <center>
                        <table>
                            <tbody>
                                <tr>
                                    <td><h5>No. Control:</h5></td>
                                    <td style={{padding: '1rem'}}>
                                        <label htmlFor="basic"></label>
                                        <InputMask id="noControl" mask="99999999" 
                                            value={noControl} placeholder="Ej. 99999999" 
                                            onChange={(e) => setNoControl(e.value)}></InputMask> 
                                    </td>
                                </tr>  
                                <tr>
                                    <td><h5>Nombre del Alumno:</h5></td>
                                    <td style={{padding: '1rem'}}>
                                        <span className="p-float-label p-input-icon-left">  
                                            <i className="pi pi-user" />                                                     
                                            <InputText id="nombreAlumno" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength="255"/>                                                        
                                            <label htmlFor="nombreAlumno">Nombre Estudiante</label>
                                        </span> 
                                    </td>
                                </tr>  
                                <tr>
                                    <td><h5>Carrera:</h5></td>
                                    <td style={{padding: '1rem'}}>
                                        <Dropdown value={value2} options={regresames(1)} 
                                            onChange={(e) => {setValue2(e.target.value)}} optionLabel="name"
                                            placeholder="Selecciona una carrera" style={{width:"15em"}}
                                        />
                                    </td>
                                </tr>                  
                            </tbody>
                        </table>
                    </center>
                </Dialog>
        </div>
    )
}

export default ServicioInstancias
