document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/profile');
        const data = await response.json();

        if (response.ok) {
            // Populate profile data in the HTML
            // Example:
            document.getElementById('profile-name').innerText = data.name; // Assuming you have an element with id 'profile-name'
            // Add more fields as necessary
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
});