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

$user = $jsonData['id'];
$oldPassword = $jsonData['oldPassword'];

if (empty($user) || empty($oldPassword)) {
    die(json_encode("Empty fields"));
}

$sql = "SELECT password FROM users WHERE id = ?";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    die(json_encode(["message" => "Prepare failed: " . $conn->error]));
}
$stmt->bind_param("i", $user);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $passwordDatabase = $result->fetch_assoc()['password'];

    $hashed_password = hash('sha256', $oldPassword);

    if ($hashed_password === $passwordDatabase) {
        echo json_encode("Old password is right");
    } else {
        echo json_encode("Old password is wrong");
    }
} else {
    echo json_encode(["error" => "No records found"]);
}

$stmt->close();
$conn->close();