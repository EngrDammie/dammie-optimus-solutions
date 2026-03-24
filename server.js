const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const LEADS_FILE = path.join(__dirname, 'data', 'leads.json');

// MIME types for static files
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Parse JSON body from request
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(e);
            }
        });
        req.on('error', reject);
    });
}

// Read leads from file
function readLeads() {
    try {
        const data = fs.readFileSync(LEADS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return { leads: [], metadata: { created: new Date().toISOString(), updated: new Date().toISOString() } };
    }
}

// Write leads to file
function writeLeads(data) {
    data.metadata.updated = new Date().toISOString();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(data, null, 2));
}

// Handle API requests
async function handleApi(req, res) {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    
    // Handle POST /api/leads - Save new lead
    if (url.pathname === '/api/leads' && req.method === 'POST') {
        try {
            const lead = await parseBody(req);
            const data = readLeads();
            
            // Add timestamp and generate ID
            lead.id = Date.now().toString();
            lead.createdAt = new Date().toISOString();
            
            // Add to leads array
            data.leads.push(lead);
            writeLeads(data);
            
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, leadId: lead.id }));
            console.log(`[${new Date().toISOString()}] New lead saved: ${lead.email} - ${lead.service}`);
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request' }));
        }
        return;
    }
    
    // Handle GET /api/leads - Get all leads
    if (url.pathname === '/api/leads' && req.method === 'GET') {
        const data = readLeads();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
    }
    
    // 404 for unknown API routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
}

// Handle static file requests
function serveStatic(req, res) {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let filePath = path.join(__dirname, url.pathname);
    
    // Default to index.html for root
    if (url.pathname === '/') {
        filePath = path.join(__dirname, 'index.html');
    }
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        
        // Determine content type
        const ext = path.extname(filePath);
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Server error');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    // API routes
    if (req.url.startsWith('/api/')) {
        await handleApi(req, res);
        return;
    }
    
    // Static files
    serveStatic(req, res);
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ⚡ Dammie Optimus Solutions - Agency Server                       ║
║                                                            ║
║   Server running at: http://localhost:${PORT}                 ║
║                                                            ║
║   Endpoints:                                               ║
║   - GET  /api/leads     → View all leads                  ║
║   - POST /api/leads     → Submit new lead                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});
