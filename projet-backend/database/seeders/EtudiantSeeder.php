<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Etudiant;

class EtudiantSeeder extends Seeder
{
    public function run(): void
    {
        $etudiants = [
            [
                'nom' => 'Alami',
                'prenom' => 'Mohammed',
                'apogee' => '12345678',
                'cin' => 'AB123456',
                'email' => 'mohammed.alami@universite.ma',
                'status' => 'inscrit',
            ],
            [
                'nom' => 'Bennani',
                'prenom' => 'Fatima',
                'apogee' => '87654321',
                'cin' => 'CD789012',
                'email' => 'fatima.bennani@universite.ma',
                'status' => 'inscrit',
            ],
            [
                'nom' => 'Idrissi',
                'prenom' => 'Youssef',
                'apogee' => '11223344',
                'cin' => 'EF345678',
                'email' => 'youssef.idrissi@universite.ma',
                'status' => 'inscrit',
            ],
            [
                'nom' => 'Tazi',
                'prenom' => 'Amina',
                'apogee' => '55667788',
                'cin' => 'GH901234',
                'email' => 'amina.tazi@universite.ma',
                'status' => 'inscrit',
            ],
            [
                'nom' => 'Fassi',
                'prenom' => 'Karim',
                'apogee' => '99887766',
                'cin' => 'IJ567890',
                'email' => 'karim.fassi@universite.ma',
                'status' => 'diplômé',
            ],
        ];

        foreach ($etudiants as $etudiant) {
            Etudiant::create($etudiant);
        }
    }
}
