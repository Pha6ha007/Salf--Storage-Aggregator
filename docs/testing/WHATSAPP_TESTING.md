# WhatsApp AI Bot Testing Guide

## Setup Twilio WhatsApp Sandbox

### 1. Create Twilio Account
1. Sign up at https://www.twilio.com/try-twilio
2. Verify your phone number
3. Get your Account SID and Auth Token from Console Dashboard

### 2. Configure WhatsApp Sandbox
1. Go to Messaging > Try it out > Send a WhatsApp message
2. Follow instructions to join sandbox (send "join <code>" to the sandbox number)
3. Note your sandbox number (format: `whatsapp:+14155238886`)

### 3. Configure Webhook URL

**For Development (ngrok):**
```bash
# Install ngrok
npm install -g ngrok

# Start backend server
cd src/backend
npm run start:dev

# In another terminal, start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

**Set webhook in Twilio Console:**
1. Go to Messaging > Settings > WhatsApp sandbox settings
2. Set "When a message comes in" to:
   ```
   https://abc123.ngrok.io/api/v1/chat/whatsapp/webhook
   ```
3. Method: POST
4. Save

### 4. Environment Variables

Add to `src/backend/.env`:
```env
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Development only (skip signature validation)
TWILIO_SKIP_VALIDATION=false

# AI Chat
ANTHROPIC_API_KEY=your_claude_api_key
AI_CHAT_MODEL=claude-sonnet-4-20250514
AI_CHAT_MAX_TOKENS=1024
AI_CHAT_TEMPERATURE=0.3
```

## Testing Flow

### Test Case 1: Basic Greeting
```
User: Hi
Bot: Hi! 👋 Looking for storage in the UAE? I can help!
```

### Test Case 2: Warehouse Search
```
User: I need storage near JLT
Bot: [Searches warehouses, provides recommendations with links]
```

### Test Case 3: Size Recommendation
```
User: What size do I need for a 2-bedroom apartment?
Bot: [Recommends box size based on items]
```

### Test Case 4: Price Inquiry
```
User: How much does it cost?
Bot: [Provides pricing information]
```

### Test Case 5: Human Escalation
```
User: I want to talk to a person
Bot: [Provides contact information]
```

### Test Case 6: Arabic Language
```
User: مرحبا، أحتاج مخزن في دبي
Bot: [Responds in Arabic]
```

## Monitoring

### View Logs
```bash
cd src/backend
npm run start:dev

# Watch for:
# - "WhatsApp message received"
# - "Intent classified"
# - "WhatsApp reply sent"
```

### Check Database
```sql
-- View chat sessions
SELECT * FROM chat_sessions WHERE channel = 'whatsapp' ORDER BY created_at DESC LIMIT 10;

-- View conversations
SELECT * FROM ai_conversations WHERE channel = 'whatsapp' ORDER BY created_at DESC LIMIT 20;

-- View captured leads
SELECT * FROM crm_leads WHERE source = 'whatsapp_chat' ORDER BY created_at DESC LIMIT 10;
```

### Twilio Logs
1. Go to Twilio Console > Monitor > Logs > Messaging
2. Filter by your sandbox number
3. Check for webhook errors

## Troubleshooting

### Issue: Webhook not receiving messages
**Solution:**
1. Check ngrok is running and URL is correct
2. Verify webhook URL in Twilio console matches ngrok HTTPS URL
3. Check firewall/proxy settings

### Issue: Signature validation failing
**Solution:**
1. Set `TWILIO_SKIP_VALIDATION=true` in development
2. Ensure webhook URL exactly matches (no trailing slash)
3. Check TWILIO_AUTH_TOKEN is correct

### Issue: Bot not responding
**Solution:**
1. Check backend logs for errors
2. Verify ANTHROPIC_API_KEY is valid
3. Check database connection
4. Ensure ConversationEngine service is working

### Issue: Media messages not supported
**Expected:**
- Bot replies: "Sorry, media messages are not supported yet. Please send text only."

## Security Notes

- **Production:** Always enable signature validation (`TWILIO_SKIP_VALIDATION=false`)
- **Development:** Use ngrok HTTPS URL (Twilio requires HTTPS)
- **Webhook URL:** Should be publicly accessible
- **Auth Token:** Never commit to git, use .env

## Rate Limits

- **Twilio Sandbox:** 100 messages/day per number
- **Claude API:** Check your Anthropic quota
- **Backend:** 100 req/min per IP (configured in ThrottlerModule)

## Next Steps

1. Test with multiple phone numbers
2. Verify lead capture in CRM
3. Check intent classification accuracy
4. Test conversation history persistence
5. Verify session expiry (24 hours)
