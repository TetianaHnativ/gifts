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

$address = $jsonData['address'];
$phone = $jsonData['phone'];
$totalPrice = $jsonData['price'];
$packaging = $jsonData['packaging'];
$user = $jsonData['user'];
$gifts = json_decode($jsonData['gifts'], true);

if (empty($address) || empty($phone) || empty($totalPrice) || empty($packaging) || empty($user) || empty($gifts)) {
    die(json_encode("Empty fields"));
}

date_default_timezone_set('Europe/Warsaw');

$currentDate = date('Y-m-d');

$idUserExists = "SELECT id FROM users WHERE id = ? ";
$stmt = stmtPrepare($conn, $idUserExists, "idUserExists");
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

if ($result->num_rows > 0) {
    $newOrder = "INSERT INTO orders (address, phone, price, packaging, date, user) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = stmtPrepare($conn, $newOrder, "newOrder");
    $stmt->bind_param("ssssss", $address, $phone, $totalPrice, $packaging, $currentDate, $user);

    if ($stmt->execute()) {
        $last_id = $stmt->insert_id;

        foreach ($gifts as $data) {
            $gift = intval($data['id']);
            $number = intval($data['number']);
            $price = floatval($data['price']);

            $ordersGifts = "INSERT INTO orders_gifts (order_id, gift, number, price) VALUES (?, ?, ?, ?)";
            $stmt = stmtPrepare($conn, $ordersGifts, "ordersGifts");
            $stmt->bind_param("iiid", $last_id, $gift, $number, $price);
            stmtExecute($stmt, "ordersGifts");

            $updateNumber = "UPDATE gifts SET number = number - ? WHERE id = ?";
            $stmt = stmtPrepare($conn, $updateNumber, "updateNumber");
            $stmt->bind_param("ii", $number, $gift);
            stmtExecute($stmt, "updateNumber");
        }
        echo json_encode("Order is successful");
    } else {
        echo json_encode("Error inserting new order: " . $stmt->error);
    }

} else {
    echo json_encode("User does not exist");
}

$conn->close();

function stmtPrepare($conn, $mySql, $errorString)
{
    $stmt = $conn->prepare($mySql);
    if ($stmt === false) {
        die(json_encode("Prepare failed ($errorString): " . $conn->error));
    }
    return $stmt;
}

function stmtExecute($stmt, $errorString)
{
    if (!$stmt->execute()) {
        echo json_encode("Error executing data ($errorString): " . $stmt->error);
        $stmt->close();
        exit;
    }
    $stmt->close();
}