/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.js';
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { ReportIncidentModal } from './components/ReportIncidentModal.js';

// Pages
import { DashboardPage } from './pages/DashboardPage.js';
import { RoutePlannerPage } from './pages/RoutePlannerPage.js';
import { FreightOptimizerPage } from './pages/FreightOptimizerPage.js';
import { PassengerAccessibilityPage } from './pages/PassengerAccessibilityPage.js';
import { RiskIntelligencePage } from './pages/RiskIntelligencePage.js';
import { EmergencyLogisticsPage } from './pages/EmergencyLogisticsPage.js';
import { ConnectivityIntelligencePage } from './pages/ConnectivityIntelligencePage.js';
import { FleetManagementPage } from './pages/FleetManagementPage.js';
import { AlertsPage } from './pages/AlertsPage.js';
import { AnalyticsPage } from './pages/AnalyticsPage.js';
import { SettingsPage } from './pages/SettingsPage.js';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 antialiased">
          
          {/* Top Command Bar & Global Navbar */}
          <Navbar />

          {/* Main App Body */}
          <div className="flex-1 flex overflow-hidden">
            {/* Nav Sidebar */}
            <div className="hidden md:block">
              <Sidebar />
            </div>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/route-planner" element={<RoutePlannerPage />} />
                <Route path="/freight-optimizer" element={<FreightOptimizerPage />} />
                <Route path="/passenger-accessibility" element={<PassengerAccessibilityPage />} />
                <Route path="/risk-intelligence" element={<RiskIntelligencePage />} />
                <Route path="/emergency-logistics" element={<EmergencyLogisticsPage />} />
                <Route path="/connectivity-intelligence" element={<ConnectivityIntelligencePage />} />
                <Route path="/fleet-management" element={<FleetManagementPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>

          {/* Global Modals */}
          <ReportIncidentModal />

        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
