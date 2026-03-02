-- Migration: RAG Enhancements + FAQ Seed Data
-- Description: Add indexes for better search performance + seed FAQ knowledge chunks

-- ========================================
-- 1. Enable pg_trgm extension for similarity search
-- ========================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ========================================
-- 2. Create indexes for knowledge_chunks
-- ========================================

-- Index for similarity search on content
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_content_trgm
ON knowledge_chunks USING gin (content gin_trgm_ops);

-- Index for source type filtering
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_source_type
ON knowledge_chunks(source_type);

-- Index for source ID filtering (warehouse lookup)
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_source_id
ON knowledge_chunks(source_id) WHERE source_id IS NOT NULL;

-- Composite index for source queries
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_source_composite
ON knowledge_chunks(source_type, source_id) WHERE source_id IS NOT NULL;

-- ========================================
-- 3. Seed FAQ knowledge chunks
-- ========================================

-- General FAQs
INSERT INTO knowledge_chunks (source_type, content, metadata) VALUES
('faq', 'Q: What is StorageCompare.ae?
A: StorageCompare.ae is the UAE''s leading platform for finding and comparing self-storage solutions. We connect customers with trusted warehouse operators across Dubai, Abu Dhabi, and all Emirates.',
'{"category": "general", "tags": ["about", "platform", "service"]}'),

('faq', 'Q: How does StorageCompare.ae work?
A: Simply search for storage in your area, compare facilities, check prices and availability, then book directly with the operator. Our AI assistant can help you find the perfect storage unit for your needs.',
'{"category": "general", "tags": ["how it works", "booking", "search"]}'),

('faq', 'Q: Is the service free to use?
A: Yes! StorageCompare.ae is completely free for customers. We help you find storage without any booking fees or hidden costs.',
'{"category": "general", "tags": ["pricing", "free", "cost"]}');

-- Storage Size FAQs
INSERT INTO knowledge_chunks (source_type, content, metadata) VALUES
('faq', 'Q: What storage sizes are available?
A: We offer 4 main size categories:
- S (Small): 1-3 m² - Perfect for small items, boxes, seasonal goods
- M (Medium): 3-6 m² - Ideal for 1-bedroom apartment contents
- L (Large): 6-12 m² - Great for 2-3 bedroom apartment or office storage
- XL (Extra Large): 12+ m² - Suitable for full house contents or commercial inventory',
'{"category": "sizes", "tags": ["sizes", "categories", "dimensions"]}'),

('faq', 'Q: What size do I need for a 1-bedroom apartment?
A: For a typical 1-bedroom apartment, we recommend a Medium (M) storage unit of 3-6 m². This can fit furniture, boxes, and appliances from a small apartment.',
'{"category": "sizes", "tags": ["1 bedroom", "apartment", "medium"]}'),

('faq', 'Q: What size do I need for a 2-bedroom apartment?
A: For a 2-bedroom apartment, we recommend a Large (L) storage unit of 6-12 m². This provides enough space for furniture, appliances, and personal belongings from a standard 2-bedroom home.',
'{"category": "sizes", "tags": ["2 bedroom", "apartment", "large"]}'),

('faq', 'Q: How much storage do I need for moving house?
A: It depends on your home size:
- Studio/1BR: 3-6 m² (Medium)
- 2BR: 6-12 m² (Large)
- 3BR+: 12+ m² (Extra Large)
Our AI assistant can help you calculate the exact size based on your inventory.',
'{"category": "sizes", "tags": ["moving", "house", "relocation"]}');

-- Pricing FAQs
INSERT INTO knowledge_chunks (source_type, content, metadata) VALUES
('faq', 'Q: How much does storage cost in Dubai?
A: Storage prices in Dubai typically range from AED 200-400/month for Small units, AED 400-800/month for Medium, AED 800-1,500/month for Large, and AED 1,500+ for Extra Large units. Prices vary by location, features, and operator.',
'{"category": "pricing", "tags": ["price", "cost", "Dubai", "rates"]}'),

('faq', 'Q: Are there any hidden fees?
A: Most operators charge only the monthly rent. Some may require a refundable security deposit (usually 1 month rent). Always check the specific facility listing for complete pricing details.',
'{"category": "pricing", "tags": ["fees", "deposit", "hidden costs"]}'),

('faq', 'Q: Can I rent storage for less than a month?
A: Most facilities have a minimum rental period of 1 month, but some offer short-term or weekly rentals. Check individual warehouse listings for specific terms.',
'{"category": "pricing", "tags": ["short term", "rental period", "minimum"]}'),

('faq', 'Q: Do you offer discounts for long-term storage?
A: Many operators offer discounts for 6-month or 12-month prepaid rentals. Contact the facility directly or ask our AI assistant to find warehouses with long-term discounts.',
'{"category": "pricing", "tags": ["discount", "long term", "deals"]}');

-- Location FAQs
INSERT INTO knowledge_chunks (source_type, content, metadata) VALUES
('faq', 'Q: Which areas in Dubai have storage facilities?
A: We have storage facilities across Dubai including: Business Bay, JLT (Jumeirah Lake Towers), Dubai Marina, Al Quoz, Dubai Investment Park (DIP), Dubai South, Jebel Ali, and more. Use our search to find storage near you.',
'{"category": "location", "tags": ["Dubai", "areas", "locations"]}'),

('faq', 'Q: Do you have storage in Abu Dhabi?
A: Yes! We have facilities in Abu Dhabi city, Mussafah, Khalifa City, and other areas. Search for "Abu Dhabi" to see all available options.',
'{"category": "location", "tags": ["Abu Dhabi", "emirate"]}'),

