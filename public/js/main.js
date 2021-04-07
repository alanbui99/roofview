const pathLookup =[
    {pathname: "/bars",
     title: "RF Bars",
     id:"bars" },
    {pathname: "/blogs",
     title: "RF Blogs",
     id:"blogs" },
    {pathname: "/login",
     title: "RF Login",
     id:"login" },
    {pathname: "/register",
     title: "RF Signup",
     id:"signup" },
    {pathname: "/users",
     title: "RF Profile",
     id:"user" }
];
pathLookup.forEach(function(path) {
    if (window.location.pathname === path.pathname) {
    document.title = path.title;
    document.getElementById(path.id).classList.toggle("active");
    }
});


(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        const validation = Array.from(forms).forEach(form => {
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
        });
    }, false);
})();