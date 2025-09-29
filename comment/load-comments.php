<?php
require_once '../db.php';

if (isset($_GET['post_id'])) {
    $post_id = intval($_GET['post_id']);

    $stmt = $conn->prepare("SELECT name, comment, created_at FROM comments WHERE post_id = ? ORDER BY created_at DESC");
    $stmt->bind_param("i", $post_id);
    $stmt->execute();

    $result = $stmt->get_result();
    $comments = [];

    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($comments);
}
?>
