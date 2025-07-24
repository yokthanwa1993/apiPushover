# Pushover API Server & Test Suite

A comprehensive Node.js application that provides both a **GraphQL API server** and **test suite** for the [Pushover API](https://pushover.net/api#messages). This project demonstrates how to send push notifications, check limits, validate users, and build a production-ready API server.

## 🚀 Features

### GraphQL API Server
- ✅ **GraphQL API** with Apollo Server
- ✅ **REST endpoints** for health checks and documentation
- ✅ **Security middleware** (Helmet, CORS, Rate Limiting)
- ✅ **Comprehensive error handling**
- ✅ **API documentation** endpoint
- ✅ **Health monitoring**

### Pushover Integration
- ✅ Send push notifications with various options
- ✅ Check application limits and usage
- ✅ Validate user/group keys and devices
- ✅ Support for HTML messages
- ✅ Priority levels (-2 to 2)
- ✅ Supplementary URLs and titles
- ✅ Device-specific notifications
- ✅ Custom notification sounds
- ✅ Emergency alerts with receipts
- ✅ Template-based notifications
- ✅ Rate limit monitoring
- ✅ Batch notifications

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [GraphQL API Server](#graphql-api-server)
  - [Test Script](#test-script)
  - [REST API](#rest-api)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Development](#development)

## ⚡ Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd push
npm install
```

### 2. Configure Environment
```bash
cp env.example .env
# Edit .env with your Pushover credentials
```

### 3. Start the Server
```bash
npm start
```

### 4. Test the API
```bash
# Health check
curl http://localhost:3000/api/v1/health

# Send notification via GraphQL
curl -X POST http://localhost:3000/api/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation SendNotification($input: SendNotificationInput!) { sendNotification(input: $input) { success status message } }","variables":{"input":{"message":"Hello from API!","title":"Test"}}}'
```

## 🔧 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Pushover account and API credentials

### Install Dependencies
```bash
npm install
```

### Development Dependencies
```bash
npm install -D nodemon
```

## ⚙️ Configuration

### 1. Get Pushover API Credentials

1. **Create Account**: Go to [Pushover](https://pushover.net/) and create an account
2. **Register Application**: Visit https://pushover.net/apps/build
3. **Get Tokens**:
   - **Application API Token** (APP_TOKEN) - from your app settings
   - **User Key** (USER_KEY) - from your dashboard
4. **Optional**: Set specific device name

### 2. Environment Variables

Copy the example file and configure:
```bash
cp env.example .env
```

Edit `.env`:
```env
# Pushover API Configuration
PUSHOVER_APP_TOKEN=your_actual_app_token_here
PUSHOVER_USER_KEY=your_actual_user_key_here
PUSHOVER_DEVICE=your_device_name_here  # Optional

# Server Configuration
PORT=3000  # Optional, defaults to 3000
NODE_ENV=development  # Optional
```

## 🎯 Usage

### GraphQL API Server

#### Start the Server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev

# Alternative REST server
npm run rest
```

#### Server Endpoints
- **GraphQL Playground**: http://localhost:3000/api/v1/graphql
- **Health Check**: http://localhost:3000/api/v1/health
- **API Documentation**: http://localhost:3000/api/v1/docs

#### GraphQL Queries

**Health Check**
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

**Check Limits**
```graphql
query {
  limits {
    remaining
    limit
    reset
    status
    request
  }
}
```

#### GraphQL Mutations

**Send Notification**
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
    "sound": "pushover"
  }
}
```

**Send Emergency Alert**
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

**Send Template Notification**
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

**Validate User**
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

### Test Script

#### Run All Tests
```bash
npm test
```

Or directly:
```bash
node test-pushover.js
```

#### Use as Module
```javascript
const PushoverAPI = require('./test-pushover');

const pushover = new PushoverAPI();

// Send a simple message
await pushover.sendMessage('Hello World!');

// Send with options
await pushover.sendMessage('Important notification!', {
    title: 'Alert',
    priority: 1,
    url: 'https://example.com',
    url_title: 'View Details'
});
```

### REST API

#### Health Check
```bash
curl http://localhost:3000/api/v1/health
```

#### API Documentation
```bash
curl http://localhost:3000/api/v1/docs
```

## 📚 API Reference

### GraphQL Schema

#### Types

**Health**
```graphql
type Health {
  status: String!
  timestamp: String!
  service: String!
  version: String!
}
```

**Limits**
```graphql
type Limits {
  limit: Int!
  remaining: Int!
  reset: Int!
  status: Int!
  request: String!
}
```

**NotificationResponse**
```graphql
type NotificationResponse {
  status: Int!
  request: String!
  receipt: String
}
```

**SendNotificationResponse**
```graphql
type SendNotificationResponse {
  success: Boolean!
  status: Int!
  data: NotificationResponse!
  message: String!
}
```

#### Input Types

**SendNotificationInput**
```graphql
input SendNotificationInput {
  message: String!
  title: String
  priority: Int
  url: String
  url_title: String
  html: Boolean
  device: String
  sound: String
  ttl: Int
  expire: Int
  retry: Int
  timestamp: Int
  callback: String
  attachment: String
  attachment_base64: String
  attachment_type: String
}
```

**EmergencyInput**
```graphql
input EmergencyInput {
  message: String!
  title: String
  url: String
  url_title: String
  expire: Int
  retry: Int
  callback: String
}
```

#### Enums

**TemplateType**
```graphql
enum TemplateType {
  success
  error
  warning
  info
  reminder
  alert
  notification
  update
  system
  user
  payment
  security
  backup
  monitoring
  weather
  news
  social
  email
  sms
  call
}
```

**Priority**
```graphql
enum Priority {
  LOWEST
  LOW
  NORMAL
  HIGH
  EMERGENCY
}
```

**Sound**
```graphql
enum Sound {
  pushover
  bike
  bugle
  cashregister
  classical
  cosmic
  falling
  gamelan
  incoming
  intermission
  magic
  mechanical
  pianobar
  siren
  spacealarm
  tugboat
  alien
  climb
  persistent
  echo
  updown
  none
}
```

### API Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `message` | string | Message content (required) | - |
| `title` | string | Message title | App name |
| `priority` | number | Priority level (-2 to 2) | 0 |
| `url` | string | Supplementary URL | - |
| `url_title` | string | Title for the URL | - |
| `html` | boolean | Enable HTML parsing | false |
| `device` | string | Target specific device | All devices |
| `sound` | string | Custom notification sound | Default |
| `timestamp` | number | Unix timestamp | Current time |
| `ttl` | number | Time to live (seconds) | - |
| `expire` | number | Emergency expire time | 3600 |
| `retry` | number | Emergency retry interval | 60 |

## 💡 Examples

### cURL Examples

#### Send Simple Notification
```bash
curl -X POST http://localhost:3000/api/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation SendNotification($input: SendNotificationInput!) { sendNotification(input: $input) { success status message } }",
    "variables": {
      "input": {
        "message": "Hello from cURL!",
        "title": "Test Notification"
      }
    }
  }'
```

#### Send Emergency Alert
```bash
curl -X POST http://localhost:3000/api/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation SendEmergency($input: EmergencyInput!) { sendEmergency(input: $input) { success status message data { receipt } } }",
    "variables": {
      "input": {
        "message": "🚨 Server is down!",
        "title": "Emergency Alert"
      }
    }
  }'
