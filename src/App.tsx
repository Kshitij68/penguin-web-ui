import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

// PAGES
import Reports from './pages/Reports/Reports';
import Dashboard from './pages/Dashboard/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';

// CONTEXT
import { DataProvider } from './context/DataContext';

// CSS
import './App.scss';

interface RouteItem {
    route: string;
    label: string;
}

const ROUTES: Array<RouteItem> = [
    { route: "/", label: "Dashboard" },
    { route: "/reports", label: "Reports" },
]

const App: React.FC = () => {
    return (
        <DataProvider>
            <HashRouter>
                <div className="container">
                    <Sidebar routes={ROUTES} />
                    <div>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/reports" element={<Reports />} />
                        </Routes>
                    </div>
                </div>
            </HashRouter>
        </DataProvider>
    );
};

export default App;
