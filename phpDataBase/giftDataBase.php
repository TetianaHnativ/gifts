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

$gift = $jsonData['gift'];

if (empty($gift)) {
    die(json_encode(["message" => "Empty field"]));
}

$sql = "SELECT * FROM gifts WHERE id = ?";
$stmt = $conn->prepare($sql);
if ($stmt === false) {
    die(json_encode(["message" => "Prepare failed: " . $conn->error]));
}
$stmt->bind_param("i", $gift);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode((object) $row, JSON_PRETTY_PRINT);
} else {
    echo json_encode(["message" => "No result found for the given ID"]);
}

$stmt->close();
$conn->close();