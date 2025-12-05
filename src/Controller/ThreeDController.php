<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

final class ThreeDController extends AbstractController
{
    #[Route('/3d/dashboard', name: 'app_3d_dashboard')]
    public function index(): Response
    {
        return $this->render('3d/index.html.twig', [
            'controller_name' => 'ThreeDController',
        ]);
    }

    #[Route('/3d/upload', name: 'app_3d_upload', methods: ['POST'])]
    public function upload(Request $request, SluggerInterface $slugger): JsonResponse
    {
        /** @var UploadedFile $stlFile */
        $stlFile = $request->files->get('stlFile');

        if (!$stlFile) {
            return new JsonResponse(['error' => 'No file uploaded'], 400);
        }

        // Validate file extension
        if (!in_array(strtolower($stlFile->getClientOriginalExtension()), ['stl'])) {
            return new JsonResponse(['error' => 'Only STL files are allowed'], 400);
        }

        // Validate file size (max 50MB)
        if ($stlFile->getSize() > 50 * 1024 * 1024) {
            return new JsonResponse(['error' => 'File is too large (max 50MB)'], 400);
        }

        $originalFilename = pathinfo($stlFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $stlFile->getClientOriginalExtension();

        try {
            $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/stl';
            
            // Create directory if it doesn't exist
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $stlFile->move($uploadDir, $newFilename);

            return new JsonResponse([
                'success' => true,
                'filename' => $newFilename,
                'url' => '/uploads/stl/' . $newFilename,
                'originalName' => $stlFile->getClientOriginalName()
            ]);
        } catch (FileException $e) {
            return new JsonResponse(['error' => 'Failed to upload file: ' . $e->getMessage()], 500);
        }
    }
}