('faq', 'Q: Can I find storage near Dubai Airport?
A: Yes, we have facilities near Dubai International Airport and Al Maktoum Airport (Dubai South). These are convenient for businesses needing airport-adjacent storage.',
'{"category": "location", "tags": ["airport", "Dubai Airport", "DXB"]}');

-- Features & Amenities FAQs
INSERT INTO knowledge_chunks (source_type, content, metadata) VALUES
('faq', 'Q: Do storage units have climate control?
A: Many facilities in the UAE offer climate-controlled units to protect your belongings from heat and humidity. Filter search results by "Climate Control" to find these facilities.',
'{"category": "features", "tags": ["climate control", "AC", "temperature"]}'),

('faq', 'Q: Are storage facilities secure?
A: All facilities on our platform provide 24/7 security with CCTV surveillance. Many also offer individual unit locks, access control systems, and on-site security guards.',
'{"category": "features", "tags": ["security", "CCTV", "safe"]}'),

('faq', 'Q: Can I access my storage unit 24/7?
A: Many facilities offer 24/7 access, while others have specific operating hours (typically 6 AM - 10 PM). Check individual facility details for access hours.',
'{"category": "features", "tags": ["access", "24/7", "hours"]}'),

('faq', 'Q: Do facilities provide packing materials?
A: Most storage operators sell packing supplies like boxes, tape, bubble wrap, and furniture covers. Some offer free initial packing materials with your rental.',
'{"category": "features", "tags": ["packing", "boxes", "supplies"]}'),

('faq', 'Q: Is there parking available for loading/unloading?
A: Yes, all our partner facilities provide parking areas and loading bays for easy loading and unloading. Some also offer trolleys and equipment to help move your items.',
'{"category": "features", "tags": ["parking", "loading", "access"]}');

-- Booking & Account FAQs
INSERT INTO knowledge_chunks (source_type, content, metadata) VALUES
('faq', 'Q: How do I book a storage unit?
A: Browse available units, click "Book Now" on your chosen facility, fill in your details, and confirm your booking. The operator will contact you to arrange move-in and payment.',
'{"category": "booking", "tags": ["how to book", "reservation", "process"]}'),

('faq', 'Q: Do I need to create an account?
A: Creating an account is optional but recommended. With an account, you can save favorites, track bookings, manage your storage, and get personalized recommendations.',
'{"category": "booking", "tags": ["account", "registration", "sign up"]}'),

('faq', 'Q: Can I cancel my booking?
A: Yes, you can cancel your booking through your account or by contacting the facility directly. Cancellation policies vary by operator - check the specific terms when booking.',
'{"category": "booking", "tags": ["cancel", "cancellation", "refund"]}'),

('faq', 'Q: What payment methods are accepted?
A: Most facilities accept cash, bank transfer, and credit/debit cards. Some also accept cheques. Payment terms are typically monthly, with options for advance payment discounts.',
'{"category": "booking", "tags": ["payment", "methods", "how to pay"]}');

-- What Can Be Stored FAQs
INSERT INTO knowledge_chunks (source_type, content, metadata) VALUES
('faq', 'Q: What can I store in a storage unit?
A: You can store: furniture, household items, business inventory, documents, seasonal items, sports equipment, and more. Items must be legal and non-hazardous.',
'{"category": "storage_rules", "tags": ["what to store", "allowed items"]}'),

('faq', 'Q: What items are not allowed in storage?
A: Prohibited items include: hazardous materials, flammable substances, perishable food, illegal items, weapons, live animals or plants, and chemicals. Check with your facility for their complete prohibited items list.',
'{"category": "storage_rules", "tags": ["prohibited", "not allowed", "banned items"]}'),

('faq', 'Q: Can I store business inventory?
A: Yes! Many businesses use our storage facilities for inventory, equipment, documents, and supplies. Look for facilities with "Commercial Storage" features and easy loading access.',
'{"category": "storage_rules", "tags": ["business", "commercial", "inventory"]}'),

('faq', 'Q: Can I store a car or vehicle?
A: Some facilities offer vehicle storage for cars, motorcycles, boats, or RVs. Filter your search for "Vehicle Storage" to find these specialized facilities.',
'{"category": "storage_rules", "tags": ["vehicle", "car", "parking"]}');

-- Support FAQs
INSERT INTO knowledge_chunks (source_type, content, metadata) VALUES
('faq', 'Q: How can I contact customer support?
A: You can reach us through:
- AI Chat Assistant (bottom-right of every page)
- Contact form on our website
- Email: support@storagecompare.ae
- Phone: +971-XXX-XXXX
We typically respond within 24 hours.',
'{"category": "support", "tags": ["contact", "support", "help"]}'),

('faq', 'Q: Can the AI assistant help me choose the right size?
A: Yes! Our AI assistant can recommend the perfect storage size based on your needs. Just tell it what you need to store, and it will suggest the best options.',
'{"category": "support", "tags": ["AI", "assistant", "help", "size recommendation"]}'),

('faq', 'Q: What if I have a complaint about a facility?
A: Please contact us immediately through the chat assistant or support email. We take all complaints seriously and work with operators to resolve issues promptly.',
'{"category": "support", "tags": ["complaint", "issue", "problem"]}');

-- ========================================
-- 4. Add indexes for ai_conversations (chat history search)
-- ========================================

CREATE INDEX IF NOT EXISTS idx_ai_conversations_session
ON ai_conversations(chat_session_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_content_search
ON ai_conversations USING gin (content gin_trgm_ops);

-- ========================================
-- Summary
-- ========================================

-- Indexes created: 7
-- FAQ entries seeded: 30
-- Extensions enabled: pg_trgm
