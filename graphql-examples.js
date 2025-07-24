const axios = require('axios');

const GRAPHQL_ENDPOINT = 'http://localhost:3000/api/v1/graphql';

// Helper function to make GraphQL requests
async function graphqlRequest(query, variables = {}) {
    try {
        const response = await axios.post(GRAPHQL_ENDPOINT, {
            query,
            variables
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.errors) {
            console.error('GraphQL Errors:', response.data.errors);
            return null;
        }

        return response.data.data;
    } catch (error) {
        console.error('Request failed:', error.response?.data || error.message);
        return null;
    }
}

// Example 1: Health check
async function checkHealth() {
    console.log('=== Health Check ===');
    const query = `
        query {
            health {
                status
                timestamp
                service
                version
            }
        }
    `;
    
    const result = await graphqlRequest(query);
    if (result) {
        console.log('✅ Health check successful:', result.health);
    }
}

// Example 2: Check limits
async function checkLimits() {
    console.log('\n=== Check Limits ===');
    const query = `
        query {
            limits {
                limit
                remaining
                reset
                status
                request
            }
        }
    `;
    
    const result = await graphqlRequest(query);
    if (result) {
        console.log('✅ Limits retrieved:', result.limits);
    }
}

// Example 3: Send simple notification
async function sendSimpleNotification() {
    console.log('\n=== Send Simple Notification ===');
    const mutation = `
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
    `;
    
    const variables = {
        input: {
            message: "Hello from GraphQL! 🎉",
            title: "GraphQL Test",
            priority: 0
        }
    };
    
    const result = await graphqlRequest(mutation, variables);
    if (result) {
        console.log('✅ Notification sent:', result.sendNotification);
    }
}

// Example 4: Send emergency alert
async function sendEmergencyAlert() {
    console.log('\n=== Send Emergency Alert ===');
    const mutation = `
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
    `;
    
    const variables = {
        input: {
            message: "This is a test emergency alert from GraphQL!",
            title: "🚨 Test Emergency"
        }
    };
    
    const result = await graphqlRequest(mutation, variables);
    if (result) {
        console.log('✅ Emergency alert sent:', result.sendEmergency);
    }
}

// Example 5: Send template notifications
async function sendTemplateNotifications() {
    console.log('\n=== Send Template Notifications ===');
    
    const templates = [
        { name: 'success', message: 'Task completed successfully!' },
        { name: 'error', message: 'An error occurred during processing' },
        { name: 'warning', message: 'System resources are running low' },
        { name: 'info', message: 'New user registered on the platform' },
        { name: 'reminder', message: 'Don\'t forget to submit your report!' }
    ];
    
    const mutation = `
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
    `;
    
    for (const template of templates) {
        console.log(`Sending ${template.name} template...`);
        
        const variables = {
            template: template.name,
            input: {
                message: template.message
            }
        };
        
        const result = await graphqlRequest(mutation, variables);
        if (result) {
            console.log(`✅ ${template.name} template sent:`, result.sendTemplate.template);
        }
        
        // Wait 2 seconds between notifications
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

// Example 6: Validate user
async function validateUser() {
    console.log('\n=== Validate User ===');
    const mutation = `
        mutation ValidateUser($input: ValidateUserInput!) {
            validateUser(input: $input) {
                status
                group
                devices
                licenses
                request
            }
        }
    `;
    
    const variables = {
        input: {
            // Use default user from env, or specify custom user key
            // user: "custom_user_key_here"
        }
    };
    
    const result = await graphqlRequest(mutation, variables);
    if (result) {
        console.log('✅ User validation successful:', result.validateUser);
    }
}

// Example 7: Send notification with all options
async function sendFullNotification() {
    console.log('\n=== Send Full Notification ===');
    const mutation = `
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
    `;
    
    const variables = {
        input: {
            message: "This is a comprehensive test notification with all options!",
            title: "🔧 Full Test",
            priority: 1,
            url: "https://pushover.net/api",
            url_title: "View API Docs",
            html: true,
            device: "iphoneYok",
            sound: "cosmic",
            ttl: 3600
        }
    };
    
    const result = await graphqlRequest(mutation, variables);
    if (result) {
        console.log('✅ Full notification sent:', result.sendNotification);
    }
}

// Run all examples
async function runAllExamples() {
    console.log('🚀 Running GraphQL Examples\n');
    
    try {
        await checkHealth();
        await checkLimits();
        await validateUser();
        await sendSimpleNotification();
        await sendEmergencyAlert();
        await sendTemplateNotifications();
        await sendFullNotification();
        
        console.log('\n🎉 All GraphQL examples completed successfully!');
    } catch (error) {
        console.error('💥 Examples failed:', error.message);
    }
}

// Export functions for individual use
module.exports = {
    checkHealth,
    checkLimits,
    sendSimpleNotification,
    sendEmergencyAlert,
    sendTemplateNotifications,
    validateUser,
    sendFullNotification,
    runAllExamples,
    graphqlRequest
};

// Run examples if this file is executed directly
if (require.main === module) {
    runAllExamples();
} 