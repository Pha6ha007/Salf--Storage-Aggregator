/**
 * Booking Completed - Email to User
 *
 * Sent when booking is marked as completed
 * Encourages user to leave a review
 */

export interface BookingCompletedData {
  customerName: string;
  bookingId: number;
  warehouseName: string;
  reviewUrl: string;
}

export function generateBookingCompletedEmail(data: BookingCompletedData): {
  subject: string;
  html: string;
} {
  const subject = `Thank you for using ${data.warehouseName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9fafb; padding: 30px; }
    .stars { font-size: 32px; text-align: center; margin: 20px 0; color: #fbbf24; }
    .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You!</h1>
    </div>

    <div class="content">
      <p>Hi ${data.customerName},</p>

      <p>Your booking at <strong>${data.warehouseName}</strong> has been completed.</p>

      <p>We hope you had a great experience with our storage service!</p>

      <div class="stars">★ ★ ★ ★ ★</div>

      <p style="text-align: center;">
        <strong>How was your experience?</strong><br>
        Help other users by sharing your feedback
      </p>

      <center>
        <a href="${data.reviewUrl}" class="button">Leave a Review</a>
      </center>

      <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
        Your review helps others find the best storage solutions
      </p>
    </div>

    <div class="footer">
      <p>StorageCompare.ae - Self-Storage Aggregator Platform</p>
      <p>Thank you for choosing StorageCompare.ae</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, html };
}
