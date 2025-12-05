<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

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

    #[Route('/contact', name: 'app_contact', methods: ['GET', 'POST'])]
    public function contact(Request $request, MailerInterface $mailer): Response|JsonResponse
    {
        if ($request->isMethod('POST')) {
            // Validate CSRF token
            $submittedToken = $request->request->get('_csrf_token');
            if (!$this->isCsrfTokenValid('contact', $submittedToken)) {
                return new JsonResponse([
                    'success' => false,
                    'message' => 'Token CSRF invalide'
                ], 400);
            }

            // Get form data
            $name = $request->request->get('name');
            $email = $request->request->get('email');
            $subject = $request->request->get('subject');
            $message = $request->request->get('message');
            $newsletter = $request->request->get('newsletter') === 'on';

            // Validate data
            if (empty($name) || empty($email) || empty($subject) || empty($message)) {
                return new JsonResponse([
                    'success' => false,
                    'message' => 'Tous les champs sont requis'
                ], 400);
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return new JsonResponse([
                    'success' => false,
                    'message' => 'Email invalide'
                ], 400);
            }

            try {
                // Create email
                $emailMessage = (new Email())
                    ->from($email)
                    ->to('contact@yoursite.com') // Change this to your email
                    ->subject('Contact Form: ' . $subject)
                    ->html(sprintf(
                        '<h2>Nouveau message de contact</h2>
                        <p><strong>Nom:</strong> %s</p>
                        <p><strong>Email:</strong> %s</p>
                        <p><strong>Sujet:</strong> %s</p>
                        <p><strong>Newsletter:</strong> %s</p>
                        <hr>
                        <p><strong>Message:</strong></p>
                        <p>%s</p>',
                        htmlspecialchars($name),
                        htmlspecialchars($email),
                        htmlspecialchars($subject),
                        $newsletter ? 'Oui' : 'Non',
                        nl2br(htmlspecialchars($message))
                    ));

                // Send email (uncomment when mailer is configured)
                // $mailer->send($emailMessage);

                // For now, just log the message
                // In production, you would save to database and/or send email

                return new JsonResponse([
                    'success' => true,
                    'message' => 'Votre message a été envoyé avec succès !'
                ]);
            } catch (\Exception $e) {
                return new JsonResponse([
                    'success' => false,
                    'message' => 'Une erreur est survenue lors de l\'envoi du message'
                ], 500);
            }
        }

        // GET request - show form
        return $this->render('main/contact.html.twig');
    }
}
