/**
 * Booking Cancelled - Email to both parties
 *
 * Sent when a booking is cancelled by user or operator
 */

export interface BookingCancelledData {
  recipientName: string;
  recipientType: 'user' | 'operator';
  bookingId: number;
  warehouseName: string;
  boxSize: string;
  startDate: string;
  endDate: string;
  cancelledBy: 'user' | 'operator';
  reason?: string;
}

export function generateBookingCancelledEmail(data: BookingCancelledData): {
  subject: string;
  html: string;
} {
  const subject = `Booking Cancelled #${data.bookingId} - ${data.warehouseName}`;

  const cancelledByText =
    data.cancelledBy === 'user'
      ? 'the customer'
      : 'the warehouse operator';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9fafb; padding: 30px; }
    .warning-badge { background-color: #fee2e2; color: #991b1b; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 10px 0; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
    .info-table td:first-child { font-weight: bold; width: 150px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Cancelled</h1>
    </div>

    <div class="content">
      <p>Hi ${data.recipientName},</p>

      <div class="warning-badge">
        <strong>Booking #${data.bookingId} has been cancelled</strong>
      </div>

      <p>This booking was cancelled by ${cancelledByText}.</p>

      ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}

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
          <td>Box Size:</td>
          <td>${data.boxSize}</td>
        </tr>
        <tr>
          <td>Period:</td>
          <td>${data.startDate} to ${data.endDate}</td>
        </tr>
      </table>

      ${
        data.recipientType === 'user'
          ? `
      <p>You can browse other available warehouses on our platform.</p>
      <center>
        <a href="https://storagecompare.ae/catalog" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Browse Warehouses</a>
      </center>
      `
          : ''
      }
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
