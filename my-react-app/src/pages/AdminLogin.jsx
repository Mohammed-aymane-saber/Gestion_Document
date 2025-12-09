import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        identifiant: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/admin/login', formData);
            localStorage.setItem('admin_token', response.data.data.token);
            localStorage.setItem('admin_user', JSON.stringify(response.data.data.admin));
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-lg)',
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)'
        }}>
            <Card glass style={{ maxWidth: '450px', width: '100%' }} className="fade-in">
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%)',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--spacing-lg)',
                        boxShadow: 'var(--shadow-xl)'
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <h2 style={{ color: 'var(--primary-800)', marginBottom: 'var(--spacing-sm)' }}>Espace Administration</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Connectez-vous pour gérer les demandes</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            background: 'var(--danger-light)',
                            color: 'var(--danger)',
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-lg)',
                            fontSize: '0.875rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <Input
                        label="Identifiant"
                        type="text"
                        name="identifiant"
                        value={formData.identifiant}
                        onChange={handleChange}
                        placeholder="Votre identifiant"
                        required
                    />

                    <Input
                        label="Mot de passe"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    <Button type="submit" disabled={loading} fullWidth>
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
