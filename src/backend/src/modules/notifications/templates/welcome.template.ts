/**
 * Welcome Email - Sent to user on registration
 */

export interface WelcomeData {
  firstName: string;
  email: string;
}

export function generateWelcomeEmail(data: WelcomeData): {
  subject: string;
  html: string;
} {
  const subject = 'Welcome to StorageCompare.ae!';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2563eb; color: white; padding: 30px; text-align: center; }
    .content { background-color: #f9fafb; padding: 30px; }
    .feature { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #2563eb; }
    .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to StorageCompare.ae!</h1>
      <p style="font-size: 18px;">Your Self-Storage Journey Starts Here</p>
    </div>

    <div class="content">
      <p>Hi ${data.firstName},</p>

      <p>Thank you for joining <strong>StorageCompare.ae</strong>, the UAE's premier self-storage aggregator platform!</p>

      <p>We're excited to help you find the perfect storage solution across the UAE.</p>

      <h3>What you can do with StorageCompare.ae:</h3>

      <div class="feature">
        <strong>🔍 Search & Compare</strong><br>
        Browse hundreds of storage facilities across Dubai, Abu Dhabi, and beyond
      </div>

      <div class="feature">
        <strong>📏 Smart AI Box Finder</strong><br>
        Describe your items and get personalized storage size recommendations
      </div>

      <div class="feature">
        <strong>⭐ Read Reviews</strong><br>
        Make informed decisions based on real customer experiences
      </div>

      <div class="feature">
        <strong>📅 Easy Booking</strong><br>
        Reserve and manage your storage space online
      </div>

      <div class="feature">
        <strong>❤️ Save Favorites</strong><br>
        Bookmark warehouses to compare later
      </div>

      <center>
        <a href="https://storagecompare.ae/catalog" class="button">Start Searching</a>
      </center>

      <p style="margin-top: 30px;">
        <strong>Need help getting started?</strong><br>
        Our support team is here to assist you at <a href="mailto:support@storagecompare.ae">support@storagecompare.ae</a>
      </p>
    </div>

    <div class="footer">
      <p>StorageCompare.ae - Find Your Perfect Storage Space</p>
      <p>This email was sent to ${data.email}</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, html };
}
