// Modal functionality
function openBooking(movieTitle) {
    const modal = document.getElementById('bookingModal');
    const movieTitleInput = document.getElementById('movieTitle');
    modal.style.display = 'block';
    movieTitleInput.value = movieTitle;
    
    // Reset steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    document.getElementById('step1').classList.add('active');
    
    // Reset sections
    document.querySelectorAll('.booking-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('seatSelectionSection').classList.add('active');
    
    // Initialize seat grid
    updateSeatAvailability();
}

function closeBooking() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
    document.getElementById('bookingForm').reset();
    selectedSeats.clear();
    updateSeatSummary();
    
    // Reset steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    document.getElementById('step1').classList.add('active');
    
    // Reset sections
    document.querySelectorAll('.booking-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('seatSelectionSection').classList.add('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target == modal) {
        closeBooking();
    }
}

// Initialize bookings in localStorage if not exists
if (!localStorage.getItem('bookings')) {
    localStorage.setItem('bookings', JSON.stringify([]));
}

// Seat Selection Variables
const SEAT_PRICE = 250; // Price per seat in rupees
let selectedSeats = new Set();
let occupiedSeats = new Set();

// Initialize seat grid
function initializeSeatGrid() {
    const seatGrid = document.getElementById('seatGrid');
    seatGrid.innerHTML = '';
    
    // Create 8 rows (A-H) with 10 seats each
    for (let row = 0; row < 8; row++) {
        const rowLetter = String.fromCharCode(65 + row); // A to H
        for (let seat = 1; seat <= 10; seat++) {
            const seatNumber = `${rowLetter}${seat}`;
            const seatElement = document.createElement('div');
            seatElement.className = `seat ${occupiedSeats.has(seatNumber) ? 'occupied' : 'available'}`;
            seatElement.dataset.seat = seatNumber;
            seatElement.textContent = seatNumber;
            
            if (!occupiedSeats.has(seatNumber)) {
                seatElement.addEventListener('click', () => toggleSeat(seatNumber, seatElement));
            }
            
            seatGrid.appendChild(seatElement);
        }
    }
    
    updateSeatSummary();
}

// Toggle seat selection
function toggleSeat(seatNumber, seatElement) {
    if (selectedSeats.has(seatNumber)) {
        selectedSeats.delete(seatNumber);
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
    } else {
        selectedSeats.add(seatNumber);
        seatElement.classList.remove('available');
        seatElement.classList.add('selected');
    }
    
    updateSeatSummary();
}

// Update seat summary
function updateSeatSummary() {
    const selectedSeatsElement = document.getElementById('selectedSeats');
    const totalPriceElement = document.getElementById('totalPrice');
    const selectedSeatsInput = document.getElementById('selectedSeatsInput');
    
    if (selectedSeats.size === 0) {
        selectedSeatsElement.textContent = 'None';
        totalPriceElement.textContent = '0';
    } else {
        selectedSeatsElement.textContent = Array.from(selectedSeats).join(', ');
        totalPriceElement.textContent = (selectedSeats.size * SEAT_PRICE).toString();
    }
    
    selectedSeatsInput.value = Array.from(selectedSeats).join(',');
}

// Update seat availability based on showtime
function updateSeatAvailability() {
    const showtime = document.getElementById('showtime').value;
    // Simulate different occupied seats for different showtimes
    occupiedSeats.clear();
    
    // Add some random occupied seats based on showtime
    const occupiedCount = Math.floor(Math.random() * 20) + 10; // 10-30 occupied seats
    for (let i = 0; i < occupiedCount; i++) {
        const row = String.fromCharCode(65 + Math.floor(Math.random() * 8));
        const seat = Math.floor(Math.random() * 10) + 1;
        occupiedSeats.add(`${row}${seat}`);
    }
    
    // Reset selected seats when showtime changes
    selectedSeats.clear();
    initializeSeatGrid();
}

