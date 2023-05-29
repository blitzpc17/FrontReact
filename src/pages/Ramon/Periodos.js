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

//chart js
import { Chart } from 'primereact/chart';

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

    const [title, setTitle] = useState(null)
    const [urlArchivo, setUrlArchivo] = useState(null)

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
    const[capDosEF, setCapDosEF] = useState(null);
    const[capTres,  setCapTres] = useState(null);
    const[capTresP, setCapTresP] = useState(null);
    const[capTresE, setCapTresE] = useState(null);
    const[capTresEF, setCapTresEF] = useState(null);
    const[capCuatro,  setCapCuatro] = useState(null);
    const[capCuatroP, setCapCuatroP] = useState(null);
    const[capCuatroE, setCapCuatroE] = useState(null);
    const[capCuatroEF, setCapCuatroEF] = useState(null);
    const[capCinco,  setCapCinco] = useState(null);
    const[capCincoP, setCapCincoP] = useState(null);
    const[capCincoE, setCapCincoE] = useState(null);
    const[capCincoEF, setCapCincoEF] = useState(null);
    const[capOtros,  setCapOtros] = useState(null);
    const[capOtrosP, setCapOtrosP] = useState(null);
    const[capOtrosE, setCapOtrosE] = useState(null);
    const[capOtrosEF, setCapOtrosEF] = useState(null);
    const[capTotal,  setCapTotal] = useState(null);
    const[capTotalP, setCapTotalP] = useState(null);
    const[capTotalE, setCapTotalE] = useState(null);
    const[capTotalEF, setCapTotalEF] = useState(null);


   
  


    //ejercido
    const[capEDos,  setECapDos] = useState(null);
    const[capEDosP, setECapDosP] = useState(null);
    const[capEDosE, setECapDosE] = useState(null);
    const[capEDosEF, setECapDosEF] = useState(null);
    const[capETres,  setECapTres] = useState(null);
    const[capETresP, setECapTresP] = useState(null);
    const[capETresE, setECapTresE] = useState(null);
    const[capETresEF, setECapTresEF] = useState(null);
    const[capECuatro,  setECapCuatro] = useState(null);
    const[capECuatroP, setECapCuatroP] = useState(null);
    const[capECuatroE, setECapCuatroE] = useState(null);
    const[capECuatroEF, setECapCuatroEF] = useState(null);
    const[capECinco,  setECapCinco] = useState(null);
    const[capECincoP, setECapCincoP] = useState(null);
    const[capECincoE, setECapCincoE] = useState(null);
    const[capECincoEF, setECapCincoEF] = useState(null);
    const[capEOtros,  setECapOtros] = useState(null);
    const[capEOtrosP, setECapOtrosP] = useState(null);
    const[capEOtrosE, setECapOtrosE] = useState(null);
    const[capEOtrosEF, setECapOtrosEF] = useState(null);
    const[capETotal,  setECapTotal] = useState(null);
    const[capETotalP, setECapTotalP] = useState(null);
    const[capETotalE, setECapTotalE] = useState(null);
    const[capETotalEF, setECapTotalEF] = useState(null);
    const[capNoEjercido,  setNoEjercido] = useState(null);
    const[capNoEjercidoP, setNoEjercidoP] = useState(null);
    const[capNoEjercidoE, setNoEjercidoE] = useState(null);
    const[capNoEjercidoEF, setNoEjercidoEF] = useState(null);

    //end recurso variables

    var servicioAsignado = new ServicioRecursoAsignado();
    var servicioRecursoEjercido = new ServicioRecursoEjercido();
    var servicioRecursoProgramado = new ServicioRecursoProgramado();

    //objetos generales
    const[objAsignado, setObjAsignado] = useState(null);
    const[objEjercido, setObjEjercido] = useState(null);
    const[objProgramado, setObjProgramado] = useState(null);


    //chart js variables
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const opcDeptosElectronica = [
        { name: 'ELECTRONICA', code:'3'},
        { name: 'BIOMEDICA', code:'12'}
    ];

    const path_base = "/Documentos/Prueba/";

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
                setPeriodoId(rowData.id_Periodo); setOp('P');  setEstadoPeriodoSelecionado(rowData.per_Estado); limpiarFormularios();
        }}/>;
    }

    const redRecursoEjercido = (rowData) => {
        return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-help" onClick={() => {
                setTitleModal("Recurso Ejercido"); setVisible(true); setShowAsignado("none"); setShowEjercido("block"); setShowProgramado("none");
                setPeriodoId(rowData.id_Periodo); setOp('E'); setEstadoPeriodoSelecionado(rowData.per_Estado); limpiarFormularios();
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
              if(data.status===200){
                swal({
                    icon:"success",
                    title:"Aviso",
                    text:"Registro guardado correctamente",
                    }).then(()=>{
                        limpiarFormularios();
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
                if(data.status===200){
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
        }else if(op === 'E'){
            servicioRecursoEjercido.save(obj).then((data) => {
                console.log(data)
                if(data.status===200){
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
            formdata.append('Id', idRp??"")  
            formdata.append('CapDos', capDos )
            formdata.append('CapDosP', capDosP )
            formdata.append('CapDosEvidencia', capDosE)
            formdata.append('CapDosEvidenciaFile', capDosEF)
            formdata.append('CapTres', capTres )
            formdata.append('CapTresP', capTresP )
            formdata.append('CapTresEvidencia', capTresE)
            formdata.append('CapTresEvidenciaFile', capTresEF)
            formdata.append('CapCuatro', capCuatro )
            formdata.append('CapCuatroP', capCuatroP )
            formdata.append('CapCuatroEvidencia', capCuatroE)
            formdata.append('CapCuatroEvidenciaFile', capCuatroEF)
            formdata.append('CapCinco', capCinco )
            formdata.append('CapCincoP', capCincoP )
            formdata.append('CapCincoEvidencia', capCincoE)
            formdata.append('CapCincoEvidenciaFile', capCincoEF)
            formdata.append('Otros', capOtros )
            formdata.append('OtrosP', capOtrosP )
            formdata.append('OtrosEvidencia', capOtrosE)
            formdata.append('OtrosEvidenciaFile', capOtrosEF)
            formdata.append('Total', capTotal )
            formdata.append('TotalP', capTotalP )
            formdata.append('TotalEvidencia',capTotalE)
            formdata.append('TotalEvidenciaFile',capTotalEF)
        }else if(op==='E'){
            formdata.append('Id', idRe??"")  
            formdata.append('CapDos', capEDos )
            formdata.append('CapDosP', capEDosP )
            formdata.append('CapDosEvidencia', capEDosE)
            formdata.append('CapDosEvidenciaFile', capEDosEF)
            formdata.append('CapTres', capETres )
            formdata.append('CapTresP', capETresP )
            formdata.append('CapTresEvidencia', capETresE)
            formdata.append('CapTresEvidenciaFile', capETresEF)
            formdata.append('CapCuatro', capECuatro )
            formdata.append('CapCuatroP', capECuatroP )
            formdata.append('CapCuatroEvidencia', capECuatroE)
            formdata.append('CapCuatroEvidenciaFile', capECuatroEF)
            formdata.append('CapCinco', capECinco )
            formdata.append('CapCincoP', capECincoP )
            formdata.append('CapCincoEvidencia', capECincoE)
            formdata.append('CapCincoEvidenciaFile', capECincoEF)
            formdata.append('Otros', capEOtros )
            formdata.append('OtrosP', capEOtrosP )
            formdata.append('OtrosEvidencia', capEOtrosE)
            formdata.append('OtrosEvidenciaFile', capEOtrosEF)
            formdata.append('Total', capETotal )
            formdata.append('TotalP', capETotalP )
            formdata.append('CapTotalEvidencia', capETotalE)
            formdata.append('CapTotalEvidenciaFile', capETotalEF)
            formdata.append('NoAsignado', capNoEjercido )
            formdata.append('NoAsignadoP', capNoEjercidoP )
            formdata.append('NoAsignadoEvidencia', capNoEjercidoE)
            formdata.append('NoAsignadoEvidenciaFile', capNoEjercidoEF)
        }

    /*   var object = {};
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
                <Button label="Cancelar" type='button' className='p-button-rounded p-button-secondary' onClick={() => {setVisible(false) ;  graficar(null, null);  }}  />
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
        else if(Number.parseFloat(valorPi)!==0)
        {
            valorPi = Number.parseFloat(valorPi)
            setPagoInscripcion(valorPi)            
        }


        if(Number.isNaN(valorMt) || valorMt === '')
        {            
            valorMt = 0
            setMatricula(valorMt)
            
        }
        else if(Number.parseFloat(valorMt)!==0)
        {
            valorMt = Number.parseFloat(valorMt)
            setMatricula(valorMt)            
        }

        setMontoCaptado(parseFloat(parseFloat(valorPi) * parseFloat(valorMt)).toFixed(2))
    } 


    const cargarArchivo = (apartado, archivo) => {     
        switch(apartado){
            //ra
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

                //rp
            case "capP200":
                setCapDosE(archivo.target.files[0].name)
                setCapDosEF(archivo.target.files[0])
                break;            
            case "capP300":
                setCapTresE(archivo.target.files[0].name)
                setCapTresEF(archivo.target.files[0])
                break;
            case "capP400":
                setCapCuatroE(archivo.target.files[0].name)
                setCapCuatroEF(archivo.target.files[0])
                break;
            case "capP500":
                setCapCincoE(archivo.target.files[0].name)
                setCapCincoEF(archivo.target.files[0])
                break;
            case "POtros":
                setCapOtrosE(archivo.target.files[0].name)
                setCapOtrosEF(archivo.target.files[0])
                break;
            case "PTotal":
                setCapTotalE(archivo.target.files[0].name)
                setCapTotalEF(archivo.target.files[0])
                break;

                //re
            case "capE200":
                console.log("cargo en ejercido cap200")
                setECapDosE(archivo.target.files[0].name)
                setECapDosEF(archivo.target.files[0])
                break;            
            case "capE300":
                setECapTresE(archivo.target.files[0].name)
                setECapTresEF(archivo.target.files[0])
                break;
            case "capE400":
                setECapCuatroE(archivo.target.files[0].name)
                setECapCuatroEF(archivo.target.files[0])
                break;
            case "capE500":
                setECapCincoE(archivo.target.files[0].name)
                setECapCincoEF(archivo.target.files[0])
                break;
            case "EOtros":
                setECapOtrosE(archivo.target.files[0].name)
                setECapOtrosEF(archivo.target.files[0])
                break;
            case "ETotal":
                setECapTotalE(archivo.target.files[0].name)
                setECapTotalEF(archivo.target.files[0])
                break;
            case "NoEjercidoETotal":
                setNoEjercidoE(archivo.target.files[0].name)
                setNoEjercidoEF(archivo.target.files[0])
                break;


            default:break;
        }
    }

    const cargarRegistro = async (tipo, val) => {
        
        console.log(val)
        const depto = val
        console.log("tipo: "+tipo+" depto: "+depto)
        let url = tipo==="ra"?"api/v1/ra":tipo==="rp"?"api/v1/rp":"api/v1/re";
        url = "http://localhost:8080/"+url+"/obtener/"+depto+"/"+periodoId
        console.log(url)
        await axios.get(url).then(res => {  setData(tipo, res, val);  });

        
    }

    const setData = (tipo,res, valctrl) => {

        if(res.data===null || res.data === ''){
            limpiarFormularios();
            setSelectDepartamentos(opcDeptosElectronica.find(x=>x.code==valctrl))
            return;
        }
        console.log("seteando...")
        console.log(res.data)
        const documentStyle = getComputedStyle(document.documentElement);
        let datagrafica = []
        switch(tipo){
            case "ra":
                
                setObjAsignado(res.data)
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

                datagrafica = [
                    {
                        data: [res.data.poa, res.data.pta, res.data.matricula],
                        backgroundColor: [
                            documentStyle.getPropertyValue('--blue-500'), 
                            documentStyle.getPropertyValue('--yellow-500'), 
                            documentStyle.getPropertyValue('--green-500')
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--blue-400'), 
                            documentStyle.getPropertyValue('--yellow-400'), 
                            documentStyle.getPropertyValue('--green-400')
                        ]
                    }
                ]
                console.log(datagrafica)
                
                graficar(['poa', 'pta', 'matricula'], datagrafica);

                break;
            case "re":
                console.log("re--")
                setObjEjercido(res.data)
                setECapDos(res.data.cap_dos);
                setECapDosP(res.data.cap_dos_p);
                setECapDosE(res.data.cap_dos_ev)
                setECapTres(res.data.cap_tres);
                setECapTresP(res.data.cap_tres_p);
                setECapTresE(res.data.cap_tres_ev)
                setECapCuatro(res.data.cap_cuatro);
                setECapCuatroP(res.data.cap_cuatro_p);
                setECapCuatroE(res.data.cap_cuatro_ev)
                setECapCinco(res.data.cap_cinco);
                setECapCincoP(res.data.cap_cinco_p);
                setECapCincoE(res.data.cap_cinco_ev)
                setECapOtros(res.data.otros)
                setECapOtrosP(res.data.otros_p)
                setECapOtrosE(res.data.otros_ev)
                setECapTotal(res.data.total)
                setECapTotalP(res.data.total_p)
                setECapTotalE(res.data.total_ev)
                setNoEjercido(res.data.recurso_no_asignado)
                setNoEjercidoE(res.data.recurso_no_asignado_ev)
                setNoEjercidoP(res.data.recurso_no_asignado_p)
                setSelectDepartamentos(opcDeptosElectronica.find(x=>x.code==res.data.id_departamento))
                setIdRe(res.data.id??'')
                
                
                datagrafica = [
                    {
                        data: [res.data.cap_dos, res.data.cap_tres, res.data.cap_cuatro, res.data.cap_cinco],
                        backgroundColor: [
                            documentStyle.getPropertyValue('--blue-500'), 
                            documentStyle.getPropertyValue('--yellow-500'), 
                            documentStyle.getPropertyValue('--green-500'),
                            documentStyle.getPropertyValue('--brown-500'), 
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--blue-400'), 
                            documentStyle.getPropertyValue('--yellow-400'), 
                            documentStyle.getPropertyValue('--green-400'),
                            documentStyle.getPropertyValue('--brown-400'),
                        ]
                    }
                ]
                console.log(datagrafica)
                
                graficar(['cap200', 'cap300', 'cap400', 'cap500'], datagrafica);
                
                

                break;
            case "rp":
                console.log("rp")
                setObjProgramado(res.data)
                setCapDos(res.data.cap_dos)
                setCapDosP(res.data.cap_dos_p)
                setCapDosE(res.data.cap_dos_ev)
                setCapTres(res.data.cap_tres)
                setCapTresP(res.data.cap_tres_p)
                setCapTresE(res.data.cap_tres_ev)
                setCapCuatro(res.data.cap_cuatro)
                setCapCuatroP(res.data.cap_cuatro_p)
                setCapCuatroE(res.data.cap_cuatro_ev)
                setCapCinco(res.data.cap_cinco)
                setCapCincoP(res.data.cap_cinco_p)
                setCapCincoE(res.data.cap_cinco_ev)
                setCapOtros(res.data.otros)
                setCapOtrosP(res.data.otros_p)
                setCapOtrosE(res.data.otros_ev)
                setCapTotal(res.data.total)
                setCapTotalP(res.data.total_p)
                setCapTotalE(res.data.total_ev)
                setSelectDepartamentos(opcDeptosElectronica.find(x=>x.code==res.data.id_departamento))
                setIdRp(res.data.id??'')

                datagrafica = [
                    {
                        data: [res.data.cap_dos, res.data.cap_tres, res.data.cap_cuatro, res.data.cap_cinco],
                        backgroundColor: [
                            documentStyle.getPropertyValue('--blue-500'), 
                            documentStyle.getPropertyValue('--yellow-500'), 
                            documentStyle.getPropertyValue('--green-500'),
                            documentStyle.getPropertyValue('--brown-500'), 
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--blue-400'), 
                            documentStyle.getPropertyValue('--yellow-400'), 
                            documentStyle.getPropertyValue('--green-400'),
                            documentStyle.getPropertyValue('--brown-400'),
                        ]
                    }
                ]
                console.log(datagrafica)
                
                graficar(['cap200', 'cap300', 'cap400', 'cap500'], datagrafica);

                break;

          

                default: break;
        }
    }

    const limpiarFormularios = () =>{
        console.log("limpiando")
        //ra
        setPoa('')
        setPoaEvidencia('')
        setPoaEvidenciaFile(null)
        setPta('')
        setPtaEvidencia('')
        setPtaEvidenciaFile(null)
        setMatricula('')
        setMatriculaEvidencia('')
        setMatriculaEvidenciaFile(null)
        setPagoInscripcion('')
        setMontoCaptado('')
        setMontoCaptadoTotal('')
        setSelectDepartamentos('')
        setIdRa('')
        //rp
        setCapDos('')
        setCapDosP('')
        setCapDosE('')
        setCapDosEF(null)
        setCapTres('')
        setCapTresP('')
        setCapTresE('')
        setCapTresEF(null)
        setCapCuatro('')
        setCapCuatroP('')
        setCapCuatroE('')
        setCapCuatroEF(null)
        setCapCinco('')
        setCapCincoP('')
        setCapCincoE('')
        setCapCincoEF(null)
        setCapOtros('')
        setCapOtrosP('')
        setCapOtrosE('')
        setCapOtrosEF(null)
        setCapTotal('')
        setCapTotalP('')
        setCapTotalE('')
        setCapTotalEF(null)
        setSelectDepartamentos('')
        setIdRp('')

        //re
        setECapDos('')
        setECapDosP('')
        setECapDosE('')
        setECapDosEF(null)
        setECapTres('')
        setECapTresP('')
        setECapTresE('')
        setECapTresEF(null)
        setECapCuatro('')
        setECapCuatroP('')
        setECapCuatroE('')
        setECapCuatroEF(null)
        setECapCinco('')
        setECapCincoP('')
        setECapCincoE('')
        setECapCincoEF(null)
        setECapOtros('')
        setECapOtrosP('')
        setECapOtrosE('')
        setECapOtrosEF(null)
        setECapTotal('')
        setECapTotalP('')
        setECapTotalE('')
        setECapTotalEF(null)
        setNoEjercido('')
        setNoEjercidoP('')
        setNoEjercidoE('')        
        setNoEjercidoEF(null)
        setIdRe('')
        setSelectDepartamentos('')

        setUrlArchivo('')
    }


    const graficar = (labels,datasets) => {
        
        const data = {
            labels: labels,
            datasets: datasets
        }
        const options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
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

                     <input type="file" style={{visibility:'hidden', display:"none"}} id="archivos" onChange={(e)=>{
                        cargarArchivo(campoOrigenArchivo,e)
                     }} />

                    <div style={{width:"100%", display:"flex"}}>
                        <div style={{width:"50%"}}>
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
                                        <div style={{display:"flex"}}>
                                            <Button icon="pi pi-search" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('poa'); }} severity="danger" />
                                            <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(objAsignado.poaEvidencia);}} />
                                        </div>                            
                                           
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
                                        <div style={{display:"flex"}}>                      
                                            <Button icon="pi pi-search" onClick={(e)=>{document.getElementById('archivos').click(); setCampoOrigenArchivo('pta'); }} severity="danger" />
                                            <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(objAsignado.ptaEvidencia);}} />
                                        </div>
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
                                        <div style={{display:"flex"}}>                       
                                            <Button icon="pi pi-search"  onClick={(e)=>{document.getElementById('archivos').click(); setCampoOrigenArchivo('matricula'); }}  severity="danger" />
                                            <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(objAsignado.matriculaEvidencia);}} />
                                        </div>
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
                                            <InputText style={{width:'100%'}} id='montoCaptadoTotal'  type="text" value={montoCaptadoTotal} onChange={ (e) => { setMontoCaptadoTotal(e.target.value) } } readOnly={true} />  
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
                                                <Dropdown style={{width:'100%'}} value={selectDepartamentos} onChange={(e) => { cargarRegistro("rp", e.target.value.code); }} options={opcDeptosElectronica} optionLabel="name" 
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
                                            <div style={{display:'flex',  flexDirection:'column', alignItems:'center', padding:'0.25rem' }}>
                                                <Button icon="pi pi-search" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('capP200'); }} severity="danger" />
                                                <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem', marginTop:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(capDosE);}} />
                                           </div>
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
                                            <div style={{display:'flex',  flexDirection:'column', alignItems:'center', padding:'0.25rem' }}>
                                                <Button icon="pi pi-search" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('capP300'); }} severity="danger" />
                                                <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem', marginTop:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(capTresE);}} />
                                           </div>
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
                                            <div style={{display:'flex',  flexDirection:'column', alignItems:'center', padding:'0.25rem' }}>
                                                <Button icon="pi pi-search" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('capP400'); }} severity="danger" />
                                                <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem', marginTop:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(capCuatroE);}} />
                                           </div>
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
                                            <div style={{display:'flex',  flexDirection:'column', alignItems:'center', padding:'0.25rem' }}>
                                                <Button icon="pi pi-search" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('capP500'); }} severity="danger" />
                                                <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem', marginTop:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(capCincoE);}} />
                                           </div>
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
                                            <div style={{display:'flex',  flexDirection:'column', alignItems:'center', padding:'0.25rem' }}>
                                                <Button icon="pi pi-search" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('POtros'); }} severity="danger" />
                                                <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem', marginTop:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(capOtrosE);}} />
                                           </div>
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
                                            <div style={{display:'flex',  flexDirection:'column', alignItems:'center', padding:'0.25rem' }}>
                                                <Button icon="pi pi-search" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('PTotal'); }} severity="danger" />
                                                <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem', marginTop:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(capTotalE);}} />
                                           </div>
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
                                        <Dropdown  style={{width:'100%'}} value={selectDepartamentos} onChange={(e) => {  cargarRegistro("re", e.target.value.code); }} options={opcDeptosElectronica} optionLabel="name" 
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
                                                    value={capEDos} onChange={(e)=>{setECapDos(e.target.value)}} 
                                                    readOnly={!estadoPeriodoSeleccionado} />  
                                            </div> 
                                        </td>  
                                        <td>
                                            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                                    <i className='pi pi-percentage'></i>
                                                    <InputText  style={{width:'100%'}}  type="text" 
                                                    value={capEDosP} onChange={(e)=>{setECapDosP(e.target.value)}} 
                                                    readOnly={!estadoPeriodoSeleccionado} />  
                                            </div> 
                                        </td> 
                                        <td>
                                            <div style={{display:'flex',  flexDirection:'column', alignItems:'center', padding:'0.25rem' }}>
                                                <Button icon="pi pi-search" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('capE200'); }} severity="danger" />
                                                <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem', marginTop:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(capEDosE);}} />
                                           </div>
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
                                                    value={capETres} onChange={(e)=>{setECapTres(e.target.value)}} 
                                                    readOnly={!estadoPeriodoSeleccionado} />   
                                            </div> 
                                        </td>  
                                        <td>
                                            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                                    <i className='pi pi-percentage'></i>
                                                    <InputText  style={{width:'100%'}}  type="text" 
                                                    value={capETresP} onChange={(e)=>{setECapTresP(e.target.value)}} 
                                                    readOnly={!estadoPeriodoSeleccionado} />  
                                            </div> 
                                        </td>   
                                        <td>
                                            <div style={{display:'flex',  flexDirection:'column', alignItems:'center', padding:'0.25rem' }}>
                                                <Button icon="pi pi-search" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('capE300'); }} severity="danger" />
                                                <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem', marginTop:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(capETresE);}} />
                                           </div>
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
                                                    value={capECuatro} onChange={(e)=>{setECapCuatro(e.target.value)}} 
                                                    readOnly={!estadoPeriodoSeleccionado} />  
                                            </div> 
                                        </td>  
                                        <td>
                                            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                                    <i className='pi pi-percentage'></i>
                                                    <InputText  style={{width:'100%'}}  type="text" 
                                                    value={capECuatroP} onChange={(e)=>{setECapCuatroP(e.target.value)}} 
                                                    readOnly={!estadoPeriodoSeleccionado} />  
                                            </div> 
                                        </td>   
                                        <td>
                                            <div style={{display:'flex',  flexDirection:'column', alignItems:'center', padding:'0.25rem' }}>
                                                <Button icon="pi pi-search" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('capE400'); }} severity="danger" />
                                                <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem', marginTop:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(capECuatroE);}} />
                                           </div>
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
                                                    value={capECinco} onChange={(e)=>{setECapCinco(e.target.value)}} 
                                                    readOnly={!estadoPeriodoSeleccionado} />   
                                            </div> 
                                        </td>    
                                        <td>
                                            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                                <i className='pi pi-percentage'></i>
                                                <InputText  style={{width:'100%'}}  type="text" 
                                                value={capECincoP} onChange={(e)=>{setECapCincoP(e.target.value)}} 
                                                readOnly={!estadoPeriodoSeleccionado} />  
                                            </div>
                                        </td>  
                                        <td>
                                            <div style={{display:'flex',  flexDirection:'column', alignItems:'center', padding:'0.25rem' }}>
                                                <Button icon="pi pi-search" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('capE500'); }} severity="danger" />
                                                <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem', marginTop:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(capECincoE);}} />
                                           </div>
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
                                                value={capEOtros} onChange={(e)=>{setECapOtros(e.target.value)}} 
                                                readOnly={!estadoPeriodoSeleccionado} />    
                                            </div>
                                        </td>    
                                        <td>
                                            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                                <i className='pi pi-percentage'></i>
                                                <InputText  style={{width:'100%'}}  type="text" 
                                                value={capEOtrosP} onChange={(e)=>{setECapOtrosP(e.target.value)}} 
                                                readOnly={!estadoPeriodoSeleccionado} />   
                                            </div>
                                        </td>  
                                        <td>
                                            <div style={{display:'flex',  flexDirection:'column', alignItems:'center', padding:'0.25rem' }}>
                                                <Button icon="pi pi-search" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('EOtros'); }} severity="danger" />
                                                <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem', marginTop:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(capEOtrosE);}} />
                                           </div>
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
                                                    value={capETotal} onChange={(e)=>{setECapTotal(e.target.value)}} 
                                                    readOnly={!estadoPeriodoSeleccionado} />  
                                                </div> 
                                        </td>    
                                        <td>

                                                <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                                    <i className='pi pi-percentage'></i>
                                                    <InputText  style={{width:'100%'}}  type="text" 
                                                    value={capETotalP} onChange={(e)=>{setECapTotalP(e.target.value)}} 
                                                    readOnly={!estadoPeriodoSeleccionado} />  
                                                </div>
                                            
                                        </td>       
                                        <td>
                                            <div style={{display:'flex',  flexDirection:'column', alignItems:'center', padding:'0.25rem' }}>
                                                <Button icon="pi pi-search" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('ETotal'); }} severity="danger" />
                                                <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem', marginTop:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo(capETotalE);}} />
                                           </div>
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
                                                    value={capNoEjercido} onChange={(e)=>{setNoEjercido(e.target.value)}} 
                                                    readOnly={!estadoPeriodoSeleccionado} />  
                                            </div> 
                                        </td>  
                                        <td>
                                            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                                    <i className='pi pi-percentage'></i>
                                                    <InputText  style={{width:'100%'}}  type="text" 
                                                    value={capNoEjercidoP} onChange={(e)=>{setNoEjercidoP(e.target.value)}} 
                                                    readOnly={!estadoPeriodoSeleccionado} />  
                                            </div> 
                                        </td> 
                                        <td>
                                           <div style={{display:'flex',  flexDirection:'column', alignItems:'center', padding:'0.25rem' }}>
                                                <Button icon="pi pi-search" onClick={(e)=>{ document.getElementById('archivos').click(); setCampoOrigenArchivo('NoEjercidoETotal'); }} severity="danger" />
                                                <Button icon="pi pi-file-pdf" style={{marginLeft:'0.35rem', marginTop:'0.35rem'}} className='p-button-info' onClick={(e)=>{setTitle('perreo'); setUrlArchivo();}} />
                                           </div>
                                        </td>                                               
                                    </tr>

                                    
                                

                                </tbody>
                            </table>
                        </div>
                        <div style={{width:"50%"}}>                           
                            <iframe id="iframe"
                                title={title}                                      
                                src={path_base+urlArchivo}
                                style={{width:"95%", height:"600px"}} 
                            ></iframe>

                           <div className="card flex justify-content-center">
                                <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
                            </div>

                        </div>
                    </div>

                    
                   
                      
                    </div>
                  
                
        </Dialog>

    </div>;
};

export default PeriodosFinanciero;
