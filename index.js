console.log("index loaded");
$(document).ready(function () {
    console.log("document ready, jquery working");
    //remember my username Rochelle.Wolfe_DRGPartner
    var clientId = 'Cgx3mZ18s8C3bqGs';
    var redirectUri = 'http://localhost:5500/';
    var signInButton = document.getElementById('sign-in');
    var signInUrl = 'https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=' + clientId + '&response_type=token&expiration=20160&redirect_uri=' + redirectUri;
    var token;
    var messageDiv = document.getElementById('message')
    signInButton.href = signInUrl;

    /**This gets and obtains the access token if logged in **/
    var match = (window.location.hash) ? window.location.hash.match(/#access_token=([^&]+)/) : false;
    // if we found an access token in the URL pass the token up to a global function in
    if (match[1]) {
        signInButton.style.visibility = "hidden";
        token = match[1];
        messageDiv.innerHTML = "login token is : <br/>" + token;
    }


    /**## This will return a temporary access token without login##**/
    $("#get-data").click(function () {
        $("#div1").load("demo_test.txt");
        $.ajax({
            method: "POST",
            url: "https://www.arcgis.com/sharing/rest/oauth2/token?client_id=Cgx3mZ18s8C3bqGs&client_secret=dcf1f44ea97345a99dc4695284624000&grant_type=client_credentials",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            // data: { username: "John", password: "Boston" }
        })
            .done(function (msg) {
                console.log(msg);
                messageDiv.innerHTML = "access token is : <br/>" + msg.access_token
                // document.write("access token is : <br/>" + msg.access_token);
            })
            .fail(function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            });
    });//end on click
});//end document ready