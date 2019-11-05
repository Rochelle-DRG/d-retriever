console.log("index loaded");
$(document).ready(function () {
    console.log("document ready, jquery working");
    $("button").click(function () {
        $("#div1").load("demo_test.txt");
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://www.arcgis.com/sharing/rest/oauth2/token?client_id=Cgx3mZ18s8C3bqGs&client_secret=dcf1f44ea97345a99dc4695284624000&grant_type=client_credentials",
            "method": "POST",
            "headers": {
              "User-Agent": "PostmanRuntime/7.19.0",
              "Accept": "*/*",
              "Cache-Control": "no-cache",
              "Postman-Token": "5bb794d8-6c70-4784-8f2c-792a2d054184,b366cca4-5b88-4ebd-9915-a23b01d0cd1d",
              "Host": "www.arcgis.com",
              "Accept-Encoding": "gzip, deflate",
              "Content-Length": "0",
              "Connection": "keep-alive",
              "cache-control": "no-cache"
            }
          }
          
          $.ajax(settings).done(function (response) {
            console.log(response);
          });
    });
});