```

#### Send Template Notification
```bash
curl -X POST http://localhost:3000/api/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation SendTemplate($template: TemplateType!, $input: TemplateInput!) { sendTemplate(template: $template, input: $input) { success template message } }",
    "variables": {
      "template": "success",
      "input": {
        "message": "Task completed successfully!"
      }
    }
  }'
```

#### Validate User
```bash
curl -X POST http://localhost:3000/api/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ValidateUser($input: ValidateUserInput!) { validateUser(input: $input) { status devices licenses } }",
    "variables": {
      "input": {
        "user": "your_user_key_here"
      }
    }
  }'
```

### JavaScript Examples

#### Using the Test Script
```javascript
const PushoverAPI = require('./test-pushover');

const pushover = new PushoverAPI();

// Send emergency alert
await pushover.sendMessage('Server is down!', {
    title: '🚨 Emergency Alert',
    priority: 2,
    sound: 'siren',
    expire: 3600,
    retry: 60
});

// Send with custom sound
await pushover.sendMessage('Task completed successfully', {
    title: '✅ Success',
    sound: 'pushover'
});

// Send to specific device
await pushover.sendMessage('Device-specific message', {
    device: 'iphone'
});

// Send HTML message
await pushover.sendMessage('<b>Bold text</b> and <i>italic text</i>', {
    html: true,
    title: 'HTML Message'
});
```

#### Using GraphQL Client
```javascript
const { ApolloClient, InMemoryCache, gql } = require('@apollo/client');

