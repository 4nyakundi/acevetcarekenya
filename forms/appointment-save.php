<?php
$host = 'localhost';
$db = 'acevetcare';
$user = 'root';
$pass = ''; // Change to your DB password if needed

// Create DB connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Collect and sanitize input
$name = $conn->real_escape_string($_POST['name']);
$email = $conn->real_escape_string($_POST['email']);
$phone = $conn->real_escape_string($_POST['phone']);
$date = $conn->real_escape_string($_POST['date']);
$department = $conn->real_escape_string($_POST['department']);
$doctor = $conn->real_escape_string($_POST['doctor']);
$message = $conn->real_escape_string($_POST['message']);

// Insert query
$sql = "INSERT INTO appointments (name, email, phone, appointment_date, department, doctor, message)
        VALUES ('$name', '$email', '$phone', '$date', '$department', '$doctor', '$message')";

if ($conn->query($sql) === TRUE) {
  echo "Appointment successfully booked!";
} else {
  echo "Error: " . $conn->error;
}

$conn->close();
?>

