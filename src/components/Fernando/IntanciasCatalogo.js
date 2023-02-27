import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import swal from 'sweetalert';
import { DatosCursoService } from '../../services/Fernando/DatosCursoService';
import '././estilos/box.css'
const IntanciasCatalogo = (props) => {


    const [z, setZ] = useState({
        cupo:0,
        usuario: "",
        curso: "",
        tipo: "",
        cupo: 0,
        horas: 0,
        temario: null
    });
    const ServCurso = new DatosCursoService();
    useEffect(() => { 
        ServCurso.search(props.idCurso).then(data => { 
            setZ(data)
        });

    }, []);

    const [instancia, setInstancia] = useState({
        id_Instancia:null,
	    id_Curso:props.idCurso,
        inst_Empresa:"",
	    inst_Asistentes:"",
	    inst_Periodo:""
    });
    /* DIALOG */
    const [displayBasic, setDisplayBasic] = useState(false);
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [value3, setValue3] = useState('');    
    const [cupo, setCupo] = useState('');
    const [docente, setDocente] = useState('');
    const [curso,setCurso] = useState('');
    const [horas, SetHoras] = useState(props.horas);
    const [tipo, setTipo] = useState(props.tipo);
    const [pdf, setPdf] = useState(props.pdf);
    const [idCambio, setIdCambio] = useState(null);
    const meses=[{
        name:"",code:null
    }];
    
    const regresames =(nummes) =>{        
        let per="";                
        
        for (var i = 0; i < props.periodo.length; i++) {             
            per="";           
            switch(props.periodo[i].per_Mes_Inicio){
                case 1:{
                    per+="Enero";
                    break;
                }
                case 2:{
                    per+="Febrero";
                    break;
                }
                case 3:{
                    per+="Marzo";
                    break;
                }
                case 4:{
                    per+="Abril";
                    break;
                }
                case 5:{
                    per+="Mayo";
                    break;
                }
                case 6:{
                    per+="Junio";
                    break;
                }
                case 7:{
                    per+="Julio";
                    break;
                }
                case 8:{
                    per+="Agosto";
                    break;
                }
                case 9:{
                    per+="Septiembre";
                    break;
                }
                case 10:{
                    per+="Octubre";
                    break;
                }
                case 11:{
                    per+="Noviembre";
                    break;
                }
                case 12:{
                    per+="Diciembre";
                    break;
                }
                default:{
                    per+="Error";
                    break;
                }
            }
            switch(props.periodo[i].per_Mes_Fin){
                case 1:{
                    per+="-Enero";
                    break;
                }
                case 2:{
                    per+="-Febrero";
                    break;
                }
                case 3:{
                    per+="-Marzo";
                    break;
                }
                case 4:{
                    per+="-Abril";
                    break;
                }
                case 5:{
                    per+="-Mayo";
                    break;
                }
                case 6:{
                    per+="-Junio";
                    break;
                }
                case 7:{
                    per+="-Julio";
                    break;
                }
                case 8:{
                    per+="-Agosto";
                    break;
                }
                case 9:{
                    per+="-Septiembre";
                    break;
                }
                case 10:{
                    per+="-Octubre";
                    break;
                }
                case 11:{
                    per+="-Noviembre";
                    break;
                }
                case 12:{
                    per+="-Diciembre";
                    break;
                }
                default:{
                    per+="-Error";
                    break;
                }
            }    
            per+=" "+props.periodo[i].per_Year;
            nummes=props.periodo[i].id_Periodo;            
            meses.push({name:""+per,code:nummes});
        } 
        meses.shift(); 
        return meses;
        
                
    }
    const buscar=(variable)=>{
        for(var i=0; i<meses.length; i++){                        
            if(variable == meses[i].name){                                
                return (meses[i].code);
            }
        }
    }
    const header = "Instancia del "+ z.curso;
    const [position, setPosition] = useState('center');
    const dialogFuncMap = {
        'displayBasic': setDisplayBasic
    }
    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);  
        setValue2('');
        instancia.id_Instancia=null;
        instancia.inst_Empresa=null;
	    instancia.inst_Asistentes=null;
	    instancia.inst_Periodo=null;
        setValue3("");
        setValue1(""); 
        setIdCambio(null);
    }
    const borrar = ()=>{        
        setValue2('');
        instancia.id_Instancia=null;
        instancia.inst_Empresa=null;
	    instancia.inst_Asistentes=null;
	    instancia.inst_Periodo=null;
        setValue3("");
        setValue1(""); 
        setIdCambio(null);
    }
    const renderFooter = (name) => {
        instancia.id_Instancia = idCambio;
        instancia.inst_Empresa = value1;               
        instancia.inst_Periodo = value2.name;
        instancia.inst_Asistentes = value3;    
        return (
            <div>                
                <Button label="Guardar" icon="pi pi-pencil" className="p-button-success" 
                onClick={() => {                     
                    if(instancia.inst_Empresa == "" || instancia.inst_Empresa == null){  
                        swal({
                            title:"¡Atencion!",
                            text:"Es necesario llenar todos los campos",
                            icon:"warning",
                            button:"Aceptar",
                            timer:"3000"
                          });                      
                    }else{
                        if(instancia.inst_Periodo == "" || instancia.inst_Periodo == null){
                            swal({
                                title:"¡Atencion!",
                                text:"Es necesario llenar todos los campos",
                                icon:"warning",
                                button:"Aceptar",
                                timer:"3000"
                              }); 
                        }else{
                            if(instancia.inst_Asistentes == 0){
                                swal({
                                    title:"¡Atencion!",
                                    text:"Los asitentes no pueden ser cero",
                                    icon:"warning",
                                    button:"Aceptar",
                                    timer:"3000"
                                  });
                            }else{
                                props.crear(instancia);
                            }
                        }
                    }
                    console.log(instancia.id_Instancia);
                    onHide(name); borrar()
                    }}/>
            </div>
        );
    }
    const renderModificar=(rowData)=>{        
        return(
            <Button  
            icon="pi pi-pencil" 
            className="p-button-info p-button-rounded"             
            onClick={() => {               
                setIdCambio(rowData.id_Instancia);
                setValue1(rowData.inst_Empresa);
                setValue3(rowData.inst_Asistentes);
                var x = buscar(rowData.inst_Periodo);
                setValue2({name:rowData.inst_Periodo,code:x});
                setDisplayBasic(true);                
            }}
            />
                
        )
    }
    const renderTemario=(rowData)=>{        
        return(
            <a href={rowData.inst_Temario} target="_blank" style={{textDecorationLine : "none"}}>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" />   
            </a>
                
        )
    }

    const datos=(rowData)=>{      
        return(
            rowData.id_Instancia
        )
    }
    /* DIALOG */
    return (
        <div className='card'>
            <Panel>
                <table>                    
                    <tbody>
                        <tr>                            
                            <td style={{paddingRight: '35rem'}}></td>
                            <td style={{paddingRight: '20rem'}}>
                                <div className="textoA">Gestion {z.curso}</div>                
                            </td>                                                        
                        </tr>
                    </tbody>                        
                </table> 
                <div>
                     <table className='box'>
                         <tbody>
                            <tr>                            
                                <td colSpan={'6'}>
                                    <div className="textoA">Datos Generales</div>
                                </td>
                            </tr>
                            <tr>
                                <td><h5>Nombre del Servicio:</h5></td>
                                <td style={{padding: '0rem'}}>
                                    <span className="p-float-label p-input-icon-left">                                                                                              
                                        <InputText id="nombre_curso" value={z.curso} className="p-link"/> 
                                    </span>                                                
                                </td>
                                <td><h5>Docente que lo imparte:</h5></td>
                                <td style={{padding: '0rem'}}>
                                    <span className="p-float-label p-input-icon-left">                                 
                                        <InputText id="nombre_curso" value={z.usuario} className="p-link" />  
                                    </span>                                                
                                </td>
                                <td><h5>Cupo:</h5></td>
                                <td style={{padding: '0rem'}}>
                                    <span className="p-float-label p-input-icon-left">                                    
                                        <InputText id="nombre_curso" value={z.cupo} className="p-link"/> 
                                    </span>                                                
                                </td>
                            </tr>
                            <tr>
                                <td><h5>Horas:</h5></td>
                                <td style={{padding: '0rem'}}>
                                    <span className="p-float-label p-input-icon-left">                                 
                                        <InputText id="nombre_curso" value={z.horas} className="p-link"/>  
                                    </span>                                                
                                </td>
                                <td><h5>Tipo:</h5></td>
                                <td style={{padding: '0rem'}}>
                                    <span className="p-float-label p-input-icon-left">                                        
                                        <InputText id="nombre_curso" value={z.tipo} className="p-link"/> 
                                    </span>                                                
                                </td>
                                <td></td>
                                <td style={{padding: '0rem'}}>
                                    <Button                                                                                                             
                                        label="Nueva Instancia" 
                                        className="p-button-success"
                                        icon="pi pi-book"                                     
                                        onClick={() => {  
                                        borrar()                                                          
                                        setDisplayBasic(true);
                                        }}                                    
                                    />                                    
                                </td> 
                            </tr>
                         </tbody>
                     </table>
                    <br></br> 
                    <br></br> 
                </div>        
                <DataTable value={props.value} responsiveLayout="scroll" >
                    <Column field="id_Instancia" header="#" body={datos}></Column>                  
                    <Column field="inst_Empresa" header="Empresa a impartir"></Column>
                    <Column field="inst_Asistentes" header="No. Asistentes"></Column>
                    <Column field="inst_Periodo" header="Periodo en que fue impartido"></Column>                    
                    <Column field={renderTemario} header="Detalles"></Column>
                    <Column field={renderModificar} header="Editar"></Column>
                </DataTable>
            </Panel>

            <Dialog header={header} visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter('displayBasic')} 
            onHide={() => onHide('displayBasic')}>
                   <center>
                        <table>
                                <tbody>
                                    <tr>
                                        <td><h5>Empresa a impartir:</h5></td>
                                        <td style={{padding: '1rem'}}>
                                            <span className="p-float-label p-input-icon-left">  
                                            <i className="pi pi-sitemap" />                                                     
                                            <InputText id="nombre_curso" value={value1} onChange={(e) => setValue1(e.target.value)} maxLength="255"/>                                                        
                                            <label htmlFor="nombre_curso">Empresa a impartir</label>
                                            </span>                                                
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><h5>Periodo a impartir:</h5></td>                                
                                        <td style={{padding: '1rem'}}>                                                                             
                                            <Dropdown value={value2} options={regresames(1)} 
                                            onChange={(e) => {setValue2(e.target.value)}} optionLabel="name"
                                            placeholder="Selecciona un Periodo" style={{width:"15em"}}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><h5>Numero de Asistentes:</h5></td>                                
                                        <td style={{padding: '1rem'}}>
                                            <div className="p-field p-col-12 p-md-3">                                            
                                            <label htmlFor="asistentes"></label>
                                            <InputNumber inputId="asistentes" value={value3} onValueChange={(e) => setValue3(e.value)} mode="decimal" showButtons min={0} max={500} />
                                            </div>                                                
                                        </td>
                                    </tr>
                                    <tr><td><h5>Detalles:</h5></td></tr>
                                    <tr>                                                                       
                                        <td colSpan={'2'}> 
                                            { (z.temario === null) ? <img src="/pdfs/pdfDefault.png" height='360px' width='400px' /> :  <iframe src={  z.temario } height='360px' width='400px'/> }
                                        </td>
                                    </tr>
                                </tbody>       
                        </table>
                   </center>
            </Dialog>
        </div>
    )
}

export default IntanciasCatalogo
