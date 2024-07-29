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

$id = $jsonData['id'];
$name = $jsonData['name'];
$user = $jsonData['user'];

if (empty($id) || empty($name) || empty($user)) {
    die(json_encode(["message" => "Empty field"]));
}

switch ($name) {
    case "favourite-gift":
        $sql = "DELETE FROM favourites WHERE gift_id = ? AND user = ?";
        break;

    case "basket-gift":
        $sql = "DELETE FROM basket WHERE gift_id = ? AND user = ?";
        break;

    case "favourite-idea":
        $sql = "DELETE FROM favourites WHERE idea_id = ? AND user = ?";
        break;

    case "my-idea":
        $sql1 = "DELETE FROM favourites WHERE idea_id = ?";
        $sql2 = "DELETE FROM ideas WHERE id = ?";
        break;

    default:
        echo json_encode("Error");
        exit;
}

if ($name === "my-idea") {
    $stmt1 = $conn->prepare($sql1);
    if ($stmt1 === false) {
        die(json_encode(["message" => "Prepare failed: " . $conn->error]));
    }
    $stmt1->bind_param("i", $id);
    $stmt1->execute();
    $stmt1->close();

    $stmt2 = $conn->prepare($sql2);
    if ($stmt2 === false) {
        die(json_encode(["message" => "Prepare failed: " . $conn->error]));
    }
    $stmt2->bind_param("i", $id);
    $stmt2->execute();
    $stmt2->close();

    echo json_encode("Deletion is successful");
} else {
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die(json_encode(["message" => "Prepare failed: " . $conn->error]));
    }
    $stmt->bind_param("ii", $id, $user);
    $stmt->execute();
    $stmt->close();

    echo json_encode("Deletion is successful");
}

$conn->close();