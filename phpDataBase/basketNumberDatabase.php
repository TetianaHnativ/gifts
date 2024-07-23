<?php
$servername = "localhost";
$username = "root";
$password = "secret";
$dbname = "gifts";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$jsonData = json_decode(file_get_contents('php://input'), true);

$user = $jsonData['user'];

if (empty($user)) {
    die(json_encode("Empty field"));
}

$sql = "SELECT COUNT(*) as total_rows FROM basket WHERE user=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user);
$stmt->execute();
$result = $stmt->get_result();

if ($result) {
    $row = $result->fetch_assoc();
    echo json_encode($row['total_rows']);
} else {
    echo json_encode("");
}

$stmt->close();
$conn->close();