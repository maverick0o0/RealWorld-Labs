How to Run with Docker

Open your terminal and navigate to the project directory.

Build and Start the Container:
Run the following command to build the image and start the service:
```
docker-compose up --build
```

Access the Application:
Once the build completes and the container is running, open your web browser and navigate to:

http://localhost:3000

Stopping the App:
To stop the container, press Ctrl+C in your terminal, or run:
```
docker-compose down
```

Usage

Select Version: Use the dropdown menu to choose between the Vulnerable and Patched versions of PDF.js.

Load Engine: Click "Load Library Engine" to fetch the selected version from the CDN.

Upload PDF: Upload a PoC PDF file.

If using the Vulnerable version with a malicious PDF, the XSS payload will execute.

If using the Patched version, the PDF should render normally (or fail safely) without executing the payload.

Troubleshooting

"exited with code 0" immediately:
If the container exits immediately without logs, ensure your server.js file is not empty. It should contain the Node.js express code.

Then access via http://localhost:3000.