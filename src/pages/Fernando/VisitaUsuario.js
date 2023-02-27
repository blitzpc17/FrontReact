import React, { useState, useEffect, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { UsuariosVisitas } from '../../services/Fernando/UsuariosVisitas';
import { ServicioPeriodos } from '../../services/Fernando/ServicioPeriodos';
import { CarreraServicio } from '../../services/Fernando/CarrerasServicio';
import swal from 'sweetalert';
import { VisitasService } from '../../services/Fernando/VisitasService';
import { DocumentosVisitasServicio } from '../../services/Fernando/DocumentosVisitasServicio';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const VisitaUsuario = () => {

    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const {idreg, titulo, nom, iddep} = new useParams();

    const idDepReg = parseInt(iddep);
    const idPer = parseInt(cookies.get('id_Periodo')); 
    const namePer = cookies.get('lblPeriodo'); 

    const idUsReg = parseInt(idreg);//Necesita id visita del registro    

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_secretaria_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Docentes Visita'){
                UsVisitas.search(idUsReg).then(data => setValue(data));
                ServicioPer.getAll().then(data => setPeriodo(data));
                carreraService.search(idDepReg).then(data => setCarreras(data));
                VisitaS.getAll().then(data => setVis(data));
                CreaDocs.getAll().then(data => setV(data));
            }
            else{
                navigate('/plataforma/departamentosvisitas');
            }
        }
        
    }, []);

    //Variable periodo
    var readonly = false;

    const [visita, setVisita] = useState({
        id_Visita:null,
        id_Periodo:idPer,
        id_Departamento:idDepReg,
        id_Usuarios:idUsReg,
        id_Carrera:null,
        vst_nombre_empresa:null,
        vst_tipo_visita:null,
        vst_creado_por:null,
        vst_fecha_creacion:null,
        vst_actualizado_por:null,
        vst_fecha_actualizacion:null,
    })

    //Servicios
    const [value, setValue] = useState([]);
    const UsVisitas = new UsuariosVisitas();

    const [periodo, setPeriodo] = useState([]);
    const ServicioPer = new ServicioPeriodos();

    const [carreras, setCarreras] = useState([]);
    const carreraService = new CarreraServicio();

    const [vis, setVis] = useState([]);
    const VisitaS = new VisitasService();

    const [v, setV] = useState([]);
    const CreaDocs = new DocumentosVisitasServicio();
    //Servicios

    

    const [documentacion,setDocumentacion] = useState({
        id_Documentos_Visita:null,
        id_Visita:null,
        docvst_pdf_oficio_solicitud:null,
        docvst_pdf_formato_solicitud:null,
        docvst_pdf_formato_oficio_solicitud : null,
        docvst_pdf_formato_programa :null,
        docvst_pdf_carta_agradecimientos:null,
        docvst_pdf_resultados_incidencias:null,
        docvst_pdf_lista_estudiantes :null,
        docvst_pdf_evidencias :null,
        docvst_pdf_oficio_constancia:null
    });

    
    const [detValor,setDetValor] = useState(0);

    const guardarDoc=(f)=>{
        documentacion.id_Visita = f
        CreaDocs.save(documentacion).then(data=>{});
    }

    const guardarVis=(data)=>{
        VisitaS.save(data).then(data=>{
            
            if(detValor == 0){
                guardarDoc(data.id_Visita);
            }  

            swal({
                title:"!Atencion",
                text:"!Registro guardado correctamente",
                icon:"success",
                button:"Aceptar",
                timer:"3000"
            }); 
            UsVisitas.search(idUsReg).then(data => setValue(data));
            })
    }

    const carr=[{
        name:"",code:null
    }];
    const regresaCarrera =(nummes) =>{        
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
    const buscar=(variable)=>{ 
        for(var i=0; i<carr.length; i++){                        
            if(variable == carr[i].name){                                
                return (carr[i].code);
            }
        }
    }

    //Dialog
    const [displayBasic, setDisplayBasic] = useState(false);
    
    const dialogFuncMap = {
        'displayBasic': setDisplayBasic
    }
    const [position, setPosition] = useState('center');    

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
        setCity('');
        setValue2('');        
        setValue3('');
        visita.id_Visita=null;
        setDetValor(0);
                    
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button 
                    label='Agregar' 
                    className="p-button-rounded p-button-info" 
                    disabled={readonly}
                    onClick={() => {
                        
                        visita.id_Carrera = value2.code;
                        visita.vst_nombre_empresa = value3;
                        visita.vst_tipo_visita = city;  
                        console.log(visita);
                        guardarVis(visita);
                        onHide(name);
                    }} 
                />
            </div>
        );
    }

    const [value2, setValue2] = useState('');
    const [value3, setValue3] = useState('');

    const [city, setCity] = useState(null);      

  
    const doc=(rowData)=>{  
        //rowData.id_visita
        //titulo  
        //nom    
        return (                       
            <Button icon="pi pi-chevron-right" className="p-button-rounded p-button-info" 
            onClick={() => {
                cambiarBreadLocal('Documentos');
                navigate('/plataforma/documentosvisita/'+ titulo + '/' + nom  + '/' + rowData.id_visita);
            }} />
    );
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/docentevisita/' + idreg + '/' + titulo + '/' + nom + '/' + iddep });

        cambiarBread(direccionesTemp, lblActual);
    }

    const modificar=(rowData)=>{ 
        return (                       
            <Button 
                icon="pi pi-sort-alt" 
                className="p-button-rounded p-button-success" 
                disabled={readonly}
                onClick={() => {
                    setDetValor(1);
                    var x = buscar(rowData.vst_carrera);
                    setValue2({name:rowData.vst_carrera,code:x});
                    setValue3(rowData.vst_empresa);
                    setCity(rowData.vst_tipo_visita);
                    visita.id_Visita = rowData.id_visita;
                    setDisplayBasic(true);
                }} 
            />
    );
    }



    return (
        <div>
            <Panel>                
                <center>                    
                    <table border="0">
                        <tbody>                        
                            <tr>
                                <td><center><h1>Visitas de {nom}</h1></center></td>
                            </tr> 
                            <tr>
                                <td><center><h3>{namePer}</h3></center></td>                                
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <div align="center">
                                        <Button 
                                            label="Agregar" icon="pi pi-file" 
                                            className="p-button-success" 
                                            disabled={readonly}
                                            onClick={()=>{setDisplayBasic(true);}}
                                        />
                                    </div>                                    
                                </td>
                            </tr>
                        </tbody>    
                    </table>
                </center>
                <br></br>
                <DataTable value={value} responsiveLayout="scroll">
                    <Column field="vst_tipo_visita" header="Tipo de Visita"></Column>
                    <Column field="vst_empresa" header="Empresa"></Column>
                    <Column field="vst_carrera" header="Carrera"></Column>
                    <Column header="Documentos" body={doc}></Column>
                    <Column header="Editar" body={modificar}></Column>
                </DataTable>
            </Panel>


            <Dialog header="Referencia a Empresa" visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
                <div align="center">
                    <table>
                        <tbody>
                            <tr>
                                <td><h5>Nombre de la Empresa:</h5></td>
                                <td style={{padding: '2rem'}}>
                                    <span className="p-float-label">
                                        <InputText id="empresa" value={value3} onChange={(e) => setValue3(e.target.value)} maxLength="255"/>
                                        <label htmlFor="empresa">Empresa</label>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td style={{padding: '1rem'}}><h5>Carrera:</h5></td>
                                <td>
                                    <Dropdown value={value2} options={regresaCarrera(1)} 
                                        onChange={(e) => {setValue2(e.target.value)}} optionLabel="name"
                                        placeholder="Selecciona una carrera" style={{width:"15em"}}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><h5>Tipo de Visita:</h5></td>
                            </tr>
                        </tbody>
                    </table>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{paddingRight: '5rem'}}>
                                    <div className="p-field-radiobutton">
                                        <RadioButton inputId="city1" name="city" value="Virtual" onChange={(e) => setCity(e.value)} checked={city === 'Virtual'} />
                                        <label htmlFor="city1">Virtual</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="p-field-radiobutton">
                                        <RadioButton inputId="city2" name="city" value="Presencial" onChange={(e) => setCity(e.value)} checked={city === 'Presencial'} />
                                        <label htmlFor="city2">Presencial</label>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Dialog>
        </div>
    )
}

export default VisitaUsuario
