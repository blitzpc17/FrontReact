import React, { useEffect, useState, useContext } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from "axios";
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const PeriodosFinanciero = () => {
    const navigate = new useNavigate();

    const [periodos, setPeriodos] = useState([]);

    const [id, setId] = useState(null);
    const [visible, setVisible] = useState(false);
    const [btntitle, setBtnTitle] = useState(null);
    const [titleModal, setTitleModal] = useState(null);
    const [showAsignado, setShowAsignado] = useState("none");
    const [showProgramado, setShowProgramado] = useState("none");
    const [showEjercido, setShowEjercido] = useState("none");

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

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
                    setId(rowData.id_Periodo); 
            }}/>;
    }


    const redRecursoProgramado = (rowData) => {
        return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-secondary" onClick={() => {
                setTitleModal("Recurso Programado"); setVisible(true); setShowAsignado("none"); setShowEjercido("none"); setShowProgramado("block");
                setId(rowData.id_Periodo); 
        }}/>;
    }

    const redRecursoEjercido = (rowData) => {
        return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-help" onClick={() => {
                setTitleModal("Recurso Ejercido"); setVisible(true); setShowAsignado("none"); setShowEjercido("block"); setShowProgramado("none");
                setId(rowData.id_Periodo); 
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

    const onHide = () => {
        setVisible(false);
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Guardar"   className='p-button-rounded p-button-primary' onClick={() => {setVisible(false) ; /*agregar() ;*/ }}  />
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
                                        <InputText  type="text" 
                                          value="" onChange="" />  
                                </td>                                                    
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>PTA <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                        <InputText  type="text" 
                                          value="" onChange="" />  
                                </td>                                                    
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>MATRÍCULA <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                        <InputText  type="text" 
                                          value="" onChange="" />  
                                </td>                                                    
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>PAGO INSCRIPCIÓN <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                        <InputText  type="text" 
                                          value="" onChange="" />  
                                </td>                                                    
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>MONTO CAPTADO <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                        <InputText  type="text" 
                                          value="" onChange="" />  
                                </td>                                                    
                            </tr>

                            <tr>
                                <td>                                  
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>MONTO CAPTADO TOTAL <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                        <InputText  type="text" 
                                          value="" onChange="" />  
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
                                            value="" onChange="" />  
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  type="text" 
                                            value="" onChange="" />  
                                    </div> 
                                </td> 
                                <td>
                                    <Button icon="pi pi-file-pdf" rounded text severity="danger" />
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
                                            value="" onChange="" />  
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  type="text" 
                                            value="" onChange="" />  
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
                                            value="" onChange="" />  
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  type="text" 
                                            value="" onChange="" />  
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
                                            value="" onChange="" />  
                                    </div> 
                                </td>    
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                        <i className='pi pi-percentage'></i>
                                        <InputText  type="text" 
                                        value="" onChange="" />  
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
                                        value="" onChange="" />  
                                    </div>
                                </td>    
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                        <i className='pi pi-percentage'></i>
                                        <InputText  type="text" 
                                        value="" onChange="" />  
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
                                            value="" onChange="" />  
                                        </div> 
                                </td>    
                                <td>

                                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  type="text" 
                                            value="" onChange="" />  
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
                                        <h5 style={{textAlign:'right', padding:'1rem'}}>Cap 2000 <i className="pi pi-arrow-up"></i></h5>                                                                        

                                </td>   
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-dollar'></i>
                                            <InputText  type="text" 
                                            value="" onChange="" />  
                                    </div> 
                                </td>  
                                <td>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                            <i className='pi pi-percentage'></i>
                                            <InputText  type="text" 
                                            value="" onChange="" />  
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
