<?php
// Database credentials
$host = '';
$dbname = '';
$username = '';
$password = '';

// Connect to database
$mysqli = new mysqli($host, $username, $password, $dbname);

if ($mysqli->connect_errno) {
    die("Connection error: " . $mysqli->connect_error);
}

$sql = "SELECT * FROM Scoreboard ORDER BY score DESC";
$result = $mysqli->query($sql);

$data = [];

if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} 

echo json_encode($data);

$mysqli->close();
?>