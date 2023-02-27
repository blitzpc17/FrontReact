import React, { useEffect, useContext } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie/es6';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const LiderazgoInstitucional = () => {
    const navigate = new useNavigate();


    


    const cookiedep=cookies.get('id_Departamento');

    const { cambiarBread, actual, direcciones } = useContext(BreadCrumbContext);
    
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
            if(cookies.get('actualTemp') === 'Liderazgo Institucional'){
            }
            else
                navigate('/plataforma/menudepartamental');
        }
      
    }, []);

   

    return ( <div>
        <h1 style={{ textAlign: 'center', paddingBottom: window.screen.width <= 1200 ? '0px' : '40px' }}>LIDERAZGO INSTITUCIONAL</h1>
        <table style={{ width: '100%', textAlign: 'center', wordSpacing: '100' }}>
            <tbody>
              
                        <tr>
                            <td style={{ paddingBottom: '80px' }}><Button label="PROGRAMA EDUCATIVO" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-primary" style={{ width: '350px', height: '70px' }} onClick={ () => cambiarBreadLocal('Programa Educativo', 'soporteinstitucional/liderazgoinstitucional/programaeducativo') }/></td>
                            <td style={{ paddingBottom: '80px' }}><Button label="JEFE DEL PE" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-success" style={{ width: '350px', height: '70px' }} onClick={() => cambiarBreadLocal('Catálogo de Cursos', 'catalogocursos')}/></td>
                            <td style={{ paddingBottom: '80px' }}><Button label="IMPACTO DEL PE Y EGRESADOS" icon="pi pi-chevron-circle-right" className="p-button-lg p-button-help" style={{ width: '350px', height: '70px' }} onClick={ () => cambiarBreadLocal('Laboratorios', 'laboratorios') }/></td>
                         
                        </tr>
                       
                
            
                
            </tbody>
        </table>
    </div>);
  

    

  
};

export default LiderazgoInstitucional;



