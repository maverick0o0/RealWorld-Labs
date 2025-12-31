console.log("Starting CVE-2024-4367 Demo Server..."); // Debug line to confirm file is loaded

/**
 * CVE-2024-4367 Node.js Demo Server
 * * This is a standalone Node.js application using Express.
 * It serves a frontend UI that demonstrates the PDF.js vulnerability.
 * * Setup:
 * 1. npm install express
 * 2. node server.js
 * 3. Open http://localhost:3000
 */

const path = require('path');
const fs = require('fs');
const multer = require('multer');

const express = require('express');
const app = express();
const PORT = 3000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const originalName = file.originalname || 'upload.pdf';
        const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${Date.now()}-${safeName}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const originalName = (file.originalname || '').toLowerCase();
        const isPdf = file.mimetype === 'application/pdf' || originalName.endsWith('.pdf');
        if (!isPdf) {
            return cb(new Error('Only PDF files are allowed.'));
        }
        return cb(null, true);
    },
});

// The HTML content is embedded here for a single-file demonstration.
// In a production app, this would be in a separate .html file.
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Node.js CVE-2024-4367 Demo</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .canvas-container { overflow: auto; min-height: 400px; display: flex; justify-content: center; background: #64748b; border-radius: 0.5rem; padding: 1rem; }
        canvas { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); max-width: 100%; }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 p-8">

    <div class="max-w-4xl mx-auto space-y-6">
        
        <!-- Header -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h1 class="text-2xl font-bold flex items-center gap-3 mb-2">
                <i data-lucide="server" class="w-8 h-8 text-indigo-600"></i>
                Node.js CVE-2024-4367 Server
            </h1>
            <p class="text-slate-600">
                This is a Node.js express server serving a vulnerability demonstration.
            </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
            
            <!-- Controls -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <i data-lucide="settings" class="w-5 h-5 text-slate-500"></i>
                    Configuration
                </h2>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Select PDF.js Version</label>
                        <select id="versionSelect" class="w-full rounded-md border border-slate-300 p-2 bg-slate-50">
                            <option value="4.1.392">Vulnerable (v4.1.392)</option>
                            <option value="4.2.67">Patched (v4.2.67)</option>
                        </select>
                    </div>

                    <div id="statusBox" class="p-3 rounded-lg border bg-red-50 border-red-200 text-red-800">
                        <div class="flex items-start gap-3">
                            <i data-lucide="alert-triangle" class="w-5 h-5 mt-0.5"></i>
                            <div class="text-sm">
                                <p class="font-semibold" id="statusTitle">Vulnerable Configuration</p>
                                <p class="opacity-90 mt-1 text-xs" id="statusDesc">Contains CVE-2024-4367. Arbitrary JS execution possible.</p>
                            </div>
                        </div>
                    </div>

                    <button id="loadBtn" class="w-full py-2 px-4 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors">
                        Load Library Engine
                    </button>
                </div>
            </div>

            <!-- Upload -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <i data-lucide="file-up" class="w-5 h-5 text-slate-500"></i>
                    Document
                </h2>

                <div id="uploadArea" class="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-8 bg-slate-50 text-slate-400">
                    <p>Load the library engine first</p>
                </div>
                <input type="file" id="fileInput" accept=".pdf" class="hidden">
                <div id="fileLinks" class="mt-4 hidden text-sm text-slate-600">
                    <div class="flex items-center gap-4">
                        <a id="previewLink" href="#" class="text-indigo-600 hover:text-indigo-700 font-medium">Preview PDF</a>
                        <a id="downloadLink" href="#" class="text-indigo-600 hover:text-indigo-700 font-medium">Download PDF</a>
                    </div>
                    <p id="uploadedName" class="mt-2 text-xs text-slate-500"></p>
                </div>
            </div>
        </div>

        <!-- Canvas -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div class="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                <h3 className="font-semibold text-slate-700">Preview Canvas</h3>
                <span id="renderStatus" class="text-sm text-slate-500">Waiting for input...</span>
            </div>
            <div class="canvas-container">
                <canvas id="pdfCanvas"></canvas>
            </div>
        </div>
    </div>

    <!-- Logic -->
    <script>
        lucide.createIcons();

        const versionSelect = document.getElementById('versionSelect');
        const statusBox = document.getElementById('statusBox');
        const statusTitle = document.getElementById('statusTitle');
        const statusDesc = document.getElementById('statusDesc');
        const loadBtn = document.getElementById('loadBtn');
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const fileLinks = document.getElementById('fileLinks');
        const previewLink = document.getElementById('previewLink');
        const downloadLink = document.getElementById('downloadLink');
        const uploadedName = document.getElementById('uploadedName');
        const renderStatus = document.getElementById('renderStatus');
        const canvas = document.getElementById('pdfCanvas');
        
        let currentVersion = '4.1.392';
        let pdfjsLib = null;
        let lastUploadedData = null;

        // UI Updates for Version Select
        versionSelect.addEventListener('change', (e) => {
            currentVersion = e.target.value;
            if (currentVersion === '4.1.392') {
                statusBox.className = "p-3 rounded-lg border bg-red-50 border-red-200 text-red-800";
                statusTitle.textContent = "Vulnerable Configuration";
                statusDesc.textContent = "Contains CVE-2024-4367. Arbitrary JS execution possible.";
                statusBox.innerHTML = '<div class="flex items-start gap-3"><i data-lucide="alert-triangle" class="w-5 h-5 mt-0.5"></i><div class="text-sm"><p class="font-semibold">Vulnerable Configuration</p><p class="opacity-90 mt-1 text-xs">Contains CVE-2024-4367. Arbitrary JS execution possible.</p></div></div>';
            } else {
                statusBox.className = "p-3 rounded-lg border bg-green-50 border-green-200 text-green-800";
                statusTitle.textContent = "Secure Configuration";
                statusDesc.textContent = "Fixes CVE-2024-4367. FontMatrix inputs validated.";
                statusBox.innerHTML = '<div class="flex items-start gap-3"><i data-lucide="shield-check" class="w-5 h-5 mt-0.5"></i><div class="text-sm"><p class="font-semibold">Secure Configuration</p><p class="opacity-90 mt-1 text-xs">Fixes CVE-2024-4367. FontMatrix inputs validated.</p></div></div>';
            }
            lucide.createIcons();
            
            // Reset if already loaded
            if (window.pdfjsLib) {
                if(confirm("Reload page to switch versions?")) {
                    window.location.reload();
                }
            }
        });

        // Load Library Logic
        loadBtn.addEventListener('click', async () => {
            if (window.pdfjsLib) return;
            
            loadBtn.textContent = "Loading...";
            loadBtn.disabled = true;

            const libUrl = \`https://unpkg.com/pdfjs-dist@\${currentVersion}/build/pdf.mjs\`;
            const workerUrl = \`https://unpkg.com/pdfjs-dist@\${currentVersion}/build/pdf.worker.mjs\`;

            try {
                // Dynamic Import
                const lib = await import(libUrl);
                window.pdfjsLib = lib;
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

                loadBtn.textContent = "Engine Loaded";
                loadBtn.className = "w-full py-2 px-4 rounded-lg font-medium bg-slate-100 text-slate-400 cursor-not-allowed";
                
                // Enable Upload UI
                uploadArea.className = "flex-1 flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-lg p-8 cursor-pointer group";
                uploadArea.innerHTML = '<i data-lucide="file-up" class="w-12 h-12 text-indigo-400 mb-2 group-hover:scale-110 transition-transform"></i><p class="text-indigo-700 font-medium">Click to upload PDF</p>';
                uploadArea.onclick = () => fileInput.click();
                lucide.createIcons();

            } catch (err) {
                console.error(err);
                loadBtn.textContent = "Error Loading";
                alert("Failed to load PDF.js from CDN");
            }
        });

        // File Handling
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            lastUploadedData = null;
            fileLinks.classList.add('hidden');
            previewLink.dataset.url = '';
            downloadLink.removeAttribute('href');
            uploadedName.textContent = '';

            renderStatus.textContent = "Uploading PDF...";

            try {
                const localDataPromise = file.arrayBuffer();
                const formData = new FormData();
                formData.append('pdf', file);

                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'Upload failed.');
                }

                const localData = await localDataPromise.catch(() => null);
                if (localData && localData.byteLength > 0) {
                    lastUploadedData = localData;
                }

                previewLink.dataset.url = result.previewUrl;
                downloadLink.href = result.downloadUrl;
                uploadedName.textContent = \`Saved as \${result.filename}\`;
                fileLinks.classList.remove('hidden');
                renderStatus.textContent = "Upload complete. Click Preview PDF to render.";
            } catch (err) {
                console.error(err);
                lastUploadedData = null;
                renderStatus.textContent = "Upload error: " + err.message;
            } finally {
                fileInput.value = '';
            }
        });

        previewLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (lastUploadedData) {
                renderPdfFromData(lastUploadedData);
                return;
            }
            const url = previewLink.dataset.url;
            if (!url) return;
            renderPdfFromSource(url);
        });

        async function renderPdfFromSource(source) {
            if (!window.pdfjsLib) return;
            renderStatus.textContent = "Downloading PDF...";

            try {
                const response = await fetch(source, { cache: 'no-store' });
                if (!response.ok || response.status === 204) {
                    throw new Error(\`Failed to fetch PDF (status \${response.status}).\`);
                }
                const data = await response.arrayBuffer();
                if (!data || data.byteLength === 0) {
                    throw new Error('Received empty PDF data from server.');
                }
                await renderPdfFromData(data);
            } catch (err) {
                console.error(err);
                renderStatus.textContent = "Error: " + err.message;
            }
        }

        async function renderPdfFromData(data) {
            if (!window.pdfjsLib) return;
            renderStatus.textContent = "Parsing PDF...";

            try {
                if (!data || data.byteLength === 0) {
                    throw new Error('The PDF file is empty.');
                }

                const loadingTask = window.pdfjsLib.getDocument({ data });
                const pdf = await loadingTask.promise;

                renderStatus.textContent = "Rendering Page 1...";
                const page = await pdf.getPage(1);

                const scale = 1.5;
                const viewport = page.getViewport({ scale });
                const context = canvas.getContext('2d');

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                await page.render(renderContext).promise;
                renderStatus.textContent = \`Render Complete (Pages: \${pdf.numPages})\`;
            } catch (err) {
                console.error(err);
                renderStatus.textContent = "Error: " + err.message;
            }
        }
    </script>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(htmlContent);
});

app.post('/upload', (req, res) => {
    upload.single('pdf')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        return res.json({
            filename: req.file.filename,
            previewUrl: `/preview/${req.file.filename}`,
            downloadUrl: `/download/${req.file.filename}`,
        });
    });
});

app.get('/preview/:filename', (req, res) => {
    const safeName = path.basename(req.params.filename || '');
    if (!safeName) {
        return res.status(400).send('Invalid filename.');
    }
    const fullPath = path.join(uploadsDir, safeName);
    fs.stat(fullPath, (err, stat) => {
        if (err || !stat.isFile()) {
            return res.status(404).send('File not found.');
        }
        const totalSize = stat.size;
        const range = req.headers.range;
        const headers = {
            'Content-Type': 'application/pdf',
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-store',
            'Content-Disposition': `inline; filename="${safeName}"`,
        };

        if (range) {
            const match = /^bytes=(\d*)-(\d*)$/.exec(range);
            if (!match) {
                res.set('Content-Range', `bytes */${totalSize}`);
                return res.status(416).end();
            }

            const start = match[1] ? parseInt(match[1], 10) : 0;
            const end = match[2] ? parseInt(match[2], 10) : totalSize - 1;

            if (start >= totalSize || end >= totalSize) {
                res.set('Content-Range', `bytes */${totalSize}`);
                return res.status(416).end();
            }

            const chunkSize = end - start + 1;
            res.writeHead(206, {
                ...headers,
                'Content-Range': `bytes ${start}-${end}/${totalSize}`,
                'Content-Length': chunkSize,
            });
            return fs.createReadStream(fullPath, { start, end }).pipe(res);
        }

        res.writeHead(200, {
            ...headers,
            'Content-Length': totalSize,
        });
        return fs.createReadStream(fullPath).pipe(res);
    });
});

app.get('/download/:filename', (req, res) => {
    const safeName = path.basename(req.params.filename || '');
    if (!safeName) {
        return res.status(400).send('Invalid filename.');
    }
    const fullPath = path.join(uploadsDir, safeName);
    fs.access(fullPath, fs.constants.R_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found.');
        }
        return res.download(fullPath, safeName);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`To use: Open your browser and navigate to the above URL.`);
});
