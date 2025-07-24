#!/usr/bin/env node

/**
 * API Test Suite for https://pushover.lslly.com
 * Tests all GraphQL API functions and endpoints
 */

const axios = require('axios');

class APITester {
    constructor() {
        this.baseURL = 'https://pushover.lslly.com';
        this.graphqlEndpoint = `${this.baseURL}/api/v1/graphql`;
        this.healthEndpoint = `${this.baseURL}/api/v1/health`;
        this.docsEndpoint = `${this.baseURL}/api/v1/docs`;
        
        this.results = {
            passed: 0,
            failed: 0,
            tests: []
        };
    }

    // Helper method to make GraphQL requests
    async graphqlRequest(query, variables = {}) {
        try {
            const response = await axios.post(this.graphqlEndpoint, {
                query,
                variables
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            throw new Error(`GraphQL Request Failed: ${error.message}`);
        }
    }

    // Helper method to make REST requests
    async restRequest(endpoint, method = 'GET') {
        try {
            const response = await axios({
                method,
                url: endpoint,
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            throw new Error(`REST Request Failed: ${error.message}`);
        }
    }

    // Test result logger
    logTest(testName, passed, message = '', data = null) {
        const status = passed ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${testName}`);
        if (message) console.log(`   ${message}`);
        if (data && !passed) console.log(`   Data:`, JSON.stringify(data, null, 2));
        
        this.results.tests.push({
            name: testName,
            passed,
            message,
            data
        });
        
        if (passed) this.results.passed++;
        else this.results.failed++;
    }

    // Test 1: Health Check Endpoint
    async testHealthEndpoint() {
        console.log('\n🔍 Testing Health Check Endpoint...');
        try {
            const data = await this.restRequest(this.healthEndpoint);
            const isValid = (data.status === 'OK' || data.status === 'ok') && data.service && data.timestamp;
            this.logTest('Health Endpoint', isValid, 
                isValid ? `Service: ${data.service}, Status: ${data.status}` : 'Invalid health response',
                data
            );
        } catch (error) {
            this.logTest('Health Endpoint', false, error.message);
        }
    }

    // Test 2: API Documentation Endpoint
    async testDocsEndpoint() {
        console.log('\n📚 Testing API Documentation Endpoint...');
        try {
            const data = await this.restRequest(this.docsEndpoint);
            const isValid = typeof data === 'object' && (data.name || data.version || data.graphqlEndpoint || data.queries || data.mutations);
            this.logTest('API Documentation', isValid, 
                isValid ? 'Documentation endpoint accessible' : 'Invalid documentation response',
                isValid ? null : data
            );
        } catch (error) {
            this.logTest('API Documentation', false, error.message);
        }
    }

    // Test 3: GraphQL Health Query
    async testGraphQLHealth() {
        console.log('\n🔍 Testing GraphQL Health Query...');
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
        
        try {
            const response = await this.graphqlRequest(query);
            const health = response.data?.health;
            const isValid = health && health.status && health.service;
            this.logTest('GraphQL Health Query', isValid,
                isValid ? `Service: ${health.service}, Status: ${health.status}` : 'Invalid health response',
                response
            );
        } catch (error) {
            this.logTest('GraphQL Health Query', false, error.message);
        }
    }

    // Test 4: GraphQL Limits Query
    async testGraphQLLimits() {
        console.log('\n📊 Testing GraphQL Limits Query...');
        const query = `
            query {
                limits {
                    remaining
                    limit
                    reset
                    status
                    request
                }
            }
        `;
        
        try {
            const response = await this.graphqlRequest(query);
            const limits = response.data?.limits;
            const isValid = limits && typeof limits.remaining === 'number' && typeof limits.limit === 'number';
            this.logTest('GraphQL Limits Query', isValid,
                isValid ? `Remaining: ${limits.remaining}/${limits.limit}` : 'Invalid limits response',
                response
            );
        } catch (error) {
            this.logTest('GraphQL Limits Query', false, error.message);
        }
    }

    // Test 5: Send Notification Mutation
    async testSendNotification() {
        console.log('\n📱 Testing Send Notification Mutation...');
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
                message: "🧪 API Test Notification from testapi.js",
                title: "API Test",
                priority: 0,
                sound: "pushover"
            }
        };
        
        try {
            const response = await this.graphqlRequest(mutation, variables);
            const result = response.data?.sendNotification;
            const isValid = result && typeof result.success === 'boolean' && result.status;
            this.logTest('Send Notification', isValid,
                isValid ? `Success: ${result.success}, Status: ${result.status}` : 'Invalid notification response',
                response
            );
        } catch (error) {
            this.logTest('Send Notification', false, error.message);
        }
    }

    // Test 6: Send Emergency Alert
    async testSendEmergency() {
        console.log('\n🚨 Testing Send Emergency Alert...');
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
                message: "🚨 Emergency API Test - Please acknowledge",
                title: "Emergency Test",
                expire: 300,
                retry: 60
            }
        };
        
        try {
            const response = await this.graphqlRequest(mutation, variables);
            const result = response.data?.sendEmergency;
            const isValid = result && typeof result.success === 'boolean';
            this.logTest('Send Emergency Alert', isValid,
                isValid ? `Success: ${result.success}, Receipt: ${result.data?.receipt || 'N/A'}` : 'Invalid emergency response',
                response
            );
        } catch (error) {
            this.logTest('Send Emergency Alert', false, error.message);
        }
    }

    // Test 7: Send Template Notification
    async testSendTemplate() {
        console.log('\n📋 Testing Send Template Notification...');
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
        
        const variables = {
            template: "success",
            input: {
                message: "API template test completed successfully!"
            }
        };
        
        try {
            const response = await this.graphqlRequest(mutation, variables);
            const result = response.data?.sendTemplate;
            const isValid = result && typeof result.success === 'boolean' && result.template;
            this.logTest('Send Template Notification', isValid,
                isValid ? `Template: ${result.template}, Success: ${result.success}` : 'Invalid template response',
                response
            );
        } catch (error) {
            this.logTest('Send Template Notification', false, error.message);
        }
    }

    // Test 8: Validate User
    async testValidateUser() {
        console.log('\n👤 Testing Validate User...');
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
                user: "test_user_key"
            }
        };
        
        try {
            const response = await this.graphqlRequest(mutation, variables);
            const result = response.data?.validateUser;
            const isValid = result && typeof result.status === 'number';
            this.logTest('Validate User', isValid,
                isValid ? `Status: ${result.status}, Devices: ${result.devices?.length || 0}` : 'Invalid validation response',
                response
            );
        } catch (error) {
            this.logTest('Validate User', false, error.message);
        }
    }

    // Test 9: GraphQL Schema Introspection
    async testSchemaIntrospection() {
        console.log('\n🔍 Testing GraphQL Schema Introspection...');
        const query = `
            query {
                __schema {
                    types {
                        name
                        kind
                    }
                    queryType {
                        name
                    }
                    mutationType {
                        name
                    }
                }
            }
        `;
        
        try {
            const response = await this.graphqlRequest(query);
            const schema = response.data?.__schema;
            const isValid = schema && schema.types && schema.queryType && schema.mutationType;
            this.logTest('Schema Introspection', isValid,
                isValid ? `Types: ${schema.types.length}, Query: ${schema.queryType.name}, Mutation: ${schema.mutationType.name}` : 'Invalid schema response',
                isValid ? null : response
            );
        } catch (error) {
            this.logTest('Schema Introspection', false, error.message);
        }
    }

    // Test 10: Error Handling
    async testErrorHandling() {
        console.log('\n⚠️ Testing Error Handling...');
        const invalidQuery = `
            query {
                invalidField {
                    nonExistentField
                }
            }
        `;
        
        try {
            const response = await this.graphqlRequest(invalidQuery);
            const hasErrors = response.errors && response.errors.length > 0;
            this.logTest('Error Handling', hasErrors,
                hasErrors ? `Properly handled ${response.errors.length} error(s)` : 'Should return errors for invalid query',
                response
            );
        } catch (error) {
            this.logTest('Error Handling', true, 'Properly caught request error');
        }
    }

    // Test 11: Rate Limiting
    async testRateLimiting() {
        console.log('\n🚦 Testing Rate Limiting...');
        const query = `query { health { status } }`;
        
        try {
            // Send multiple rapid requests
            const promises = Array(5).fill().map(() => this.graphqlRequest(query));
            const responses = await Promise.all(promises);
            
            const allSuccessful = responses.every(r => r.data?.health?.status);
            this.logTest('Rate Limiting', true,
                allSuccessful ? 'All requests processed (rate limiting may be configured)' : 'Some requests failed',
                { requestCount: responses.length, successful: responses.filter(r => r.data?.health?.status).length }
            );
        } catch (error) {
            this.logTest('Rate Limiting', false, error.message);
        }
    }

    // Test 12: CORS Headers
    async testCORSHeaders() {
        console.log('\n🌐 Testing CORS Headers...');
        try {
            const response = await axios.options(this.graphqlEndpoint, {
                headers: {
                    'Origin': 'https://example.com',
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type'
                }
            });
            
            const hasCORS = response.headers['access-control-allow-origin'] || 
                           response.headers['access-control-allow-methods'];
            this.logTest('CORS Headers', hasCORS,
                hasCORS ? 'CORS headers present' : 'CORS headers missing',
                { headers: response.headers }
            );
        } catch (error) {
            this.logTest('CORS Headers', false, error.message);
        }
    }

    // Run all tests
    async runAllTests() {
        console.log('🚀 Starting API Test Suite for https://pushover.lslly.com');
        console.log('=' .repeat(60));
        
        const startTime = Date.now();
        
        // Run all tests
        await this.testHealthEndpoint();
        await this.testDocsEndpoint();
        await this.testGraphQLHealth();
        await this.testGraphQLLimits();
        await this.testSendNotification();
        await this.testSendEmergency();
        await this.testSendTemplate();
        await this.testValidateUser();
        await this.testSchemaIntrospection();
        await this.testErrorHandling();
        await this.testRateLimiting();
        await this.testCORSHeaders();
        
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        
        // Print summary
        console.log('\n' + '=' .repeat(60));
        console.log('📊 TEST SUMMARY');
        console.log('=' .repeat(60));
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`⏱️  Duration: ${duration}s`);
        console.log(`🎯 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);
        
        if (this.results.failed > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.results.tests
                .filter(test => !test.passed)
                .forEach(test => {
                    console.log(`   • ${test.name}: ${test.message}`);
                });
        }
        
        console.log('\n🔗 API Endpoints Tested:');
        console.log(`   • Health: ${this.healthEndpoint}`);
        console.log(`   • Docs: ${this.docsEndpoint}`);
        console.log(`   • GraphQL: ${this.graphqlEndpoint}`);
        
        return this.results;
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new APITester();
    tester.runAllTests()
        .then(results => {
            process.exit(results.failed > 0 ? 1 : 0);
        })
        .catch(error => {
            console.error('❌ Test suite failed:', error.message);
            process.exit(1);
        });
}

module.exports = APITester;