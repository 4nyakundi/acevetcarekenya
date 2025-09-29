<?php
require_once '../db.php'; // Adjust path if in another folder

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $post_id = intval($_POST['post_id']);
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $comment = trim($_POST['comment']);

    if ($name && $email && $comment) {
        $stmt = $conn->prepare("INSERT INTO comments (post_id, name, email, comment, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->bind_param("isss", $post_id, $name, $email, $comment);

        if ($stmt->execute()) {
            echo "success";
        } else {
            echo "Error: Could not save comment.";
        }

        $stmt->close();
    } else {
        echo "All fields are required.";
    }

    $conn->close();
}
?>
