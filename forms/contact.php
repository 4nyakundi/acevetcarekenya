<?php
// =======================
// contact.php
// =======================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['contact_form'])) {
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$subject = $_POST['subject'] ?? 'New Contact Message';
$message = $_POST['message'] ?? '';


$to = 'acevetcare@gmail.com';
$email_subject = "[Contact] $subject from $name";
$email_body = "<h2>New Contact Message</h2>
<p><strong>Name:</strong> $name</p>
<p><strong>Email:</strong> $email</p>
<p><strong>Message:</strong><br>$message</p>";


$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: $email";


mail($to, $email_subject, $email_body, $headers);
echo "Message sent successfully.";
exit;
}
?>
