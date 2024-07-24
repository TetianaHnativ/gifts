<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "secret";
$dbname = "gifts";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$jsonData = json_decode(file_get_contents('php://input'), true);

$email = $jsonData['email'];
$number = $jsonData['numberConfirmation'];
$password = $jsonData['password'];
$passwordConfirmation = $jsonData['passwordConfirmation'];

$action = $jsonData['action'];

if (empty($email) || empty($action)) {
    die(json_encode("Empty fields"));
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    if ($action === 'sendEmail') {
        $randomNumber = rand(100000, 999999);
        $_SESSION['randomNumber'] = (string) $randomNumber;

        $subject = "FavouriteGift: random number";
        $message = "Your random number: $randomNumber";
        $headers = "From: $email\r\n";
        $headers .= "Content-type: text/plain; charset=UTF-8\r\n";

        if (mail($email, $subject, $message, $headers)) {
            echo json_encode("Random number sent to email");
        } else {
            echo json_encode("Error sending email");
        }
    } elseif ($action === 'numberChecking') {
        if (isset($_SESSION['randomNumber'])) {
            $randomNumber = $_SESSION['randomNumber'];

            if ($randomNumber === $number) {
                echo json_encode("Random number request is successful");
            } else {
                echo json_encode("Only email is right");
            }
        } else {
            echo json_encode("No random number found");
        }
    } elseif ($action === 'passwordChecking') {
        if ($password && $passwordConfirmation && $passwordConfirmation === $password) {
            $hashed_password = hash('sha256', $password);

            $update_sql = "UPDATE users SET password=? WHERE email=?";

            $stmt = $conn->prepare($update_sql);
            $stmt->bind_param("ss", $hashed_password, $email);

            if ($stmt->execute()) {
                echo json_encode("Updating password request is successful");
            } else {
                echo json_encode("Error updating password: " . $conn->error);
            }
        } else {
            echo json_encode("Passwords do not match");
        }
    }
} else {
    echo json_encode("Email is wrong");
}

$stmt->close();
$conn->close();