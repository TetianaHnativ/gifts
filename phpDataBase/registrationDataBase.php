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

$surname = $jsonData['surname'];
$name = $jsonData['username'];
$phone = $jsonData['phone'];
$email = $jsonData['email'];
$password = $jsonData['password'];

if (empty($surname) || empty($name) || empty($phone) || empty($email) || empty($password)) {
    die(json_encode("Empty fields"));
}

$sql_check_email = "SELECT * FROM users WHERE email=?";
$stmt = $conn->prepare($sql_check_email);
$stmt->bind_param("s", $email);
$stmt->execute();
$result_check_email = $stmt->get_result();

if ($result_check_email->num_rows > 0) {
    echo json_encode("Email is already registered");
} else {
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (surname, username, phone, email, password) 
        VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $surname, $name, $phone, $email, $hashed_password);

    if ($stmt->execute()) {
        echo json_encode("Registration successful");
    } else {
        echo json_encode("Error: " . $stmt->error);
    }
}

$stmt->close();
$conn->close();