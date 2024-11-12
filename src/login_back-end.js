<script>
    document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            // Redirect to the profile page or handle successful login
            window.location.href = 'profile.html';
        } else {
            // Show error message
            alert(data.message);
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
});
</script>