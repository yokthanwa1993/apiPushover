const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Health {
    status: String!
    timestamp: String!
    service: String!
    version: String!
  }

  type Limits {
    limit: Int!
    remaining: Int!
    reset: Int!
    status: Int!
    request: String!
  }

  type ValidationResult {
    status: Int!
    group: Int!
    devices: [String!]!
    licenses: [String!]!
    request: String!
  }

  type NotificationResponse {
    status: Int!
    request: String!
    receipt: String
  }

  type SendNotificationResponse {
    success: Boolean!
    status: Int!
    data: NotificationResponse!
    message: String!
  }

  type EmergencyResponse {
    success: Boolean!
    status: Int!
    data: NotificationResponse!
    message: String!
  }

  type TemplateResponse {
    success: Boolean!
    status: Int!
    data: NotificationResponse!
    template: String!
    message: String!
  }

  type BatchNotificationResponse {
    success: Boolean!
    status: Int!
    data: [NotificationResponse!]!
    message: String!
    sent: Int!
    failed: Int!
  }

  type Error {
    error: String!
    status: Int!
    details: String
  }

  # Comprehensive notification input
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

  input EmergencyInput {
    message: String!
    title: String
    url: String
    url_title: String
    expire: Int
    retry: Int
    callback: String
  }

  input TemplateInput {
    message: String!
    title: String
    priority: Int
    url: String
    url_title: String
    html: Boolean
    device: String
    sound: String
    ttl: Int
    timestamp: Int
    callback: String
  }

  input ValidateUserInput {
    user: String
    device: String
  }

  input BatchNotificationInput {
    notifications: [SendNotificationInput!]!
    delay: Int
  }

  # Notification types
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

  # Priority levels
  enum Priority {
    LOWEST
    LOW
    NORMAL
    HIGH
    EMERGENCY
  }

  # Sound options
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

  # Device types
  enum DeviceType {
    iphone
    ipad
    android
    desktop
    web
    mac
    windows
    linux
    chrome
    firefox
    safari
    edge
  }

  # Notification categories
  enum NotificationCategory {
    system
    user
    business
    personal
    monitoring
    security
    entertainment
    news
    weather
    social
    communication
    finance
    health
    travel
    education
    sports
    gaming
    music
    video
    other
  }

  type Query {
    health: Health!
    limits: Limits!
    sounds: [String!]!
    devices: [String!]!
    templates: [TemplateType!]!
  }

  type Mutation {
    # Basic notification
    sendNotification(input: SendNotificationInput!): SendNotificationResponse!
    
    # Emergency notification
    sendEmergency(input: EmergencyInput!): EmergencyResponse!
    
    # Template-based notifications
    sendTemplate(template: TemplateType!, input: TemplateInput!): TemplateResponse!
    
    # Batch notifications
    sendBatch(input: BatchNotificationInput!): BatchNotificationResponse!
    
    # User validation
    validateUser(input: ValidateUserInput!): ValidationResult!
    
    # Specialized notifications
    sendSystemAlert(message: String!, title: String, priority: Priority): SendNotificationResponse!
    sendUserNotification(message: String!, title: String, device: String): SendNotificationResponse!
    sendBusinessAlert(message: String!, title: String, priority: Priority): SendNotificationResponse!
    sendSecurityAlert(message: String!, title: String): SendNotificationResponse!
    sendMonitoringAlert(message: String!, title: String, url: String): SendNotificationResponse!
    sendPaymentNotification(message: String!, title: String): SendNotificationResponse!
    sendWeatherAlert(message: String!, title: String): SendNotificationResponse!
    sendNewsNotification(message: String!, title: String, url: String): SendNotificationResponse!
    sendSocialNotification(message: String!, title: String): SendNotificationResponse!
    sendEmailNotification(message: String!, title: String): SendNotificationResponse!
    sendSMSNotification(message: String!, title: String): SendNotificationResponse!
    sendCallNotification(message: String!, title: String): SendNotificationResponse!
    
    # Category-based notifications
    sendByCategory(category: NotificationCategory!, message: String!, title: String, priority: Priority): SendNotificationResponse!
  }

  type Subscription {
    notificationSent: NotificationResponse!
    emergencyAlert: NotificationResponse!
    systemAlert: NotificationResponse!
  }
`;

module.exports = typeDefs; 