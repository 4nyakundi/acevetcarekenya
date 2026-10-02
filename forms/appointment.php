<?php
/**
 * ACE VET CARE Kenya - Appointment Confirmation & Notification Handler
 * Dispatches official confirmation email from dr.njimia@acevetcare.co.ke to client
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

// 1. Sanitize & Retrieve Inputs
$name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8') : 'Valued Client';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : false;
$phone = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone']), ENT_QUOTES, 'UTF-8') : 'Not provided';
$date = isset($_POST['date']) ? htmlspecialchars(trim($_POST['date']), ENT_QUOTES, 'UTF-8') : date('Y-m-d');
$time_slot = isset($_POST['time_slot']) ? htmlspecialchars(trim($_POST['time_slot']), ENT_QUOTES, 'UTF-8') : '08:00 AM - 10:00 AM';
$department = isset($_POST['department']) ? htmlspecialchars(trim($_POST['department']), ENT_QUOTES, 'UTF-8') : 'General Veterinary Care';
$doctor = isset($_POST['doctor']) ? htmlspecialchars(trim($_POST['doctor']), ENT_QUOTES, 'UTF-8') : 'Dr. K. Njimia';
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8') : 'None provided';
$booking_id = isset($_POST['id']) && !empty($_POST['id']) ? htmlspecialchars(trim($_POST['id']), ENT_QUOTES, 'UTF-8') : ('APT-' . time());

if (!$email) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address provided']);
    exit;
}

// 2. Doctor & Clinic Config
$doctor_name = "Dr. K. Njimia";
$doctor_email = "dr.njimia@acevetcare.co.ke";
$clinic_name = "ACE VET CARE Kenya";
$clinic_phone = "+254 703 824 551";
$clinic_location = "Muthaiga Square, Riabai Road, Off Kiambu Road, Nairobi";
$wa_url = "https://wa.me/254703824551?text=" . urlencode("Hello Dr. Njimia, I have booked an appointment (Ref: {$booking_id}) for {$name} on {$date} ({$time_slot}).");

// 3. Email Headers for Official Domain Delivery (dr.njimia@acevetcare.co.ke)
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: {$doctor_name} <{$doctor_email}>\r\n";
$headers .= "Reply-To: {$doctor_name} <{$doctor_email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "X-Priority: 1 (Highest)\r\n";

$subject = "Appointment Confirmation [Ref: {$booking_id}] - Dr. K. Njimia | ACE VET CARE";

// 4. Luxury Branded HTML Confirmation Email Body
$client_html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Appointment Confirmation - ACE VET CARE</title>
</head>
<body style="margin: 0; padding: 20px 0; background-color: #f4f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #00796B 0%, #004D40 100%); padding: 35px 30px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 1px;">ACE VET CARE</h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1.5px;">Compassionate Veterinary Excellence</p>
            </td>
          </tr>

          <!-- Confirmation Badge Bar -->
          <tr>
            <td style="background-color: #E0F2F1; padding: 14px 30px; border-bottom: 1px solid #B2DFDB; text-align: center;">
              <span style="display: inline-block; color: #00796B; font-weight: 600; font-size: 15px;">
                &#10003; Clinical Appointment Confirmed &bull; Ref: {$booking_id}
              </span>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 35px 30px;">
              <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">Dear <strong>{$name}</strong>,</p>
              <p style="font-size: 15px; line-height: 1.6; color: #555555; margin: 0 0 25px 0;">
                Thank you for scheduling your pet's visit with <strong>Dr. K. Njimia</strong> at ACE VET CARE. Your 2-hour clinical session has been reserved in our system. Below are your appointment details:
              </p>

              <!-- Appointment Details Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAF9; border-radius: 12px; border: 1px solid #E0E7E5; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="8" border="0" style="font-size: 14px;">
                      <tr>
                        <td width="38%" style="color: #777777; font-weight: 600;">Booking Reference:</td>
                        <td width="62%" style="color: #00796B; font-weight: 700; font-family: monospace; font-size: 15px;">{$booking_id}</td>
                      </tr>
                      <tr>
                        <td style="color: #777777; font-weight: 600;">Client Name:</td>
                        <td style="color: #222222; font-weight: 600;">{$name}</td>
                      </tr>
                      <tr>
                        <td style="color: #777777; font-weight: 600;">Phone Number:</td>
                        <td style="color: #222222;">{$phone}</td>
                      </tr>
                      <tr>
                        <td style="color: #777777; font-weight: 600;">Appointment Date:</td>
                        <td style="color: #222222; font-weight: 600;">{$date}</td>
                      </tr>
                      <tr>
                        <td style="color: #777777; font-weight: 600;">2-Hour Time Slot:</td>
                        <td style="color: #00796B; font-weight: 700;">{$time_slot}</td>
                      </tr>
                      <tr>
                        <td style="color: #777777; font-weight: 600;">Attending Doctor:</td>
                        <td style="color: #222222; font-weight: 600;">Dr. K. Njimia (Lead Veterinary Surgeon)</td>
                      </tr>
                      <tr>
                        <td style="color: #777777; font-weight: 600; vertical-align: top;">Pet Notes:</td>
                        <td style="color: #555555; vertical-align: top;">{$message}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- WhatsApp Direct Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 30px; text-align: center;">
                <tr>
                  <td align="center">
                    <a href="{$wa_url}" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);">
                      &#128172; Open WhatsApp with Dr. Njimia
                    </a>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #888888;">Direct clarification & instant pet triage</p>
                  </td>
                </tr>
              </table>

              <!-- Visit Preparation Tips -->
              <div style="background-color: #FFF9E6; border-left: 4px solid #FFC107; padding: 16px; border-radius: 6px; margin-bottom: 25px;">
                <h4 style="margin: 0 0 8px 0; color: #B78103; font-size: 14px; font-weight: 700;">Helpful Visit Preparation:</h4>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #665200; line-height: 1.6;">
                  <li>Please arrive 10 minutes prior to your 2-hour window.</li>
                  <li>Ensure dogs are safely leashed and cats are secured in a well-ventilated carrier.</li>
                  <li>Bring your pet's vaccination booklet and prior medical records if available.</li>
                </ul>
              </div>

              <!-- Location & Emergency -->
              <div style="font-size: 13px; color: #666666; line-height: 1.6; border-top: 1px solid #eeeeee; padding-top: 20px;">
                <p style="margin: 0 0 6px 0;"><strong>Clinic Location:</strong> Muthaiga Square, Riabai Road, Off Kiambu Road, Nairobi</p>
                <p style="margin: 0 0 6px 0;"><strong>Direct Hotline:</strong> <a href="tel:+254703824551" style="color: #00796B; text-decoration: none; font-weight: 600;">+254 703 824 551</a></p>
                <p style="margin: 0 0 6px 0;"><strong>Emergency:</strong> 24/7 Veterinary Emergency Care Available</p>
              </div>

              <!-- Doctor Signature Block -->
              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                <p style="margin: 0; font-size: 15px; font-weight: 700; color: #222222;">Dr. K. Njimia (BVM)</p>
                <p style="margin: 2px 0 0 0; font-size: 13px; color: #777777;">Lead Veterinary Surgeon &bull; ACE VET CARE Kenya</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #00796B;">Email: dr.njimia@acevetcare.co.ke | Phone: +254 703 824 551</p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F1F5F4; padding: 20px 30px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #E5EBEA;">
              <p style="margin: 0 0 4px 0;">&copy; <?php echo date('Y'); ?> ACE VET CARE Kenya. All Rights Reserved.</p>
              <p style="margin: 0;">Muthaiga Square, Off Kiambu Road, Nairobi &bull; <a href="https://www.acevetcare.co.ke" style="color: #00796B; text-decoration: none;">www.acevetcare.co.ke</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

// 5. Send Client Confirmation Email
$mail_client_sent = @mail($email, $subject, $client_html, $headers);

// 6. Send Internal Notification to Clinic & Doctor
$clinic_subject = "NEW APPOINTMENT: {$name} - {$date} ({$time_slot}) [Ref: {$booking_id}]";
$clinic_html = <<<HTML
<!DOCTYPE html>
<html>
<body>
  <h2>New Appointment Booking Received</h2>
  <p><strong>Ref:</strong> {$booking_id}</p>
  <p><strong>Client:</strong> {$name}</p>
  <p><strong>Phone:</strong> {$phone}</p>
  <p><strong>Email:</strong> {$email}</p>
  <p><strong>Date:</strong> {$date}</p>
  <p><strong>Slot:</strong> {$time_slot}</p>
  <p><strong>Department:</strong> {$department}</p>
  <p><strong>Doctor:</strong> {$doctor}</p>
  <p><strong>Notes:</strong> {$message}</p>
</body>
</html>
HTML;

@mail("dr.njimia@acevetcare.co.ke, acevetcare@gmail.com", $clinic_subject, $clinic_html, $headers);

// 7. Return Clean JSON Output
echo json_encode([
    'status' => 'success',
    'booking_id' => $booking_id,
    'email_sent' => $mail_client_sent,
    'client_email' => $email,
    'doctor_email' => $doctor_email,
    'message' => 'Confirmation email successfully dispatched from ' . $doctor_email . ' to ' . $email
]);
