<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

final class MainController extends AbstractController
{
    #[Route('/main', name: 'app_main')]
    public function index(SessionInterface $session): Response
    {
        return $this->render('main/index.html.twig', [
            'controller_name' => 'MainController',
            'user_email' => $session->get('user_email'),
        ]);
    }

    #[Route('/secret', name: 'app_secret')]
    public function secret(): Response
    {
        return $this->render('main/secret.html.twig');
    }
}
