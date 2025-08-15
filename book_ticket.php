<?php
// Database configuration
$dbHost = 'localhost';
$dbName = 'cinema_db';
$dbUser = 'root';
$dbPass = '';

// Headers for handling JSON requests
header('Content-Type: application/json');

try {
    // Create database connection
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get JSON data from the request
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData);

    // Validate input data
    if (!$data->movieTitle || !$data->name || !$data->email || !$data->seats || !$data->showtime) {
        throw new Exception('All fields are required');
    }

    // Check seat availability
    $stmt = $pdo->prepare("SELECT available_seats FROM shows WHERE movie_title = ? AND showtime = ?");
    $stmt->execute([$data->movieTitle, $data->showtime]);
    $show = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$show) {
        throw new Exception('Show not found');
    }

    if ($show['available_seats'] < $data->seats) {
        throw new Exception('Not enough seats available');
    }

    // Start transaction
    $pdo->beginTransaction();

    // Insert booking record
    $stmt = $pdo->prepare("INSERT INTO bookings (movie_title, customer_name, email, seats, showtime, booking_date) 
                          VALUES (?, ?, ?, ?, ?, NOW())");
    $stmt->execute([
        $data->movieTitle,
        $data->name,
        $data->email,
        $data->seats,
        $data->showtime
    ]);

    // Update available seats
    $stmt = $pdo->prepare("UPDATE shows SET available_seats = available_seats - ? 
                          WHERE movie_title = ? AND showtime = ?");
    $stmt->execute([$data->seats, $data->movieTitle, $data->showtime]);

    // Commit transaction
    $pdo->commit();

    // Send confirmation email
    $to = $data->email;
    $subject = "Booking Confirmation - Star Cinema";
    $message = "Dear " . htmlspecialchars($data->name) . ",\n\n"
             . "Your booking has been confirmed!\n\n"
             . "Movie: " . htmlspecialchars($data->movieTitle) . "\n"
             . "Show Time: " . htmlspecialchars($data->showtime) . "\n"
             . "Number of Seats: " . htmlspecialchars($data->seats) . "\n\n"
             . "Thank you for choosing Star Cinema!\n"
             . "Please arrive 15 minutes before the show time.";
    $headers = "From: bookings@starcinema.com";

    mail($to, $subject, $message, $headers);

    // Send success response
    echo json_encode([
        'success' => true,
        'message' => 'Booking successful'
    ]);

} catch (Exception $e) {
    // If there was a transaction, roll it back
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    // Send error response
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 