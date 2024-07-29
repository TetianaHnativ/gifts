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

$img = $jsonData['img'];
$name = $jsonData['name'];
$price = $jsonData['price'];
$phone = $jsonData['phone'] ?? "-";
$description = $jsonData['description'];
$author = $jsonData['author'];

$id = $jsonData['id'] ?? "";

if (empty($img) || empty($name) || ($price === '') || empty($phone) || empty($description) || empty($author)) {
    die(json_encode("Empty fields"));
}

$isIdExists = empty($id) ? "SELECT id FROM users WHERE id = ? " : "SELECT * FROM ideas WHERE id = ?";
$stmt = $conn->prepare($isIdExists);
$parameter = empty($id) ? $author : $id;
$stmt->bind_param("i", $parameter);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

if ($result->num_rows > 0) {
    $sql = empty($id) ? "INSERT INTO ideas (img, name, price, phone, description, user) VALUES (?, ?, ?, ?, ?, ?)"
        : "UPDATE ideas SET img = ?, name = ?, price = ?, phone = ?, description = ?, user = ? WHERE id = ?";

    $stmt = $conn->prepare($sql);

    if (empty($id)) {
        $stmt->bind_param("ssdssi", $img, $name, $price, $phone, $description, $author);
    } else {
        $stmt->bind_param("ssdssii", $img, $name, $price, $phone, $description, $author, $id);
    }

    if ($stmt->execute()) {
        echo json_encode("Request is successful");
    } else {
        echo json_encode("Request failed. Error: " . $stmt->error);
    }

    $stmt->close();
} else {
    echo "User does not exist";
}

$conn->close();