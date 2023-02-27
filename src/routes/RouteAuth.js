import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MenuPrincipal } from '../pages/MenuPrincipal';
import ActividadesApoyoDocente from '../pages/Orozco/ActividadesApoyoDocente';
import DocumentosGrupos from '../pages/Orozco/DocumentosGrupos';
import GestionDocencia from '../pages/Orozco/GestionDocencia';
import ProductosDocencia from '../pages/Orozco/ProductosDocencia';
import Grupos from '../pages/Orozco/Grupos';
import ProductosDesTecnologico from '../pages/Orozco/ProductosDesTecnologico';
import BreadCrumb from '../components/Orozco/BreadCrumb';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import './SpeedDial.css'
import Footer from '../components/Footer';
import PeriodosSecretaria from '../pages/Orozco/PeriodosSecretaria';
import GestionDocentesSecretaria from '../pages/Orozco/GestionDocentesSecretaria';
import SeleccionGrupos from '../pages/Orozco/SeleccionGrupos';
import SeleccionActividadesApoyo from '../pages/Orozco/SeleccionActividadesApoyo';
import PeriodosDocente from '../pages/Orozco/PeriodosDocente';
import { BreadCrumbProvider } from '../context/BreadCrumbContext';
import SpeedDialAdicionalesRoles from './SpeedDialAdicionalesRoles';
import ParticipacionCapacitaciones from '../pages/Orozco/ParticipacionCapacitaciones';
import CapacitacionesDocentes from '../pages/Orozco/CapacitacionesDocentes';
import EncuestasParticipantes from '../pages/Orozco/EncuestasParticipantes';
import DocumentosCapacitacionesDocentes from '../pages/Orozco/DocumentosCapacitacionesDocentes';
import PeriodosDesarrolloAcademico from '../pages/Orozco/PeriodosDesarrolloAcademico';
import DepartamentosDesarrolloAcademico from '../pages/Orozco/DepartamentosDesarrolloAcademico';
import CapacitacionesDesarrolloAcademico from '../pages/Orozco/CapacitacionesDesarrolloAcademico';
import GestionDocentes from '../pages/Alonso/JefeProyectosDocencia/GestionDocentes';
import GruposDocente from '../pages/Alonso/JefeProyectosDocencia/GruposDocente';
import ActividadesDocencia from '../pages/Alonso/JefeProyectosDocencia/ActividadesDocencia';
import SeguimientoAula from '../pages/Alonso/JefeProyectosDocencia/SeguimientoAula';
import DocumentosGrupo from '../pages/Alonso/JefeProyectosDocencia/DocumentosGrupo';
import PeriodosJefeLab from '../pages/Alonso/JefeLaboratorio/PeriodosJefeLab';
import GestionLaboratorio from '../pages/Alonso/JefeLaboratorio/GestionLaboratorio';
import SolicitudesLaboratorio from '../pages/Alonso/JefeLaboratorio/SolicitudesLaboratorio';
import DocumentosLaboratorio from '../pages/Alonso/JefeLaboratorio/DocumentosLaboratorio';
import PeriodosAuxiliar from '../pages/Alonso/AuxiliardeLaboratorio/PeriodosAuxiliar';
import AGestionAuxiliar from '../pages/Alonso/AuxiliardeLaboratorio/AGestionAuxiliar';
import ASolicitudes from '../pages/Alonso/AuxiliardeLaboratorio/ASolicitudes';
import OcupacionLaboratorio from '../pages/Alonso/AuxiliardeLaboratorio/OcupacionLaboratorio';
import PeriodosInvestigacion from '../pages/Fernando/PeriodosInvestigacion';
import ConvocatoriasInv from '../pages/Fernando/ConvocatoriasInv';
import EstadisticoDocencia from '../pages/Fernando/EstadisticoDocencia';
import RetroalimentacionDocencia from '../pages/Fernando/RetroalimentacionDocencia';
import EstadisticoTecnologico from '../pages/Fernando/EstadisticoTecnologico';
import RetroalimentacionTecnologico from '../pages/Fernando/RetroalimentacionTecnologico';
import DepCatalogoSecre from '../pages/Fernando/DepCatalogoSecre';
import GestionCatalogoCursos from '../pages/Fernando/GestionCatalogoCursos';
import IntanciasGestionCatalogo from '../pages/Fernando/IntanciasGestionCatalogo';
import DocumentosCapacitacionesDesarrollo from '../pages/Orozco/DocumentosCapacitacionesDesarrollo';
import ParticipantesDesarrollo from '../pages/Orozco/ParticipantesDesarrollo';
import DesarrolloAcademicoJefeDepartamento from '../pages/Orozco/DesarrolloAcademicoJefeDepartamento';
import CapacitacionesJefeDepartamento from '../pages/Orozco/CapacitacionesJefeDepartamento';
import PeriodosDocencia from '../pages/Alonso/JefeProyectosDocencia/PeriodosDocencia';
import ServicioDepSec from '../pages/Fernando/ServicioDepSec';
import DepServicioSocial from '../pages/Fernando/DepServicioSocial';
import ServicioInstancias from '../pages/Fernando/ServicioInstancias';
import DocumentosSocial from '../pages/Fernando/DocumentosSocial';
import PeriodosVisitas from '../pages/Fernando/PeriodosVisitas';
import DepVisitas from '../pages/Fernando/DepVisitas';
import DocVisitasCount from '../pages/Fernando/DocVisitasCount';
import VisitaUsuario from '../pages/Fernando/VisitaUsuario';
import InnDepartamentos from '../pages/Fernando/InnDepartamentos';
import Innovacion from '../pages/Fernando/Innovacion';
import DocumentosVisitas from '../pages/Fernando/DocumentosVisitas';
import MenuJefeVinculacion from '../pages/Fernando/MenuJefeVinculacion';
import RolesInicio from '../pages/Fernando/RolesInicio';
import UsuariosVinculacionGestion from '../pages/Fernando/UsuariosVinculacion';
import DepsMensajes from '../pages/Fernando/DepsMensajes';
import GestionMensajes from '../pages/Fernando/GestionMensajes';
import ServicioInstanciasJefe from '../pages/Fernando/ServiciosIntanciasJefe';
import DocumentosSocialJefe from '../pages/Fernando/DocumentosSocialJefe';
import VisitasJefeUsuario from '../pages/Fernando/VisitasJefeUsuario';
import DocumentosVisitasJefe from '../pages/Fernando/DocumentosVisitasJefe';
import DepCatalogoJefe from '../pages/Fernando/DepCatalogoJefe';
import CatalogoEstadistica from '../pages/Fernando/CatalogoEstadistica';
import ExpCatalogo from '../pages/Fernando/ExpCatalogo';
import CatalogoDatos from '../pages/Fernando/CatalogoDatos';
import MenuJefeDep from '../pages/Josean/MenuJefeDep';
import Usuarios from '../pages/Josean/Usuarios';
import Laboratorios from '../pages/Josean/Laboratorios';
import SeleccionPeriodos from '../pages/Josean/SeleccionPeriodosDoc';
import DocumentosLaboratorioJ from '../pages/Josean/DocumentosLaboratorio';
import Formatos from '../pages/Josean/Formatos';
import Actividades from '../pages/Josean/Actividades';
import Catalogo from '../pages/Josean/Catalogo';
import Vinculacion from '../pages/Josean/Vinculacion';
import AsesoresServicio from '../pages/Josean/AsesoresServicio';
import AlumnosServicio from '../pages/Josean/AlumnosServicio';
import DocumentosSocialJA from '../pages/Josean/DocumentosSocial';
import VisitasEmpresas from '../pages/Josean/VisitasEmpresas';
import VisitasDocente from '../pages/Josean/VisitasDocente';
import DocumentosVisitasJA from '../pages/Josean/DocumentosVisitas';
import GestionMensajesJA from '../pages/Josean/GestionMensajes';
import Carreras from '../pages/Josean/Carreras';

