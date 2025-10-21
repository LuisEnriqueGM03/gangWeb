import { Routes, Route, Navigate } from 'react-router-dom';
import { URLS } from './CONSTANTS';
import HomePage from '../pages/homePage';
import MapaPage from '../pages/mapa/mapaPage';
import PawnShopPage from '../pages/pawnShopPage';
import RobosPage from '../pages/robosPage';

const RouterConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={URLS.HOMEPAGE} replace />} />
      <Route path={URLS.HOMEPAGE} element={<HomePage />} />
      <Route path={URLS.MAPA} element={<MapaPage />} />
      <Route path={URLS.PAWNSHOP} element={<PawnShopPage />} />
      <Route path={URLS.ROBOS} element={<RobosPage />} />
    </Routes>
  );
};

export default RouterConfig;
