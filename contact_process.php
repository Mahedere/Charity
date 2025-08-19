<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // sanitize inputs
    $name = htmlspecialchars(strip_tags(trim($_POST['name'])));
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $subject = htmlspecialchars(strip_tags(trim($_POST['subject'])));
    $message = htmlspecialchars(strip_tags(trim($_POST['message'])));

    // validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email address.");
    }

    $recipient = "Congo.cnda@gmail.com";
    $mailheader = "From: $name <$email>\r\nReply-To: $email\r\n";

    if (mail($recipient, $subject, $message, $mailheader)) {
        echo '
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Contact Form</title>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="style1.css">
        </head>
        <body>
            <div class="container">
                <h1>✅ Thank you for contacting us!</h1>
                <p>We will get back to you as soon as possible.</p>
                <p class="back">Go back to the <a href="index.html">homepage</a>.</p>
            </div>
        </body>
        </html>
        ';
    } else {
        echo "❌ Sorry, your message could not be sent. Please try again later.";
    }
} else {
    echo "Access denied.";
}
?>
