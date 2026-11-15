import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Privacy from './pages/Privacy';

// Tools
import IpTracker from './pages/tools/IpTracker';
import MacRecon from './pages/tools/MacRecon';
import DnsRecon from './pages/tools/DnsRecon';
import SubnetCalculator from './pages/tools/SubnetCalculator';
import PasswordAuditor from './pages/tools/PasswordAuditor';
import CryptoEngine from './pages/tools/CryptoEngine';
import CryptoVault from './pages/tools/CryptoVault';
import FileIntegrity from './pages/tools/FileIntegrity';
import Track from './pages/tools/Track';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* 8 Working Tools */}
        <Route path="/tools/ip-tracker" element={<IpTracker />} />
        <Route path="/tools/mac-recon" element={<MacRecon />} />
        <Route path="/tools/dns-recon" element={<DnsRecon />} />
        <Route path="/tools/subnet-calculator" element={<SubnetCalculator />} />
        <Route path="/tools/password-auditor" element={<PasswordAuditor />} />
        <Route path="/tools/crypto-engine" element={<CryptoEngine />} />
        <Route path="/tools/crypto-vault" element={<CryptoVault />} />
        <Route path="/tools/file-integrity" element={<FileIntegrity />} />
        <Route path="/tools/track" element={<Track />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
