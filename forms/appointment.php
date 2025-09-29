<?php
// =======================
// appointment.php
// =======================
require 'db.php';
$stmt = $pdo->query("SELECT * FROM appointments ORDER BY id DESC");
$appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html>
<head>
<title>All Appointments</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
</head>
<body>
<div class="container py-4">
<h2 class="mb-4">Appointments List</h2>
<table class="table table-bordered table-striped">
<thead>
<tr>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
<th>Date</th>
<th>Department</th>
<th>Doctor</th>
<th>Message</th>
</tr>
</thead>
<tbody>
<?php foreach ($appointments as $row): ?>
<tr>
<td><?= htmlspecialchars($row['name']) ?></td>
<td><?= htmlspecialchars($row['email']) ?></td>
<td><?= htmlspecialchars($row['phone']) ?></td>
<td><?= htmlspecialchars($row['date']) ?></td>
<td><?= htmlspecialchars($row['department']) ?></td>
<td><?= htmlspecialchars($row['doctor']) ?></td>
<td><?= nl2br(htmlspecialchars($row['message'])) ?></td>
</tr>
<?php endforeach; ?>
</tbody>
</table>
</div>
</body>
</html>
?>
