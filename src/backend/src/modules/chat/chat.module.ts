import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ChatSessionService } from './services/chat-session.service';
import { IntentClassifierService } from './services/intent-classifier.service';
import { ClaudeChatService } from './services/claude-chat.service';
import { ConversationEngineService } from './services/conversation-engine.service';
import { WhatsAppService } from './services/whatsapp.service';
import { LeadCaptureService } from './services/lead-capture.service';
import { RagService } from './services/rag.service';
import { WhatsAppController } from './controllers/whatsapp.controller';
import { WebChatController } from './controllers/webchat.controller';
import { CrmModule } from '../crm/crm.module';

@Module({
  imports: [PrismaModule, CrmModule],
  controllers: [WhatsAppController, WebChatController],
  providers: [
    // Core services (order matters - dependencies)
    ChatSessionService,          // First - no dependencies
    IntentClassifierService,     // Second - no dependencies
    RagService,                  // Third - database access only
    ClaudeChatService,           // Fourth - external API
    LeadCaptureService,          // Fifth - depends on CRM
    WhatsAppService,             // Sixth - external API (Twilio)
    ConversationEngineService,   // Last - orchestrates all above
  ],
  exports: [
    ChatSessionService,
    ConversationEngineService,
    IntentClassifierService,
  ],
})
export class ChatModule {}
