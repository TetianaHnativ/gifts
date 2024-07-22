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
$receiver = $jsonData['receiver'];
$age = $jsonData['age'];
$occasion = $jsonData['occasion'];
$interests = $jsonData['interests'];

if (empty($user) || empty($receiver) || empty($age) || empty($occasion) || empty($interests)) {
    die(json_encode("Empty fields"));
}

$sql = "INSERT INTO questionnaire (receiver, age, occasion, interests, user)
        VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $receiver, $age, $occasion, $interests, $user);

if ($stmt->execute()) {
    echo json_encode("New record created successfully");
} else {
    echo json_encode("Error: " . $stmt->error);
}

$stmt->close();
$conn->close();