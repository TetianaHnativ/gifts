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

$email = mysqli_real_escape_string($conn, $jsonData['email']);
$password = mysqli_real_escape_string($conn, $jsonData['password']);

if (empty($email) || empty($password)) {
    die("Empty fields");
}

$sql_check_email = "SELECT * FROM users WHERE email=?";
$stmt = $conn->prepare($sql_check_email);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    if ($row["blocking"]) {
        echo json_encode("Blocking");
    } else if (hash('sha256', $password) === $row["password"]) {
        $user_id = $row['id'];
        echo json_encode("Login successful,$user_id");
    } else {
        echo json_encode("Wrong");
    }

} else {
    echo json_encode("User isn't registered");
}

$stmt->close();
$conn->close();