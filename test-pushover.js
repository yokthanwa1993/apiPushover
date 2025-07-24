require('dotenv').config();
const axios = require('axios');

class PushoverAPI {
    constructor() {
        this.baseURL = 'https://api.pushover.net/1';
        this.appToken = process.env.PUSHOVER_APP_TOKEN;
        this.userKey = process.env.PUSHOVER_USER_KEY;
        this.device = process.env.PUSHOVER_DEVICE;
        
        if (!this.appToken || !this.userKey) {
            throw new Error('PUSHOVER_APP_TOKEN and PUSHOVER_USER_KEY must be set in .env file');
        }
    }

    /**
     * Send a push notification
     * @param {string} message - The message content
     * @param {Object} options - Optional parameters
     */
    async sendMessage(message, options = {}) {
        try {
            const data = {
                token: this.appToken,
                user: this.userKey,
                message: message,
                ...options
            };

            // Add device if specified
            if (this.device) {
                data.device = this.device;
            }

            console.log('Sending message:', { message, ...options });
            
            const response = await axios.post(`${this.baseURL}/messages.json`, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            console.log('✅ Message sent successfully!');
            console.log('Response:', response.data);
            
            // Log rate limit headers
            console.log('Rate Limit Info:');
            console.log(`- App Limit: ${response.headers['x-limit-app-limit']}`);
            console.log(`- Remaining: ${response.headers['x-limit-app-remaining']}`);
            console.log(`- Reset Time: ${new Date(response.headers['x-limit-app-reset'] * 1000)}`);
            
            return response.data;
        } catch (error) {
            console.error('❌ Error sending message:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Check application limits
     */
    async checkLimits() {
        try {
            console.log('Checking application limits...');
            
            const response = await axios.get(`${this.baseURL}/apps/limits.json`, {
                params: { token: this.appToken }
            });

            console.log('✅ Limits retrieved successfully!');
            console.log('Limits:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('❌ Error checking limits:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Validate user/group key
     */
    async validateUser() {
        try {
            console.log('Validating user key...');
            
            const data = {
                token: this.appToken,
                user: this.userKey
            };

            if (this.device) {
                data.device = this.device;
            }

            const response = await axios.post(`${this.baseURL}/users/validate.json`, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            console.log('✅ User validation successful!');
            console.log('Validation result:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('❌ Error validating user:', error.response?.data || error.message);
            throw error;
        }
    }
}

// Test functions
async function runTests() {
    const pushover = new PushoverAPI();
    
    console.log('🚀 Starting Pushover API Tests\n');
    
    try {
        // Test 1: Validate user
        console.log('=== Test 1: User Validation ===');
        await pushover.validateUser();
        console.log();

        // Test 2: Check limits
        console.log('=== Test 2: Check Application Limits ===');
        await pushover.checkLimits();
        console.log();

        // Test 3: Send simple message
        console.log('=== Test 3: Send Simple Message ===');
        await pushover.sendMessage('Hello from Pushover API test! 🎉');
        console.log();

        // Test 4: Send message with title
        console.log('=== Test 4: Send Message with Title ===');
        await pushover.sendMessage('This is a test message with a custom title', {
            title: 'Test Notification'
        });
        console.log();

        // Test 5: Send high priority message
        console.log('=== Test 5: Send High Priority Message ===');
        await pushover.sendMessage('This is a high priority test message!', {
            title: 'High Priority Test',
            priority: 1
        });
        console.log();

        // Test 6: Send message with URL
        console.log('=== Test 6: Send Message with URL ===');
        await pushover.sendMessage('Check out the Pushover API documentation!', {
            title: 'API Documentation',
            url: 'https://pushover.net/api',
            url_title: 'View API Docs'
        });
        console.log();

        // Test 7: Send HTML message
        console.log('=== Test 7: Send HTML Message ===');
        await pushover.sendMessage('This message contains <b>bold text</b> and <i>italic text</i>', {
            title: 'HTML Test',
            html: 1
        });
        console.log();

        console.log('🎉 All tests completed successfully!');

    } catch (error) {
        console.error('💥 Test suite failed:', error.message);
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = PushoverAPI; 