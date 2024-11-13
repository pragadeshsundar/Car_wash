document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    // Send data to the server
    fetch('http://localhost:3000/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, date, time })
    })
    .then(response => {
        // Check for conflict status
        if (response.status === 409) {
            return response.json().then(data => {
                // Display the conflict message
                document.getElementById('confirmationMessage').innerText = data.message;
            });
        } else if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // If booking was successful
    })
    .then(data => {
        // Display success message if no conflict
        if (data) {
            const message = `Thank you, ${name}! Your car wash is booked for ${date} at ${time}.`;
            document.getElementById('confirmationMessage').innerText = message;

            // Clear the form
            document.getElementById('bookingForm').reset();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('confirmationMessage').innerText = 'There was an error booking your car wash.';
    });
});
