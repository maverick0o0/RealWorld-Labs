# Use official PHP 8.3 with Apache
FROM php:8.3-apache

# Install EXIF extension (required for exif_read_data)
RUN docker-php-ext-install exif

# Set working directory
WORKDIR /var/www/html

# Copy PHP files into the container
COPY index.php upload.php view.php ./

# Create uploads directory and set permissions for www-data user (Apache runs as this)
RUN mkdir -p /var/www/html/uploads && \
    chown -R www-data:www-data /var/www/html/uploads && \
    chmod -R 755 /var/www/html/uploads

# Expose port 80
EXPOSE 80