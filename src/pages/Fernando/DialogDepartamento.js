import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import swal from 'sweetalert';
import { DepartamentoServicio } from '../../services/Fernando/DepartamentoServicio';
const DialogDepartemento = (props) => {

    const [products, setProducts] = useState([]);
    const productService = new DepartamentoServicio();

    
    useEffect(() => {
        productService.getAll().then(data => setProducts(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const [value2, setValue2] = useState('');
    const [selectedCity1, setSelectedCity1] = useState({});
    const [selectedCity2, setSelectedCity2] = useState({});
    const cities = [
        { name: 'Académico', code: '1' },
        { name: 'Vinculación', code: '2' },
        { name: 'Administrativo', code: '3' },
        { name: 'Inactivo', code: '4' }
    ];

    const onCityChange = (e) => {
        setSelectedCity1(e.value);
    }

    const [displayBasic, setDisplayBasic] = useState(true);
    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [position, setPosition] = useState('center');
    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
        'displayBasic2': setDisplayBasic2
    }
    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
        setValue2(''); setSelectedCity1(null);
        objeto.id_Departamento = null;
    }
    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Crear Departamento" icon="pi pi-book" style={{  marginTop: '20px' }}
                onClick={() => {setDisplayBasic2(true); setOvs(1);}} className="p-button-raised" />
            </div>
        );
    }
    const renderFooter2 = (name) => {
        return (
            <div>
                <Button label="Guardar" icon="pi pi-book" onClick={() =>{ 
                    guardar(); onHide(name); setValue2(''); setSelectedCity1(null);
                    }} className="p-button-raised" />
            </div>
        );
    }
    let v;
    const [ovs,setOvs] = useState(0);
    const cambiar=(rowData)=>{
        return (
            <div>
                <Button icon="pi pi-pencil"  className="p-button-rounded p-button-success" onClick={()=>{
                    setOvs(2);
                    objeto.id_Departamento = rowData.id_Departamento;
                    setValue2(rowData.dep_nombre);
                    let cod = '0';
                    if(rowData.dep_creado_por == "Académico"){
                        cod = '1'; 
                    }else{
                        if(rowData.dep_creado_por == "Vinculación"){
                            cod = '2'; setOvs(3);
                        }else{
                            if(rowData.dep_creado_por == "Administrativo"){
                                cod = '3';
                            }else{
                                if(rowData.dep_creado_por == "Inactivo"){
                                    cod = '4';
                                }                                
                            }
                        }                        
                    }   
                    v =    {name:rowData.dep_creado_por,code:cod};         
                    setSelectedCity1(v);                    
                    setDisplayBasic2(true);
                }}/>
            </div>
        );
    }

    const [objeto, setObjeto] = useState({
        id_Departamento:null,
        dep_nombre:null,
        dep_creado_por:null,
        dep_fecha_creacion:null,
        dep_actualizado_por:null,
        dep_fecha_actualizacion:null
    });

    const guardar=async()=>{

        let nombre = "No";
        let tipo = "No";
        if(ovs == 1){
            for(var i=0; i<products.length;i++){
                if(value2 == products[i].dep_nombre){
                    nombre = "Si";
                }
                if(products[i].dep_creado_por == "Vinculación"){
                    tipo = "Si";
                }
            }
            if(tipo == "Si" & selectedCity1.name == "Vinculación"){
                swal({
                    title:"¡Atención!",
                    text:"Ya existe un departamento de Vinculación",
                    icon:"warning",
                    button:"Aceptar",
                    timer:"3000"
                  });
            }else{
                if(nombre == "Si"){
                    swal({
                        title:"¡Atención!",
                        text:"Ya existe el " + value2,
                        icon:"warning",
                        button:"Aceptar",
                        timer:"3000"
                      });
                }else{
                    objeto.dep_nombre = value2;
                    objeto.dep_creado_por = selectedCity1.name;
                    await productService.save(objeto).then(data => {
                        productService.getAll().then(data => setProducts(data));            
                    })
                    swal({
                        title: "¡Atención!",
                        text: "Agregado con Exito!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                    });                
                }
            }
        }

        if(ovs == 2){
            for(var i=0; i<products.length;i++){
                if(products[i].dep_creado_por == "Vinculación"){
                    tipo = "Si";
                }
            }

            if(tipo == "Si" & selectedCity1.name == "Vinculación"){
                swal({
                    title:"¡Atención!",
                    text:"Ya existe un departamento de Vinculación",
                    icon:"warning",
                    button:"Aceptar",
                    timer:"3000"
                  });
            }else{
                objeto.dep_nombre = value2;
                    objeto.dep_creado_por = selectedCity1.name;
                    await productService.save(objeto).then(data => {
                        productService.getAll().then(data => setProducts(data));            
                    })
                    swal({
                        title: "¡Atención!",
                        text: "Agregado con Exito!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                    }); 
            }
        }


        if(ovs == 3){
            objeto.dep_nombre = value2;
                    objeto.dep_creado_por = selectedCity1.name;
                    await productService.save(objeto).then(data => {
                        productService.getAll().then(data => setProducts(data));            
                    })
                    swal({
                        title: "¡Atención!",
                        text: "Agregado con Exito!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                    });             
        }
        
       
          setOvs(0);    
    }
    return(
        <div>
            <Dialog header="Gestión de Departamentos" visible={props.visible} style={{ width: '90vw' }} footer={renderFooter('displayBasic')} onHide={props.onHide}>
                <DataTable value={products} responsiveLayout="scroll">
                    <Column field="id_Departamento" header="#" style={{ width: '10%'}}></Column>
                    <Column field="dep_nombre" header="Nombre" style={{ width: '40%'}}></Column>
                    <Column field="dep_creado_por" header="Tipo" style={{ width: '25%'}}></Column>
                    <Column body={cambiar} header="Características" style={{ width: '25%'}}></Column>
                </DataTable>                    
            </Dialog>

            <Dialog header="Gestión de Departamentos" visible={displayBasic2} style={{ width: '90vw' }} footer={renderFooter2('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <center>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{padding: '1rem', paddingRight: '1rem'}}>
                                    <h5>Nombre departamento:</h5>
                                </td>
                                <td>
                                    <div className="field col-12 md:col-4">
                                        <span className="p-float-label p-input-icon-left">
                                            <i className="pi pi-search" />
                                            <InputText id="lefticon" value={value2} onChange={(e) => setValue2(e.target.value)} style={{ width: '600px'}} maxLength="255"/>
                                            <label htmlFor="lefticon">Nombre del departamento</label>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style={{padding: '1rem', paddingRight: '1rem'}}>
                                    <h5>Tipo:</h5>
                                </td>
                                <td>
                                    <Dropdown value={selectedCity1} options={cities} onChange={(e) => {setSelectedCity1(e.target.value)}} optionLabel="name" placeholder="Seleccione un tipo" style={{ width: '60%'}} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </center>
            </Dialog>
        </div>
    )
}

export default DialogDepartemento;
