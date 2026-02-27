/**
 * Booking Confirmed - Email + SMS to User
 *
 * Sent when operator confirms a booking
 */

export interface BookingConfirmedData {
  customerName: string;
  bookingId: number;
  warehouseName: string;
  warehouseAddress: string;
  boxSize: string;
  startDate: string;
  endDate: string;
  priceTotal: number;
  operatorPhone: string;
  bookingUrl: string;
}

export function generateBookingConfirmedEmail(data: BookingConfirmedData): {
  subject: string;
  html: string;
} {
  const subject = `Booking Confirmed #${data.bookingId} - ${data.warehouseName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9fafb; padding: 30px; }
    .success-badge { background-color: #d1fae5; color: #065f46; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 10px 0; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
    .info-table td:first-child { font-weight: bold; width: 150px; }
    .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Booking Confirmed!</h1>
    </div>

    <div class="content">
      <p>Hi ${data.customerName},</p>

      <div class="success-badge">
        <strong>Your booking has been confirmed</strong>
      </div>

      <table class="info-table">
        <tr>
          <td>Booking ID:</td>
          <td>#${data.bookingId}</td>
        </tr>
        <tr>
          <td>Warehouse:</td>
          <td>${data.warehouseName}</td>
        </tr>
        <tr>
          <td>Address:</td>
          <td>${data.warehouseAddress}</td>
        </tr>
        <tr>
          <td>Box Size:</td>
          <td>${data.boxSize}</td>
        </tr>
        <tr>
          <td>Period:</td>
          <td>${data.startDate} to ${data.endDate}</td>
        </tr>
        <tr>
          <td>Total Price:</td>
          <td><strong>${data.priceTotal} AED</strong></td>
        </tr>
        <tr>
          <td>Operator Contact:</td>
          <td>${data.operatorPhone}</td>
        </tr>
      </table>

      <p><strong>Next Steps:</strong></p>
      <ul>
        <li>Contact the warehouse operator at ${data.operatorPhone} to arrange move-in</li>
        <li>Bring a valid ID and payment</li>
        <li>Keep your booking ID handy: #${data.bookingId}</li>
      </ul>

      <center>
        <a href="${data.bookingUrl}" class="button">View Booking Details</a>
      </center>
    </div>

    <div class="footer">
      <p>StorageCompare.ae - Self-Storage Aggregator Platform</p>
      <p>Need help? Contact us at support@storagecompare.ae</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, html };
}

export function generateBookingConfirmedSMS(data: BookingConfirmedData): string {
  return `Booking Confirmed! #${data.bookingId} at ${data.warehouseName}. Period: ${data.startDate} - ${data.endDate}. Total: ${data.priceTotal} AED. Contact: ${data.operatorPhone}. View: ${data.bookingUrl}`;
}
