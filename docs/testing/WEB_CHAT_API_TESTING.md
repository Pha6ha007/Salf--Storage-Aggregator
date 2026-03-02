# Web Chat API Testing Guide

## API Endpoints

### 1. Send Message
**POST** `/api/v1/chat/message`

**Authentication:** Optional (Public endpoint)

**Rate Limits:**
- Anonymous: 20 requests/hour
- Authenticated: 50 requests/hour

**Request Body:**
```json
{
  "session_id": "web_a1b2c3d4e5f6...",
  "message": "I need storage near JLT",
  "channel": "web",
  "page_context": {
    "path": "/catalog",
    "warehouseId": null,
    "searchParams": {
      "city": "Dubai"
    }
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reply": "I found 5 warehouses near JLT!...",
    "intent": "search_warehouse",
    "confidence": 0.92,
    "suggestions": [
      "Show me prices",
      "What sizes are available?",
      "View on map"
    ],
    "warehouses": [
      {
        "id": 105
      }
    ],
    "session_id": "web_a1b2c3d4e5f6..."
  }
}
```

**Error Responses:**
```json
// 429 Too Many Requests
{
  "statusCode": 429,
  "message": "Rate limit exceeded. Anonymous users are limited to 20 messages per hour.",
  "retryAfter": 3600
}

// 500 Internal Server Error
{
  "statusCode": 500,
  "message": "Failed to process message"
}
```

---

### 2. Get Chat History
**GET** `/api/v1/chat/history?session_id=xxx&limit=50`

**Authentication:** Optional (Public endpoint)

**Query Parameters:**
- `session_id` (required): Session identifier
- `limit` (optional): Max messages to return (default: 50, max: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "web_a1b2c3d4e5f6...",
      "channel": "web",
      "created_at": "2026-03-02T10:00:00.000Z"
    },
    "messages": [
      {
        "id": "uuid-1",
        "role": "assistant",
        "content": "Hi! 👋 Looking for storage in the UAE?",
        "created_at": "2026-03-02T10:00:01.000Z"
      },
      {
        "id": "uuid-2",
        "role": "user",
        "content": "I need storage near JLT",
        "created_at": "2026-03-02T10:00:05.000Z"
      },
      {
        "id": "uuid-3",
        "role": "assistant",
        "content": "I found 5 warehouses near JLT!...",
        "created_at": "2026-03-02T10:00:07.000Z"
      }
    ]
  }
}
```

**Error Responses:**
```json
// 400 Bad Request
{
  "statusCode": 400,
  "message": "session_id is required"
}

// 404 Not Found
{
  "statusCode": 404,
  "message": "Session not found"
}
```

---

## Testing with cURL

### Test 1: Send First Message (Create Session)
```bash
curl -X POST http://localhost:3000/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "new_session_123",
    "message": "Hi, I need storage",
    "page_context": {
      "path": "/",
      "referrer": "google"
    }
  }'
```

**Expected:** New session created, AI greeting response

---

### Test 2: Continue Conversation
```bash
curl -X POST http://localhost:3000/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "web_a1b2c3d4e5f6...",
    "message": "What sizes do you have?",
    "page_context": {
      "path": "/catalog"
    }
  }'
```

**Expected:** Context-aware response about box sizes

---

### Test 3: Get Chat History
```bash
curl "http://localhost:3000/api/v1/chat/history?session_id=web_a1b2c3d4e5f6...&limit=20"
```

**Expected:** Array of conversation messages

---

### Test 4: Rate Limit (Anonymous)
```bash
# Send 21 messages in quick succession
for i in {1..21}; do
  curl -X POST http://localhost:3000/api/v1/chat/message \
    -H "Content-Type: application/json" \
    -d "{\"session_id\":\"test_$i\",\"message\":\"Test $i\"}"
  echo ""
done
```

**Expected:** First 20 succeed, 21st returns 429 Too Many Requests

---

### Test 5: Authenticated User (Higher Limit)
```bash
# First, login to get cookie
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }' \
  -c cookies.txt

# Then send messages with cookie
curl -X POST http://localhost:3000/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "session_id": "auth_session",
    "message": "I need storage"
  }'
