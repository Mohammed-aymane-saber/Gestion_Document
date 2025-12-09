<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    use HasFactory;

    protected $fillable = [
        'etudiant_id',
        'type_document',
        'num_demande',
        'date_demande',
        'status',
    ];

    protected $casts = [
        'date_demande' => 'date',
    ];

    /**
     * Relation avec l'étudiant
     */
    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }

    /**
     * Relation polymorphique avec les détails du document
     */
    public function attestationScolaire()
    {
        return $this->hasOne(AttestationScolaire::class);
    }

    public function attestationReussite()
    {
        return $this->hasOne(AttestationReussite::class);
    }

    public function releveNotes()
    {
        return $this->hasOne(ReleveNotes::class);
    }

    public function conventionStage()
    {
        return $this->hasOne(ConventionStage::class);
    }

    /**
     * Scope pour filtrer par statut
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope pour filtrer par type de document
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type_document', $type);
    }
}
