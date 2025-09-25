<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "your@email.com"; // <-- Change this to your real email
    $subject = "New Contact Message from Ace Vet Website";

    // Sanitize input
    $name = htmlspecialchars(strip_tags(trim($_POST["name"])));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $subjectInput = htmlspecialchars(strip_tags(trim($_POST["subject"])));
    $message = htmlspecialchars(strip_tags(trim($_POST["message"])));

    // Compose email body
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Subject: $subjectInput\n";
    $email_content .= "Message:\n$message\n";

    $headers = "From: $name <$email>";

    if (mail($to, $subject, $email_content, $headers)) {
        http_response_code(200);
        echo "Message sent successfully!";
    } else {
        http_response_code(500);
        echo "Something went wrong. Message not sent.";
    }
} else {
    http_response_code(403);
    echo "Forbidden: You can't access this page directly.";
}
?>
