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

$item = $jsonData['itemId'];
$name = $jsonData['name'];
$user = $jsonData['user'];

if (empty($item) || empty($name) || empty($user)) {
    die(json_encode("Empty fields"));
}

$item_id = ($name === 'gift') ? 'gift_id' : 'idea_id';

$idItemExists = "SELECT id FROM favourites WHERE $item_id = ? AND user = ?";

$stmt = $conn->prepare($idItemExists);
$stmt->bind_param("ii", $item, $user);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode("Item is already exist");
} else {
    $sql = "INSERT INTO favourites (name, $item_id, user) VALUES (?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sii", $name, $item, $user);

    if ($stmt->execute()) {
        echo json_encode("Item is added");
    } else {
        echo json_encode("Failed to add item to favourites. Error: " . $stmt->error);
    }
}

$stmt->close();
$conn->close();