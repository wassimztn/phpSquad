<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;

class GameController extends AbstractController
{
    #[Route('/game/dataguardian', name: 'app_game')]
    public function index(SessionInterface $session): Response
    {
        // Vérifier que l'utilisateur est connecté
        if (!$session->get('user_id')) {
            $session->set('auth_message', 'Vous devez être connecté pour jouer !');
            return new RedirectResponse($this->generateUrl('app_login'));
        }
        
        return $this->render('game/index.html.twig', [
            'controller_name' => 'GameController',
            'user_email' => $session->get('user_email'),
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
