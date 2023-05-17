import React, { useEffect, useState, useContext } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import BreadCrumbContext from '../../context/BreadCrumbContext';

import { ServicioRecursoAsignado } from '../../services/Ramon/ServicioRecursoAsignado';
import { ServicioRecursoProgramado } from '../../services/Ramon/ServicioRecursoProgramado';
import { ServicioRecursoEjercido } from '../../services/Ramon/ServicioRecursoEjercido';
import swal from 'sweetalert';

const cookies = new Cookies();



const PeriodosFinanciero = () => {
    const navigate = new useNavigate();

    const [periodos, setPeriodos] = useState([]);
    const [idRe, setIdRe] = useState(null);
    const [idRa, setIdRa] = useState(null);
    const [idRp, setIdRp] = useState(null);
    const [visible, setVisible] = useState(false);
    const [btntitle, setBtnTitle] = useState(null); //cambiar cuando ya traiga la info d elos existentes
    const [titleModal, setTitleModal] = useState(null);
    const [showAsignado, setShowAsignado] = useState("none");
    const [showProgramado, setShowProgramado] = useState("none");
    const [showEjercido, setShowEjercido] = useState("none");    

    const[campoOrigenArchivo, setCampoOrigenArchivo] = useState(null);

    //genrales del modal
    const [periodoId, setPeriodoId] = useState(null);
    const [selectDepartamentos, setSelectDepartamentos] = useState(null);
    const [op, setOp] = useState(null);
    const [estadoPeriodoSeleccionado, setEstadoPeriodoSelecionado] = useState(null);

    //asignado
    const [poa, setPoa] = useState(null);
    const [poaEvidencia, setPoaEvidencia] = useState(null);
    const [poaEvidenciaFile, setPoaEvidenciaFile] = useState(null);
    const [pta, setPta] = useState(null);
    const [ptaEvidencia, setPtaEvidencia] = useState(null);
    const [ptaEvidenciaFile, setPtaEvidenciaFile] = useState(null);
    const [matricula, setMatricula] = useState(null);
    const [matriculaEvidencia, setMatriculaEvidencia] = useState(null);
    const [matriculaEvidenciaFile, setMatriculaEvidenciaFile] = useState(null);
    const [pagoInscripcion, setPagoInscripcion] = useState(null);
    const [montoCaptado, setMontoCaptado] = useState(null);
    const [montoCaptadoTotal, setMontoCaptadoTotal] = useState(null);
    

    //programado
    const[capDos, setCapDos] = useState(null);
    const[capDosP, setCapDosP] = useState(null);
    const[capDosE, setCapDosE] = useState(null);
    const[capTres,  setCapTres] = useState(null);
    const[capTresP, setCapTresP] = useState(null);
    const[capTresE, setCapTresE] = useState(null);
    const[capCuatro,  setCapCuatro] = useState(null);
    const[capCuatroP, setCapCuatroP] = useState(null);
    const[capCuatroE, setCapCuatroE] = useState(null);
    const[capCinco,  setCapCinco] = useState(null);
    const[capCincoP, setCapCincoP] = useState(null);
    const[capCincoE, setCapCincoE] = useState(null);
    const[capOtros,  setCapOtros] = useState(null);
    const[capOtrosP, setCapOtrosP] = useState(null);
    const[capOtrosE, setCapOtrosE] = useState(null);
    const[capTotal,  setCapTotal] = useState(null);
    const[capTotalP, setCapTotalP] = useState(null);
    const[capTotalE, setCapTotalE] = useState(null);


   
  


    //ejercido
    const[capEDos,  setECapDos] = useState(null);
    const[capEDosP, setECapDosP] = useState(null);
    const[capEDosE, setECapDosE] = useState(null);
    const[capETres,  setECapTres] = useState(null);
    const[capETresP, setECapTresP] = useState(null);
    const[capETresE, setECapTresE] = useState(null);
    const[capECuatro,  setECapCuatro] = useState(null);
    const[capECuatroP, setECapCuatroP] = useState(null);
    const[capECuatroE, setECapCuatroE] = useState(null);
    const[capECinco,  setECapCinco] = useState(null);
    const[capECincoP, setECapCincoP] = useState(null);
    const[capECincoE, setECapCincoE] = useState(null);
    const[capEOtros,  setECapOtros] = useState(null);
    const[capEOtrosP, setECapOtrosP] = useState(null);
    const[capEOtrosE, setECapOtrosE] = useState(null);
    const[capETotal,  setECapTotal] = useState(null);
    const[capETotalP, setECapTotalP] = useState(null);
    const[capETotalE, setECapTotalE] = useState(null);
    const[capNoEjercido,  setNoEjercido] = useState(null);
    const[capNoEjercidoP, setNoEjercidoP] = useState(null);
    const[capNoEjercidoE, setNoEjercidoE] = useState(null);

    //end recurso variables

    var servicioAsignado = new ServicioRecursoAsignado();
    var servicioRecursoEjercido = new ServicioRecursoEjercido();
    var servicioRecursoProgramado = new ServicioRecursoProgramado();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const opcDeptosElectronica = [
        { name: 'ELECTRONICA', code:'3'},
        { name: 'BIOMEDICA', code:'12'}
    ];

    const cambiarBreadLocal = (lblActual, donde) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/menudepartamental' });

        cambiarBread(direccionesTemp, lblActual);

        navigate('/plataforma/' + donde);
    }

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Recursos Financieros'){
                datosPeriodo();
               // setDepartamentoId(cookies.get('id_Departamento'))
            }
            else
                navigate('/plataforma/menudepartamental');
        }
      
    }, []);

    const datosPeriodo = async () => {
        await axios.get("http://localhost:8080/api/v1/periodos/all").then(res => {setPeriodos(res.data); console.log(res.data)});        
    }

    const redRecursoAsignado = (rowData) => {

        return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-primary" onClick={() => {
                    setTitleModal("Recurso Asignado"); setVisible(true); setShowAsignado("block"); setShowEjercido("none"); setShowProgramado("none");
                    setPeriodoId(rowData.id_Periodo); setOp('A'); setEstadoPeriodoSelecionado(rowData.per_Estado); limpiarFormularios();
            }}/>;
    }


    const redRecursoProgramado = (rowData) => {        
       
        return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-secondary" onClick={() => {
                setTitleModal("Recurso Programado"); setVisible(true); setShowAsignado("none"); setShowEjercido("none"); setShowProgramado("block");
                setPeriodoId(rowData.id_Periodo); setOp('P');  setEstadoPeriodoSelecionado(rowData.per_Estado);
        }}/>;
    }

    const redRecursoEjercido = (rowData) => {
        return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-help" onClick={() => {
                setTitleModal("Recurso Ejercido"); setVisible(true); setShowAsignado("none"); setShowEjercido("block"); setShowProgramado("none");
                setPeriodoId(rowData.id_Periodo); setOp('E'); setEstadoPeriodoSelecionado(rowData.per_Estado);
        }}/>;
    }

    const concat =(rowData) =>{
        const mesInicio = dataMeses[rowData.per_Mes_Inicio - 1];
        const mesFin = dataMeses[rowData.per_Mes_Fin - 1];
        let per = mesInicio.abrev + ' - ' + mesFin.abrev;
        return(per);
    }   

    const dataMeses = [
        {
            "id":1,
            "mes":"ENERO",
            "abrev":"ENE"
        },
        {
            "id":2,
            "mes":"FEBRERO",
            "abrev":"FEB"
        },
        {
            "id":3,
            "mes":"MARZO",
            "abrev":"MAR"
        },
        {
            "id":4,
            "mes":"ABRIL",
            "abrev":"ABR"
        },
        {
            "id":5,
            "mes":"MAYO",
            "abrev":"MAY"
        },
        {
            "id":6,
            "mes":"JUN",
            "abrev":"JUNIO"
        },
        {
            "id":7,
            "mes":"JUL",
            "abrev":"JULIO"
        },
        {
            "id":8,
            "mes":"AGOSTO",
            "abrev":"AGO"
        },
        {
            "id":9,
            "mes":"SEPTIEMBRE",
            "abrev":"SEP"
        },
        {
            "id":10,
            "mes":"OCTUBRE",
            "abrev":"OCT"
        },
        {
            "id":11,
            "mes":"NOVIEMBRE",
            "abrev":"NOV"
        },
        {
            "id":12,
            "mes":"DICIEMBRE",
            "abrev":"DIC"
        }

    ]

    const save = (obj) => {
        if(op === 'A'){
            servicioAsignado.save(obj).then((data) => {
                console.log(data)
              if(data.status==200){
                swal({
                    icon:"success",
                    title:"Aviso",
                    text:"Registro guardado correctamente",
                    }).then(()=>{
                        setVisible(false);
                    });
              }else{
                swal({
                    icon:"warning",
                    title:"Advertencia",
                    text:data.message,
                    }).then(()=>{
                        setVisible(false);
                    });
              }
                
            });
        }else if(op === 'P'){
            servicioRecursoProgramado.save(obj).then((data) => {
                console.log(data)
                if(data.status==200){
                    swal({
                        icon:"success",
                        title:"Aviso",
                        text:"Registro guardado correctamente",
                        }).then(()=>{
                            setVisible(false);
                        });
                  }else{
                    swal({
                        icon:"warning",
                        title:"Advertencia",
                        text:data.message,
                        }).then(()=>{
                            setVisible(false);
                        });
                  }
            });
        }else if(op == 'E'){
            servicioRecursoEjercido.save(obj).then((data) => {
                console.log(data)
                if(data.status==200){
                    swal({
                        icon:"success",
                        title:"Aviso",
                        text:"Registro guardado correctamente",
                        }).then(()=>{
                            setVisible(false);
                        });
                  }else{
                    swal({
                        icon:"warning",
                        title:"Advertencia",
                        text:data.message,
                        }).then(()=>{
                            setVisible(false);
                        });
                  }
            });
        }else{
            //tirar modal de operacipon no valida
            swal({
                title: "¡Advertencia!",
                text: "¡Operación no válida!",
                icon: "warning",
                button: "Aceptar"
                })
        }
    }

    const Guardar = () => {
       // console.log(selectDepartamentos)
        let formdata = new FormData();
            formdata.append('PeriodoId', periodoId)
            formdata.append('DepartamentoId', selectDepartamentos.code)
        if(op==='A'){
            console.log("RAid: "+idRa??null)
            formdata.append('Id', idRa??"")  
            formdata.append('Poa', poa)
            formdata.append('PoaEvidencia', poaEvidencia)
            formdata.append('PoaEvidenciaFile', poaEvidenciaFile)
            formdata.append('Pta', pta)
            formdata.append('PtaEvidencia', ptaEvidencia)
            formdata.append('PtaEvidenciaFile', ptaEvidenciaFile)  
            formdata.append('PagoInscripcion', pagoInscripcion)
            formdata.append('MontoCaptado', montoCaptado)
            formdata.append('MontoTotal', montoCaptadoTotal)
            formdata.append('Matricula', matricula)
            formdata.append('MatriculaEvidencia', matriculaEvidencia)
            formdata.append('MatriculaEvidenciaFile', matriculaEvidenciaFile)  
        }else if(op==='P')
        {
            formdata.append('CapDos', capDos )
            formdata.append('CapDosP', capDosP )
            formdata.append('CapTres', capTres )
            formdata.append('CapTresP', capTresP )
            formdata.append('CapCuatro', capCuatro )
            formdata.append('CapCuatroP', capCuatroP )
            formdata.append('CapCinco', capCinco )
            formdata.append('CapCincoP', capCincoP )
            formdata.append('Otros', capOtros )
            formdata.append('OtrosP', capOtrosP )
            formdata.append('Total', capTotal )
            formdata.append('TotalP', capTotalP )
        }else if(op==='E'){
            console.log(capEDos)
            console.log(capEDosP)
            formdata.append('CapDos', capEDos )
            formdata.append('CapDosP', capEDosP )
        }

     /*  var object = {};
        formdata.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);
        console.log(json)
        console.log(op)
        console.log(selectDepartamentos)
        console.log(periodoId)*/

        save(formdata)
    }

    const onHide = () => {
        setVisible(false);
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Guardar" type='button'  className='p-button-rounded p-button-primary' onClick={() => {setVisible(false) ; Guardar() ; }}  />
                <Button label="Cancelar" type='button' className='p-button-rounded p-button-secondary' onClick={() => {setVisible(false) ;  }}  />
            </div>
        );
    }

    const estado = (rowData) => {
        if(rowData.per_Estado === true){
            return (
                <>
                    <Button label='Cursando' className="p-button-rounded"></Button>
                </>
            );
        }else{
            return (
                <>
                    <Button label='Cerrado' className="p-button-rounded p-button-secondary"></Button>
                </>
            );
        }
    }

    const calcularMontoCaptado = () => {

        let valorPi = document.getElementById('pagoInscripcion').value
        let valorMt = document.getElementById('matricula').value

        if(Number.isNaN(valorPi) || valorPi === '')
        {
            valorPi = 0   
            setPagoInscripcion(valorPi) 
        }
        else if(Number.parseFloat(valorPi)!=0)
        {
            valorPi = Number.parseFloat(valorPi)
            setPagoInscripcion(valorPi)            
        }


        if(Number.isNaN(valorMt) || valorMt === '')
        {            
            valorMt = 0
            setMatricula(valorMt)
            
        }
        else if(Number.parseFloat(valorMt)!=0)
        {
            valorMt = Number.parseFloat(valorMt)
            setMatricula(valorMt)            
        }

        setMontoCaptado(parseFloat(parseFloat(valorPi) * parseFloat(valorMt)).toFixed(2))
    }

    /*const calcularMontoTotalCaptado = () => {

    }*/

    const calcularTotalEjercido =  () => {

        let cap2 = document.getElementById('cp2').value
        let cap2p = document.getElementById('cpp2').value
        let cap3 = document.getElementById('cp3').value
        let cap3p = document.getElementById('cpp3').value
        let cap4 = document.getElementById('cp4').value
        let cap4p = document.getElementById('cpp4').value
        let cap5 = document.getElementById('cp5').value
        let cap5p = document.getElementById('cpp5').value
        let otros = document.getElementById('otros').value
        let otrospp = document.getElementById('otrospp').value

        

    }

 /*   const calcularTotalProgramado = () => {

    }*/


    const cargarArchivo = (apartado, archivo) => {     
        switch(apartado){
            case "poa":
                setPoaEvidencia(archivo.target.files[0].name)
                console.log(archivo.target.files[0])
                setPoaEvidenciaFile(archivo.target.files[0])
                break;
            case "pta":
                setPtaEvidencia(archivo.target.files[0].name)
                console.log(archivo.target.files[0])
                setPtaEvidenciaFile(archivo.target.files[0])
                break;
            case "matricula":
                setMatriculaEvidencia(archivo.target.files[0].name)
                console.log(archivo.target.files[0])
                setMatriculaEvidenciaFile(archivo.target.files[0])
                break;
        }
    }

    const cargarRegistro = async (tipo, val) => {
        
        console.log(val)
        const depto = val
        console.log("tipo: "+tipo+" depto: "+depto)
        let url = tipo=="ra"?"api/v1/ra":tipo=="rp"?"api/v1/rp":"api/v1/re";
        url = "http://localhost:8080/"+url+"/obtener/"+depto+"/"+periodoId
        console.log(url)
        await axios.get(url).then(res => {  setData(tipo, res, val);  });

        
    }

    const setData = (tipo,res, valctrl) => {

        if(res.data==null || res.data == ''){
            limpiarFormularios();
            setSelectDepartamentos(opcDeptosElectronica.find(x=>x.code==valctrl))
            return;
        }
        switch(tipo){
            case "ra":
                console.log("seteando...")
                console.log(res.data)
                setPoa(res.data.poa)
                setPoaEvidencia(res.data.poaEvidencia)
                setPeriodoId(res.data.id_Periodo)
                setMatricula(res.data.matricula)
                setMatriculaEvidencia(res.data.matriculaEvidencia)
                setMontoCaptado(res.data.montoCaptado)
                setMontoCaptadoTotal(res.data.montoCaptadoTotal)
                setPagoInscripcion(res.data.pagoInscripcion)
                setPta(res.data.pta)
                setPtaEvidencia(res.data.ptaEvidencia)
                setSelectDepartamentos(opcDeptosElectronica.find(x=>x.code==res.data.id_Departamento))
                setIdRa(res.data.id??'')
                break;
            case "re":
                break;
            case "rp":
                break;
        }
    }

    const limpiarFormularios = () =>{
        console.log("limpiando")
        setPoa('')
        setPta('')
        setMatricula('')
        setPagoInscripcion('')
        setMontoCaptado('')
        setMontoCaptadoTotal('')
        setSelectDepartamentos('')
    }


    

    return <div>
        <h1 style={{ textAlign: 'center' }}>PERIODOS RECURSOS FINANCIEROS</h1>
        <DataTable value={periodos} responsiveLayout="scroll">
            <Column header="Periodo" body={concat} style={{ width: '29%' }}></Column>
            <Column field="per_Year" header="Año" style={{ width: '10%' }}></Column>
            <Column header="Estado" body={estado} style={{ width: '20%' }}  ></Column>
            <Column header="Rec. Asignado" body={ redRecursoAsignado } style={{ width: '11%', textAlign: 'center' }}></Column>
            <Column header="Rec. Programado" body={ redRecursoProgramado } style={{ width: '15%', textAlign: 'center' }}></Column>
            <Column header="Rec. Ejercido" body={ redRecursoEjercido } style={{ width: '15%', textAlign: 'center' }}></Column>
        </DataTable>



        <Dialog header={titleModal} visible={visible} style={{ width:'80vw'}} onHide={onHide} modal={true}  footer={renderFooter}>
                    <div style={{ width:"100%", display:"flex"}}>

                     <input type="file" style={{visibility:'hidden'}} id="archivos" onChange={(e)=>{
                        cargarArchivo(campoOrigenArchivo,e)
                     }} />

                    <table style={{width:"100%", display: showAsignado }}>
                        <tbody>
                            <tr>
                                <td colSpan={3}>
                                    <InputText type="hidden" value = {idRa} onChange={(e)=>{setIdRa(e.target.value)}} />
                                </td>
                            </tr>
                            <tr>
                                <td>                                  
                                    <h5 style={{textAlign:'right', padding:'1rem'}}>PROG. EDUCATIVO</h5>                                                                        

                                </td>   
                                <td colSpan={2}>
                                <Dropdown  style={{width:'100%'}} value={selectDepartamentos} onChange={(e) => {  cargarRegistro("ra", e.target.value.code); }} options={opcDeptosElectronica} optionLabel="name" 
                                        placeholder="Seleccione departamento" className="w-full md:w-14rem departamentos" />  
                                </td>                                                    
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>POA</h5>                                                                        

                                </td>   
                                <td>
                                        <InputText  style={{width:'100%'}} id='poa' type="text" value={poa} onChange={(e) => {setPoa(e.target.value)}} readOnly={!estadoPeriodoSeleccionado} />  
                                </td> 
                                <td>                              
                                        <Button icon="pi pi-file-pdf" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('poa'); }} severity="danger" />
                                </td>                                                                               
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>PTA</h5>                                                                        

                                </td>   
                                <td>
                                        <InputText  style={{width:'100%'}} id='pta' type="text" value={pta} onChange={(e) => { setPta(e.target.value) } } readOnly={!estadoPeriodoSeleccionado} />  
                                </td> 
                                <td>                              
                                        <Button icon="pi pi-file-pdf" onClick={(e)=>{document.getElementById('archivos').click(); setCampoOrigenArchivo('pta'); }} severity="danger" />
                                </td>                                                   
                            </tr>

                            <tr>
                                <td>                                  
                                    <h5 style={{textAlign:'right', padding:'1rem'}}>MATRÍCULA</h5> 
                                </td>   
                                <td>
                                    <InputText  style={{width:'100%'}} id="matricula"  type="text" value={matricula} onChange={ (e) => { setMatricula(e.target.value); calcularMontoCaptado(); } } readOnly={!estadoPeriodoSeleccionado} />
                                </td> 
                                <td>                              
                                        <Button icon="pi pi-file-pdf"  onClick={(e)=>{document.getElementById('archivos').click(); setCampoOrigenArchivo('matricula'); }}  severity="danger" />
                                </td>                                                   
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>PAGO INSCRIPCIÓN</h5>                                                                        

                                </td>   
                                <td colSpan={2}>
                                        <InputText  style={{width:'100%'}} id="pagoInscripcion"  type="text" value={pagoInscripcion} onChange={ (e) => { setPagoInscripcion(e.target.value); calcularMontoCaptado(); } }  readOnly={!estadoPeriodoSeleccionado} />  
                                </td>                                                    
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>MONTO CAPTADO</h5>                                                                        

                                </td>   
                                <td colSpan={2}>
                                        <InputText  style={{width:'100%'}} id='montoCaptado'  type="text" value={montoCaptado} readOnly={!estadoPeriodoSeleccionado} /*onChange={ (e) => { setMontoCaptado(e.target.value) } }*/ />  
                                </td>                                                 
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>MONTO CAPTADO TOTAL</h5>                                                                       

                                </td> 
                                <td colSpan={2}>
                                        <InputText style={{width:'100%'}} id='montoCaptadoTotal'  type="text" value={montoCaptadoTotal} onChange={ (e) => { setMontoCaptadoTotal(e.target.value) } } readOnly={!estadoPeriodoSeleccionado} />  
                                </td>                                                             
                            </tr>
                           

                        </tbody>
                    </table>

                    <table style={{width:"100%", display: showProgramado }}>
                        <tbody>
                            <tr>
                                <td colSpan={4}>
                                    <InputText type="hidden" value = {idRp} onChange={(e)=>{setIdRp(e.target.value)}} />
                                </td>
                            </tr>
                            <tr>
                                <td>                                  
                                    <h5 style={{textAlign:'right', padding:'1rem'}}>PROG. EDUCATIVO</h5>                                                                        

                                </td>   
                                <td colSpan={3}>
                                <Dropdown style={{width:'100%'}} value={selectDepartamentos} onChange={(e) => { cargarRegistro("ra", e.target.value.code); }} options={opcDeptosElectronica} optionLabel="name" 
                                        placeholder="Seleccione departamento" className="w-full md:w-14rem departamentos" />  
                                </td>                                                    
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>CAP 2000</h5>                                                                        

                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  style={{width:'100%'}}  type="text"  
                                            value={capDos} onChange={(e)=>{setCapDos(e.target.value)}} 
                                            readOnly={!estadoPeriodoSeleccionado} />  
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                               value={capDosP} onChange={(e)=>{setCapDosP(e.target.value)}} 
                                               readOnly={!estadoPeriodoSeleccionado} />  
                                    </div> 
                                </td> 
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                               
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>CAP 3000</h5>                                                                        

                                </td> 
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                            value={capTres} onChange={(e)=>{setCapTres(e.target.value)}} 
                                            readOnly={!estadoPeriodoSeleccionado} />   
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                               value={capTresP} onChange={(e)=>{setCapTresP(e.target.value)}} 
                                               readOnly={!estadoPeriodoSeleccionado} />  
                                    </div> 
                                </td>   
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>   
                                                                               
                            </tr>

                            <tr>
                                <td>                                  
                                    <h5 style={{textAlign:'right', padding:'1rem'}}>CAP 4000</h5>
                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                               value={capCuatro} onChange={(e)=>{setCapCuatro(e.target.value)}} 
                                               readOnly={!estadoPeriodoSeleccionado} />  
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  style={{width:'100%'}} type="text" 
                                               value={capCuatroP} onChange={(e)=>{setCapCuatroP(e.target.value)}}
                                               readOnly={!estadoPeriodoSeleccionado}  />  
                                    </div> 
                                </td>   
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                                
                            </tr>

                            <tr>
                                <td>                                  
                                    <h5 style={{textAlign:'right', padding:'1rem'}}>CAP 5000</h5>                                                                        

                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                               value={capCinco} onChange={(e)=>{setCapCinco(e.target.value)}} 
                                               readOnly={!estadoPeriodoSeleccionado} />   
                                    </div> 
                                </td>    
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                        <i className='pi pi-percentage'></i>
                                        <InputText  style={{width:'100%'}} type="text" 
                                           value={capCincoP} onChange={(e)=>{setCapCincoP(e.target.value)}} 
                                           readOnly={!estadoPeriodoSeleccionado} />  
                                    </div>
                                </td>  
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                                
                            </tr>

                            <tr>
                                <td>                                  
                                    <h5 style={{textAlign:'right', padding:'1rem'}}>OTROS</h5>                                                                        

                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                        <i className='pi pi-dollar'></i>
                                        <InputText  style={{width:'100%'}}  type="text" 
                                           value={capOtros} onChange={(e)=>{setCapOtros(e.target.value)}} 
                                           readOnly={!estadoPeriodoSeleccionado}/>    
                                    </div>
                                </td>    
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                        <i className='pi pi-percentage'></i>
                                        <InputText  style={{width:'100%'}}  type="text" 
                                           value={capOtrosP} onChange={(e)=>{setCapOtrosP(e.target.value)}} 
                                           readOnly={!estadoPeriodoSeleccionado}/>   
                                    </div>
                                </td>  
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                               
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>TOTAL</h5>                                                                        

                                </td>   
                                <td>
                                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                               value={capTotal} onChange={(e)=>{setCapTotal(e.target.value)}} 
                                               readOnly={!estadoPeriodoSeleccionado }/>  
                                        </div> 
                                </td>    
                                <td>

                                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                              value={capTotalP} onChange={(e)=>{setCapTotalP(e.target.value)}} 
                                              readOnly={!estadoPeriodoSeleccionado} />  
                                        </div>
                                      
                                </td>       
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                           
                            </tr>
                        </tbody>
                    </table>

                    <table style={{width:"100%", display: showEjercido }}>
                        <tbody>
                            <tr>
                                <td colSpan={4}>
                                    <InputText type="hidden" value = {idRe} onChange={(e)=>{setIdRe(e.target.value)}} />
                                </td>
                            </tr>
                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>PROG. EDUCATIVO</h5>                                                                        

                                </td>   
                                <td colSpan={3}>
                                <Dropdown  style={{width:'100%'}} value={selectDepartamentos} onChange={(e) => {  cargarRegistro("ra", e.target.value.code); }} options={opcDeptosElectronica} optionLabel="name" 
                                        placeholder="Seleccione departamento" className="w-full md:w-14rem departamentos" />  
                                </td>                                                    
                            </tr>                     

                            <tr>
                                <td>                                  
                                    <h5 style={{textAlign:'right', padding:'1rem'}}>CAP 2000</h5>                                                                        

                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  style={{width:'100%'}}  type="text"  
                                            value={capDos} onChange={(e)=>{setCapDos(e.target.value)}} 
                                            readOnly={!estadoPeriodoSeleccionado} />  
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                               value={capDosP} onChange={(e)=>{setCapDosP(e.target.value)}} 
                                               readOnly={!estadoPeriodoSeleccionado} />  
                                    </div> 
                                </td> 
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                               
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>CAP 3000</h5>                                                                        

                                </td> 
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                            value={capTres} onChange={(e)=>{setCapTres(e.target.value)}} 
                                            readOnly={!estadoPeriodoSeleccionado} />   
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                               value={capTresP} onChange={(e)=>{setCapTresP(e.target.value)}} 
                                               readOnly={!estadoPeriodoSeleccionado} />  
                                    </div> 
                                </td>   
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>   
                                                                               
                            </tr>

                            <tr>
                                <td>                                  
                                    <h5 style={{textAlign:'right', padding:'1rem'}}>CAP 4000</h5>
                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                               value={capCuatro} onChange={(e)=>{setCapCuatro(e.target.value)}} 
                                               readOnly={!estadoPeriodoSeleccionado} />  
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                               value={capCuatroP} onChange={(e)=>{setCapCuatroP(e.target.value)}} 
                                               readOnly={!estadoPeriodoSeleccionado} />  
                                    </div> 
                                </td>   
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                                
                            </tr>

                            <tr>
                                <td>                                  
                                    <h5 style={{textAlign:'right', padding:'1rem'}}>CAP 5000</h5>                                                                        

                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                               value={capCinco} onChange={(e)=>{setCapCinco(e.target.value)}} 
                                               readOnly={!estadoPeriodoSeleccionado} />   
                                    </div> 
                                </td>    
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                        <i className='pi pi-percentage'></i>
                                        <InputText  style={{width:'100%'}}  type="text" 
                                           value={capCincoP} onChange={(e)=>{setCapCincoP(e.target.value)}} 
                                           readOnly={!estadoPeriodoSeleccionado} />  
                                    </div>
                                </td>  
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                                
                            </tr>

                            <tr>
                                <td>                                  
                                    <h5 style={{textAlign:'right', padding:'1rem'}}>OTROS</h5>                                                                        

                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                        <i className='pi pi-dollar'></i>
                                        <InputText  style={{width:'100%'}}  type="text" 
                                           value={capOtros} onChange={(e)=>{setCapOtros(e.target.value)}} 
                                           readOnly={!estadoPeriodoSeleccionado} />    
                                    </div>
                                </td>    
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                        <i className='pi pi-percentage'></i>
                                        <InputText  style={{width:'100%'}}  type="text" 
                                           value={capOtrosP} onChange={(e)=>{setCapOtrosP(e.target.value)}} 
                                           readOnly={!estadoPeriodoSeleccionado} />   
                                    </div>
                                </td>  
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                               
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>TOTAL</h5>                                                                        

                                </td>   
                                <td>
                                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                               value={capTotal} onChange={(e)=>{setCapTotal(e.target.value)}} 
                                               readOnly={!estadoPeriodoSeleccionado} />  
                                        </div> 
                                </td>    
                                <td>

                                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                              value={capTotalP} onChange={(e)=>{setCapTotalP(e.target.value)}} 
                                              readOnly={!estadoPeriodoSeleccionado} />  
                                        </div>
                                      
                                </td>       
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                           
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>RECURSO<br></br>NO EJERCIDO</h5>                                                                        

                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  style={{width:'100%'}}  type="text"  
                                            value={capDos} onChange={(e)=>{setCapDos(e.target.value)}} 
                                            readOnly={!estadoPeriodoSeleccionado} />  
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  style={{width:'100%'}}  type="text" 
                                               value={capDosP} onChange={(e)=>{setCapDosP(e.target.value)}} 
                                               readOnly={!estadoPeriodoSeleccionado} />  
                                    </div> 
                                </td> 
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                               
                            </tr>

                            
                           

                        </tbody>
                    </table>
                   
                      
                    </div>
                  
                
        </Dialog>

    </div>;
};

export default PeriodosFinanciero;
