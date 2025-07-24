require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const PushoverAPI = require('./test-pushover');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api/v1/', limiter);

// Initialize Pushover API
let pushover;
try {
    pushover = new PushoverAPI();
} catch (error) {
    console.error('Failed to initialize Pushover API:', error.message);
    process.exit(1);
}

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Pushover API Server',
        version: '1.0.0'
    });
});

// Send notification endpoint
app.post('/api/v1/send', async (req, res) => {
    try {
        const { message, title, priority, url, url_title, html, device, sound, ttl, expire, retry } = req.body;

        // Validate required fields
        if (!message) {
            return res.status(400).json({
                error: 'Message is required',
                status: 0
            });
        }

        // Prepare options
        const options = {};
        if (title) options.title = title;
        if (priority !== undefined) options.priority = priority;
        if (url) options.url = url;
        if (url_title) options.url_title = url_title;
        if (html) options.html = html;
        if (device) options.device = device;
        if (sound) options.sound = sound;
        if (ttl) options.ttl = ttl;
        if (expire) options.expire = expire;
        if (retry) options.retry = retry;

        // Send message
        const result = await pushover.sendMessage(message, options);

        res.json({
            success: true,
            status: 1,
            data: result,
            message: 'Notification sent successfully'
        });

    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({
            success: false,
            status: 0,
            error: error.message,
            details: error.response?.data || null
        });
    }
});

// Check limits endpoint
app.get('/api/v1/limits', async (req, res) => {
    try {
        const limits = await pushover.checkLimits();
        res.json({
            success: true,
            status: 1,
            data: limits
        });
    } catch (error) {
        console.error('Error checking limits:', error);
        res.status(500).json({
            success: false,
            status: 0,
            error: error.message
        });
    }
});

// Validate user endpoint
app.post('/api/v1/validate', async (req, res) => {
    try {
        const { user, device } = req.body;
        
        // Use provided user key or default from env
        const userKey = user || process.env.PUSHOVER_USER_KEY;
        
        if (!userKey) {
            return res.status(400).json({
                error: 'User key is required',
                status: 0
            });
        }

        // Create temporary instance with provided user key
        const tempPushover = new PushoverAPI();
        tempPushover.userKey = userKey;
        if (device) tempPushover.device = device;

        const result = await tempPushover.validateUser();
        
        res.json({
            success: true,
            status: 1,
            data: result
        });
    } catch (error) {
        console.error('Error validating user:', error);
        res.status(500).json({
            success: false,
            status: 0,
            error: error.message
        });
    }
});

// Send emergency alert endpoint
app.post('/api/v1/emergency', async (req, res) => {
    try {
        const { message, title, url, url_title } = req.body;

        if (!message) {
            return res.status(400).json({
                error: 'Message is required for emergency alerts',
                status: 0
            });
        }

        const options = {
            priority: 2,
            sound: 'siren',
            expire: 3600, // 1 hour
            retry: 60,    // 60 seconds
            ...(title && { title }),
            ...(url && { url }),
            ...(url_title && { url_title })
        };

        const result = await pushover.sendMessage(message, options);

        res.json({
            success: true,
            status: 1,
            data: result,
            message: 'Emergency alert sent successfully'
        });

    } catch (error) {
        console.error('Error sending emergency alert:', error);
        res.status(500).json({
            success: false,
            status: 0,
            error: error.message
        });
    }
});

// Send notification with predefined templates
app.post('/api/v1/templates/:template', async (req, res) => {
    try {
        const { template } = req.params;
        const { message, title, ...customOptions } = req.body;

        if (!message) {
            return res.status(400).json({
                error: 'Message is required',
                status: 0
            });
        }

        let options = { ...customOptions };

        // Predefined templates
        switch (template) {
            case 'success':
                options = {
                    title: title || '✅ Success',
                    priority: 0,
                    sound: 'pushover',
                    ...options
                };
                break;
            
            case 'error':
                options = {
                    title: title || '❌ Error',
                    priority: 1,
                    sound: 'falling',
                    ...options
                };
                break;
            
            case 'warning':
                options = {
                    title: title || '⚠️ Warning',
                    priority: 1,
                    sound: 'cosmic',
                    ...options
                };
                break;
            
            case 'info':
                options = {
                    title: title || 'ℹ️ Information',
                    priority: -1,
                    sound: 'none',
                    ...options
                };
                break;
            
            case 'reminder':
                options = {
                    title: title || '⏰ Reminder',
                    priority: 0,
                    sound: 'magic',
                    ...options
                };
                break;
            
            default:
                return res.status(400).json({
                    error: 'Invalid template. Available templates: success, error, warning, info, reminder',
                    status: 0
                });
        }

        const result = await pushover.sendMessage(message, options);

        res.json({
            success: true,
            status: 1,
            data: result,
            template: template,
            message: 'Notification sent successfully'
        });

    } catch (error) {
        console.error('Error sending template notification:', error);
        res.status(500).json({
            success: false,
            status: 0,
            error: error.message
        });
    }
});

// API documentation endpoint
app.get('/api/v1/docs', (req, res) => {
    res.json({
        name: 'Pushover API Server',
        version: '1.0.0',
        endpoints: {
            'GET /api/v1/health': 'Health check',
            'POST /api/v1/send': 'Send notification',
            'GET /api/v1/limits': 'Check application limits',
            'POST /api/v1/validate': 'Validate user key',
            'POST /api/v1/emergency': 'Send emergency alert',
            'POST /api/v1/templates/:template': 'Send notification with template',
            'GET /api/v1/docs': 'API documentation'
        },
        templates: ['success', 'error', 'warning', 'info', 'reminder'],
        examples: {
            send: {
                method: 'POST',
                url: '/api/v1/send',
                body: {
                    message: 'Hello World!',
                    title: 'Test Notification',
                    priority: 0
                }
            },
            emergency: {
                method: 'POST',
                url: '/api/v1/emergency',
                body: {
                    message: 'Server is down!',
                    title: '🚨 Emergency Alert'
                }
            },
            template: {
                method: 'POST',
                url: '/api/v1/templates/success',
                body: {
                    message: 'Task completed successfully!'
                }
            }
        }
    });
});

// 404 handler
app.use('/api/v1/*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        status: 0,
        availableEndpoints: [
            'GET /api/v1/health',
            'POST /api/v1/send',
            'GET /api/v1/limits',
            'POST /api/v1/validate',
            'POST /api/v1/emergency',
            'POST /api/v1/templates/:template',
            'GET /api/v1/docs'
        ]
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        status: 0
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Pushover API Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1/docs`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/v1/health`);
});

module.exports = app; 