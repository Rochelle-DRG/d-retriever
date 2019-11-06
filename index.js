console.log("index loaded");
$(document).ready(function () {
    console.log("document ready, jquery working");
    $("button").click(function () {
        $("#div1").load("demo_test.txt");


        /**## This will actually return an access token ##**/
        $.ajax({
            method: "POST",
            url: "https://www.arcgis.com/sharing/rest/oauth2/token?client_id=Cgx3mZ18s8C3bqGs&client_secret=dcf1f44ea97345a99dc4695284624000&grant_type=client_credentials",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            // data: { username: "John", password: "Boston" }
        })
        .done(function( msg ) {
          console.log(msg);
          document.write("access token is : <br/>" +msg.access_token);

        })
        .fail(function( jqXHR, textStatus ) {
          alert( "Request failed: " + textStatus );
        });


    });//end on click
});