<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $uploadDir = 'uploads/';
    $allowedExtensions = ['jpg', 'jpeg', 'png'];
    $allowedMimeTypes = ['image/jpeg', 'image/png'];
    $maxSize = 2 * 1024 * 1024; // 2MB

    $file = $_FILES['image'];
    $fileName = basename($file['name']);
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $fileMime = mime_content_type($file['tmp_name']);
    $fileSize = $file['size'];

    // Security checks
    if (!in_array($fileExt, $allowedExtensions)) {
        die('Invalid file extension. Only JPG and PNG allowed.');
    }
    if (!in_array($fileMime, $allowedMimeTypes)) {
        die('Invalid MIME type. Only image/jpeg and image/png allowed.');
    }
    if ($fileSize > $maxSize) {
        die('File too large. Max 2MB.');
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        die('Upload error.');
    }

    // Generate unique filename to prevent overwrites/traversal
    $uniqueName = uniqid() . '.' . $fileExt;
    $targetPath = $uploadDir . $uniqueName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        header('Location: view.php?file=' . urlencode($uniqueName));
        exit;
    } else {
        die('Failed to move uploaded file.');
    }
} else {
    header('Location: index.php');
    exit;
}
?>