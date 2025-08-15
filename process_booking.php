<?php
$servername = "localhost";
$username ="root";
$password ="";
$dbname ="cinema_db";
//create connection
$conn = mysqli_connect($servername,$username,$password,$dbname);
//check connection
if(mysqli_connect_errno()){
    die("Connection failed: " .$conn->connect_error);
}
echo "Connected successfully";   
$sql="desc student";
if(mysqli_query($conn,$sql)==TRUE){
    echo "<br>";
    echo "connected to the table";
}
else{
    echo "Error: " ;
}
//inserting the
echo "<br>";
//insertion from html

$movieTitle = $_POST['movieTitle'];
$showtime = $_POST['showtime'];
$selectedSeats = $_POST['selectedSeats'];
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$paymentMethod = $_POST['payment'];
$seatCount = count(explode(",", $selectedSeats));
$pricePerSeat = 250; // Change as needed
$totalPrice = $seatCount * $pricePerSeat;
$sql11="INSERT INTO bookings values('$movieTitle','$showtime','$selectedSeats','$name','$email','$phone','$paymentMethod',$totalPrice)";
if(mysqli_query($conn,$sql11)==TRUE){
    echo "New record created successfully";
}
else{
    echo "Error: " ;}
echo "<br>";
$sqli="SELECT * FROM student";
$result=mysqli_query($conn,$sqli);
if(mysqli_num_rows($result)>0){
    
    echo "<table border><tr><th>MovieTitle</th><th>Showtime</th><th>SelectedSeats</th><th>Name</th><th>Email</th><th>Phone</th><th>PaymentMethod</th><th>TotalPrice</th></tr>";
    //output data of each row
    #echo "<table>";
    while($row=mysqli_fetch_assoc($result)){
        echo "<tr><td>".$row["movie_title"]."</td><td>".$row["show_time"]."</td><td>".$row["selected_seats"]."</td><td>".$row["full_name"]."</td><td>".$row["email"]."</td><td>".$row["phone"]."</td><td>".$row["payment_method"]."</td><td>".$row["total_price"]."</td></tr>";
    }
    echo "</table>";
}
else{
    echo "0 results";
}
$conn->close();
?>