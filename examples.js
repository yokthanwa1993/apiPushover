require('dotenv').config();
const PushoverAPI = require('./test-pushover');

// Initialize the API
const pushover = new PushoverAPI();

// Example 1: Server monitoring notification
async function serverDownAlert() {
    try {
        await pushover.sendMessage('Server is not responding! Check immediately.', {
            title: '🚨 Server Down Alert',
            priority: 2,
            sound: 'siren',
            url: 'https://your-monitoring-dashboard.com',
            url_title: 'View Dashboard',
            expire: 3600, // Expires in 1 hour
            retry: 60     // Retry every 60 seconds
        });
        console.log('Server down alert sent!');
    } catch (error) {
        console.error('Failed to send server alert:', error.message);
    }
}

// Example 2: Task completion notification
async function taskCompleted() {
    try {
        await pushover.sendMessage('Database backup completed successfully', {
            title: '✅ Backup Complete',
            priority: 0,
            sound: 'pushover'
        });
        console.log('Task completion notification sent!');
    } catch (error) {
        console.error('Failed to send task notification:', error.message);
    }
}

// Example 3: Daily summary
async function dailySummary() {
    try {
        const summary = `
📊 Daily Summary Report

• Users registered: 25
• Orders processed: 150
• Revenue: $2,450
• Errors: 0

All systems operational! 🎉
        `.trim();

        await pushover.sendMessage(summary, {
            title: '📈 Daily Summary',
            priority: 0,
            html: 1
        });
        console.log('Daily summary sent!');
    } catch (error) {
        console.error('Failed to send daily summary:', error.message);
    }
}

// Example 4: Weather alert
async function weatherAlert() {
    try {
        await pushover.sendMessage('Heavy rain expected today. Bring an umbrella! ☔', {
            title: '🌧️ Weather Alert',
            priority: 1,
            sound: 'cosmic',
            ttl: 3600 // Expires in 1 hour
        });
        console.log('Weather alert sent!');
    } catch (error) {
        console.error('Failed to send weather alert:', error.message);
    }
}

// Example 5: Reminder notification
async function reminder() {
    try {
        await pushover.sendMessage('Don\'t forget to submit your weekly report!', {
            title: '⏰ Reminder',
            priority: 0,
            sound: 'magic',
            url: 'https://your-app.com/reports',
            url_title: 'Submit Report'
        });
        console.log('Reminder sent!');
    } catch (error) {
        console.error('Failed to send reminder:', error.message);
    }
}

// Example 6: Error notification with details
async function errorNotification() {
    try {
        const errorDetails = `
❌ Application Error

Error: Database connection failed
Time: ${new Date().toISOString()}
Severity: High
Component: User Authentication

Please check the logs immediately.
        `.trim();

        await pushover.sendMessage(errorDetails, {
            title: '🐛 System Error',
            priority: 1,
            sound: 'falling',
            url: 'https://your-logging-system.com',
            url_title: 'View Logs'
        });
        console.log('Error notification sent!');
    } catch (error) {
        console.error('Failed to send error notification:', error.message);
    }
}

// Example 7: Success notification
async function successNotification() {
    try {
        await pushover.sendMessage('Payment processed successfully! Transaction ID: TXN123456', {
            title: '💳 Payment Success',
            priority: 0,
            sound: 'cashregister'
        });
        console.log('Success notification sent!');
    } catch (error) {
        console.error('Failed to send success notification:', error.message);
    }
}

// Example 8: Low priority info
async function infoNotification() {
    try {
        await pushover.sendMessage('New user John Doe registered on the platform', {
            title: 'ℹ️ New User',
            priority: -1,
            sound: 'none'
        });
        console.log('Info notification sent!');
    } catch (error) {
        console.error('Failed to send info notification:', error.message);
    }
}

// Run all examples
async function runExamples() {
    console.log('🚀 Running Pushover API Examples\n');
    
    // Wait 2 seconds between notifications to avoid rate limiting
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
        await serverDownAlert();
        await delay(2000);
        
        await taskCompleted();
        await delay(2000);
        
        await dailySummary();
        await delay(2000);
        
        await weatherAlert();
        await delay(2000);
        
        await reminder();
        await delay(2000);
        
        await errorNotification();
        await delay(2000);
        
        await successNotification();
        await delay(2000);
        
        await infoNotification();
        
        console.log('\n🎉 All examples completed!');
    } catch (error) {
        console.error('💥 Examples failed:', error.message);
    }
}

// Export functions for individual use
module.exports = {
    serverDownAlert,
    taskCompleted,
    dailySummary,
    weatherAlert,
    reminder,
    errorNotification,
    successNotification,
    infoNotification,
    runExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
    runExamples();
} 