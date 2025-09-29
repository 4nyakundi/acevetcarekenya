<?php
// =======================
// appointment-save.php
// =======================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
require 'db.php';
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$date = $_POST['date'];
$department = $_POST['department'];
$doctor = $_POST['doctor'];
$message = $_POST['message'];


$stmt = $pdo->prepare("INSERT INTO appointments (name, email, phone, date, department, doctor, message) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->execute([$name, $email, $phone, $date, $department, $doctor, $message]);


// Email notification
$to = 'acevetcare@gmail.com';
$subject = "New Appointment Request from $name";
$body = "<h2>Appointment Details</h2>
<p><strong>Name:</strong> $name</p>
<p><strong>Email:</strong> $email</p>
<p><strong>Phone:</strong> $phone</p>
<p><strong>Date:</strong> $date</p>
<p><strong>Department:</strong> $department</p>
<p><strong>Doctor:</strong> $doctor</p>
<p><strong>Message:</strong><br>$message</p>";
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: noreply@acevetcare.co.ke";


mail($to, $subject, $body, $headers);
echo "success";
exit;
}
?>

