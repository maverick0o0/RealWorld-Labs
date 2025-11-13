<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Upload Lab</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 class="text-2xl font-bold mb-4 text-center">Upload Your Image</h1>
        <form action="upload.php" method="post" enctype="multipart/form-data" class="space-y-4">
            <input type="file" name="image" accept="image/jpeg, image/png" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
            <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Upload</button>
        </form>
        <a href="view.php" class="block mt-4 text-center text-blue-500 hover:underline">View Uploaded Images</a>
    </div>
</body>
</html>