```

**Expected:** 50 requests/hour limit (instead of 20 for anonymous)

---

## Testing with Postman

### Collection Setup

1. **Environment Variables:**
   ```
   BASE_URL: http://localhost:3000
   API_VERSION: api/v1
   SESSION_ID: {{$guid}}
   ```

2. **Request 1: Send Message**
   - Method: POST
   - URL: `{{BASE_URL}}/{{API_VERSION}}/chat/message`
   - Body (JSON):
     ```json
     {
       "session_id": "{{SESSION_ID}}",
       "message": "I need storage near Dubai Marina",
       "page_context": {
         "path": "/catalog",
         "city": "Dubai"
       }
     }
     ```
   - Tests:
     ```javascript
     pm.test("Status is 200", () => {
       pm.response.to.have.status(200);
     });

     pm.test("Response has session_id", () => {
       const json = pm.response.json();
       pm.expect(json.data.session_id).to.exist;
       pm.environment.set("SESSION_ID", json.data.session_id);
     });

     pm.test("Response has AI reply", () => {
       const json = pm.response.json();
       pm.expect(json.data.reply).to.be.a('string');
       pm.expect(json.data.reply.length).to.be.above(0);
     });

     pm.test("Intent is classified", () => {
       const json = pm.response.json();
       pm.expect(json.data.intent).to.exist;
       pm.expect(json.data.confidence).to.be.a('number');
     });
     ```

3. **Request 2: Get History**
   - Method: GET
   - URL: `{{BASE_URL}}/{{API_VERSION}}/chat/history?session_id={{SESSION_ID}}`
   - Tests:
     ```javascript
     pm.test("Status is 200", () => {
       pm.response.to.have.status(200);
     });

     pm.test("Messages array exists", () => {
       const json = pm.response.json();
       pm.expect(json.data.messages).to.be.an('array');
     });

     pm.test("Has at least 1 message", () => {
       const json = pm.response.json();
       pm.expect(json.data.messages.length).to.be.above(0);
     });
     ```

---

## Database Monitoring

### Check Active Sessions
```sql
SELECT
  id,
  channel,
  session_token,
  message_count,
  lead_captured,
  created_at,
  expires_at
FROM chat_sessions
WHERE channel = 'web'
ORDER BY last_message_at DESC
LIMIT 10;
```

### Check Conversation History
```sql
SELECT
  cs.session_token,
  ac.role,
  ac.content,
  ac.intent,
  ac.confidence,
  ac.created_at
FROM ai_conversations ac
JOIN chat_sessions cs ON cs.id = ac.chat_session_id
WHERE cs.channel = 'web'
ORDER BY ac.created_at DESC
LIMIT 20;
```

### Check Rate Limiting (Redis)
```bash
# Connect to Redis
redis-cli

# Check rate limit keys
KEYS chat_rate_limit:*

# Get specific user/IP limit
GET chat_rate_limit:ip:192.168.1.1
GET chat_rate_limit:user:uuid-here

# Check TTL (time to live)
TTL chat_rate_limit:ip:192.168.1.1
```

### Check Lead Capture
```sql
SELECT
  l.*,
  cs.session_token
FROM crm_leads l
JOIN chat_sessions cs ON cs.lead_id = l.id
WHERE l.source = 'web_chat'
ORDER BY l.created_at DESC
LIMIT 10;
```

---

## Intent Classification Test Cases

### Search Warehouse
```json
{
  "message": "I need storage near Business Bay"
}
```
**Expected Intent:** `search_warehouse`

### Size Recommendation
```json
{
  "message": "What size do I need for a 2-bedroom apartment?"
}
```
**Expected Intent:** `size_recommendation`

### Price Inquiry
```json
{
  "message": "How much does it cost per month?"
}
```
**Expected Intent:** `price_inquiry`

### Booking Help
```json
{
  "message": "How do I book a storage unit?"
}
```
**Expected Intent:** `booking_help`

### Operator Contact
```json
{
  "message": "I want to talk to a person"
}
```
**Expected Intent:** `operator_contact`

### Complaint
```json
{
  "message": "I had a bad experience with this service"
}
```
**Expected Intent:** `complaint`

### FAQ
```json
{
  "message": "What are your opening hours?"
}
```
**Expected Intent:** `faq`

---

## Performance Testing

### Load Test Script (Artillery)
```yaml
# artillery-config.yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 120
      arrivalRate: 10
      name: "Sustained load"
    - duration: 60
      arrivalRate: 20
      name: "Peak load"

scenarios:
  - name: "Chat conversation"
    flow:
      - post:
          url: "/api/v1/chat/message"
          json:
            session_id: "{{ $randomString() }}"
            message: "I need storage"
```

Run:
```bash
npm install -g artillery
artillery run artillery-config.yml
```

---

## Troubleshooting

### Issue: Session not persisting
**Check:**
1. Database connection
2. Session token format (should start with `web_`)
3. Redis connection for session lookup

### Issue: Rate limit not working
**Check:**
1. Redis connection: `redis-cli ping`
2. Guard is registered in ChatModule
3. Check Redis keys: `redis-cli KEYS chat_rate_limit:*`

### Issue: AI not responding
**Check:**
1. ANTHROPIC_API_KEY in .env
2. ConversationEngine logs
3. Claude API quota/limits

### Issue: Lead not capturing
**Check:**
1. Conversation has enough data (phone/email + location)
2. CrmModule imported in ChatModule
3. Database constraints on crm_leads table

---

## Next Steps

1. Frontend widget implementation (Phase 4)
2. Real-time typing indicators
3. File upload support
4. Multi-language support (Arabic)
5. Analytics dashboard