//ramon
import SoporteInstitucional from '../pages/Ramon/SoporteInstitucional';
import LiderazgoInstitucional from '../pages/Ramon/LiderazgoInstitucional';
import ProgramaEducativo from '../pages/Ramon/ProgramaEducativo';

const cookies = new Cookies();

const RouteAuth = () => {
    const navigate = new useNavigate();

    useEffect(() => {
        if(!cookies.get('idUsuario')){
            navigate('/');
        }
    }, []);

    return <div>
        <BreadCrumbProvider>
        <BreadCrumb/>
        <div style={{ marginTop: '135px' }}></div>
          <Routes>
              <Route  path="/menu" element={<MenuPrincipal/>}/>

              {/*  Rutas Docencia */}
              <Route  path="/gestiondocencia" element={<PeriodosDocente/>}/>
              <Route  path="/menudocencia/:idPeriodo" element={<GestionDocencia/>}/>
              <Route  path="/grupos/:iddocper" element={<Grupos/>}/>
              <Route  path="/documentosgrupos/:idGrupo" element={<DocumentosGrupos/>}/>
              <Route  path="/actividadesapoyo/:iddocper" element={<ActividadesApoyoDocente/>}/>
              <Route  path="/productosdocencia/:iddocper" element={<ProductosDocencia/>}/>
              <Route  path="/productosdesarrollo/:iddocper" element={<ProductosDesTecnologico/>}/>
              <Route  path="/participacioncapacitaciones/:idPeriodo" element={<ParticipacionCapacitaciones/>}/>
              <Route  path="/capacitacionesimpartidas/:idPeriodo" element={<CapacitacionesDocentes/>}/>
              <Route  path="/encuestasparticipantes/:idCapacitacion" element={<EncuestasParticipantes/>}/>
              <Route  path="/documentoscapdocentes/:idCapacitacion" element={<DocumentosCapacitacionesDocentes/>}/>

              {/*  Rutas Secretaria */}
              <Route  path="/periodosecretaria" element={<PeriodosSecretaria/>}/>
              <Route  path="/gestiondocentes/:idPeriodo" element={<GestionDocentesSecretaria/>}/>
              <Route  path="/gruposdocente/:id_docper" element={<SeleccionGrupos/>}/>
              <Route  path="/actividadesdocente/:id_docper" element={<SeleccionActividadesApoyo/>}/>

              {/*  Desarrollo Académico */}
              <Route  path="/periodosdesarrollo" element={<PeriodosDesarrolloAcademico/>}/>
              <Route  path="/departamentosdesarrollo/:id_desarrollo" element={<DepartamentosDesarrolloAcademico/>}/>
              <Route  path="/capacitacionesdesarrollo/:iddepdesa" element={<CapacitacionesDesarrolloAcademico/>}/>
              <Route  path="/documentoscapdesarrollo/:idCapacitacion" element={<DocumentosCapacitacionesDesarrollo/>}/>
              <Route  path="/participantesdesarrollo/:idCapacitacion" element={<ParticipantesDesarrollo/>}/>

              {/*  Capacitaciones Jefe Departamento */}
              <Route  path="/periodoscapacitacionesdep" element={<DesarrolloAcademicoJefeDepartamento/>}/>
              <Route  path="/capacitacionesjefedep/:iddepdesa" element={<CapacitacionesJefeDepartamento/>}/>

              {/*ramon rutas */}
              <Route  path="/soporteinstitucional" element={<SoporteInstitucional/>}/>
              <Route  path="/soporteinstitucional/liderazgoinstitucional" element={<LiderazgoInstitucional/>}/>
              <Route  path="/soporteinstitucional/liderazgoinstitucional/programaeducativo" element={<ProgramaEducativo/>}/>

              {/*  Jefe de Proyectos de Docencia */}
              <Route  path="/periodosjefedocencia" element={<PeriodosDocencia/>}/>
              <Route  path="/gestionjefedocencia" element={<GestionDocentes/>}/>
              <Route  path="/gruposjefedocencia/:iddocper" element={<GruposDocente/>}/>
              <Route  path="/actividadesjefedocencia/:iddocper" element={<ActividadesDocencia/>}/>
              <Route  path="/seguimientojefedocencia/:iddocper" element={<SeguimientoAula/>}/>
              <Route  path="/documentosjefedocencia/:iddocper/:idgrupo" element={<DocumentosGrupo/>}/>

              {/*  Jefe de Laboratorio */}
              <Route  path="/gestionjefelaboratorio" element={<PeriodosJefeLab/>}/>
              <Route  path="/laboratoriosjefe/:idPeriodo" element={<GestionLaboratorio/>}/>
              <Route  path="/solicitudesjefelaboratorio/:idlab/:gestlab" element={<SolicitudesLaboratorio/>}/>
              <Route  path="/documentosjefelaboratorio/:idlab/:gestlab" element={<DocumentosLaboratorio/>}/>

              {/*  Auxiliar de Laboratorio */}
              <Route  path="/gestionauxiliarlab" element={<PeriodosAuxiliar/>}/>
              <Route  path="/laboratoriosauxiliar/:idPeriodo" element={<AGestionAuxiliar/>}/>
              <Route  path="/solicitudesauxiliarlaboratorio/:idlab/:gestlab" element={<ASolicitudes/>}/>
              <Route  path="/ocupacionlaboratorio/:idlab/:gestlab" element={<OcupacionLaboratorio/>}/>

              {/*  Jefe de Investigación de Proyectos */}
              <Route  path="/periodosjefeinvestigacion" element={<PeriodosInvestigacion/>}/>
              <Route  path="/convocatorias/:idPeriodo" element={<ConvocatoriasInv/>}/>
              <Route  path="/estadisticodocencia/:idPeriodo" element={<EstadisticoDocencia/>}/>
              <Route  path="/retrodocencia/:nombreusuario/:iddocper" element={<RetroalimentacionDocencia/>}/>
              <Route  path="/estadisticotecnologico/:idPeriodo" element={<EstadisticoTecnologico/>}/>
              <Route  path="/retrotecnologico/:nombreusuario/:iddocper" element={<RetroalimentacionTecnologico/>}/>

              {/*  Jefe de Oficina Servicios Externos V */}
              <Route  path="/serviciosexternos" element={<DepCatalogoSecre/>}/>
              <Route  path="/gestioncursosvinculacion/:depName/:idActiv" element={<GestionCatalogoCursos/>}/>
              <Route  path="/instanciascursos/:idCurso" element={<IntanciasGestionCatalogo/>}/>

              {/*  Jefe de Oficina Servicio Social y D. C. V */}
              <Route  path="/periodosocial" element={<ServicioDepSec usuario = {0} />}/>
              <Route  path="/departamentosocial/:idPeriodo" element={<DepServicioSocial usuario = {0}/>}/>
              <Route  path="/departamentosocial/:depRegistro/:iddep" element={<ServicioInstancias/>}/>
              <Route  path="/documentosalumno/:depRegistro/:nombreA/:idserv" element={<DocumentosSocial/>}/>

              {/*  Secretaria de Vinculación */}
              <Route  path="/periodosvisitas" element={<PeriodosVisitas dif = {0}/>}/>
              <Route  path="/departamentosvisitas" element={<DepVisitas dif = {0}/>}/>
              <Route  path="/visitasdocente/:titulo/:iddep" element={<DocVisitasCount dif = {0}/>}/>
              <Route  path="/docentevisita/:idreg/:titulo/:nom/:iddep" element={<VisitaUsuario/>}/>
              <Route  path="/documentosvisita/:depRegistro/:nombreA/:idvis" element={<DocumentosVisitas/>}/>

              {/*  Jefe Vinculación */}
              <Route  path="/menuvinculacion" element={<MenuJefeVinculacion/>}/>
	      <Route  path="/innovacion" element={<InnDepartamentos/>}/>
	      <Route  path="/proyectosinnovacion/:depName/:idDep" element={<Innovacion/>}/>

                {/*  Roles */}
                <Route  path="/rolesvinculacion" element={<RolesInicio/>}/>
                <Route  path="/usuariosvinculacion" element={<UsuariosVinculacionGestion/>}/>

                {/*  Mensajes */}
                <Route  path="/mensajesvinculacion" element={<DepsMensajes/>}/>
                <Route  path="/gestionmensajes/:iddep/:nombredep" element={<GestionMensajes/>}/>

                {/*  Servicio Social */}
                <Route  path="/socialjefe" element={<ServicioDepSec usuario = {1} />}/>
                <Route  path="/departamentosocialjefe/:idPeriodo" element={<DepServicioSocial usuario = {1}/>}/>
                <Route  path="/instanciasocialjefe/:depRegistro/:iddep" element={<ServicioInstanciasJefe/>}/>
                <Route  path="/documentosocialjefe/:depRegistro/:nombreA/:idserv" element={<DocumentosSocialJefe/>}/>

                {/*  Visitas */}
                <Route  path="/periodosvisitasjefe" element={<PeriodosVisitas dif = {1}/>}/>
                <Route  path="/departamentosvisitasjefe" element={<DepVisitas dif = {1}/>}/>
                <Route  path="/visitasdocentejefe/:titulo/:iddep" element={<DocVisitasCount dif = {1}/>}/>
                <Route  path="/docentevisitajefe/:idreg/:titulo/:nom/:iddep" element={<VisitasJefeUsuario/>}/>
                <Route  path="/documentosvisitajefe/:depRegistro/:nombreA/:idvis" element={<DocumentosVisitasJefe/>}/>

                {/*  Cursos Externos */}
                <Route  path="/departamentoscursosjefe" element={<DepCatalogoJefe/>}/>
                <Route  path="/estadisticacursosjefe/:depName/:iddep" element={<CatalogoEstadistica/>}/>
                <Route  path="/exportarcursos/:depName/:iddep" element={<ExpCatalogo/>}/>
                <Route  path="/infocursos/:depName/:idcurso" element={<CatalogoDatos/>}/>
            
              {/*  Jefe Departamento */}
              <Route  path="/menudepartamental" element={<MenuJefeDep/>}/>

              <Route  path="/usuarios" element={<Usuarios/>}/>

              <Route  path="/laboratorios" element={<Laboratorios/>}/>
              <Route  path="/periodosgestionlab/:idlab" element={<SeleccionPeriodos/>}/>
              <Route  path="/documentoslabdep/:idlab/:idges" element={<DocumentosLaboratorioJ/>}/>

              <Route  path="/formatos" element={<Formatos/>}/>

              <Route  path="/actividadesad" element={<Actividades/>}/>

              <Route  path="/carreras" element={<Carreras/>}/>

              <Route  path="/vinculaciondep" element={<Vinculacion/>}/>
              <Route  path="/serviciosocialdep" element={<AsesoresServicio/>}/>
              <Route  path="/alumnoservicio/:idus" element={<AlumnosServicio/>}/>
              <Route  path="/documentosocialdep/:nombreA/:controlA/:idserv" element={<DocumentosSocialJA/>}/>
              <Route  path="/visitasempresasdep" element={<VisitasEmpresas/>}/>
              <Route  path="/visitasdocentedep/:idus" element={<VisitasDocente/>}/>
              <Route  path="/documentosvisitasdep/:nombreA/:idvis" element={<DocumentosVisitasJA/>}/>

              {/*  Coordinador de Vinculación */}
              <Route  path="/coordinacionviculacion" element={<GestionMensajesJA/>}/>

              <Route  path="/catalogocursos" element={<Catalogo/>}/>

              <Route  path="*" element={<h1>Error 404</h1>}/>
          </Routes>

          <SpeedDialAdicionalesRoles/>

          <div style={{ marginTop: '75px' }}></div>
          <Footer/>
        </BreadCrumbProvider>
    </div>;
};

export default RouteAuth;
