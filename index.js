$(document).ready(function () {
    console.log("document ready, jquery working");

    /**#######################   LOGGING IN TO COLLECTOR    #########################**/
    //~~~~remember my username Rochelle.Wolfe_DRGPartner
    var token;
    var messageDiv = document.getElementById('message')

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
            token = msg.token;
            messageDiv.innerHTML = "Okay, we're logged in to ArcGIS Online.";
        })
        .fail(function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
            messageDiv.innerHTML = "Ut-oh, login failed. Try clicking the login link.";
        });

    /**#######################   GETTING DATA FROM COLLECTOR    #########################**/

    /** Query ALL the features from the Kent Stormwater */
    $("#get-data").click(function () {
        messageDiv.innerHTML = "Let's get some data";
        $.ajax({
            method: "POST",
            url: "https://services3.arcgis.com/kwmUh9MJciUcuce3/arcgis/rest/services/MyMapService/FeatureServer/0/query?token=" + token,
            dataType: "json",
            data: {
                // returnCountOnly: "true",
                f: "json",
                // where: "1=1",
                where: "OBJECTID > 0",
                outSr: "4326",
                outfields: "*"
            }
        }) //end .ajax
            .done(function (msg) {
                messageDiv.innerHTML = "We have retrieved the data from collector. ";
                console.log();
                var jsonInfoAsString = JSON.stringify(msg.features);

                /** For each manhole */
                for (let i = 0; i < msg.features.length; i++) {
                    let stormManhole = makeManhole(msg.features[i]); //returns MRK-ready manhole object
                    submitToMRK(stormManhole, i);
                }//end For
            })
            .fail(function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
                messageDiv.innerHTML = "Ut-oh, data fetch failed.";
            });
        messageDiv.innerHTML = "Working on it";
    });//end on clicking get-data button


    /**#######################   FORMATTING COLLECTOR DATA FOR MRK    #########################**/


    function makeManhole(collectedManhole) {
        let manhole = {
            properties: {
                WRK_REGION: "N\/A",
                WRK_AREA: "N/A",
                UNIQUEID: collectedManhole.attributes.GlobalID,
                NOTES: nullToString(collectedManhole.attributes.Comments),
                ChangeTIME: formatTime(collectedManhole.attributes.EditDate),
                Inv_Time: formatTime(collectedManhole.attributes.CreationDate),
                ChangeDATE: formatDate(collectedManhole.attributes.EditDate),
                Inv_Date: formatDate(collectedManhole.attributes.CreationDate),
                Status: collectedManhole.attributes.Site_Status,
                MH_ID: "",
                Elevation: convertNullElevation(collectedManhole.attributes.TopElevationft),
                Inverts: convertNumInverts(collectedManhole.attributes.NumberInverts),
                Location: "",
                DT_Verify: formatDTVerify(collectedManhole.attributes.EditDate),
                Material: nullToString(collectedManhole.attributes.MaterialMH),
                Invert_1: nullToString(collectedManhole.attributes.Invert1),
                Invert_2: nullToString(collectedManhole.attributes.Invert2),
                Invert_3: nullToString(collectedManhole.attributes.Invert3),
                Invert_4: nullToString(collectedManhole.attributes.Invert4),
                Invert_5: nullToString(collectedManhole.attributes.Invert5),
                Invert_6: nullToString(collectedManhole.attributes.Invert6),
                Invert_7: nullToString(collectedManhole.attributes.Invert7),
                Invert_8: nullToString(collectedManhole.attributes.Invert8),
                FormInv: nullToUnassigned(collectedManhole.attributes.FormedInvert),
                Steps: nullToUnassigned(collectedManhole.attributes.Steps),
                SolLid: nullToString(collectedManhole.attributes.SolidLid)

            },
            geometry: {
                type: "point",
                coordinates: [
                    collectedManhole.geometry.x,
                    collectedManhole.geometry.y,
                ]
            },
            factype: "Storm Manholes"

        };

        return manhole;
    }; // end makeManhole

    function formatDate(collectorDate) {
        let d = new Date(collectorDate);
        let formattedDate = ( "0"+(d.getMonth()+1) ).slice(-2) + "-" + ( "0"+d.getDate() ).slice(-2) + "-" + d.getFullYear();
        return formattedDate;
    };
    function formatTime(collectorDate) {
        let d = new Date(collectorDate);
        let formattedTime = ( "0"+(d.getHours()) ).slice(-2) + ":" + ( "0"+(d.getMinutes()) ).slice(-2) + ":" + ( "0"+(d.getSeconds()) ).slice(-2);
        return formattedTime;
    };
    function formatDTVerify(collectorDate){
        let d = new Date(collectorDate);
        let formattedDate = d.getFullYear() + "" + ( "0"+(d.getMonth()+1) ).slice(-2) + "" + ( "0"+d.getDate() ).slice(-2);
        return Number(formattedDate);
    };
    function nullToString(value){
        if (value === null){
            return "";
        }
        else return value;
    };
    function convertNullElevation(value){
        if (value === null){
            return 0;
        }
        else return value;
    };
    function convertNumInverts(value){
        if (value === null){
            return "0";
        }
        else return value;
    };
    function nullToUnassigned(value){
        if (value === null){
            return "Unassigned";
        }
        else return value;
    }



    /**#######################   SUBMITTING DATA TO MRK    #########################**/


    function submitToMRK(manhole, manNum) {
        messageDiv.innerHTML = "Submitting number "+manNum+" to MRK";

        let dataVar = {
            username: "rwolfe",
            password: "1Justice!",
            projectId: "8514", //test project id, real Kent id =1
            key: "fedce050-04a3-11ea-945b-5740d47ce5e1", //this will be the same for real Kent and test project
            feature: manhole 
        }

        $.ajax({
            method: "POST",
            url: "https://clientapi.rowkeeper.com/api/v1/proxy/upload/feature",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(dataVar)
        })
            .done(function (msg) {
                messageDiv.innerHTML = "Success for number: "+ manNum;
                displaySuccess(manhole, manNum);

            })
            .fail(function (jqXHR, textStatus) {
                console.log("Submit request failed: " + textStatus);
                console.log(manNum);
                console.log(manhole);
                messageDiv.innerHTML = "Ut-oh, submitting failed. "+ textStatus;
                displayFailed(manhole, manNum);
            })



    }
/**#######################   DISPLAYING SUCCESS OR FAIL RESULTS    #########################**/
    var failNode = document.getElementById("failures");
    var sNode = document.getElementById("successes");

    function displayFailed(manhole, number){
        let failLI = document.createElement("li");
        failLI.innerText = number + ": " + JSON.stringify(manhole);
        failNode.appendChild(failLI);
    };

    function displaySuccess(manhole, number){
        let successLI = document.createElement("li");
        successLI.innerText = number + ": " + JSON.stringify(manhole);
        sNode.appendChild(successLI);
    };


});//end document ready