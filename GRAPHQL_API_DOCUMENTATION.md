# Pushover GraphQL API Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [GraphQL Endpoints](#graphql-endpoints)
4. [Queries](#queries)
5. [Mutations](#mutations)
6. [Notification Types](#notification-types)
7. [Templates](#templates)
8. [Categories](#categories)
9. [Priority Levels](#priority-levels)
10. [Sound Options](#sound-options)
11. [Examples](#examples)
12. [Error Handling](#error-handling)
13. [Rate Limits](#rate-limits)
14. [Best Practices](#best-practices)

## 🚀 Overview

This GraphQL API provides comprehensive access to the Pushover notification service, supporting all notification types, templates, categories, and features. The API is built with Apollo Server and Express.js, offering a modern, type-safe interface for sending push notifications.

### Features

- ✅ **20+ Notification Templates** - Pre-configured templates for different use cases
- ✅ **20+ Notification Categories** - Category-based notifications with automatic styling
- ✅ **5 Priority Levels** - From lowest to emergency priority
- ✅ **22 Sound Options** - Various notification sounds
- ✅ **Batch Notifications** - Send multiple notifications at once
- ✅ **Specialized Methods** - Dedicated methods for specific notification types
- ✅ **Full Pushover API Support** - All Pushover features including attachments, callbacks, etc.
- ✅ **GraphQL Playground** - Interactive API explorer
- ✅ **Type Safety** - Strong typing with GraphQL schema

## 🏁 Getting Started

### Prerequisites

1. **Pushover Account**: Create an account at [pushover.net](https://pushover.net)
2. **Application Token**: Register an application to get your API token
3. **User Key**: Get your user key from the Pushover dashboard

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd push

# Install dependencies
npm install

# Configure environment variables
cp env.example .env
# Edit .env with your Pushover credentials

# Start the GraphQL server
npm start
```

### Environment Variables

```env
PUSHOVER_APP_TOKEN=your_app_token_here
PUSHOVER_USER_KEY=your_user_key_here
PUSHOVER_DEVICE=your_device_name_here  # Optional
PORT=3000  # Optional, defaults to 3000
```

## 🌐 GraphQL Endpoints

| Endpoint | Description |
|----------|-------------|
| `http://localhost:3000/api/v1/graphql` | GraphQL API endpoint |
| `http://localhost:3000/api/v1/graphql` | GraphQL Playground (GET) |
| `http://localhost:3000/api/v1/health` | Health check |
| `http://localhost:3000/api/v1/docs` | API documentation |

## 📊 Queries

### Health Check

```graphql
query {
  health {
    status
    timestamp
    service
    version
  }
}
```

**Response:**
```json
{
  "data": {
    "health": {
      "status": "ok",
      "timestamp": "2025-07-24T14:57:26.360Z",
      "service": "Pushover GraphQL API Server",
      "version": "1.0.0"
    }
  }
}
```

### Check Limits

```graphql
query {
  limits {
    limit
    remaining
    reset
    status
    request
  }
}
```

**Response:**
```json
{
  "data": {
    "limits": {
      "limit": 10000,
      "remaining": 9987,
      "reset": 1754024400,
      "status": 1,
      "request": "d2e5550a-caab-4a3b-afde-f2dbe0392855"
    }
  }
}
```

### Get Available Sounds

```graphql
query {
  sounds
}
```

### Get Available Devices

```graphql
query {
  devices
}
```

### Get Available Templates

```graphql
query {
  templates
}
```

## 🔧 Mutations

### Basic Notification

```graphql
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
```

**Variables:**
```json
{
  "input": {
    "message": "Hello from GraphQL!",
    "title": "Test Notification",
    "priority": 0,
    "sound": "pushover",
    "device": "iphoneYok",
    "url": "https://example.com",
    "url_title": "View Details",
    "html": true
  }
}
```

### Emergency Alert

```graphql
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
```

**Variables:**
```json
{
  "input": {
    "message": "Server is down! Check immediately.",
    "title": "🚨 Emergency Alert",
    "url": "https://dashboard.example.com",
    "url_title": "View Dashboard",
    "expire": 3600,
    "retry": 60
  }
}
```

### Template Notifications

```graphql
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
```

**Variables:**
```json
{
  "template": "success",
  "input": {
    "message": "Task completed successfully!",
    "title": "Custom Success Title"
  }
}
```

### Batch Notifications

```graphql
mutation SendBatch($input: BatchNotificationInput!) {
  sendBatch(input: $input) {
    success
    status
    message
    sent
    failed
    data {
      status
      request
      receipt
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "notifications": [
      {
        "message": "First notification",
        "title": "Notification 1"
      },
      {
        "message": "Second notification",
        "title": "Notification 2"
      }
    ],
    "delay": 2000
  }
}
```

### User Validation

```graphql
mutation ValidateUser($input: ValidateUserInput!) {
  validateUser(input: $input) {
    status
    group
    devices
    licenses
    request
  }
}
```

**Variables:**
```json
{
  "input": {
    "user": "optional_custom_user_key",
    "device": "optional_device_name"
  }
}
```

## 🎨 Notification Types

### Specialized Notification Methods

#### System Alert
```graphql
mutation {
  sendSystemAlert(
    message: "System maintenance scheduled"
    title: "System Update"
    priority: HIGH
  ) {
    success
    message
    data {
      status
      request
    }
  }
}
```

#### User Notification
```graphql
mutation {
  sendUserNotification(
    message: "Welcome to our platform!"
    title: "Welcome"
    device: "iphoneYok"
  ) {
    success
    message
    data {
      status
      request
    }
  }
}
```

#### Business Alert
```graphql
mutation {
  sendBusinessAlert(
    message: "New order received"
    title: "Order Alert"
    priority: HIGH
  ) {
    success
    message
    data {
      status
      request
    }
  }
}
```

#### Security Alert
```graphql
mutation {
  sendSecurityAlert(
    message: "Unauthorized access detected"
    title: "Security Breach"
  ) {
    success
    message
    data {
      status
      request
    }
  }
}
```

#### Monitoring Alert
```graphql
mutation {
  sendMonitoringAlert(
    message: "Server CPU usage at 95%"
    title: "High CPU Usage"
    url: "https://monitoring.example.com"
  ) {
    success
    message
    data {
      status
      request
    }
  }
}
```

#### Payment Notification
```graphql
mutation {
  sendPaymentNotification(
    message: "Payment of $99.99 received"
    title: "Payment Confirmed"
  ) {
    success
    message
    data {
      status
      request
    }
  }
}
```

#### Weather Alert
```graphql
mutation {
  sendWeatherAlert(
    message: "Heavy rain expected today"
    title: "Weather Warning"
  ) {
    success
    message
    data {
      status
      request
    }
  }
}
```

#### News Notification
```graphql
mutation {
  sendNewsNotification(
    message: "Breaking: Major announcement"
    title: "Breaking News"
    url: "https://news.example.com"
  ) {
    success
    message
    data {
      status
      request
    }
  }
}
```

#### Social Notification
```graphql
mutation {
  sendSocialNotification(
    message: "New message from John Doe"
    title: "New Message"
  ) {
    success
    message
    data {
      status
      request
    }
  }
}
```

#### Email Notification
```graphql
mutation {
  sendEmailNotification(
    message: "New email from support@example.com"
    title: "New Email"
  ) {
    success
    message
    data {
      status
      request
    }
  }
}
```

#### SMS Notification
```graphql
mutation {
  sendSMSNotification(
    message: "Your verification code is 123456"
    title: "SMS Verification"
  ) {
    success
    message
    data {
      status
      request
    }
  }
}
```

#### Call Notification
```graphql
mutation {
  sendCallNotification(
    message: "Incoming call from +1234567890"
    title: "Incoming Call"
  ) {
    success
    message
    data {
      status
      request
    }
  }
}
```

### Category-Based Notifications

```graphql
mutation {
  sendByCategory(
    category: BUSINESS
    message: "Quarterly report is ready"
    title: "Business Update"
    priority: HIGH
  ) {
    success
    message
    data {
      status
      request
    }
  }
}
```

## 🎯 Templates

The API provides 20 pre-configured templates with appropriate icons, priorities, and sounds:

| Template | Icon | Priority | Sound | Use Case |
|----------|------|----------|-------|----------|
| `success` | ✅ | 0 | pushover | Task completion, success messages |
| `error` | ❌ | 1 | falling | Error messages, failures |
| `warning` | ⚠️ | 1 | cosmic | Warnings, alerts |
| `info` | ℹ️ | -1 | none | Information, updates |
| `reminder` | ⏰ | 0 | magic | Reminders, scheduled tasks |
| `alert` | 🚨 | 1 | siren | General alerts |
| `notification` | 📢 | 0 | pushover | General notifications |
| `update` | 🔄 | 0 | cosmic | System updates |
| `system` | ⚙️ | 1 | mechanical | System messages |
| `user` | 👤 | 0 | incoming | User-related messages |
| `payment` | 💳 | 1 | cashregister | Payment confirmations |
| `security` | 🔒 | 2 | siren | Security alerts |
| `backup` | 💾 | 0 | cosmic | Backup notifications |
| `monitoring` | 📊 | 1 | spacealarm | Monitoring alerts |
| `weather` | 🌤️ | 0 | cosmic | Weather alerts |
| `news` | 📰 | 0 | bugle | News notifications |
| `social` | 📱 | -1 | incoming | Social media notifications |
| `email` | 📧 | 0 | incoming | Email notifications |
| `sms` | 💬 | 1 | magic | SMS notifications |
| `call` | 📞 | 2 | siren | Call notifications |

## 📂 Categories

The API supports 20 notification categories with automatic styling:

| Category | Icon | Priority | Sound | Description |
|----------|------|----------|-------|-------------|
| `system` | ⚙️ | 1 | mechanical | System-related notifications |
| `user` | 👤 | 0 | incoming | User-related notifications |
| `business` | 💼 | 1 | cashregister | Business notifications |
| `personal` | 👤 | 0 | pushover | Personal notifications |
| `monitoring` | 📊 | 1 | spacealarm | Monitoring alerts |
| `security` | 🔒 | 2 | siren | Security alerts |
| `entertainment` | 🎮 | -1 | magic | Entertainment notifications |
| `news` | 📰 | 0 | bugle | News notifications |
| `weather` | 🌤️ | 0 | cosmic | Weather alerts |
| `social` | 📱 | -1 | incoming | Social media notifications |
| `communication` | 💬 | 0 | incoming | Communication notifications |
| `finance` | 💰 | 1 | cashregister | Financial notifications |
| `health` | 🏥 | 1 | falling | Health-related notifications |
| `travel` | ✈️ | 0 | cosmic | Travel notifications |
| `education` | 📚 | 0 | classical | Educational notifications |
| `sports` | ⚽ | 0 | bike | Sports notifications |
| `gaming` | 🎮 | -1 | magic | Gaming notifications |
| `music` | 🎵 | -1 | pianobar | Music notifications |
| `video` | 🎬 | -1 | magic | Video notifications |
| `other` | 📢 | 0 | pushover | Other notifications |

## 🎚️ Priority Levels

| Priority | Value | Description | Behavior |
|----------|-------|-------------|----------|
| `LOWEST` | -2 | Lowest priority | Quiet notification |
| `LOW` | -1 | Low priority | Normal notification |
| `NORMAL` | 0 | Normal priority | Default notification |
| `HIGH` | 1 | High priority | High-priority notification |
| `EMERGENCY` | 2 | Emergency priority | Emergency notification with retry |

## 🔊 Sound Options

The API supports 22 different notification sounds:

| Sound | Description |
|-------|-------------|
| `pushover` | Default Pushover sound |
| `bike` | Bicycle bell |
| `bugle` | Bugle call |
| `cashregister` | Cash register |
| `classical` | Classical music |
| `cosmic` | Cosmic sound |
| `falling` | Falling sound |
| `gamelan` | Gamelan music |
| `incoming` | Incoming message |
| `intermission` | Intermission |
| `magic` | Magic sound |
| `mechanical` | Mechanical sound |
| `pianobar` | Piano bar |
| `siren` | Siren |
| `spacealarm` | Space alarm |
| `tugboat` | Tugboat horn |
| `alien` | Alien sound |
| `climb` | Climbing sound |
| `persistent` | Persistent sound |
| `echo` | Echo sound |
| `updown` | Up and down sound |
| `none` | No sound |

## 💡 Examples

### Complete Notification with All Options

```graphql
mutation {
  sendNotification(input: {
    message: "This is a comprehensive test notification with all options!"
    title: "🔧 Full Test"
    priority: 1
    url: "https://pushover.net/api"
    url_title: "View API Docs"
    html: true
    device: "iphoneYok"
    sound: "cosmic"
    ttl: 3600
    timestamp: 1640995200
    callback: "https://your-callback-url.com/webhook"
  }) {
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
```

### Batch Notifications with Delay

```graphql
mutation {
  sendBatch(input: {
    notifications: [
      {
        message: "First notification"
        title: "Notification 1"
        priority: 0
      },
      {
        message: "Second notification"
        title: "Notification 2"
        priority: 1
      },
      {
        message: "Third notification"
        title: "Notification 3"
        priority: 2
      }
    ]
    delay: 2000
  }) {
    success
    message
    sent
    failed
    data {
      status
      request
    }
  }
}
```

### Template with Custom Options

```graphql
mutation {
  sendTemplate(
    template: "payment"
    input: {
      message: "Payment of $299.99 processed successfully"
      title: "Payment Confirmed"
      url: "https://dashboard.example.com/payments"
      url_title: "View Payment"
      html: true
    }
  ) {
    success
    template
    message
    data {
      status
      request
    }
  }
}
```

### Category-Based Notification

```graphql
mutation {
  sendByCategory(
    category: MONITORING
    message: "Server response time exceeded 5 seconds"
    title: "Performance Alert"
    priority: HIGH
  ) {
    success
    message
    data {
      status
      request
    }
  }
}
```

## ⚠️ Error Handling

The API provides comprehensive error handling with detailed error messages:

### Common Error Types

1. **Validation Errors**: Invalid input parameters
2. **Authentication Errors**: Invalid tokens or user keys
3. **Rate Limit Errors**: Exceeded monthly message limits
4. **Network Errors**: Connection issues
5. **Pushover API Errors**: Errors from Pushover service

### Error Response Format

```json
{
  "errors": [
    {
      "message": "Failed to send notification: Invalid user key",
      "path": ["sendNotification"],
      "extensions": {
        "code": "PUSHOVER_ERROR"
      }
    }
  ]
}
```

### Error Handling Best Practices

```javascript
// Example error handling in JavaScript
try {
  const response = await graphqlRequest(mutation, variables);
  if (response.data.errors) {
    console.error('GraphQL Errors:', response.data.errors);
    // Handle specific error types
    response.data.errors.forEach(error => {
      if (error.message.includes('Invalid user key')) {
        // Handle authentication error
      } else if (error.message.includes('Rate limit')) {
        // Handle rate limit error
      }
    });
  }
} catch (error) {
  console.error('Request failed:', error);
}
```

## 📊 Rate Limits

### Pushover Limits

- **Free Accounts**: 10,000 messages per month
- **Team Accounts**: 25,000 messages per month
- **Rate Limit Headers**: Included in all responses

### API Rate Limiting

- **Requests per IP**: 100 requests per 15 minutes
- **Concurrent Connections**: Maximum 2 concurrent requests
- **Retry Policy**: Wait 5 seconds between retries on 5xx errors

### Monitoring Usage

```graphql
query {
  limits {
    limit
    remaining
    reset
    status
    request
  }
}
```

## 🎯 Best Practices

### 1. Use Appropriate Templates

```graphql
# Good: Use specific template
mutation {
  sendTemplate(
    template: "payment"
    input: { message: "Payment received" }
  ) { success }
}

# Avoid: Generic notification for specific use case
mutation {
  sendNotification(input: {
    message: "Payment received"
    title: "Payment"
    priority: 1
    sound: "cashregister"
  }) { success }
}
```

### 2. Set Appropriate Priorities

```graphql
# Emergency situations
mutation {
  sendEmergency(input: {
    message: "Server is down!"
    title: "🚨 Emergency"
  }) { success }
}

# Normal notifications
mutation {
  sendNotification(input: {
    message: "Daily backup completed"
    priority: 0
  }) { success }
}

# Low priority updates
mutation {
  sendByCategory(
    category: SOCIAL
    message: "New follower on Twitter"
    priority: LOW
  ) { success }
}
```

### 3. Use Batch Notifications for Multiple Messages

```graphql
# Good: Batch notifications
mutation {
  sendBatch(input: {
    notifications: [
      { message: "Update 1" },
      { message: "Update 2" },
      { message: "Update 3" }
    ]
    delay: 1000
  }) { success }
}

# Avoid: Multiple individual requests
mutation { sendNotification(input: { message: "Update 1" }) { success } }
mutation { sendNotification(input: { message: "Update 2" }) { success } }
mutation { sendNotification(input: { message: "Update 3" }) { success } }
```

### 4. Include Relevant URLs

```graphql
mutation {
  sendMonitoringAlert(
    message: "High CPU usage detected"
    title: "Performance Alert"
    url: "https://monitoring.example.com/dashboard"
  ) { success }
}
```

### 5. Use HTML for Rich Content

```graphql
mutation {
  sendNotification(input: {
    message: "User <b>John Doe</b> registered with <i>premium</i> plan"
    html: true
  }) { success }
}
```

### 6. Set Appropriate TTL

```graphql
mutation {
  sendNotification(input: {
    message: "Temporary maintenance notice"
    ttl: 3600  # Expires in 1 hour
  }) { success }
}
```

### 7. Use Device-Specific Notifications

```graphql
mutation {
  sendUserNotification(
    message: "Mobile app update available"
    title: "App Update"
    device: "iphoneYok"
  ) { success }
}
```

## 🔧 Advanced Features

### Attachments

```graphql
mutation {
  sendNotification(input: {
    message: "Screenshot attached"
    attachment_base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    attachment_type: "image/png"
  }) { success }
}
```

### Callbacks

```graphql
mutation {
  sendNotification(input: {
    message: "Click to acknowledge"
    callback: "https://your-server.com/webhook"
  }) { success }
}
```

### Custom Timestamps

```graphql
mutation {
  sendNotification(input: {
    message: "Scheduled notification"
    timestamp: 1640995200  # Unix timestamp
  }) { success }
}
```

## 📱 Testing

### Using GraphQL Playground

1. Open http://localhost:3000/api/v1/graphql
2. Use the interactive playground to test queries and mutations
3. Explore the schema documentation
4. Test with different variables

### Using curl

```bash
# Health check
curl -X POST http://localhost:3000/api/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { health { status } }"}'

# Send notification
curl -X POST http://localhost:3000/api/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation SendNotification($input: SendNotificationInput!) { sendNotification(input: $input) { success message } }",
    "variables": {
      "input": {
        "message": "Test notification",
        "title": "Test"
      }
    }
  }'
```

### Using JavaScript

```javascript
const axios = require('axios');

async function sendNotification(message, title) {
  const response = await axios.post('http://localhost:3000/api/v1/graphql', {
    query: `
      mutation SendNotification($input: SendNotificationInput!) {
        sendNotification(input: $input) {
          success
          message
          data {
            status
            request
          }
        }
      }
    `,
    variables: {
      input: { message, title }
    }
  }, {
    headers: { 'Content-Type': 'application/json' }
  });

  return response.data;
}

// Usage
sendNotification('Hello from JavaScript!', 'JS Test')
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Use secure environment variables
2. **HTTPS**: Enable HTTPS in production
3. **Rate Limiting**: Configure appropriate rate limits
4. **Monitoring**: Set up monitoring and logging
5. **Error Handling**: Implement comprehensive error handling
6. **Security**: Use helmet and other security middleware

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Configuration

```env
# Production environment
NODE_ENV=production
PORT=3000
PUSHOVER_APP_TOKEN=your_production_token
PUSHOVER_USER_KEY=your_production_user_key
PUSHOVER_DEVICE=production_device

# Security
HELMET_ENABLED=true
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📞 Support

For issues and questions:

1. **GraphQL Playground**: http://localhost:3000/api/v1/graphql
2. **API Documentation**: http://localhost:3000/api/v1/docs
3. **Health Check**: http://localhost:3000/api/v1/health
4. **Pushover Documentation**: https://pushover.net/api

## 📄 License

MIT License - feel free to use this API in your projects! 