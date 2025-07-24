const PushoverAPI = require('./test-pushover');

// Initialize Pushover API
let pushover;
try {
    pushover = new PushoverAPI();
} catch (error) {
    console.error('Failed to initialize Pushover API:', error.message);
    process.exit(1);
}

// Helper function to convert priority enum to number
function getPriorityNumber(priority) {
    switch (priority) {
        case 'LOWEST': return -2;
        case 'LOW': return -1;
        case 'NORMAL': return 0;
        case 'HIGH': return 1;
        case 'EMERGENCY': return 2;
        default: return 0;
    }
}

// Helper function to get template configuration
function getTemplateConfig(template) {
    const templates = {
        success: {
            title: '✅ Success',
            priority: 0,
            sound: 'pushover'
        },
        error: {
            title: '❌ Error',
            priority: 1,
            sound: 'falling'
        },
        warning: {
            title: '⚠️ Warning',
            priority: 1,
            sound: 'cosmic'
        },
        info: {
            title: 'ℹ️ Information',
            priority: -1,
            sound: 'none'
        },
        reminder: {
            title: '⏰ Reminder',
            priority: 0,
            sound: 'magic'
        },
        alert: {
            title: '🚨 Alert',
            priority: 1,
            sound: 'siren'
        },
        notification: {
            title: '📢 Notification',
            priority: 0,
            sound: 'pushover'
        },
        update: {
            title: '🔄 Update',
            priority: 0,
            sound: 'cosmic'
        },
        system: {
            title: '⚙️ System',
            priority: 1,
            sound: 'mechanical'
        },
        user: {
            title: '👤 User',
            priority: 0,
            sound: 'incoming'
        },
        payment: {
            title: '💳 Payment',
            priority: 1,
            sound: 'cashregister'
        },
        security: {
            title: '🔒 Security',
            priority: 2,
            sound: 'siren'
        },
        backup: {
            title: '💾 Backup',
            priority: 0,
            sound: 'cosmic'
        },
        monitoring: {
            title: '📊 Monitoring',
            priority: 1,
            sound: 'spacealarm'
        },
        weather: {
            title: '🌤️ Weather',
            priority: 0,
            sound: 'cosmic'
        },
        news: {
            title: '📰 News',
            priority: 0,
            sound: 'bugle'
        },
        social: {
            title: '📱 Social',
            priority: -1,
            sound: 'incoming'
        },
        email: {
            title: '📧 Email',
            priority: 0,
            sound: 'incoming'
        },
        sms: {
            title: '💬 SMS',
            priority: 1,
            sound: 'magic'
        },
        call: {
            title: '📞 Call',
            priority: 2,
            sound: 'siren'
        }
    };
    return templates[template] || templates.notification;
}

// Helper function to get category configuration
function getCategoryConfig(category) {
    const categories = {
        system: { priority: 1, sound: 'mechanical', icon: '⚙️' },
        user: { priority: 0, sound: 'incoming', icon: '👤' },
        business: { priority: 1, sound: 'cashregister', icon: '💼' },
        personal: { priority: 0, sound: 'pushover', icon: '👤' },
        monitoring: { priority: 1, sound: 'spacealarm', icon: '📊' },
        security: { priority: 2, sound: 'siren', icon: '🔒' },
        entertainment: { priority: -1, sound: 'magic', icon: '🎮' },
        news: { priority: 0, sound: 'bugle', icon: '📰' },
        weather: { priority: 0, sound: 'cosmic', icon: '🌤️' },
        social: { priority: -1, sound: 'incoming', icon: '📱' },
        communication: { priority: 0, sound: 'incoming', icon: '💬' },
        finance: { priority: 1, sound: 'cashregister', icon: '💰' },
        health: { priority: 1, sound: 'falling', icon: '🏥' },
        travel: { priority: 0, sound: 'cosmic', icon: '✈️' },
        education: { priority: 0, sound: 'classical', icon: '📚' },
        sports: { priority: 0, sound: 'bike', icon: '⚽' },
        gaming: { priority: -1, sound: 'magic', icon: '🎮' },
        music: { priority: -1, sound: 'pianobar', icon: '🎵' },
        video: { priority: -1, sound: 'magic', icon: '🎬' },
        other: { priority: 0, sound: 'pushover', icon: '📢' }
    };
    return categories[category] || categories.other;
}

