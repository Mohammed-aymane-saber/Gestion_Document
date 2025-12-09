<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Demande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * Authentification de l'administrateur
     */
    public function login(Request $request)
    {
        $request->validate([
            'identifiant' => 'required|string',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('identifiant', $request->identifiant)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Identifiant ou mot de passe incorrect.'
            ], 401);
        }

        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie.',
            'data' => [
                'admin' => [
                    'id' => $admin->id,
                    'identifiant' => $admin->identifiant,
                ],
                'token' => $token,
            ]
        ]);
    }

    /**
     * Déconnexion
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie.'
        ]);
    }

    /**
     * Tableau de bord - Statistiques
     */
    public function dashboard()
    {
        $stats = [
            'total_demandes' => Demande::count(),
            'en_attente' => Demande::where('status', 'en_attente')->count(),
            'validees' => Demande::where('status', 'validee')->count(),
            'rejetees' => Demande::where('status', 'rejetee')->count(),
            'par_type' => [
                'attestation_scolaire' => Demande::where('type_document', 'attestation_scolaire')->count(),
                'attestation_reussite' => Demande::where('type_document', 'attestation_reussite')->count(),
                'releve_notes' => Demande::where('type_document', 'releve_notes')->count(),
                'convention_stage' => Demande::where('type_document', 'convention_stage')->count(),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Liste des demandes avec filtres
     */
    public function getDemandes(Request $request)
    {
        $query = Demande::with(['etudiant', 'attestationScolaire', 'attestationReussite', 'releveNotes', 'conventionStage']);

        // Filtres
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('type_document') && $request->type_document !== 'all') {
            $query->where('type_document', $request->type_document);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('etudiant', function ($q) use ($search) {
                $q->where('apogee', 'like', "%{$search}%")
                  ->orWhere('cin', 'like', "%{$search}%")
                  ->orWhere('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%");
            });
        }

        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->whereBetween('date_demande', [$request->date_debut, $request->date_fin]);
        }

        $demandes = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $demandes
        ]);
    }

    /**
     * Valider une demande
     */
    public function validerDemande(Request $request, $id)
    {
        $demande = Demande::findOrFail($id);

        $demande->update([
            'status' => 'validee',
        ]);

        // TODO: Envoyer email de validation à l'étudiant

        return response()->json([
            'success' => true,
            'message' => 'Demande validée avec succès.',
            'data' => $demande->load('etudiant')
        ]);
    }

    /**
     * Refuser une demande
     */
    public function refuserDemande(Request $request, $id)
    {
        $request->validate([
            'raison' => 'required|string',
        ]);

        $demande = Demande::findOrFail($id);

        $demande->update([
            'status' => 'rejetee',
            // Note: Il faudrait ajouter un champ 'raison_refus' dans la migration
        ]);

        // TODO: Envoyer email de refus à l'étudiant avec la raison

        return response()->json([
            'success' => true,
            'message' => 'Demande refusée.',
            'data' => $demande->load('etudiant')
        ]);
    }

    /**
     * Obtenir les détails d'une demande
     */
    public function getDemandeDetails($id)
    {
        $demande = Demande::with([
            'etudiant',
            'attestationScolaire',
            'attestationReussite',
            'releveNotes',
            'conventionStage'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $demande
        ]);
    }
}
