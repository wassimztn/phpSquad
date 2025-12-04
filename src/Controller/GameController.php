<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class GameController extends AbstractController
{
    #[Route('/game/dataguardian', name: 'app_game')]
    public function index(): Response
    {
        return $this->render('game/index.html.twig', [
            'controller_name' => 'GameController',
        ]);
    }

    #[Route('/game/highscores', name: 'app_game_highscores')]
    public function highscores(): Response
    {
        // TODO: Récupérer les scores depuis la base de données
        return $this->json([
            'scores' => []
        ]);
    }

    #[Route('/game/save-score', name: 'app_game_save_score', methods: ['POST'])]
    public function saveScore(): Response
    {
        // TODO: Sauvegarder le score en base de données
        return $this->json([
            'success' => true
        ]);
    }
}
