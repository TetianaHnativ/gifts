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

$gift = $jsonData['itemId'];
$user = $jsonData['user'];

if (empty($gift) || empty($user)) {
    die(json_encode("Empty fields"));
}

$idGiftExists = "SELECT id FROM basket WHERE gift_id = ? AND user = ?";
$stmt = $conn->prepare($idGiftExists);
$stmt->bind_param("ii", $gift, $user);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode("Item is already exist");
} else {
    $sql = "INSERT INTO basket (gift_id, user) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $gift, $user);

    if ($stmt->execute()) {
        echo json_encode("Item is added");
    } else {
        echo json_encode("Failed to add gift to basket. Error: " . $stmt->error);
    }
}

$stmt->close();
$conn->close();