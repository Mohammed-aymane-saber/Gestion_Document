import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        fetchStats();
    }, [navigate]);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            setStats(response.data.data);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('admin_token');
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="pulse" style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>⏳</div>
                    <p>Chargement...</p>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, color, icon }) => (
        <Card className="fade-in" hover style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>{icon}</div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color, marginBottom: 'var(--spacing-sm)' }}>{value}</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{title}</p>
        </Card>
    );

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-2xl)' }}>
            <div className="container">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <div>
                        <h1 className="fade-in">Tableau de Bord</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Vue d'ensemble des demandes</p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <Button variant="secondary" onClick={() => navigate('/admin/demandes')}>
                            Gérer les demandes
                        </Button>
                        <Button variant="danger" onClick={handleLogout}>
                            Déconnexion
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-xl)',
                    marginBottom: 'var(--spacing-2xl)'
                }}>
                    <StatCard title="Total des demandes" value={stats?.total_demandes || 0} color="var(--primary-600)" icon="📊" />
                    <StatCard title="En attente" value={stats?.en_attente || 0} color="var(--warning)" icon="⏳" />
                    <StatCard title="Validées" value={stats?.validees || 0} color="var(--success)" icon="✅" />
                    <StatCard title="Rejetées" value={stats?.rejetees || 0} color="var(--danger)" icon="❌" />
                </div>

                {/* Document Types */}
                <Card glass className="slide-in">
                    <h2 style={{ marginBottom: 'var(--spacing-xl)', color: 'var(--primary-700)' }}>Répartition par type de document</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        {[
                            { key: 'attestation_scolaire', label: 'Attestations de scolarité', icon: '📜' },
                            { key: 'attestation_reussite', label: 'Attestations de réussite', icon: '🎓' },
                            { key: 'releve_notes', label: 'Relevés de notes', icon: '📝' },
                            { key: 'convention_stage', label: 'Conventions de stage', icon: '💼' }
                        ].map(type => (
                            <div key={type.key} style={{
                                padding: 'var(--spacing-lg)',
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                                transition: 'all var(--transition-base)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--primary-50)';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-secondary)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}>
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>{type.icon}</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary-700)', marginBottom: 'var(--spacing-xs)' }}>
                                    {stats?.par_type?.[type.key] || 0}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{type.label}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
