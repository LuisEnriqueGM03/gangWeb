import { Routes, Route, Navigate } from 'react-router-dom';
import { URLS } from './CONSTANTS';
import HomePage from '../pages/homePage';
import MapaPage from '../pages/mapa/mapaPage';

const RouterConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={URLS.HOMEPAGE} replace />} />
      <Route path={URLS.HOMEPAGE} element={<HomePage />} />
      <Route path={URLS.MAPA} element={<MapaPage />} />
    </Routes>
  );
};

export default RouterConfig;
