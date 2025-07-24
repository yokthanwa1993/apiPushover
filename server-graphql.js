require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: ({ req }) => {
        // Add any context you need here
        return {
            req,
            timestamp: new Date().toISOString()
        };
    },
    formatError: (error) => {
        console.error('GraphQL Error:', error);
        return {
            message: error.message,
            path: error.path,
            extensions: error.extensions
        };
    }
});

// Apply Apollo Server to Express
async function startServer() {
    await server.start();
    server.applyMiddleware({ 
        app, 
        path: '/api/v1/graphql',
        cors: {
            origin: true,
            credentials: true
        }
    });

    // Health check endpoint
    app.get('/api/v1/health', (req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'Pushover GraphQL API Server',
            version: '1.0.0',
            graphql: `/api/v1/graphql`
        });
    });

    // API documentation endpoint
    app.get('/api/v1/docs', (req, res) => {
        res.json({
            name: 'Pushover GraphQL API Server',
            version: '1.0.0',
            graphqlEndpoint: '/api/v1/graphql',
            playground: '/api/v1/graphql',
            queries: [
                'health',
                'limits'
            ],
            mutations: [
                'sendNotification',
                'sendEmergency',
                'sendTemplate',
                'validateUser'
            ],
            templates: ['success', 'error', 'warning', 'info', 'reminder'],
            examples: {
                health: {
                    query: `
                        query {
                            health {
                                status
                                timestamp
                                service
                                version
                            }
                        }
                    `
                },
                sendNotification: {
                    mutation: `
                        mutation SendNotification($input: SendNotificationInput!) {
                            sendNotification(input: $input) {
                                success
                                status
                                message
                                data {
                                    status
                                    request
                                    receipt
                                }
                            }
                        }
                    `,
                    variables: {
                        input: {
                            message: "Hello from GraphQL!",
                            title: "Test Notification",
                            priority: 0
                        }
                    }
                },
                sendEmergency: {
                    mutation: `
                        mutation SendEmergency($input: EmergencyInput!) {
                            sendEmergency(input: $input) {
                                success
                                status
                                message
                                data {
                                    status
                                    request
                                    receipt
                                }
                            }
                        }
                    `,
                    variables: {
                        input: {
                            message: "Server is down!",
                            title: "🚨 Emergency Alert"
                        }
                    }
                },
                sendTemplate: {
                    mutation: `
                        mutation SendTemplate($template: TemplateType!, $input: TemplateInput!) {
                            sendTemplate(template: $template, input: $input) {
                                success
                                status
                                template
                                message
                                data {
                                    status
                                    request
                                    receipt
                                }
                            }
                        }
                    `,
                    variables: {
                        template: "success",
                        input: {
                            message: "Task completed successfully!"
                        }
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
                'POST /api/v1/graphql',
                'GET /api/v1/graphql (GraphQL Playground)',
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
        console.log(`🚀 Pushover GraphQL API Server running on http://localhost:${PORT}`);
        console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1/docs`);
        console.log(`🎮 GraphQL Playground: http://localhost:${PORT}/api/v1/graphql`);
        console.log(`💚 Health Check: http://localhost:${PORT}/api/v1/health`);
    });
}

startServer().catch(console.error);

module.exports = app; 