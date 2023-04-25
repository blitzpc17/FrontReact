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

const cookies = new Cookies();

const PeriodosFinanciero = () => {
    const navigate = new useNavigate();

    const [periodos, setPeriodos] = useState([]);

    const [id, setId] = useState(null);
    const [visible, setVisible] = useState(false);
    const [btntitle, setBtnTitle] = useState(null); //cambiar cuando ya traiga la info d elos existentes
    const [titleModal, setTitleModal] = useState(null);
    const [showAsignado, setShowAsignado] = useState("none");
    const [showProgramado, setShowProgramado] = useState("none");
    const [showEjercido, setShowEjercido] = useState("none");

    //genrales del modal
    const [periodoId, setPeriodoId] = useState(null);
    const [selectDepartamentos, setSelectDepartamentos] = useState(null);
    const [op, setOp] = useState(null);

    //asignado
    const [poa, setPoa] = useState(null);
    const [poaEvidencia, setPoaEvidencia] = useState(null);
    const [pta, setPta] = useState(null);
    const [ptaEvidencia, setPtaEvidencia] = useState(null);
    const [matriculaDepartamentoId, setMatriculaDepartamentoId] = useState(null);
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

    //end recurso variables

    var servicioAsignado = new ServicioRecursoAsignado();
    var servicioRecursoEjercido = new ServicioRecursoEjercido();
    var servicioRecursoProgramado = new ServicioRecursoProgramado();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const opcDeptosElectronica = [
      //  { name: 'Seleccione una opción', code:null},
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
        await axios.get("http://localhost:8080/api/v1/periodos/all").then(res => setPeriodos(res.data));
    }

    const redRecursoAsignado = (rowData) => {
       return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-primary" onClick={() => {
                    setTitleModal("Recurso Asignado"); setVisible(true); setShowAsignado("block"); setShowEjercido("none"); setShowProgramado("none");
                    setPeriodoId(rowData.id_Periodo); setOp('A');
            }}/>;
    }


    const redRecursoProgramado = (rowData) => {
        return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-secondary" onClick={() => {
                setTitleModal("Recurso Programado"); setVisible(true); setShowAsignado("none"); setShowEjercido("none"); setShowProgramado("block");
                setPeriodoId(rowData.id_Periodo); setOp('P');
        }}/>;
    }

    const redRecursoEjercido = (rowData) => {
        return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-help" onClick={() => {
                setTitleModal("Recurso Ejercido"); setVisible(true); setShowAsignado("none"); setShowEjercido("block"); setShowProgramado("none");
                setPeriodoId(rowData.id_Periodo); setOp('E');
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

        if(op==='A'){
            servicioAsignado.save(obj).then((data) => {
                console.log(data)
                //si es 200 limpiar formulario
            });            
        }
        else if(op==='P'){

            servicioRecursoProgramado.save(obj).then((data) => {
                console.log(data)
            })
        }
        else if(op==='E'){
            servicioRecursoEjercido.save(obj).then((data) => {
                console.log(data)
            })
        }
        else{
            //tirar modal de operacion no valida
        }
       
    }

    const Guardar = () => {
       // console.log(selectDepartamentos)
        let formdata = new FormData();
            formdata.append('PeriodoId', periodoId)//periodoId)
            formdata.append('DepartamentoId', selectDepartamentos.code)//matriculaDepartamentoId )
        if(op==='A'){  
            formdata.append('Poa', poa)
            formdata.append('PoaEvidencia', null)//poaEvidencia)
            formdata.append('Pta', pta)
            formdata.append('PtaEvidencia', null)//ptaEvidencia)         
            formdata.append('PagoInscripcion', pagoInscripcion)
            formdata.append('MontoCaptado', montoCaptado)
            formdata.append('MontoTotal', montoCaptadoTotal)
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
        console.log(op)
        console.log(selectDepartamentos)
        console.log(periodoId)

            save(formdata)
    }

    const onHide = () => {
        setVisible(false);
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Guardar"   className='p-button-rounded p-button-primary' onClick={() => {setVisible(false) ; Guardar() ; }}  />
                <Button label="Cancelar"  className='p-button-rounded p-button-secondary' onClick={() => {setVisible(false) ;  }}  />
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
                    <table style={{width:"100%", display: showAsignado }}>
                        <tbody>
                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>POA <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                        <InputText  type="text" value={poa} onChange={(e) => {setPoa(e.target.value)}} />  
                                </td>                                                    
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>PTA <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                        <InputText  type="text" value={pta} onChange={(e) => { setPta(e.target.value) } } />  
                                </td>                                                    
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>MATRÍCULA <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                <Dropdown value={selectDepartamentos} onChange={(e) => { setSelectDepartamentos(e.target.value); }} options={opcDeptosElectronica} optionLabel="name" 
                                        placeholder="Seleccione departamento" className="w-full md:w-14rem" />  
                                </td>                                                    
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>PAGO INSCRIPCIÓN <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                        <InputText  type="text" value={pagoInscripcion} onChange={ (e) => { setPagoInscripcion(e.target.value) } } />  
                                </td>                                                    
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>MONTO CAPTADO <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                        <InputText  type="text" value={montoCaptado} onChange={ (e) => { setMontoCaptado(e.target.value) } } />  
                                </td>                                                    
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>MONTO CAPTADO TOTAL <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                        <InputText  type="text" value={montoCaptadoTotal} onChange={(e) => { setMontoCaptadoTotal(e.target.value)} } />  
                                </td>                                                    
                            </tr>
                           

                        </tbody>
                    </table>

                    <table style={{width:"100%", display: showProgramado }}>
                        <tbody>
                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>CAP 2000 <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  type="text"  
                                            value={capDos} onChange={(e)=>{setCapDos(e.target.value)}} />  
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  type="text" 
                                               value={capDosP} onChange={(e)=>{setCapDosP(e.target.value)}} />  
                                    </div> 
                                </td> 
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                               
                            </tr>

                            
                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>MATRÍCULA <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td colSpan={3}>
                                <Dropdown value={selectDepartamentos} onChange={(e) => { setSelectDepartamentos(e.target.value); }} options={opcDeptosElectronica} optionLabel="name" 
                                        placeholder="Seleccione departamento" className="w-full md:w-14rem" />  
                                </td>                                                    
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>CAP 3000 <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td> 
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  type="text" 
                                            value={capTres} onChange={(e)=>{setCapTres(e.target.value)}} />   
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  type="text" 
                                               value={capTresP} onChange={(e)=>{setCapTresP(e.target.value)}} />  
                                    </div> 
                                </td>   
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>   
                                                                               
                            </tr>

                            <tr>
                                <td>                                  
                                    <h5 style={{textAlign:'right', padding:'1rem'}}>CAP 4000 <i className="pi pi-arrow-up"></i></h5>
                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  type="text" 
                                               value={capCuatro} onChange={(e)=>{setCapCuatro(e.target.value)}} />  
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  type="text" 
                                               value={capCuatroP} onChange={(e)=>{setCapCuatroP(e.target.value)}} />  
                                    </div> 
                                </td>   
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                                
                            </tr>

                            <tr>
                                <td>                                  
                                    <h5 style={{textAlign:'right', padding:'1rem'}}>CAP 5000 <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  type="text" 
                                               value={capCinco} onChange={(e)=>{setCapCinco(e.target.value)}} />   
                                    </div> 
                                </td>    
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                        <i className='pi pi-percentage'></i>
                                        <InputText  type="text" 
                                           value={capCincoP} onChange={(e)=>{setCapCincoP(e.target.value)}} />  
                                    </div>
                                </td>  
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                                
                            </tr>

                            <tr>
                                <td>                                  
                                    <h5 style={{textAlign:'right', padding:'1rem'}}>OTROS <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                        <i className='pi pi-dollar'></i>
                                        <InputText  type="text" 
                                           value={capOtros} onChange={(e)=>{setCapOtros(e.target.value)}} />    
                                    </div>
                                </td>    
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                        <i className='pi pi-percentage'></i>
                                        <InputText  type="text" 
                                           value={capOtrosP} onChange={(e)=>{setCapOtrosP(e.target.value)}} />   
                                    </div>
                                </td>  
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>                                               
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>TOTAL <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  type="text" 
                                               value={capTotal} onChange={(e)=>{setCapTotal(e.target.value)}} />  
                                        </div> 
                                </td>    
                                <td>

                                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  type="text" 
                                              value={capTotalP} onChange={(e)=>{setCapTotalP(e.target.value)}} />  
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
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>MATRÍCULA <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td colSpan={3}>
                                <Dropdown value={selectDepartamentos} onChange={(e) => { setSelectDepartamentos(e.target.value); }} options={opcDeptosElectronica} optionLabel="name" 
                                        placeholder="Seleccione departamento" className="w-full md:w-14rem" />  
                                </td>                                                    
                            </tr>
                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>Cap 2000 <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  type="text" 
                                               value={capEDos} onChange={(e)=>{setECapDos(e.target.value)}} />  
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  type="text" 
                                               value={capEDosP} onChange={(e)=>{setECapDosP (e.target.value)}} />  
                                    </div> 
                                </td>  
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
                                </td>  
                                                                                    
                            </tr>

                            
                           

                        </tbody>
                    </table>



                    <InputText type="hidden" value = {id} />
                      
                    </div>
                  
                
        </Dialog>

    </div>;
};

export default PeriodosFinanciero;
