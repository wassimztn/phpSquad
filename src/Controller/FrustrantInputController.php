<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class FrustrantInputController extends AbstractController
{
    #[Route('/frustrant_input', name: 'app_frustrant_input')]
    public function index(Request $request): Response
    {
        $submitted = false;
        $result = null;

        if ($request->isMethod('POST')) {
            $date = $request->request->get('date_naissance');

            // Valide que la date a exactement 8 chiffres (JJMMYYYY)
            if (!$date || strlen($date) !== 8 || !ctype_digit($date)) {
                $result = "❌ Erreur : La date doit être au format JJMMYYYY (8 chiffres).";
            } else {
                // Valide la date (jour 01-31, mois 01-12)
                $day = (int)substr($date, 0, 2);
                $month = (int)substr($date, 2, 2);
                $year = (int)substr($date, 4, 4);

                if ($day < 1 || $day > 31 || $month < 1 || $month > 12) {
                    $result = "❌ Erreur : Date invalide (jour ou mois incorrect).";
                } else {
                    // ✅ Date valide !
                    $submitted = true;
                    $formattedDate = sprintf('%02d/%02d/%04d', $day, $month, $year);
                    $result = "🎉 Bravo ! Vous avez réussi à saisir votre date de naissance ($formattedDate) ! Vous avez survécu au champ le plus frustrant du web ! 🎊";
                }
            }
        }

        // Récupère la liste des vidéos dans public/videos pour la passer au template
        $projectDir = $this->getParameter('kernel.project_dir');
        $videoDir = $projectDir . '/public/videos';
        $videos = [];
        if (is_dir($videoDir)) {
            $files = scandir($videoDir);
            foreach ($files as $file) {
                if (is_file($videoDir . '/' . $file)) {
                    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                    if (in_array($ext, ['mp4', 'webm', 'ogg'])) {
                        $videos[] = $file; // basename only, used with asset('videos/'+file)
                    }
                }
            }
        }

        return $this->render('frustrant_input/index.html.twig', [
            'submitted' => $submitted,
            'result' => $result,
            'videos' => $videos,
        ]);
    }
}