// Form submission handling
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (selectedSeats.size === 0) {
        alert('Please select at least one seat');
        return;
    }
    
    const formData = {
        movieTitle: document.getElementById('movieTitle').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        showtime: document.getElementById('showtime').value,
        selectedSeats: Array.from(selectedSeats),
        totalPrice: selectedSeats.size * SEAT_PRICE,
        payment: document.getElementById('payment').value
    };

    // Get existing bookings
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Add new booking
    bookings.push({
        ...formData,
        id: Date.now(),
        bookingDate: new Date().toLocaleString()
    });
    
    // Save updated bookings
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Show success message
    const successMessage = `
        Booking Successful!
        
        Movie: ${formData.movieTitle}
        Name: ${formData.name}
        Email: ${formData.email}
        Phone: ${formData.phone}
        Show Time: ${formData.showtime}
        Selected Seats: ${formData.selectedSeats.join(', ')}
        Total Price: ₹${formData.totalPrice}
        Payment Method: ${formData.payment}
        Booking Date: ${new Date().toLocaleString()}
        
        Thank you for choosing Star Cinema!
    `;
    
    alert(successMessage);
    closeBooking();
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add animation on scroll for movie cards
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.movie-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Step Navigation
function nextStep(currentStep) {
    // Validate current step
    if (currentStep === 1) {
        if (selectedSeats.size === 0) {
            alert('Please select at least one seat');
            return;
        }
    } else if (currentStep === 2) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        if (!name || !email || !phone) {
            alert('Please fill in all personal details');
            return;
        }
    }

    // Update steps
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep}`).classList.add('completed');
    document.getElementById(`step${currentStep + 1}`).classList.add('active');

    // Update sections
    document.querySelector('.booking-section.active').classList.remove('active');
    document.getElementById(currentStep === 1 ? 'personalDetailsSection' : 'paymentSection').classList.add('active');

    // Update summary if moving to payment
    if (currentStep === 2) {
        updateBookingSummary();
    }
}

function prevStep(currentStep) {
    // Update steps
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep - 1}`).classList.remove('completed');
    document.getElementById(`step${currentStep - 1}`).classList.add('active');

    // Update sections
    document.querySelector('.booking-section.active').classList.remove('active');
    document.getElementById(currentStep === 3 ? 'personalDetailsSection' : 'seatSelectionSection').classList.add('active');
}

function updateBookingSummary() {
    document.getElementById('summaryMovie').textContent = document.getElementById('movieTitle').value;
    document.getElementById('summaryShowtime').textContent = document.getElementById('showtime').options[document.getElementById('showtime').selectedIndex].text;
    document.getElementById('summarySeats').textContent = Array.from(selectedSeats).join(', ');
    document.getElementById('summaryAmount').textContent = (selectedSeats.size * SEAT_PRICE).toString();
}

// Add styles for button group
const style = document.createElement('style');
style.textContent = `
    .button-group {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    .back-btn {
        padding: 1rem 2rem;
        background: #f0f0f0;
        color: #333;
        border: none;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .back-btn:hover {
        background: #e0e0e0;
    }
    
    .booking-summary {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        margin: 1.5rem 0;
    }
    
    .booking-summary h4 {
        margin-bottom: 1rem;
        color: #333;
    }
    
    .booking-summary p {
        margin: 0.5rem 0;
        color: #666;
    }
    
    .booking-summary span {
        font-weight: 500;
        color: #333;
    }
`;
document.head.appendChild(style);

// Hero Slider functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize slider elements
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0 || dots.length === 0) {
        console.error('Slider elements not found!');
        return;
    }

    let currentSlideIndex = 0;
    const slideInterval = 5000; // Change slide every 5 seconds
    let slideTimer;

    function showSlide(index) {
        console.log('Showing slide:', index);
        
        // Remove active class from all slides and dots
        slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.classList.remove('active');
        });
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].style.opacity = '1';
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlideIndex = index;
    }

    // Make nextSlide function globally available
    window.nextSlide = function() {
        let nextIndex = currentSlideIndex + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
        // Reset the timer when manually changing slides
        clearInterval(slideTimer);
        startSlider();
    }

    // Make prevSlide function globally available
    window.prevSlide = function() {
        let prevIndex = currentSlideIndex - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1;
        }
        showSlide(prevIndex);
        // Reset the timer when manually changing slides
        clearInterval(slideTimer);
        startSlider();
    }

    // Make currentSlide function globally available
    window.currentSlide = function(index) {
        showSlide(index);
        // Reset the timer when manually changing slides
        clearInterval(slideTimer);
        startSlider();
    }

    function startSlider() {
        // Clear any existing timer
        if (slideTimer) {
            clearInterval(slideTimer);
        }
        // Start the slider
        slideTimer = setInterval(nextSlide, slideInterval);
        console.log('Slider started');
    }

    // Initialize first slide
    showSlide(0);
    
    // Start automatic sliding
    startSlider();

    // Pause sliding when hovering over the hero section or arrows
    const heroSection = document.querySelector('.hero');
    const arrows = document.querySelectorAll('.slider-arrow');
    
    if (heroSection) {
        const pauseSlider = () => {
            console.log('Slider paused');
            clearInterval(slideTimer);
        };

        const resumeSlider = () => {
            console.log('Slider resumed');
            startSlider();
        };

        // Pause on hero section hover
        heroSection.addEventListener('mouseenter', pauseSlider);
        heroSection.addEventListener('mouseleave', resumeSlider);

        // Pause on arrow hover
        arrows.forEach(arrow => {
            arrow.addEventListener('mouseenter', pauseSlider);
            arrow.addEventListener('mouseleave', resumeSlider);
        });
    }

    // Add click event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide(index);
        });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
}); 