const resolvers = {
    Query: {
        health: () => ({
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'Pushover GraphQL API Server',
            version: '1.0.0'
        }),

        limits: async () => {
            try {
                return await pushover.checkLimits();
            } catch (error) {
                throw new Error(`Failed to check limits: ${error.message}`);
            }
        },

        sounds: () => [
            'pushover', 'bike', 'bugle', 'cashregister', 'classical', 'cosmic',
            'falling', 'gamelan', 'incoming', 'intermission', 'magic', 'mechanical',
            'pianobar', 'siren', 'spacealarm', 'tugboat', 'alien', 'climb',
            'persistent', 'echo', 'updown', 'none'
        ],

        devices: () => ['iphoneYok', 'Mac'],

        templates: () => [
            'success', 'error', 'warning', 'info', 'reminder', 'alert',
            'notification', 'update', 'system', 'user', 'payment', 'security',
            'backup', 'monitoring', 'weather', 'news', 'social', 'email',
            'sms', 'call'
        ]
    },

    Mutation: {
        sendNotification: async (_, { input }) => {
            try {
                const { message, title, priority, url, url_title, html, device, sound, ttl, expire, retry, timestamp, callback, attachment, attachment_base64, attachment_type } = input;

                // Prepare options
                const options = {};
                if (title) options.title = title;
                if (priority !== undefined) options.priority = priority;
                if (url) options.url = url;
                if (url_title) options.url_title = url_title;
                if (html) options.html = html ? 1 : 0;
                if (device) options.device = device;
                if (sound) options.sound = sound;
                if (ttl) options.ttl = ttl;
                if (expire) options.expire = expire;
                if (retry) options.retry = retry;
                if (timestamp) options.timestamp = timestamp;
                if (callback) options.callback = callback;
                if (attachment) options.attachment = attachment;
                if (attachment_base64) options.attachment_base64 = attachment_base64;
                if (attachment_type) options.attachment_type = attachment_type;

                const result = await pushover.sendMessage(message, options);

                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: 'Notification sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send notification: ${error.message}`);
            }
        },

        sendEmergency: async (_, { input }) => {
            try {
                const { message, title, url, url_title, expire, retry, callback } = input;

                const options = {
                    priority: 2,
                    sound: 'siren',
                    expire: expire || 3600,
                    retry: retry || 60,
                    ...(title && { title }),
                    ...(url && { url }),
                    ...(url_title && { url_title }),
                    ...(callback && { callback })
                };

                const result = await pushover.sendMessage(message, options);

                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: 'Emergency alert sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send emergency alert: ${error.message}`);
            }
        },

        sendTemplate: async (_, { template, input }) => {
            try {
                const { message, title, ...customOptions } = input;
                const templateConfig = getTemplateConfig(template);

                const options = {
                    ...templateConfig,
                    ...customOptions,
                    ...(title && { title: title || templateConfig.title })
                };

                const result = await pushover.sendMessage(message, options);

                return {
                    success: true,
                    status: 1,
                    data: result,
                    template: template,
                    message: 'Notification sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send template notification: ${error.message}`);
            }
        },

        sendBatch: async (_, { input }) => {
            try {
                const { notifications, delay = 1000 } = input;
                const results = [];
                let sent = 0;
                let failed = 0;

                for (const notification of notifications) {
                    try {
                        const result = await pushover.sendMessage(notification.message, notification);
                        results.push(result);
                        sent++;
                        
                        if (delay > 0) {
                            await new Promise(resolve => setTimeout(resolve, delay));
                        }
                    } catch (error) {
                        results.push({ error: error.message });
                        failed++;
                    }
                }

                return {
                    success: true,
                    status: 1,
                    data: results,
                    message: `Batch notification completed. Sent: ${sent}, Failed: ${failed}`,
                    sent,
                    failed
                };
            } catch (error) {
                throw new Error(`Failed to send batch notifications: ${error.message}`);
            }
        },

        validateUser: async (_, { input }) => {
            try {
                const { user, device } = input;
                
                const userKey = user || process.env.PUSHOVER_USER_KEY;
                
                if (!userKey) {
                    throw new Error('User key is required');
                }

                const tempPushover = new PushoverAPI();
                tempPushover.userKey = userKey;
                if (device) tempPushover.device = device;

                return await tempPushover.validateUser();
            } catch (error) {
                throw new Error(`Failed to validate user: ${error.message}`);
            }
        },

        // Specialized notification methods
        sendSystemAlert: async (_, { message, title, priority }) => {
            try {
                const options = {
                    title: title || '⚙️ System Alert',
                    priority: getPriorityNumber(priority),
                    sound: 'mechanical'
                };

                const result = await pushover.sendMessage(message, options);
                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: 'System alert sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send system alert: ${error.message}`);
            }
        },

        sendUserNotification: async (_, { message, title, device }) => {
            try {
                const options = {
                    title: title || '👤 User Notification',
                    priority: 0,
                    sound: 'incoming',
                    ...(device && { device })
                };

                const result = await pushover.sendMessage(message, options);
                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: 'User notification sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send user notification: ${error.message}`);
            }
        },

        sendBusinessAlert: async (_, { message, title, priority }) => {
            try {
                const options = {
                    title: title || '💼 Business Alert',
                    priority: getPriorityNumber(priority),
                    sound: 'cashregister'
                };

                const result = await pushover.sendMessage(message, options);
                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: 'Business alert sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send business alert: ${error.message}`);
            }
        },

        sendSecurityAlert: async (_, { message, title }) => {
            try {
                const options = {
                    title: title || '🔒 Security Alert',
                    priority: 2,
                    sound: 'siren',
                    expire: 3600,
                    retry: 60
                };

                const result = await pushover.sendMessage(message, options);
                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: 'Security alert sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send security alert: ${error.message}`);
            }
        },

        sendMonitoringAlert: async (_, { message, title, url }) => {
            try {
                const options = {
                    title: title || '📊 Monitoring Alert',
                    priority: 1,
                    sound: 'spacealarm',
                    ...(url && { url, url_title: 'View Dashboard' })
                };

                const result = await pushover.sendMessage(message, options);
                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: 'Monitoring alert sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send monitoring alert: ${error.message}`);
            }
        },

        sendPaymentNotification: async (_, { message, title }) => {
            try {
                const options = {
                    title: title || '💳 Payment Notification',
                    priority: 1,
                    sound: 'cashregister'
                };

                const result = await pushover.sendMessage(message, options);
                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: 'Payment notification sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send payment notification: ${error.message}`);
            }
        },

        sendWeatherAlert: async (_, { message, title }) => {
            try {
                const options = {
                    title: title || '🌤️ Weather Alert',
                    priority: 0,
                    sound: 'cosmic'
                };

                const result = await pushover.sendMessage(message, options);
                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: 'Weather alert sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send weather alert: ${error.message}`);
            }
        },

        sendNewsNotification: async (_, { message, title, url }) => {
            try {
                const options = {
                    title: title || '📰 News Notification',
                    priority: 0,
                    sound: 'bugle',
                    ...(url && { url, url_title: 'Read More' })
                };

                const result = await pushover.sendMessage(message, options);
                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: 'News notification sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send news notification: ${error.message}`);
            }
        },

        sendSocialNotification: async (_, { message, title }) => {
            try {
                const options = {
                    title: title || '📱 Social Notification',
                    priority: -1,
                    sound: 'incoming'
                };

                const result = await pushover.sendMessage(message, options);
                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: 'Social notification sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send social notification: ${error.message}`);
            }
        },

        sendEmailNotification: async (_, { message, title }) => {
            try {
                const options = {
                    title: title || '📧 Email Notification',
                    priority: 0,
                    sound: 'incoming'
                };

                const result = await pushover.sendMessage(message, options);
                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: 'Email notification sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send email notification: ${error.message}`);
            }
        },

        sendSMSNotification: async (_, { message, title }) => {
            try {
                const options = {
                    title: title || '💬 SMS Notification',
                    priority: 1,
                    sound: 'magic'
                };

                const result = await pushover.sendMessage(message, options);
                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: 'SMS notification sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send SMS notification: ${error.message}`);
            }
        },

        sendCallNotification: async (_, { message, title }) => {
            try {
                const options = {
                    title: title || '📞 Call Notification',
                    priority: 2,
                    sound: 'siren',
                    expire: 3600,
                    retry: 60
                };

                const result = await pushover.sendMessage(message, options);
                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: 'Call notification sent successfully'
                };
            } catch (error) {
                throw new Error(`Failed to send call notification: ${error.message}`);
            }
        },

        sendByCategory: async (_, { category, message, title, priority }) => {
            try {
                const categoryConfig = getCategoryConfig(category);
                const options = {
                    title: title || `${categoryConfig.icon} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                    priority: getPriorityNumber(priority) || categoryConfig.priority,
                    sound: categoryConfig.sound
                };

                const result = await pushover.sendMessage(message, options);
                return {
                    success: true,
                    status: 1,
                    data: result,
                    message: `${category} notification sent successfully`
                };
            } catch (error) {
                throw new Error(`Failed to send ${category} notification: ${error.message}`);
            }
        }
    },

    Subscription: {
        notificationSent: {
            subscribe: () => {
                throw new Error('Subscriptions not implemented yet');
            }
        },
        emergencyAlert: {
            subscribe: () => {
                throw new Error('Subscriptions not implemented yet');
            }
        },
        systemAlert: {
            subscribe: () => {
                throw new Error('Subscriptions not implemented yet');
            }
        }
    }
};

module.exports = resolvers; 