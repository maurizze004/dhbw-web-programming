$(document).ready(function() {
    // Function to load content
    function loadContent(url) {
        $('#contentSection').load(url);
    }

    // Attach click event handlers to buttons
    $('#home').click(function(e) {
        e.preventDefault();
        loadContent('/content-pages/home.html');
        document.title = 'Home';
    });

    $('#real-estate').click(function(e) {
        e.preventDefault();
        loadContent('/content-pages/real-estate.html');
        document.title = 'Real Estate';
    });

    $('#fyd').click(function(e) {
        e.preventDefault();
        loadContent('/content-pages/fyd.html');
        document.title = 'Find Your Drink';
    });


    // Optionally, load default content on page load
    loadContent('/content-pages/home.html');
});
