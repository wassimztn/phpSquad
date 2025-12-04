<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class AuthController extends AbstractController
{
    #[Route('/register', name: 'app_register')]
    public function register(): Response
    {
        return $this->render('auth/register.html.twig');
    }

    #[Route('/register/save', name: 'app_register_save', methods: ['POST'])]
    public function registerSave(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        
        $email = $data['email'] ?? '';
        $username = $data['username'] ?? '';
        $combo = $data['combo'] ?? '';

        if (empty($email) || empty($username) || empty($combo)) {
            return new JsonResponse(['success' => false, 'message' => 'Tous les champs sont requis'], 400);
        }

        // Vérifier si l'email existe déjà
        $existingUser = $em->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            return new JsonResponse(['success' => false, 'message' => 'Cet email est déjà utilisé'], 400);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setComboSecret($combo); // Stocker le combo directement (on pourrait le hasher aussi)
        
        // Créer un mot de passe aléatoire (on n'en a pas besoin mais c'est requis)
        $randomPassword = bin2hex(random_bytes(16));
        $hashedPassword = $passwordHasher->hashPassword($user, $randomPassword);
        $user->setPassword($hashedPassword);

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['success' => true, 'message' => 'Compte créé avec succès !']);
    }

    #[Route('/login', name: 'app_login')]
    public function login(): Response
    {
        return $this->render('auth/login.html.twig');
    }

    #[Route('/login/verify', name: 'app_login_verify', methods: ['POST'])]
    public function loginVerify(
        Request $request,
        UserRepository $userRepository,
        SessionInterface $session
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        
        $email = $data['email'] ?? '';
        $combo = $data['combo'] ?? '';

        if (empty($email) || empty($combo)) {
            return new JsonResponse(['success' => false, 'message' => 'Email et combo requis'], 400);
        }

        $user = $userRepository->findOneBy(['email' => $email]);
        
        if (!$user) {
            return new JsonResponse(['success' => false, 'message' => 'Utilisateur introuvable'], 404);
        }

        if ($user->getComboSecret() !== $combo) {
            return new JsonResponse(['success' => false, 'message' => 'Combo incorrect !'], 401);
        }

        // Mettre l'utilisateur en session
        $session->set('user_id', $user->getId());
        $session->set('user_email', $user->getEmail());

        return new JsonResponse([
            'success' => true, 
            'message' => 'Authentification réussie !',
            'redirect' => $this->generateUrl('app_game')
        ]);
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout(SessionInterface $session): Response
    {
        $session->clear();
        return $this->redirectToRoute('app_main');
    }
}
