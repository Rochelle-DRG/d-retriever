console.log("index loaded");
$(document).ready(function () {
    console.log("document ready, jquery working");

    /**#######################   LOGGING IN TO COLLECTOR    #########################**/
    //~~~~remember my username Rochelle.Wolfe_DRGPartner
    var token;
    var messageDiv = document.getElementById('message')

    /**Dummy Project details for the sample arcgis app I made*/
    // var clientId = 'Cgx3mZ18s8C3bqGs';
    // var clientSecret = 'dcf1f44ea97345a99dc4695284624000';

    /**Kent Ohio Stormwater sample argis app that Holly made */
    var clientId = 'Lv925FWYHn6Tg1ga'; // 
    var clientSecret = '7e442cc80b974ab6a94f3bd3d7e67f18'; // 

    /**##  This gets and obtains the access token if logged in (after login link is clicked) REQUIRES CLIENT ID ##**/
    // var redirectUri = 'http://localhost:5500/';
    // var signInButton = document.getElementById('sign-in');
    // var signInUrl = 'https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=' + clientId + '&response_type=token&expiration=20160&redirect_uri=' + redirectUri;
    // signInButton.href = signInUrl;
    // var match = (window.location.hash) ? window.location.hash.match(/#access_token=([^&]+)/) : false;
    // // if we found an access token in the URL pass the token up to a global function in
    // if (match[1]) {
    //     signInButton.style.visibility = "hidden";
    //     token = match[1];
    //     messageDiv.innerHTML = "login token is : <br/>" + token;
    //     messageDiv.innerHTML = "Okay, you're logged in. Click to get data";
    // }


    // /**## This will return an access token without the user logging in (uses clientID and secretID) ##**/
    // messageDiv.innerHTML = "Logging you in";
    // $("#div1").load("demo_test.txt");
    // $.ajax({
    //     method: "POST",
    //     url: "https://www.arcgis.com/sharing/rest/oauth2/token?client_id=" + clientId + "&client_secret=" + clientSecret + "&grant_type=client_credentials",
    //     dataType: "json",
    //     contentType: "application/json; charset=utf-8",
    // })
    //     .done(function (msg) {
    //         // console.log(msg);
    //         // messageDiv.innerHTML = "access token is : <br/>" + msg.access_token
    //         token = msg.access_token;
    //         messageDiv.innerHTML = "Okay, we're logged in.";
    //     })
    //     .fail(function (jqXHR, textStatus) {
    //         alert("Request failed: " + textStatus);
    //         messageDiv.innerHTML = "Ut-oh, login failed. Try clicking the login link.";
    //     });

    /**## This will return an access token without the user logging in (uses my credentials and our project) ##**/
    messageDiv.innerHTML = "Logging you in";
    $("#div1").load("demo_test.txt");
    $.ajax({
        method: "POST",
        url: "https://www.arcgis.com/sharing/rest/generateToken",
        dataType: "json",
        data: {
            f: "json",
            username: "Rochelle.Wolfe_DRGPartner",
            password: "1Justice!",
            referer: "http://localhost:5500/"
        }
    })
        .done(function (msg) {
            // console.log(msg);
            // messageDiv.innerHTML = "access token is : <br/>" + msg.token
            token = msg.token;
            messageDiv.innerHTML = "Okay, we're logged in.";
        })
        .fail(function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
            messageDiv.innerHTML = "Ut-oh, login failed. Try clicking the login link.";
        });

/**#######################   GETTING DATA FROM COLLECTOR    #########################**/
    /** Query ALL the features from the whole TEST API */
    $("#get-test-data").click(function () {
        messageDiv.innerHTML = "Let's get some data";
        $.ajax({
            method: "POST",
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0/query",
            // token: token,
            dataType: "json",
            data: {
                // returnCountOnly: "true",
                f: "json",
                // where: "PARK_NAME = 'National Parks Service' AND ELEV_FT > 250 and ELEV_FT < 1000",
                where: "1=1",
                outSr: "4326",
                // outfields: "TRL_NAME,ELEV_FT,CITY_JUR,PARK_NAME,FID"
                outfields: "*"
            }
        }) //end .ajax
            .done(function (msg) {
                console.log(msg);
                var jsonInfo = JSON.stringify(msg);
                // messageDiv.innerHTML = "Data: <br>" + msg;
                messageDiv.innerHTML = "Data: <br>" + jsonInfo;
            })
            .fail(function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
                messageDiv.innerHTML = "Ut-oh, data fetch failed.";
            });
        messageDiv.innerHTML = "That's all";
    });//end on click


    /** Query ALL the features from the Kent Stormwater */
    $("#get-data").click(function () {
        messageDiv.innerHTML = "Let's get some data";
        $.ajax({
            method: "POST",
            url: "https://services3.arcgis.com/kwmUh9MJciUcuce3/arcgis/rest/services/MyMapService/FeatureServer/0/query?token="+token,
            // url: "https://services3.arcgis.com/kwmUh9MJciUcuce3/arcgis/rest/services/MyMapService/FeatureServer/0/query?token=g6SmFR5yRa07hhE7Rn5UzNBK8YghiP9oixoMnIrN8_hpA3G42asSjxgl0e5wjJeRXUSjlQNx087st9EFE68wVtRMAUDmpkyaJHLW8vN7SRDZpvw9lTm-jwUCvzkKWrNsJ6wR-t3nn2dG9yCcJDnSCp9ziB_krdlVlyUpvz82iWyEpzhMPyAFlDINWSlZeY2Y60_YPFj58u3SEbyu4XzIw5_jBsCvPe6myJGb4eL1wf0hu8ZHtcPFAZ9ITMGZeTKH",
            // url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0/query",
            // token: token,
            dataType: "json",
            data: {
                // returnCountOnly: "true",
                f: "json",
                // where: "1=1",
                where: "OBJECTID > 0",
                outSr: "4326",
                outfields: "*"
                // outfields: "OBJECTID,Site_Status,Manhole_Number,StreetName"
            }
        }) //end .ajax
            .done(function (msg) {
                console.log(msg);
                var jsonInfoAsString = JSON.stringify(msg.features);
                // messageDiv.innerHTML = "Data: <br>" + jsonInfoAsString;
                // messageDiv.innerHTML = "Data (string) length: <br>" + jsonInfoAsString.length;
                // messageDiv.innerHTML = "Data : <br>" + JSON.stringify(msg.features[0]);
                // messageDiv.innerHTML = "Data: <br>" + JSON.stringify(msg.features[0].attributes.OBJECTID);
                messageDiv.innerHTML = "Data: <br>" + msg.features[0].attributes.OBJECTID; //successfully returns the property
            })
            .fail(function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
                messageDiv.innerHTML = "Ut-oh, data fetch failed.";
            });
        messageDiv.innerHTML = "Working on it";
    });//end on click




});//end document ready