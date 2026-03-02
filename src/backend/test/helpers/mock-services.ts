/**
 * Mock external services for unit tests
 */

// Mock Redis Service
export const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  setex: jest.fn(),
  exists: jest.fn(),
  expire: jest.fn(),
  ttl: jest.fn(),
  keys: jest.fn(),
  flushdb: jest.fn(),
};

// Mock JWT Service
export const mockJwtService = {
  sign: jest.fn((payload) => 'mock-jwt-token'),
  verify: jest.fn((token) => ({ userId: 'test-user-id', email: 'test@example.com' })),
  decode: jest.fn((token) => ({ userId: 'test-user-id', email: 'test@example.com' })),
};

// Mock EventEmitter2
export const mockEventEmitter = {
  emit: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn(),
};

// Mock S3 Service
export const mockS3Service = {
  uploadFile: jest.fn((file) => Promise.resolve({
    url: `https://s3.example.com/${file.originalname}`,
    key: `uploads/${file.originalname}`,
  })),
  deleteFile: jest.fn((key) => Promise.resolve()),
  getSignedUrl: jest.fn((key) => Promise.resolve(`https://s3.example.com/${key}?signature=xyz`)),
};

// Mock SendGrid Service
export const mockSendGridService = {
  send: jest.fn((data) => Promise.resolve({ statusCode: 202, body: '', headers: {} })),
  sendEmail: jest.fn((to, subject, html) => Promise.resolve()),
};

// Mock Twilio Service
export const mockTwilioService = {
  sendSms: jest.fn((to, body) => Promise.resolve({ sid: 'mock-sms-sid' })),
  sendWhatsApp: jest.fn((to, body) => Promise.resolve({ sid: 'mock-whatsapp-sid' })),
};

// Mock Anthropic/Claude Service
export const mockClaudeService = {
  chat: jest.fn((messages) => Promise.resolve({
    content: [{ type: 'text', text: 'Mock AI response' }],
    usage: { input_tokens: 10, output_tokens: 20 },
  })),
  generateBoxRecommendation: jest.fn((items) => Promise.resolve({
    size: 'medium',
    reasoning: 'Mock reasoning',
  })),
};

// Mock Google Maps Service
export const mockGoogleMapsService = {
  geocode: jest.fn((address) => Promise.resolve({
    latitude: 25.2048,
    longitude: 55.2708,
    formattedAddress: 'Dubai, UAE',
  })),
  reverseGeocode: jest.fn((lat, lng) => Promise.resolve({
    address: 'Dubai, UAE',
  })),
};

/**
 * Reset all mock services
 */
export const resetMockServices = () => {
  Object.values(mockRedisService).forEach((fn) => fn.mockReset());
  Object.values(mockJwtService).forEach((fn) => fn.mockReset());
  Object.values(mockEventEmitter).forEach((fn) => fn.mockReset());
  Object.values(mockS3Service).forEach((fn) => fn.mockReset());
  Object.values(mockSendGridService).forEach((fn) => fn.mockReset());
  Object.values(mockTwilioService).forEach((fn) => fn.mockReset());
  Object.values(mockClaudeService).forEach((fn) => fn.mockReset());
  Object.values(mockGoogleMapsService).forEach((fn) => fn.mockReset());
};
