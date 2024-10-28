$(document).ready(function() {
    // Function to load content
    function loadContent(url) {
        $('#contentSection').load(url);
    }

    // Attach click event handlers to buttons
    $('#home').click(function(e) {
        e.preventDefault();
        loadContent('/pages/home.html');
        document.title = 'Weather | Home';
    });

    $('#about').click(function(e) {
        e.preventDefault();
        loadContent('pages/about.html');
        document.title = 'Weather | About';
    });

    $('#contact').click(function(e) {
        e.preventDefault();
        loadContent('/pages/contact.html');
        document.title = 'Weather | Contact';
    });

    $('#faq').click(function(e) {
        e.preventDefault();
        loadContent('/pages/faq.html');
        document.title = 'Weather | FAQ';
    });

    // Optionally, load default content on page load
    loadContent('/pages/home.html');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelector('.nav-link.active')?.classList.remove('active');
        this.classList.add('active');
    });
});
