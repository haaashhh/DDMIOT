import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';

// Placeholder pages for now
const ServersPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900">Page Serveurs</h1>
    <p className="text-gray-600 mt-2">En cours de développement...</p>
  </div>
);

const AlertsPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900">Page Alertes</h1>
    <p className="text-gray-600 mt-2">En cours de développement...</p>
  </div>
);

const NetworkPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900">Page Réseau</h1>
    <p className="text-gray-600 mt-2">En cours de développement...</p>
  </div>
);

const RacksPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900">Page Racks</h1>
    <p className="text-gray-600 mt-2">En cours de développement...</p>
  </div>
);

const ReportsPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900">Page Rapports</h1>
    <p className="text-gray-600 mt-2">En cours de développement...</p>
  </div>
);

const SettingsPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900">Page Paramètres</h1>
    <p className="text-gray-600 mt-2">En cours de développement...</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="servers" element={<ServersPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="network" element={<NetworkPage />} />
            <Route path="racks" element={<RacksPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;