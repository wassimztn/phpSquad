<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class 3dController extends AbstractController
{
    #[Route('/3d/dashboard', name: 'app_3d_dashboard')]
    public function index(): Response
    {
        return $this->render('3d/index.html.twig', [
            'controller_name' => '3dController',
        ]);
    }
}
