<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Images</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-8">
    <h1 class="text-3xl font-bold mb-6 text-center">Uploaded Images</h1>
    
    <?php
    $uploadDir = 'uploads/';
    $files = scandir($uploadDir);
    
    if (isset($_GET['file'])) {
        $file = basename($_GET['file']);
        $filePath = $uploadDir . $file;
        
        if (file_exists($filePath)) {
            echo '<div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">';
            echo '<img src="' . htmlspecialchars($filePath) . '" alt="Uploaded Image" class="w-full mb-4 rounded">';
            
            // Check file extension before reading EXIF to avoid warning for PNG
            $fileExt = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            if (in_array($fileExt, ['jpg', 'jpeg'])) {
                // Vulnerable EXIF display (only UserComment, no sanitization)
                $exif = @exif_read_data($filePath); // Suppress any remaining warnings
                if ($exif !== false && isset($exif['COMPUTED']['UserComment'])) {
                    echo '<h2 class="text-xl font-semibold mb-2">EXIF User Comment</h2>';
                    // Intentional vulnerability: No htmlspecialchars here
                    echo '<p>' . $exif['COMPUTED']['UserComment'] . '</p>';
                } elseif ($exif !== false && isset($exif['EXIF']['UserComment'])) {
                    echo '<h2 class="text-xl font-semibold mb-2">EXIF User Comment</h2>';
                    // Intentional vulnerability: No htmlspecialchars here
                    echo '<p>' . $exif['EXIF']['UserComment'] . '</p>';
                } else {
                    echo '<p>No UserComment found in EXIF data.</p>';
                }
            } else {
                echo '<p>No EXIF data found (PNG not supported).</p>';
            }
            echo '</div>';
        } else {
            echo '<p class="text-red-500 text-center">File not found.</p>';
        }
    } else {
        // List all uploads
        echo '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">';
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..') {
                echo '<a href="view.php?file=' . urlencode($file) . '" class="block">';
                echo '<img src="' . htmlspecialchars($uploadDir . $file) . '" alt="' . htmlspecialchars($file) . '" class="w-full h-48 object-cover rounded">';
                echo '<p class="text-center mt-2">' . htmlspecialchars($file) . '</p>';
                echo '</a>';
            }
        }
        echo '</div>';
    }
    ?>
    
    <a href="index.php" class="block mt-6 text-center text-blue-500 hover:underline">Back to Upload</a>
</body>
</html>