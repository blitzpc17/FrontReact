import React, { useState, useEffect, useRef  } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Tooltip } from 'primereact/tooltip';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import swal from 'sweetalert';
import { useParams } from 'react-router-dom';
import { ServiceInnovacion } from '../../services/Fernando/ServiceInnovacion';
import { DepartamentoServicio } from '../../services/Fernando/DepartamentoServicio';
import { DateInnovacion } from '../../services/Fernando/DateInnovacion';

const Innovacion =()=>{

    useEffect(() => {
        ArrayDatos.getAll().then(data => setDatos(data));        
        deps.getAll().then(data => setDepartamentos(data));

    }, []); 

    const [datos, setDatos] = useState([]);
    const [selectedDatos, setSelectedDatos] = useState([]);
    const ArrayDatos = new ServiceInnovacion();
    const ArrayDatos2 = new DateInnovacion();
    const [departamentos, setDepartamentos] = useState([]);
    const deps = new DepartamentoServicio();

    const {depName, idDep} = new useParams();
    //const [idDep, setIdDep ] = useState(3);
    //const [depName, setDepName ] = useState(['Electronica']);

    const [objeto, setObjeto] = useState({
        id_innovacion: null,
        id_departamento: idDep,
        inn_etapa : null,
        inn_año : null,
        inn_numero : null,
        inn_folio : null,
        inn_proyecto : null,
        inn_categoria : null,
        inn_semestre : null,
        inn_autor : null,
        inn_no_control : null,
        inn_asesor : null,
        inn_tipo_asesor : null,
        inn_departamento : null,
        inn_nombre_departamento : null
    });

    

    /* Datos del Dialog */
    const [fecha, setFecha] = useState(null);
    const [semestre, setSemestre] = useState(null);
    const [estudiante, setEstudiante] = useState(null);
    const [numero, setNumero] = useState(null);
    const [control, setControl] = useState(null);
    const [folio, setFolio] = useState(null);
    const [asesor, setAsesor] = useState(null);
    const [proyecto, setProyecto] = useState(null);
    const [categoria, setCategoria] = useState(null);
    const [selectEtapa, setSelectEtapa] = useState(null);
    const [selectCarrera, setSelectCarrera] = useState(null);
    const [selectTipoAsesor, setSelectTipoAsesor] = useState(null);
    const [selectYear, setSelectYear] = useState(null);
    const [displayBasic, setDisplayBasic] = useState(false);
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
        objeto.id_innovacion = null;
        setFecha(null);
        setSemestre(null);
        setEstudiante(null);
        setNumero(null);
        setControl(null);
        setFolio(null);
        setAsesor(null);
        setProyecto(null);
        setCategoria(null);
        setSelectEtapa(null);
        setSelectCarrera(null);
        setSelectTipoAsesor(null);

    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Guardar" onClick={() =>{
                    if(selectEtapa == null){
                        swal({
                            title: "¡Atención!",
                            text: "¡Selecione una Etapa!",
                            icon: "warning",
                            button: "Aceptar",
                            timer: "3000"
                        });
                    }else{
                        if(selectTipoAsesor == null){
                            swal({
                                title: "¡Atención!",
                                text: "¡Selecione un Tipo de Asesor!",
                                icon: "warning",
                                button: "Aceptar",
                                timer: "3000"
                            });
                        }else{
                            if(selectCarrera == null){
                                swal({
                                    title: "¡Atención!",
                                    text: "¡Selecione un Departamento!",
                                    icon: "warning",
                                    button: "Aceptar",
                                    timer: "3000"
                                });
                            }else{
                                objeto.inn_etapa = selectEtapa.name;
                                objeto.inn_año = fecha;
                                objeto.inn_numero = numero;
                                objeto.inn_folio = folio;
                                objeto.inn_proyecto = proyecto;
                                objeto.inn_categoria = categoria;
                                objeto.inn_semestre = semestre;
                                objeto.inn_autor = estudiante;
                                objeto.inn_no_control = control;
                                objeto.inn_asesor = asesor;
                                objeto.inn_tipo_asesor = selectTipoAsesor.name;
                                objeto.inn_departamento = selectCarrera.code;
                                objeto.inn_nombre_departamento = selectCarrera.name;
                                guardar(objeto);
                            }
                        }                        
                    }
                    onHide(name)
                    }}  />
            </div>
        );
    }

    const etapas = [
        { name: 'Local', code: 'LOC' },
        { name: 'Regional', code: 'REG' },
        { name: 'Nacional', code: 'NAC' }
       
    ];
    const meses=[{
        name:"",code:null
    }];
    
    const carreras = ()=>{        
        for (var i = 0; i < departamentos.length; i++) { 
            meses.push({name:departamentos[i].dep_nombre,code:departamentos[i].id_Departamento});
        } 
        meses.shift(); 
        return meses;
    };
    const tipoAsesor= [
        { name: 'Interno', code: 'INT' },
        { name: 'Externo', code: 'EXT' },
       
    ];

    const years= [
        { name: 'Todos los años', code: '100' },
        { name: '2020', code: '0' },
        { name: '2021', code: '1' },
        { name: '2022', code: '2' },
        { name: '2023', code: '3' },
        { name: '2024', code: '4' },
        { name: '2025', code: '5' },
        { name: '2026', code: '6' },
        { name: '2027', code: '7' },
        { name: '2028', code: '8' },
        { name: '2029', code: '9' },
        { name: '2030', code: '10' },
        { name: '2031', code: '11' },
        { name: '2032', code: '12' },
        { name: '2033', code: '13' },
        { name: '2034', code: '14' },
        { name: '2035', code: '15' },
        { name: '2036', code: '16' },
        { name: '2037', code: '17' },
        { name: '2038', code: '18' },
        { name: '2039', code: '19' },
        { name: '2040', code: '20' },
        { name: '2041', code: '21' },
        { name: '2042', code: '22' },
        { name: '2043', code: '23' },
        { name: '2044', code: '24' },
       
    ];

    const onCityYear = (e) => {
        setSelectYear(e.value);
        
        if(e.value.name == "Todos los años"){
            ArrayDatos.getAll().then(data => setDatos(data));
        }else{
            ArrayDatos2.search(e.value.name).then(data => setDatos(data));
        }
        

    }

    const onChangeEtapa=(e)=>{
       setSelectEtapa(e.value);
    }
    const onChangeCarrera=(e)=>{
        setSelectCarrera(e.value);
    }
    const onChangeAsesor=(e)=>{
        setSelectTipoAsesor(e.value);
    }
    /* Datos del Dialog */
 


    /* Datos de la tabla exportable */
    const dt = useRef(null);
    
    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    }


    const onSelectionChange = (e) => {
        setSelectedDatos(e.value);
    }

    const cols = [
        { field: 'inn_etapa', header: 'Etapa' },
        { field: 'inn_año', header: 'Año' },
        { field: 'inn_numero', header: 'No.' },
        { field: 'inn_folio', header: 'Folio' },
        { field: 'inn_proyecto', header: 'Proyecto' },
        { field: 'inn_categoria', header: 'Categoria' },
        { field: 'inn_semestre', header: 'Semestre' },
        { field: 'inn_autor', header: 'Autor' },
        { field: 'inn_no_control', header: 'No. Control' },
        { field: 'inn_asesor', header: 'Asesor' },
        { field: 'inn_nombre_departamento', header: 'Carrera del asesor' },
        { field: 'inn_tipo_asesor', header: 'Tipo de Asesor' }
    ];

    const editar=(rowData)=>{
        return(
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" 
                onClick={()=>{
                    objeto.id_innovacion = rowData.id_innovacion;
                    setFecha(rowData.inn_año);
                    setSemestre(rowData.inn_semestre);
                    setEstudiante(rowData.inn_autor);
                    setNumero(rowData.inn_numero);
                    setControl(rowData.inn_no_control);
                    setFolio(rowData.inn_folio);
                    setAsesor(rowData.inn_asesor);
                    setProyecto(rowData.inn_proyecto);
                    setCategoria(rowData.inn_categoria);

                    if(rowData.inn_etapa == 'Local'){
                        setSelectEtapa({ name: 'Local', code: 'LOC' });
                    }else{
                        if(rowData.inn_etapa == 'Regional'){
                            setSelectEtapa({ name: 'Regional', code: 'REG' });
                        }else{
                            if(rowData.inn_etapa == 'Nacional'){
                                setSelectEtapa({ name: 'Nacional', code: 'NAC' });
                            }
                        }
                    }
                    
                    setSelectCarrera({ name: rowData.inn_nombre_departamento, code: rowData.inn_departamento });                    
        
                    if(rowData.inn_tipo_asesor == 'Interno'){
                        setSelectTipoAsesor({ name: 'Interno', code: 'INT' });
                    }else{
                        if(rowData.inn_tipo_asesor == 'Externo'){
                            setSelectTipoAsesor({ name: 'Externo', code: 'EXT' });
                        }
                    }
                    setDisplayBasic(true);
                }}
            />
        )
    }
    const eliminar=(rowData)=>{
        return(
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={()=>{deleterow(rowData.id_innovacion)}} />
        )
    }

    const header  = (
        <div className="p-d-flex p-ai-center export-buttons">
            <div>Seleccione año:</div>
            <Dropdown value={selectYear} options={years} onChange={onCityYear} optionLabel="name" style={{ width: '200px'}} placeholder="Seleccione un año" />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button label="Crear Registro" icon="pi pi-book" className="p-button-raised p-button-info" 
                onClick={() => {setDisplayBasic(true);}}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;           
            <Button type="button" label="EXPORTAR A EXCEL" icon="pi pi-file-excel" onClick={() => exportCSV(false)} className="p-button-success p-mr-2" data-pr-tooltip="CSV" />             
        </div>
    );

    /* Datos de la tabla exportable */

    const guardar=(data)=>{  
        ArrayDatos.save(data).then(data => {  
            ArrayDatos.getAll().then(data => setDatos(data));
        });
        swal({
            title: "¡Atención!",
            text: "¡Registro Guardado!",
            icon: "success",
            button: "Aceptar",
            timer: "3000"
        });  
    }
    const deleterow=(data)=>{  
        ArrayDatos.delete(data).then(data => {  
            ArrayDatos.getAll().then(data => setDatos(data));
        });
        swal({
            title: "¡Atención!",
            text: "¡Registro Borrado!",
            icon: "success",
            button: "Aceptar",
            timer: "3000"
        });  
    }
   

    return(        
        <div>
            <table border="0">
                <tbody>
                    <tr>
                        <td style={{paddingRight: '35rem'}}></td>
                        <td style={{paddingRight: '25rem'}}>
                            <h1>Proyectos de Innovación</h1>               
                            <h2>Departamento de {depName}</h2>
                        </td>                            
                    </tr>
                </tbody>
            </table>
            <br/>
            <div className="card">
                <Panel>                
                    <Tooltip target=".export-buttons>button" position="bottom" />

                    <DataTable ref={dt} value={datos} header={header} dataKey="id" responsiveLayout="scroll" showGridlines
                        selectionMode="multiple" selection={selectedDatos} >
                        {
                            cols.map((col, index) => <Column key={index} field={col.field} header={col.header} />)
                        }
                        <Column  header="Editar" body={editar}></Column>
                        <Column  header="Eliminar" body={eliminar}></Column>
                    </DataTable>
                
                </Panel>
            </div>



            <Dialog header="Header" visible={displayBasic} style={{ width: '70vw' }} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
                <table border='0'>
                    <tbody>
                        <tr>
                            <td style={{paddingBottom:'10px'}}>
                                <label> Etapa :</label>
                            </td>
                            <td style={{paddingBottom:'10px'}}>
                            <Dropdown value={selectEtapa} options={etapas} onChange={onChangeEtapa} optionLabel="name" placeholder="Seleccione una Etapa" />
                            </td>
                            <td style={{paddingLeft:'80px'}}>
                                <label>Semestre :</label>
                            </td>
                            <td>
                            <span className="p-input-icon-left">
                                        <i className="pi pi-sort-numeric-up" />
                                        <InputText value={semestre} onChange={(e) => setSemestre(e.target.value)} placeholder="Ejemplo: 1" style={{ width: '100px'}} maxLength="4"/>
                                        </span>
                            
                            </td>
                        </tr>
                        
                        <tr>
                            <td style={{paddingBottom:'10px'}}>
                                <label> Fecha :</label>
                            </td>
                            <td style={{paddingBottom:'10px'}}>
                            
                            <span className="p-input-icon-left">
                                        <i className="pi pi-calendar" />
                                        <InputText value={fecha} onChange={(e) => setFecha(e.target.value)} placeholder="2022" style={{ width: '100px'}} maxLength="4"/>
                                        </span>
                            </td>
                            <td style={{paddingLeft:'80px'}}>Autor :</td>
                            <td> <span className="p-input-icon-left">
                                        <i className="pi pi-user" />
                                        <InputText value={estudiante} onChange={(e) => setEstudiante(e.target.value)} placeholder="Nombre del Autor" style={{ width: '400px'}} maxLength="500"/>
                                        </span>
                                        </td>
                        </tr>
                        
                            <tr >
                                <td style={{paddingBottom:'10px'}}>
                                <label> Número :</label>

                            </td>
                            <td style={{paddingBottom:'10px'}}>
                            <span className="p-input-icon-left">
                                        <i className="pi pi-hashtag" />
                                        <InputText value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Ejemplo: 1" style={{ width: '150px'}} maxLength="4"/>
                                        </span>
                            </td>
                            <td style={{paddingLeft:'80px'}}>Numero de Control :</td>
                            <td> <span className="p-input-icon-left">
                                        <i className="pi pi-id-card" />
                                        <InputText value={control} onChange={(e) => setControl(e.target.value)} placeholder="99999999" style={{ width: '150px'}} maxLength="8"/>
                                        </span>
                                        </td>
                            </tr>
                            <tr>
                            <td style={{paddingBottom:'10px'}}>
                                <label> Folio : </label>
                            </td>
                            <td style={{paddingBottom:'10px'}}>
                            <span className="p-input-icon-left">
                                        <i className="pi pi-folder" />
                                        <InputText value={folio} onChange={(e) => setFolio(e.target.value)} placeholder="Ingrese el folio" style={{ width: '300px'}} maxLength="255"/>
                                        </span>
                            </td>  
                            <td style={{paddingLeft:'80px'}}>Asesor :</td>
                            <td> <span className="p-input-icon-left">
                                        <i className="pi pi-user" />
                                        <InputText value={asesor} onChange={(e) => setAsesor(e.target.value)} placeholder="Nombre del Asesor" style={{ width: '400px'}} maxLength="500"/>
                                        </span></td>
                            </tr>
                            <tr>
                                <td style={{paddingBottom:'10px'}}>
                                <label> Proyecto :</label>
                            </td>
                            <td style={{paddingBottom:'10px'}}>
                                <InputTextarea value={proyecto} onChange={(e) => setProyecto(e.target.value)} rows={5} cols={35}  maxLength="500"/>
                            </td>
                            <td style={{paddingLeft:'80px'}}>
                                <label>Departamento :</label>
                            </td>
                            <td>
                            <Dropdown value={selectCarrera} options={carreras()} onChange={onChangeCarrera} optionLabel="name" placeholder="Seleccione Carrera" style={{ width: '400px'}}/>

                            </td>
                            </tr>
                        <tr>
                            <td>
                                <label> Categoria :</label>
                            </td>
                            <td>
                            <span className="p-input-icon-left">
                                        <i className="pi pi-list" />
                                        <InputText value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Escriba la categoria" style={{ width: '300px'}} maxLength="255"/>
                                        </span>
                            </td>
                            <td style={{paddingLeft:'80px'}}>
                            <label>Tipo de Asesor :</label>
                            </td>
                            <td>
                            <Dropdown value={selectTipoAsesor} options={tipoAsesor} onChange={onChangeAsesor} optionLabel="name" placeholder="Seleccione Tipo de Asesor" style={{ width: '150px'}}/>

                            </td>

                        </tr>                                    
                    </tbody>
                </table>
            </Dialog>
            
        </div>
    )

}

export default Innovacion;
