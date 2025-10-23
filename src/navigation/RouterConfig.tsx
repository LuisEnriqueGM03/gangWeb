import { Routes, Route, Navigate } from 'react-router-dom';
import { URLS } from './CONSTANTS';
import HomePage from '../pages/homePage';
import MapaPage from '../pages/mapa/mapaPage';
import PawnShopPage from '../pages/pawnShopPage';
import RobosPage from '../pages/robosPage';
import ListaMinijuegos from '../pages/ListaMinijuegos';
import CajaRegistradoraPage from '../pages/cajaRegistradoraPage';
import BuscaminasPage from '../pages/BuscaminasPage';
import DescruzarCablesPage from '../pages/DescruzarCablesPage';

const RouterConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={URLS.HOMEPAGE} replace />} />
      <Route path={URLS.HOMEPAGE} element={<HomePage />} />
      <Route path={URLS.MAPA} element={<MapaPage />} />
      <Route path={URLS.PAWNSHOP} element={<PawnShopPage />} />
      <Route path={URLS.ROBOS} element={<RobosPage />} />
      <Route path={URLS.MINIJUEGOS} element={<ListaMinijuegos />} />
      <Route path={URLS.CAJA_REGISTRADORA} element={<CajaRegistradoraPage />} />
      <Route path={URLS.BUSCAMINAS} element={<BuscaminasPage />} />
      <Route path={URLS.DESCRUZAR_CABLES} element={<DescruzarCablesPage />} />
    </Routes>
  );
};

export default RouterConfig;
