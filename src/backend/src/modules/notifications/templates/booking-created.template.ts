/**
 * Booking Created - Email to Operator
 *
 * Sent when a new booking is created (pending status)
 */

export interface BookingCreatedData {
  operatorName: string;
  warehouseName: string;
  bookingId: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  boxSize: string;
  startDate: string;
  endDate: string;
  priceTotal: number;
  dashboardUrl: string;
}

export function generateBookingCreatedEmail(data: BookingCreatedData): {
  subject: string;
  html: string;
} {
  const subject = `New Booking Request #${data.bookingId} - ${data.warehouseName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9fafb; padding: 30px; }
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
      <h1>New Booking Request</h1>
    </div>

    <div class="content">
      <p>Hi ${data.operatorName},</p>

      <p>You have received a new booking request for <strong>${data.warehouseName}</strong>.</p>

      <table class="info-table">
        <tr>
          <td>Booking ID:</td>
          <td>#${data.bookingId}</td>
        </tr>
        <tr>
          <td>Customer:</td>
          <td>${data.customerName}</td>
        </tr>
        <tr>
          <td>Phone:</td>
          <td>${data.customerPhone}</td>
        </tr>
        ${data.customerEmail ? `<tr><td>Email:</td><td>${data.customerEmail}</td></tr>` : ''}
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
      </table>

      <p>Please review and confirm this booking as soon as possible.</p>

      <center>
        <a href="${data.dashboardUrl}" class="button">View in Dashboard</a>
      </center>
    </div>

    <div class="footer">
      <p>StorageCompare.ae - Self-Storage Aggregator Platform</p>
      <p>This is an automated notification. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, html };
}
