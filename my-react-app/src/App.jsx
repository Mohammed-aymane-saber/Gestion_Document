import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DocumentRequestForm from './pages/DocumentRequestForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import RequestManagement from './pages/RequestManagement';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route par défaut - Formulaire étudiant */}
        <Route path="/" element={<DocumentRequestForm />} />

        {/* Routes admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/demandes" element={<RequestManagement />} />

        {/* Redirection pour routes non trouvées */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
