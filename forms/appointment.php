<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $to = "acevetcare@gmail.com"; // Receiver email for appointments
  $subject = "New Online Appointment Request";

  // Collect form data safely
  $name = htmlspecialchars($_POST["name"]);
  $email = htmlspecialchars($_POST["email"]);
  $phone = htmlspecialchars($_POST["phone"]);
  $date = htmlspecialchars($_POST["date"]);
  $department = htmlspecialchars($_POST["department"]);
  $doctor = htmlspecialchars($_POST["doctor"]);
  $message = htmlspecialchars($_POST["message"]);

  $body = "You have a new appointment request:\n\n";
  $body .= "Name: $name\n";
  $body .= "Email: $email\n";
  $body .= "Phone: $phone\n";
  $body .= "Date: $date\n";
  $body .= "Department: $department\n";
  $body .= "Doctor: $doctor\n";
  $body .= "Message:\n$message";

  $headers = "From: $email\r\n";
  $headers .= "Reply-To: $email\r\n";

  if (mail($to, $subject, $body, $headers)) {
    echo "Your appointment request has been sent successfully.";
  } else {
    echo "Failed to send your message. Please try again later.";
  }
}
?>
