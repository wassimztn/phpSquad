<?php

namespace App\Security;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\CustomCredentials;

class CustomAuthenticator extends AbstractAuthenticator
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function supports(Request $request): ?bool
    {
        // Always support to check authentication
        return true;
    }

    public function authenticate(Request $request): Passport
    {
        $session = $request->getSession();
        $userId = $session->get('user_id');

        if (!$userId) {
            throw new AuthenticationException('No user_id in session');
        }

        $user = $this->userRepository->find($userId);
        if (!$user) {
            throw new AuthenticationException('User not found');
        }

        return new Passport(
            new UserBadge((string)$userId, function ($userId) {
                return $this->userRepository->find($userId);
            }),
            new CustomCredentials(
                function ($credentials, $user) {
                    return true; // Session is valid
                },
                []
            )
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return null;
    }
}
