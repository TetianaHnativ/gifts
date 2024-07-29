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
$surname = $jsonData['surname'];
$username = $jsonData['username'];
$email = $jsonData['email'];
$phone = $jsonData['phone'];
$newPassword = $jsonData['newPassword'];

if (empty($user) || empty($surname) || empty($username) || empty($email) || empty($phone)) {
    die(json_encode("Empty fields"));
}

$sqlEmail = "SELECT email FROM users WHERE id = ?";

$stmt = stmtPrepare($conn, $sqlEmail, "sqlEmail");

$stmt->bind_param("i", $user);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

if ($result->num_rows > 0) {
    $sqlEmailCheck = "SELECT * FROM users WHERE email = ? AND id <> ?";

    $stmt = stmtPrepare($conn, $sqlEmailCheck, "sqlEmailCheck");

    $stmt->bind_param("si", $email, $user);
    $stmt->execute();
    $isEmailExist = $stmt->get_result();
    $stmt->close();

    if ($isEmailExist->num_rows > 0) {
        $row = $result->fetch_assoc();
        $email = $row['email'];
    }

    $sqlUpdate = "UPDATE users SET surname = ?, username = ?, email = ?, phone = ? WHERE id = ?";

    $stmt = stmtPrepare($conn, $sqlUpdate, "sqlUpdate");

    $stmt->bind_param("ssssi", $surname, $username, $email, $phone, $user);
    $success = $stmt->execute();
    $stmt->close();

    if (!empty($newPassword)) {
        $hashed_password = hash('sha256', $newPassword);
        $sqlUpdatePassword = "UPDATE users SET password = ? WHERE id = ?";

        $stmt = stmtPrepare($conn, $sqlUpdatePassword, "sqlUpdatePassword");

        $stmt->bind_param("si", $hashed_password, $user);
        $stmt->execute();
        $stmt->close();
    }

    if ($success === TRUE && $isEmailExist->num_rows > 0) {
        echo json_encode("The update is successful except email");
    } else if ($success === TRUE) {
        echo json_encode("Updating is successful");
    } else {
        echo json_encode("Error: " . $sql . "<br>" . $conn->error);
    }
} else {
    echo json_encode(["error" => "No records found"]);
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
