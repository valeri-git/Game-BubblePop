<?php
// Database credentials
$host = '';
$dbname = '';
$username = '';
$password = '';

// Connect to database
$mysqli = new mysqli(hostname: $host,
                    username: $username,
                    password: $password,
                    database: $dbname);

if ($mysqli->connect_errno) {
    die("Connection error: " . $mysqli->connect_error);
}

$name = htmlspecialchars($_POST['name']);
$score = htmlspecialchars($_POST['score']);

$stmt = $mysqli->prepare("INSERT INTO Scoreboard (name, score) VALUES (?, ?)");

$stmt->bind_param("si", $name, $score);

if ($stmt->execute()) {
    echo "Score saved successfully";
} else {
    echo "Error saving score: " . $stmt->error;
}

$stmt->close();
?>