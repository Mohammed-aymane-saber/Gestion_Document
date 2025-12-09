import { useState } from 'react';
import api from '../services/api';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Card from '../components/Card';

export default function DocumentRequestForm() {
    const [formData, setFormData] = useState({
        email: '',
        apogee: '',
        cin: '',
        type_document: '',
        // Attestation scolaire
        niveau: '',
        filiere: '',
        annee_universitaire: '',
        // Attestation réussite
        cycle: '',
        session: '',
        type_releve: '',
        // Relevé de notes
        semestre: '',
        // Convention de stage
        date_debut: '',
        date_fin: '',
        entreprise: '',
        adresse_entreprise: '',
        email_encadrant: '',
        telephone_encadrant: '',
        encadrant_entreprise: '',
        encadrant_pedagogique: '',
        fonction_encadrant: '',
        sujet: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [responseData, setResponseData] = useState(null);

    const documentTypes = [
        { value: 'attestation_scolaire', label: 'Attestation de scolarité' },
        { value: 'attestation_reussite', label: 'Attestation de réussite' },
        { value: 'releve_notes', label: 'Relevé de notes' },
        { value: 'convention_stage', label: 'Convention de stage' }
    ];

    const niveaux = [
        { value: 'L1', label: 'Licence 1' },
        { value: 'L2', label: 'Licence 2' },
        { value: 'L3', label: 'Licence 3' },
        { value: 'M1', label: 'Master 1' },
        { value: 'M2', label: 'Master 2' }
    ];

    const semestres = [
        { value: 'S1', label: 'Semestre 1' },
        { value: 'S2', label: 'Semestre 2' },
        { value: 'S3', label: 'Semestre 3' },
        { value: 'S4', label: 'Semestre 4' },
        { value: 'S5', label: 'Semestre 5' },
        { value: 'S6', label: 'Semestre 6' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await api.post('/demandes', formData);
            setSuccess(true);
            setResponseData(response.data.data);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: error.response?.data?.message || 'Une erreur est survenue' });
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ minHeight: '100vh', padding: 'var(--spacing-2xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Card glass style={{ maxWidth: '600px', textAlign: 'center' }} className="fade-in">
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>✅</div>
                    <h2 style={{ color: 'var(--success)', marginBottom: 'var(--spacing-lg)' }}>Demande enregistrée avec succès !</h2>
                    <div style={{ background: 'var(--success-light)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-xl)' }}>
                        <p style={{ fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>Numéro de suivi :</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-700)', fontFamily: 'monospace' }}>{responseData?.num_demande}</p>
                    </div>
                    <p style={{ marginBottom: 'var(--spacing-md)' }}>Un email de confirmation a été envoyé à votre adresse.</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Conservez votre numéro de suivi pour suivre l'état de votre demande.</p>
                    <Button onClick={() => { setSuccess(false); setFormData({ email: '', apogee: '', cin: '', type_document: '' }); }} style={{ marginTop: 'var(--spacing-xl)' }}>
                        Faire une nouvelle demande
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', padding: 'var(--spacing-2xl)' }}>
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 className="fade-in" style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        Demande de Document Administratif
                    </h1>

                    <Card glass className="slide-in">
                        <form onSubmit={handleSubmit}>
                            {errors.general && (
                                <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)' }}>
                                    {errors.general}
                                </div>
                            )}

                            <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--primary-700)' }}>Informations personnelles</h3>

                            <Input
                                label="Adresse Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="exemple@universite.ma"
                                required
                                error={errors.email}
                            />

                            <Input
                                label="Numéro Apogée"
                                type="text"
                                name="apogee"
                                value={formData.apogee}
                                onChange={handleChange}
                                placeholder="12345678"
                                required
                                error={errors.apogee}
                            />

                            <Input
                                label="Numéro CIN"
                                type="text"
                                name="cin"
                                value={formData.cin}
                                onChange={handleChange}
                                placeholder="AB123456"
                                required
                                error={errors.cin}
                            />

                            <div style={{ borderTop: '2px solid var(--border-light)', margin: 'var(--spacing-xl) 0', paddingTop: 'var(--spacing-xl)' }}>
                                <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--primary-700)' }}>Type de document</h3>

                                <Select
                                    label="Document demandé"
                                    name="type_document"
                                    value={formData.type_document}
                                    onChange={handleChange}
                                    options={documentTypes}
                                    required
                                    error={errors.type_document}
                                />
                            </div>

                            {/* Champs conditionnels selon le type de document */}
                            {formData.type_document === 'attestation_scolaire' && (
                                <div className="fade-in" style={{ borderTop: '2px solid var(--border-light)', margin: 'var(--spacing-xl) 0', paddingTop: 'var(--spacing-xl)' }}>
                                    <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--primary-700)' }}>Détails de l'attestation</h3>
                                    <Select label="Niveau d'étude" name="niveau" value={formData.niveau} onChange={handleChange} options={niveaux} required />
                                    <Input label="Filière" name="filiere" value={formData.filiere} onChange={handleChange} required />
                                    <Input label="Année universitaire" name="annee_universitaire" value={formData.annee_universitaire} onChange={handleChange} placeholder="2024-2025" required />
                                </div>
                            )}

                            {formData.type_document === 'attestation_reussite' && (
                                <div className="fade-in" style={{ borderTop: '2px solid var(--border-light)', margin: 'var(--spacing-xl) 0', paddingTop: 'var(--spacing-xl)' }}>
                                    <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--primary-700)' }}>Détails de l'attestation</h3>
                                    <Input label="Filière" name="filiere" value={formData.filiere} onChange={handleChange} required />
                                    <Input label="Année universitaire" name="annee_universitaire" value={formData.annee_universitaire} onChange={handleChange} placeholder="2024-2025" required />
                                    <Input label="Cycle" name="cycle" value={formData.cycle} onChange={handleChange} placeholder="Licence, Master..." required />
                                    <Select label="Session" name="session" value={formData.session} onChange={handleChange} options={[{ value: 'Normale', label: 'Normale' }, { value: 'Rattrapage', label: 'Rattrapage' }]} required />
                                    <Input label="Type de relevé" name="type_releve" value={formData.type_releve} onChange={handleChange} placeholder="Normal, Provisoire, Définitif" required />
                                </div>
                            )}

                            {formData.type_document === 'releve_notes' && (
                                <div className="fade-in" style={{ borderTop: '2px solid var(--border-light)', margin: 'var(--spacing-xl) 0', paddingTop: 'var(--spacing-xl)' }}>
                                    <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--primary-700)' }}>Détails du relevé</h3>
                                    <Select label="Semestre" name="semestre" value={formData.semestre} onChange={handleChange} options={semestres} required />
                                    <Input label="Année universitaire" name="annee_universitaire" value={formData.annee_universitaire} onChange={handleChange} placeholder="2024-2025" required />
                                </div>
                            )}

                            {formData.type_document === 'convention_stage' && (
                                <div className="fade-in" style={{ borderTop: '2px solid var(--border-light)', margin: 'var(--spacing-xl) 0', paddingTop: 'var(--spacing-xl)' }}>
                                    <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--primary-700)' }}>Informations sur le stage</h3>
                                    <Input label="Entreprise d'accueil" name="entreprise" value={formData.entreprise} onChange={handleChange} required />
                                    <Input label="Adresse de l'entreprise" name="adresse_entreprise" value={formData.adresse_entreprise} onChange={handleChange} required />
                                    <Input label="Encadrant entreprise" name="encadrant_entreprise" value={formData.encadrant_entreprise} onChange={handleChange} required />
                                    <Input label="Fonction de l'encadrant" name="fonction_encadrant" value={formData.fonction_encadrant} onChange={handleChange} required />
                                    <Input label="Email de l'encadrant" type="email" name="email_encadrant" value={formData.email_encadrant} onChange={handleChange} required />
                                    <Input label="Téléphone de l'encadrant" name="telephone_encadrant" value={formData.telephone_encadrant} onChange={handleChange} required />
                                    <Input label="Encadrant pédagogique" name="encadrant_pedagogique" value={formData.encadrant_pedagogique} onChange={handleChange} required />
                                    <Input label="Sujet du stage" name="sujet" value={formData.sujet} onChange={handleChange} required />
                                    <Input label="Date de début" type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} required />
                                    <Input label="Date de fin" type="date" name="date_fin" value={formData.date_fin} onChange={handleChange} required />
                                </div>
                            )}

                            <Button type="submit" disabled={loading} fullWidth style={{ marginTop: 'var(--spacing-xl)' }}>
                                {loading ? 'Envoi en cours...' : 'Soumettre la demande'}
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
