Docker Setup
The project is dockerized using PHP 8.3 with Apache and the EXIF extension.
Build and Run with Docker Compose (Recommended)

Ensure Docker and Docker Compose are installed.
Build the image:
```docker-compose build```
Start the container:
```docker-compose up -d```
Access the app at http://localhost:8000/index.php.
Stop the container:
```docker-compose down```