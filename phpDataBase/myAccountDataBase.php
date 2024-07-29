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

$elements = $jsonData['elements'];

if (empty($user) || empty($elements)) {
    die(json_encode(["message" => "Empty field"]));
}

$sql = "";

switch ($elements) {
    case "favourites-gifts":
        $sql = "SELECT favourites.id, favourites.name, favourites.gift_id, favourites.user, gifts.*
                FROM favourites 
                LEFT JOIN gifts ON gifts.id = favourites.gift_id 
                WHERE favourites.name = 'gift' AND favourites.user = ?";
        break;

    case "basket-gifts":
        $sql = "SELECT basket.*, gifts.* 
                FROM basket 
                LEFT JOIN gifts ON gifts.id = basket.gift_id 
                WHERE basket.user = ?";
        break;

    case "favourites-ideas":
        $sql = "SELECT favourites.id, favourites.name, favourites.idea_id, favourites.user, ideas.*, users.username, users.surname
                FROM favourites
                LEFT JOIN ideas ON ideas.id = favourites.idea_id
                LEFT JOIN users ON users.id = ideas.user
                WHERE favourites.name = 'idea' AND favourites.user = ?";
        break;

    case "my-ideas":
        $sql = "SELECT ideas.*, users.surname, users.username 
                FROM ideas
                LEFT JOIN users ON ideas.user = users.id
                WHERE ideas.user = ?";
        break;

    case "my-data":
        $sql = "SELECT surname, username, email, phone FROM users WHERE id = ?";
        break;

    default:
        $sql = "";
        break;
}


$stmt = $conn->prepare($sql);
if ($stmt === false) {
    die(json_encode(["message" => "Prepare failed: " . $conn->error]));
}
$stmt->bind_param("i", $user);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

$data_array = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data_array[] = $row;
    }
} else {
    $data_array = array("error" => "No records found");
}

$conn->close();

echo json_encode($data_array);