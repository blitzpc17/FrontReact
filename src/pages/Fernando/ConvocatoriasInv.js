import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import { addLocale } from 'primereact/api';
import { ConvocatoriasService } from '../../services/Fernando/ConvocatoriasServicio';
import Cookies from 'universal-cookie';
import swal from 'sweetalert';
import { QConvocatorias } from '../../services/Fernando/QConvocatoriasService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InteresadosConvo } from '../../services/Fernando/InteresadosConvo';
import FileService from '../../services/FileService';
import { useNavigate, useParams } from 'react-router-dom';

const cookies = new Cookies();

const ConvocatoriasInv =()=>{
    const navigate = new useNavigate();

    const {idPeriodo} = new useParams();

    const depRegistro = parseInt(cookies.get('id_Departamento'));
    const idPer = parseInt(idPeriodo);

    const [value, setValue] = useState([]);
    const GetQConvo = new QConvocatorias();
    const GetConvo = new ConvocatoriasService();

    const Interesados = new InteresadosConvo();
    const [valueInt, setValueInt] = useState();

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_desarrollo_academico_departamental)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Convocatorias')
                GetQConvo.search(depRegistro, idPer).then(data => setValue(data)); 
            else
                navigate('/plataforma/periodosjefeinvestigacion');
        }
            
    }, []); 

    //Variable periodo
    var readonly = false;

    //Dialog
    const [objeto, setObjeto] = useState({
        id_Convocatoria: null,
        id_Periodo: idPer,
        id_Departamento: depRegistro,
        conv_Nombre: null,
        conv_Fecha_Expirar: null,
        conv_Estado: 1,
        conv_Tipo: 1,
        conv_pdf_Informacion: null,
        conv_creado_por: null,
        conv_fecha_creacion: null,
        conv_actualizado_por: null,
        conv_fecha_actualizacion: null
    });
    const [opcion, setOpcion] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [docVer, setDocVer] = useState(true);
    const [enVer, setEnVer] = useState(true);
    const [calendario, setCalendario] = useState('');
    const [enlace, setEnlace] = useState('');
    const [pdf, setPdf] = useState('');
    const [z, setZ] = useState(1);
    const [displayBasic, setDisplayBasic] = useState(false);
    const [Idialog, setIdialog] = useState(false);
    const [informacion, setInformacion] = useState(null);
    const [DataDocumento, SetDataDocumento] = useState(null);
    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
        'Idialog': setIdialog
    }
    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
        setDocVer(true);
        setEnVer(true);
        setEnlace('');
        setInformacion(null);
        setTitulo('');
        setCalendario('');
    }
    addLocale('es', {
        firstDayOfWeek: 1,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Hoy',
        clear: 'Claro'
    });

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Guardar" disabled={readonly}
                 onClick={() => 
                    {                        
                        objeto.conv_Nombre = titulo;
                        objeto.conv_Fecha_Expirar = calendario;
                        if(z == 1){
                            objeto.conv_pdf_Informacion = enlace;
                        }else{
                            objeto.conv_pdf_Informacion = pdf;
                        }
                        console.log(objeto);
                        guardarConvo(objeto);
                        onHide(name);
                    }} className="p-button-info" />
            </div>
        );
    }

    const footer = (name) => {
        return (
            <div>
                <Button label="Cerrar" onClick={() => 
                    {onHide(name);
                    }} className="p-button-warning" />
            </div>
        );
    }
    
    
    const VerBoton=(props)=>{
        return(
            <div>
                <Button icon="pi pi-cloud" className="p-button-rounded p-button-success" 
                onClick={()=>{
                    objeto.conv_Tipo = 0;
                    setZ(0);
                    accesoPdf();
                }}
                disabled={props.v}/>
            </div>
        )
    }
    var formData = new FormData();
    const onPdfChange=(e)=>{        
        formData.append('file',e.target.files[0]); 
        formData.append('ruta',cookies.get('lblPeriodo')+'\\Gestion Tecnologica y Vinculacion\\'+cookies.get('nombreUsuario')+'\\Documentos'); 
        formData.append('nombrearch',e.target.files[0].name); 
    }
    const accesoPdf=()=>{
        document.getElementById("archivopdf").click();                                                 
    }
    const SerDoc = new FileService();
    const VerEnlace=(props)=>{
        return(
            <div>
                <span className="p-float-label p-input-icon-left">
                    <i className="pi pi-link" />
                    <InputText id="enlace" value={enlace} onChange={(e) => {setEnlace(e.target.value); setPdf(null);}} style={{ width: '400px'}} disabled={props.v}/>
                    <label htmlFor="enlace">www.ejemplo.com</label>
                </span>
            </div>
        )
    }

    const guardarConvo =async(data)=>{
        if(z == 1){
            GetConvo.save(data).then(data => {
                GetQConvo.search(depRegistro, idPer).then(data => setValue(data));     
                swal({
                    title: "¡Atención!",
                    text: "¡Registro Guardado!",
                    icon: "success",
                    button: "Aceptar",
                    timer: "3000"
                });
            });
        }else{
            await SerDoc.upload(formData).then(data2=>{
                if(data2.status===200){                
                    setPdf(data.message);
                    objeto.conv_pdf_Informacion = pdf;
                    let objTemp={
                        ...data,
                        conv_pdf_Informacion : data2.message
                    };
                    GetConvo.save(objTemp).then(data => {
                        GetQConvo.search(depRegistro, idPer).then(data => setValue(data));     
                       swal({
                           title: "¡Atención!",
                           text: "¡Registro Guardado!",
                           icon: "success",
                           button: "Aceptar",
                           timer: "3000"
                       });
                   });
                }
                else{
                    if(data2.status === 501){
                        swal({
                            title: "¡Atención!",
                            text: data.message,
                            icon: "error",
                            button: "Aceptar",
                            timer: "3000"
                          });
                     }
                }
            })
        }
        

        objeto.conv_Nombre = null;
        objeto.conv_Fecha_Expirar = null;
        objeto.conv_pdf_Informacion = null;
        objeto.conv_Tipo = 1;
        objeto.id_Convocatoria = null;
        setTitulo('');
        setCalendario('');
        setEnlace('');
    }

    //Dialog

    const verInfo=(rowData)=>{
        if(rowData.conv_tipo == 0){
            return(            
                <div>
                    <a href={rowData.conv_informacion} target="_blank" style={{textDecorationLine : "none"}}>
                        <Button icon="pi pi-cloud" className="p-button-rounded p-button-success" />
                    </a>
                </div>
            )
        }
        if(rowData.conv_tipo == 1){
            return(            
                <div>
                    <a href={rowData.conv_informacion} target="_blank" style={{textDecorationLine : "none"}}>
                        <Button icon="pi pi-link" className="p-button-rounded p-button-success" />
                    </a>
                </div>
            )
        }
        
    }

    var id = null;
    const modificar=(rowData)=>{
        return(
            <div>
                <Button disabled={readonly} icon="pi pi-sort-alt" className="p-button-rounded p-button-info" 
                    onClick={()=>{
                        objeto.id_Convocatoria = rowData.id_convocatoria;
                        id = rowData.id_convocatoria;
                        setTitulo(rowData.conv_nombre);
                        let date1= new Date(rowData.conv_expirar);
                        setCalendario(date1);
                        if(rowData.conv_tipo == 0){
                            setDocVer(false);
                            setEnVer(true);
                            setInformacion(rowData.conv_informacion);
                        }else{
                            setDocVer(true);
                            setEnVer(false);
                            setEnlace(rowData.conv_informacion);
                        }
                        setDisplayBasic(true);  
                    }}
                />
            </div>
        )
    }

    
    const opcionesUsuarios = [
        { name: 'Activa', code: 1 },
        { name: 'Desactivada', code: 2 }
    ];
    const onCityChange2 = (e, rowData) => {        
        cambiarestado(e.value, rowData);
    }

    const cambiarestado = async(e, rowData) =>{
        objeto.id_Convocatoria = rowData.id_convocatoria;
        objeto.conv_Nombre = rowData.conv_nombre;
        objeto.conv_Fecha_Expirar = rowData.conv_expirar;
        objeto.conv_Tipo = rowData.conv_tipo;
        objeto.conv_pdf_Informacion = rowData.conv_informacion;        
        if(e.name == 'Activa'){
            objeto.conv_Estado = 1;
            await GetConvo.save(objeto).then(data => {
                GetQConvo.search(depRegistro, idPer).then(data => setValue(data));     
                swal({
                    title: "¡Atención!",
                    text: "¡Se activo!",
                    icon: "success",
                    button: "Aceptar",
                    timer: "3000"
                });
            });
        }else{
            if(e.name == 'Desactivada'){
                objeto.conv_Estado = 0;
                await GetConvo.save(objeto).then(data => {
                    GetQConvo.search(depRegistro, idPer).then(data => setValue(data));     
                    swal({
                        title: "¡Atención!",
                        text: "¡Se desactivo!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                    });
                });
            }            
        }
        
        objeto.id_Convocatoria = null;
        objeto.conv_Nombre = null;
        objeto.conv_Fecha_Expirar = null;
        objeto.conv_Tipo = null;
        objeto.conv_pdf_Informacion = null; 
        objeto.conv_Estado = null; 
    }

    const estadoChange =(rowData)=>{
        let fecha_actual = new Date();
        let fecha_data =new Date( rowData.conv_expirar);
        let condi;
        let num;
        if(rowData.conv_estado == 0 ){

            condi = 'Desactivada';
            num = 2
        }else{
            condi = 'Activa';
            num = 1
        }
        let objeto = {name: condi,code:num};   
        if(fecha_data < fecha_actual){
            return(<h3>Caduco</h3>)
        }else{
            return(                
                <Dropdown value={objeto} options={opcionesUsuarios} onChange={(e)=> onCityChange2(e, rowData)} 
                optionLabel="name" placeholder="Estado"  style={{ width: '150px'}}/>
            )
        }
    }

    const [encabezado,setEncabezado] = useState('');
    const llenadoTabla=(rowData)=>{
        setEncabezado("Convocatoria " + rowData.conv_nombre);
        Interesados.search(rowData.id_convocatoria).then(data => setValueInt(data)); 
        setIdialog(true);
    }

    const redireccion=(rowData)=>{
        let a = rowData.conv_cantidad;
        let b = rowData.conv_num_user;
        let x = a + "/"+ b + " de los Docentes";
        if(a == 0){
            return(
                <Button label="Sin interesados" className="p-button-secondary p-button-text"/>

            )
        }else{
            return(
                <Button label={x} className="p-button-link" onClick={()=>{
                    llenadoTabla(rowData)
                }} />
            )
        }
        
    }
    return(
        <div>
            <center>
                <h1>Alta de Convocatorias</h1>
            </center>
            <br></br>
            <center>
                <Button label="Crear Convocatria" icon="pi pi-book" disabled={readonly}
                onClick={() => {setDisplayBasic(true); objeto.id_Convocatoria =null;}} />
            </center>
            <br></br>
            <Panel>  
                <DataTable value={value} responsiveLayout="scroll">
                    <Column field="conv_nombre" header="Convocatoria"></Column>
                    <Column field="conv_expirar" header="Fecha Expiracion" style={{ width: '15%'}}></Column>
                    <Column header="Estado" body={estadoChange} style={{ width: '15%'}}></Column>
                    <Column header="Ver" body={verInfo} style={{ width: '10%'}}></Column>
                    <Column header="Editar" body={modificar} style={{ width: '10%'}}></Column>
                    <Column header="Interesados" body={redireccion} style={{ width: '20%'}}></Column>
                </DataTable>   
                <input type="file" id="archivopdf" hidden accept=".pdf" onChange={(e)=> onPdfChange(e)}/>                                           
            </Panel>

            <Dialog header="Convocatoria" visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
                <center>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{padding: '1rem', paddingRight: '2rem'}}><h4>Titulo:</h4></td>
                                <td>
                                    <span className="p-float-label p-input-icon-left">
                                        <i className="pi pi-info-circle" />
                                        <InputText id="titulo" value={titulo} onChange={(e) => {setTitulo(e.target.value);}} style={{ width: '400px'}}/>
                                        <label htmlFor="titulo">Titulo de la convocatoria</label>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td style={{padding: '1rem', paddingRight: '2rem'}}><h4>Fecha de expiración:</h4></td>
                                <td>
                                    <div className="field col-12 md:col-4">
                                        <Calendar id="icon" value={calendario} onChange={(e) => setCalendario(e.value)} showIcon locale="es" dateFormat="yy/mm/dd" />
                                    </div>
                                </td>
                            </tr>                            
                        </tbody>
                    </table>                    
                </center>
                <center>
                    <table>
                        <tbody>
                            <tr>                                 
                                <td style={{padding: '1rem', paddingRight: '2rem', paddingLeft: '5rem'}}>                                    
                                    <div className="field-radiobutton">
                                        <RadioButton inputId="docName" name="opcion" value="documento" onChange={(e) => {setOpcion(e.value); setDocVer(false); setEnVer(true);}} checked={opcion === 'documento'} />
                                            <label htmlFor="docName"> Documento</label>
                                    </div>
                                    <br></br>  
                                    <br></br>
                                    <VerBoton v={docVer}/>                      
                                </td>                            
                                <td style={{padding: '1rem', paddingRight: '2rem'}}>                                   
                                    <div className="field-radiobutton">
                                        <RadioButton inputId="opcion2" name="opcion" value="enlace" onChange={(e) => {setOpcion(e.value); setDocVer(true); setEnVer(false);}} checked={opcion === 'enlace'} />
                                            <label htmlFor="opcion2">Link Convocatoria</label>
                                    </div>
                                    <br></br>
                                    <br></br>
                                    <VerEnlace v={enVer}/>                                                                                                                
                                </td>                                                                 
                            </tr>
                            <tr>
                                <td colSpan={'2'}> 
                                    { (informacion === null) ? <img src="/pdfs/pdfDefault.png" height='0' width='0' /> :  <iframe src={  informacion } height='200' width='600'/> }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </center>
            </Dialog>

            <Dialog header={encabezado} visible={Idialog} style={{ width: '30vw' }}  footer={footer('Idialog')} onHide={() => onHide('Idialog')}>
                <DataTable value={valueInt} scrollable scrollHeight="200px">
                    <Column field="secuencia" header="#"></Column>
                    <Column field="conv_nombre_user" header="Docentes Interesado"></Column>
                </DataTable>
            </Dialog>

        </div>
    )
}

export default ConvocatoriasInv;
