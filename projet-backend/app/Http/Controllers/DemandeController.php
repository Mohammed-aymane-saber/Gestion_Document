<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\Etudiant;
use App\Models\AttestationScolaire;
use App\Models\AttestationReussite;
use App\Models\ReleveNotes;
use App\Models\ConventionStage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DemandeController extends Controller
{
    /**
     * Créer une nouvelle demande de document
     */
    public function store(Request $request)
    {
        // Validation des données de base
        $validated = $request->validate([
            'email' => 'required|email',
            'apogee' => 'required|string',
            'cin' => 'required|string',
            'type_document' => 'required|in:attestation_scolaire,attestation_reussite,releve_notes,convention_stage',
        ]);

        // Vérifier que l'étudiant existe avec ces informations
        $etudiant = Etudiant::where('email', $validated['email'])
            ->where('apogee', $validated['apogee'])
            ->where('cin', $validated['cin'])
            ->first();

        if (!$etudiant) {
            return response()->json([
                'success' => false,
                'message' => 'Les informations fournies ne correspondent à aucun étudiant enregistré.'
            ], 404);
        }

        try {
            DB::beginTransaction();

            // Générer un numéro de demande unique
            $numDemande = 'DEM-' . strtoupper(Str::random(8)) . '-' . date('Ymd');

            // Créer la demande
            $demande = Demande::create([
                'etudiant_id' => $etudiant->id,
                'type_document' => $validated['type_document'],
                'num_demande' => $numDemande,
                'date_demande' => now(),
                'status' => 'en_attente',
            ]);

            // Créer les détails spécifiques selon le type de document
            $this->createDocumentDetails($demande, $request, $validated['type_document']);

            DB::commit();

            // TODO: Envoyer un email de confirmation
            
            return response()->json([
                'success' => true,
                'message' => 'Votre demande a été enregistrée avec succès.',
                'data' => [
                    'num_demande' => $numDemande,
                    'type_document' => $validated['type_document'],
                    'date_demande' => $demande->date_demande->format('d/m/Y'),
                    'status' => 'En attente de traitement',
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'enregistrement de votre demande.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer les détails spécifiques du document
     */
    private function createDocumentDetails(Demande $demande, Request $request, string $type)
    {
        switch ($type) {
            case 'attestation_scolaire':
                $request->validate([
                    'niveau' => 'required|string',
                    'filiere' => 'required|string',
                    'annee_universitaire' => 'required|string',
                ]);
                
                AttestationScolaire::create([
                    'demande_id' => $demande->id,
                    'niveau' => $request->niveau,
                    'filiere' => $request->filiere,
                    'annee_universitaire' => $request->annee_universitaire,
                ]);
                break;

            case 'attestation_reussite':
                $request->validate([
                    'filiere' => 'required|string',
                    'annee_universitaire' => 'required|string',
                    'cycle' => 'required|string',
                    'session' => 'required|in:Normale,Rattrapage',
                    'type_releve' => 'required|string',
                ]);
                
                AttestationReussite::create([
                    'demande_id' => $demande->id,
                    'filiere' => $request->filiere,
                    'annee_universitaire' => $request->annee_universitaire,
                    'cycle' => $request->cycle,
                    'session' => $request->session,
                    'type_releve' => $request->type_releve,
                ]);
                break;

            case 'releve_notes':
                $request->validate([
                    'semestre' => 'required|string',
                    'annee_universitaire' => 'required|string',
                ]);
                
                ReleveNotes::create([
                    'demande_id' => $demande->id,
                    'semestre' => $request->semestre,
                    'annee_universitaire' => $request->annee_universitaire,
                ]);
                break;

            case 'convention_stage':
                $request->validate([
                    'date_debut' => 'required|date',
                    'date_fin' => 'required|date|after:date_debut',
                    'entreprise' => 'required|string',
                    'adresse_entreprise' => 'required|string',
                    'email_encadrant' => 'required|email',
                    'telephone_encadrant' => 'required|string',
                    'encadrant_entreprise' => 'required|string',
                    'encadrant_pedagogique' => 'required|string',
                    'fonction_encadrant' => 'required|string',
                    'sujet' => 'required|string',
                ]);
                
                ConventionStage::create([
                    'demande_id' => $demande->id,
                    'date_debut' => $request->date_debut,
                    'date_fin' => $request->date_fin,
                    'entreprise' => $request->entreprise,
                    'adresse_entreprise' => $request->adresse_entreprise,
                    'email_encadrant' => $request->email_encadrant,
                    'telephone_encadrant' => $request->telephone_encadrant,
                    'encadrant_entreprise' => $request->encadrant_entreprise,
                    'encadrant_pedagogique' => $request->encadrant_pedagogique,
                    'fonction_encadrant' => $request->fonction_encadrant,
                    'sujet' => $request->sujet,
                ]);
                break;
        }
    }
}