const client = new ApolloClient({
  uri: 'http://localhost:3000/api/v1/graphql',
  cache: new InMemoryCache(),
});

// Send notification
const SEND_NOTIFICATION = gql`
  mutation SendNotification($input: SendNotificationInput!) {
    sendNotification(input: $input) {
      success
      status
      message
    }
  }
`;

const result = await client.mutate({
  mutation: SEND_NOTIFICATION,
  variables: {
    input: {
      message: "Hello from Apollo Client!",
      title: "Test"
    }
  }
});
```

## 🔧 Troubleshooting

### Common Issues

#### 1. "Invalid token" error
**Cause**: Incorrect APP_TOKEN
**Solution**:
- Check that your APP_TOKEN is correct
- Ensure the application is registered and active
- Verify the token in your Pushover app settings

#### 2. "Invalid user" error
**Cause**: Incorrect USER_KEY or no active devices
**Solution**:
- Verify your USER_KEY is correct
- Make sure you have at least one active device
- Check your Pushover dashboard

#### 3. Rate limit exceeded
**Cause**: Monthly message limit reached
**Solution**:
- Check your monthly usage: `curl -X POST http://localhost:3000/api/v1/graphql -H "Content-Type: application/json" -d '{"query":"query { limits { remaining limit reset } }"}'`
- Wait until the next month or upgrade your plan
- Free accounts: 10,000 messages/month
- Team accounts: 25,000 messages/month

#### 4. Network errors
**Cause**: Connection issues
**Solution**:
- Check your internet connection
- Verify the API endpoint is accessible
- Check firewall settings

#### 5. GraphQL validation errors
**Cause**: Incorrect query structure
**Solution**:
- Use the GraphQL Playground to test queries
- Check the schema documentation
- Verify input types and required fields

### Debug Mode

The server automatically logs detailed information:
- API responses and errors
- Rate limit information
- Request/response details

### Logs

Check server logs for detailed error information:
```bash
# View server logs
npm start

# Development mode with detailed logging
npm run dev
```

## 🛠️ Development

### Project Structure
```
push/
├── server-graphql.js      # Main GraphQL server
├── server.js              # Alternative REST server
├── test-pushover.js       # Test script
├── schema.js              # GraphQL schema
├── resolvers.js           # GraphQL resolvers
├── package.json           # Dependencies
├── env.example            # Environment template
└── README.md              # This file
```

### Available Scripts
```bash
npm start          # Start GraphQL server
npm run dev        # Start with nodemon (development)
npm run rest       # Start REST server
npm test           # Run test script
```

### Adding New Features

#### 1. Add New GraphQL Type
Edit `schema.js`:
```javascript
const typeDefs = gql`
  type NewType {
    id: ID!
    name: String!
    value: Int!
  }
`;
```

#### 2. Add New Resolver
Edit `resolvers.js`:
```javascript
const resolvers = {
  Query: {
    newQuery: async () => {
      // Implementation
    }
  },
  Mutation: {
    newMutation: async (_, { input }) => {
      // Implementation
    }
  }
};
```

#### 3. Add New Template
Edit `resolvers.js` in the template mapping:
```javascript
const templateConfigs = {
  // ... existing templates
  newTemplate: {
    title: 'New Template',
    priority: 0,
    sound: 'pushover'
  }
};
```

### Testing

#### Run Tests
```bash
npm test
```

#### Manual Testing
1. Start the server: `npm start`
2. Open GraphQL Playground: http://localhost:3000/api/v1/graphql
3. Test queries and mutations
4. Check notifications on your device

#### API Testing
```bash
# Health check
curl http://localhost:3000/api/v1/health

# Send test notification
curl -X POST http://localhost:3000/api/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation SendNotification($input: SendNotificationInput!) { sendNotification(input: $input) { success } }","variables":{"input":{"message":"Test"}}}'
```

## 📊 Rate Limits

- **Free accounts**: 10,000 messages per month
- **Team accounts**: 25,000 messages per month
- **Rate limit info** is displayed after each API call
- **Reset time** is shown in the limits query

## 🔒 Security

The server includes several security features:
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Validation**: GraphQL schema validation
- **Error Handling**: Comprehensive error management

## 📄 License

MIT License - feel free to use this code in your projects!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Test with the GraphQL Playground
4. Check server logs for detailed error information

---

**Happy coding! 🚀** 