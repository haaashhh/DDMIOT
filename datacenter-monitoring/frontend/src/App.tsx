import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme/theme';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Servers from './pages/Servers';
import Alerts from './pages/Alerts';
import Network from './pages/Network';
import Racks from './pages/Racks';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="servers" element={<Servers />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="network" element={<Network />} />
              <Route path="racks" element={<Racks />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;