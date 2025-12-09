import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Select from '../components/Select';
import Input from '../components/Input';

export default function RequestManagement() {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'all',
        type_document: 'all',
        search: ''
    });
    const [selectedDemande, setSelectedDemande] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [refusalReason, setRefusalReason] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        fetchDemandes();
    }, [filters, navigate]);

    const fetchDemandes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.status !== 'all') params.append('status', filters.status);
            if (filters.type_document !== 'all') params.append('type_document', filters.type_document);
            if (filters.search) params.append('search', filters.search);

            const response = await api.get(`/admin/demandes?${params.toString()}`);
            setDemandes(response.data.data.data || []);
        } catch (error) {
            console.error('Error fetching demandes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async () => {
        try {
            if (modalAction === 'valider') {
                await api.put(`/admin/demandes/${selectedDemande.id}/valider`);
            } else if (modalAction === 'refuser') {
                await api.put(`/admin/demandes/${selectedDemande.id}/refuser`, { raison: refusalReason });
            }
            setShowModal(false);
            setSelectedDemande(null);
            setRefusalReason('');
            fetchDemandes();
        } catch (error) {
            console.error('Error performing action:', error);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            en_attente: { bg: 'var(--warning-light)', color: 'var(--warning)', text: 'En attente' },
            validee: { bg: 'var(--success-light)', color: 'var(--success)', text: 'Validée' },
            rejetee: { bg: 'var(--danger-light)', color: 'var(--danger)', text: 'Rejetée' }
        };
        const style = styles[status] || styles.en_attente;
        return (
            <span style={{
                background: style.bg,
                color: style.color,
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: '600'
            }}>
                {style.text}
            </span>
        );
    };

    const getDocumentTypeLabel = (type) => {
        const labels = {
            attestation_scolaire: 'Attestation de scolarité',
            attestation_reussite: 'Attestation de réussite',
            releve_notes: 'Relevé de notes',
            convention_stage: 'Convention de stage'
        };
        return labels[type] || type;
    };

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-2xl)' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <h1>Gestion des Demandes</h1>
                    <Button variant="secondary" onClick={() => navigate('/admin/dashboard')}>
                        ← Retour au tableau de bord
                    </Button>
                </div>

                {/* Filters */}
                <Card glass style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        <Select
                            label="Statut"
                            name="status"
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            options={[
                                { value: 'all', label: 'Tous les statuts' },
                                { value: 'en_attente', label: 'En attente' },
                                { value: 'validee', label: 'Validées' },
                                { value: 'rejetee', label: 'Rejetées' }
                            ]}
                        />
                        <Select
                            label="Type de document"
                            name="type_document"
                            value={filters.type_document}
                            onChange={(e) => setFilters(prev => ({ ...prev, type_document: e.target.value }))}
                            options={[
                                { value: 'all', label: 'Tous les types' },
                                { value: 'attestation_scolaire', label: 'Attestation de scolarité' },
                                { value: 'attestation_reussite', label: 'Attestation de réussite' },
                                { value: 'releve_notes', label: 'Relevé de notes' },
                                { value: 'convention_stage', label: 'Convention de stage' }
                            ]}
                        />
                        <Input
                            label="Rechercher"
                            name="search"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            placeholder="Apogée, CIN, Nom..."
                        />
                    </div>
                </Card>

                {/* Demandes List */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div className="pulse">Chargement...</div>
                    </div>
                ) : demandes.length === 0 ? (
                    <Card style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <p>Aucune demande trouvée</p>
                    </Card>
                ) : (
                    <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                        {demandes.map(demande => (
                            <Card key={demande.id} className="fade-in">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-md)' }}>
                                    <div>
                                        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{getDocumentTypeLabel(demande.type_document)}</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            N° {demande.num_demande} • {new Date(demande.date_demande).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    {getStatusBadge(demande.status)}
                                </div>

                                <div style={{ background: 'var(--bg-secondary)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)' }}>
                                    <p><strong>Étudiant:</strong> {demande.etudiant?.nom} {demande.etudiant?.prenom}</p>
                                    <p><strong>Apogée:</strong> {demande.etudiant?.apogee}</p>
                                    <p><strong>Email:</strong> {demande.etudiant?.email}</p>
                                </div>

                                {demande.status === 'en_attente' && (
                                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                        <Button
                                            variant="primary"
                                            onClick={() => {
                                                setSelectedDemande(demande);
                                                setModalAction('valider');
                                                setShowModal(true);
                                            }}
                                        >
                                            ✓ Valider
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => {
                                                setSelectedDemande(demande);
                                                setModalAction('refuser');
                                                setShowModal(true);
                                            }}
                                        >
                                            ✗ Refuser
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'var(--bg-overlay)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: 'var(--spacing-lg)'
                    }} onClick={() => setShowModal(false)}>
                        <Card glass style={{ maxWidth: '500px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>
                                {modalAction === 'valider' ? 'Confirmer la validation' : 'Refuser la demande'}
                            </h3>
                            <p style={{ marginBottom: 'var(--spacing-lg)' }}>
                                {modalAction === 'valider'
                                    ? 'Êtes-vous sûr de vouloir valider cette demande ?'
                                    : 'Veuillez indiquer la raison du refus :'}
                            </p>
                            {modalAction === 'refuser' && (
                                <Input
                                    label="Raison du refus"
                                    name="raison"
                                    value={refusalReason}
                                    onChange={(e) => setRefusalReason(e.target.value)}
                                    placeholder="Expliquez la raison..."
                                    required
                                />
                            )}
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                                <Button variant="ghost" onClick={() => setShowModal(false)} fullWidth>
                                    Annuler
                                </Button>
                                <Button
                                    variant={modalAction === 'valider' ? 'primary' : 'danger'}
                                    onClick={handleAction}
                                    fullWidth
                                    disabled={modalAction === 'refuser' && !refusalReason}
                                >
                                    Confirmer
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
