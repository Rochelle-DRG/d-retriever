console.log("index loaded");
$(document).ready(function () {

    /**#######################   LOGGING IN TO COLLECTOR    #########################**/
    //~~~~remember my username Rochelle.Wolfe_DRGPartner
    var token;
    var mrkToken;
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
    $("#logintoArcGIS").click(function () {
        let ag_username = document.getElementById("aG_username").value;
        let ag_password = document.getElementById("aG_password").value;
        loginToArcIGSWithUsernameAndPass(ag_username, ag_password);
    }) //end $("#logintoArcGIS").click

    function loginToArcIGSWithUsernameAndPass(username, pass) {
        messageDiv.innerHTML = "Logging you in";
        $("#div1").load("demo_test.txt");
        $.ajax({
            method: "POST",
            url: "https://www.arcgis.com/sharing/rest/generateToken",
            dataType: "json",
            data: {
                f: "json",
                username: ag_username,
                password: ag_password,
                referer: "http://localhost:5500/"
            }
        })
            .done(function (msg) {
                token = msg.token;
                messageDiv.innerHTML = "Okay, we're logged in to ArcGIS Online.";
                document.getElementById("aG_login").style.visibility = "hidden";
            })
            .fail(function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
                messageDiv.innerHTML = "Ut-oh, login failed. Try clicking the login link.";
            });
    }; //end loginToArcIGSWithUsernameAndPass(username, pass)

    /*For Development purposes I am skipping the click to login */
    let ag_username = "Rochelle.Wolfe_DRGPartner";
    let ag_password = "1Justice!";
    loginToArcIGSWithUsernameAndPass(ag_username, ag_password);


    /**#######################   GETTING USER LAYER INFO    #########################**/
    $("#select-proj-button").click(function () {
        messageDiv.innerHTML = "Getting Layers for " + document.getElementById("project-select").innerHTML;
        let projectLayersURL = document.getElementById("project-select").value + "layers?token=" + token;
        $.ajax({
            method: "POST",
            url: projectLayersURL,
            dataType: "json",
            data: {
                f: "json",
                where: "1=1",
                outSr: "4326",
                outfields: "*"
            }
            // token: token, 
        }) //end .ajax
            .done(function (msg) {
                messageDiv.innerHTML = "We have retrieved the project layers.";
                removeAllLayerOptions();
                for (let i = 0; i < msg.layers.length; i++) {
                    addCollectorLayerOption(msg.layers[i]);
                }
                $("#select-layer-button").click(function () {
                    let displayLayerNode = document.getElementById("display-collect-layer");
                    let layerId = document.getElementById("layer-select").value;
                    messageDiv.innerHTML = "This layer has " + msg.layers[layerId].fields.length + " fields. Next step loging to MRK and select they layer to send data to.";
                    document.getElementById("mrk").classList.toggle("hide");

                });
            })
            .fail(function (jqXHR, textStatus) {
                addMessage("Failed to retrieve the list of layers.");
            });
    });//end #user-layers .click



    function addCollectorLayerOption(layer) {
        let layersNode = document.getElementById("layer-select");
        let newLayer = document.createElement("option");
        newLayer.innerText = layer.name;
        newLayer.value = layer.id;
        layersNode.appendChild(newLayer);
    };
    function removeAllLayerOptions() {
        let layersNode = document.getElementById("layer-select");
        while (layersNode.hasChildNodes()) {
            layersNode.removeChild(layersNode.firstChild);
        }
    }


    /**#######################   GETTING DATA FROM COLLECTOR AND CALLING ADD TO MRK FUNCTION ON EACH FACILITY    #########################**/

    /** Query ALL the features from the Kent Stormwater */
    // $("#get-data").click(function () {
    //     addMessage("Let's get some data");
    //     $.ajax({
    //         method: "POST",
    //         url: "https://services3.arcgis.com/kwmUh9MJciUcuce3/arcgis/rest/services/MyMapService/FeatureServer/0/query?token=" + token,
    //         dataType: "json",
    //         data: {
    //             // returnCountOnly: "true",
    //             f: "json",
    //             // where: "1=1",
    //             where: "OBJECTID > 0",
    //             outSr: "4326",
    //             outfields: "*"
    //         }
    //     }) //end .ajax
    //         .done(function (msg) {
    //             addMessage("We have retrieved the data from collector. ");
    //             addMessage("Submitting to MRK. ");
    //             var jsonInfoAsString = JSON.stringify(msg.features);

    //             /** For each manhole */
    //             for (let i = 0; i < msg.features.length; i++) {
    //                 let stormManhole = makeManhole(msg.features[i]); //returns MRK-ready manhole object
    //                 // submitToMRK(stormManhole, i);
    //             }//end For
    //         })
    //         .fail(function (jqXHR, textStatus) {
    //             alert("Request failed: " + textStatus);
    //             messageDiv.innerHTML = "Ut-oh, data fetch failed.";
    //         });
    // });//end on clicking get-data button


    /**#######################   LOGIN TO MRK AND GET TOKEN    #########################**/

    $("#mRK-login-button").click(function () {
        let mrkUser = document.getElementById("mRK_username").value;
        let mrkPass = document.getElementById("mRK_password").value;
        let projId = document.getElementById("proj-id").value;
        /**##$$ FOR DEVELOPMENT SHORTCUT$$##**/
        mrkUser = "rwolfe";
        mrkPass = "1Justice!";
        $.ajax({
            method: "POST",
            url: "https://www.daveyresourcekeeper.com/api/v2/login",
            dataType: "json",
            contentType: "application/json",
            data: '{"name": "' + mrkUser.trim() + '", "password": "' + mrkPass + '", "project": '+ projId + '}'
        })
            .done(function (msg){
                addMessage("Successful login to MRK");
                // addMessage(JSON.stringify(msg)); //returns {"id":1519,"username":"rwolfe","projectName":"Kent","projectURL":"http://kentohrochelletest.daveytreekeeper.com","databaseName":"postgresql_kentOH_rochelletest","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTE5LCJ1c2VybmFtZSI6InJ3b2xmZSIsImVtYWlsIjoicm9jaGVsbGUud29sZmVAZGF2ZXkuY29tIiwiZmlyc3RfbmFtZSI6IlJvY2hlbGxlIiwibGFzdF9uYW1lIjoiV29sZmUgKERSRykiLCJwYXNzd29yZCI6IjhGQzU1NDQ4QkVFMDExNEI1OTc0NERFMTdCMjgwM0VBMDIwQjg5ODZDOEQ4QURBRDg2ODZENjU2MTNGMEQ5RDM5N0NCMUM1MUVBNzEyQjcxODBBQTQ4RjMxRjIxOUM3NTY0QUE3Mzc2RDFCQUQ2REYyMTQzOERDQThBNjExNUVGIiwiaW5pdGlhbHMiOiJSb1dvIiwibGV2ZWwiOjN9LCJwcm9qZWN0Ijp7ImlkIjo4NTE0LCJuYW1lIjoiS2VudCIsImRiX25hbWUiOiJwb3N0Z3Jlc3FsX2tlbnRPSF9yb2NoZWxsZXRlc3QiLCJ1cmwiOiJodHRwOi8va2VudG9ocm9jaGVsbGV0ZXN0LmRhdmV5dHJlZWtlZXBlci5jb20iLCJob3N0aXAiOiIxMC4zLjEuMTUifSwiaWF0IjoxNTc0MTk1ODgyLCJleHAiOjE1NzQyMDMwODJ9.cs_7npoh42yCjwMdrN2CNpOQfrzr5lE_qCjsrSTmIms","initials":"RoWo","level":3}
                // console.log(msg);
                mrkToken = msg.token;
                console.log(mrkToken);
                document.getElementById("mrk").classList.toggle("hide");
                document.getElementById("select-mrk-proj").classList.toggle("hide");

                /**Get & Generate list of layers **/
                $.ajax({
                    method: "GET",
                    url: "https://www.daveyresourcekeeper.com/api/v2/projects/"+projId,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify({
                        token: mrkToken
                    })
                })
                    .done(function(msg){
                        addMessage("successfully gathered list of MRK layers for this project");
                        console.log(msg);
                    })
                    .fail(function (jqXHR, textStatus){
                        addMessage("there was a problem gathering the layers list for this MRK project.");
                        console.log(textStatus);
                    })

            })
            .fail(function (jqXHR, textStatus) {
                console.log("Login to MRK Failed.");
                addMessage("Login to MRK failed.");
            })
    }); //end mRK-login-button .click



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
        let formattedDate = ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + "-" + d.getFullYear();
        return formattedDate;
    };
    function formatTime(collectorDate) {
        let d = new Date(collectorDate);
        let formattedTime = ("0" + (d.getHours())).slice(-2) + ":" + ("0" + (d.getMinutes())).slice(-2) + ":" + ("0" + (d.getSeconds())).slice(-2);
        return formattedTime;
    };
    function formatDTVerify(collectorDate) {
        let d = new Date(collectorDate);
        let formattedDate = d.getFullYear() + "" + ("0" + (d.getMonth() + 1)).slice(-2) + "" + ("0" + d.getDate()).slice(-2);
        return Number(formattedDate);
    };
    function nullToString(value) {
        if (value === null) {
            return "";
        }
        else return value;
    };
    function convertNullElevation(value) {
        if (value === null) {
            return 0;
        }
        else return value;
    };
    function convertNumInverts(value) {
        if (value === null) {
            return "0";
        }
        else return value;
    };
    function nullToUnassigned(value) {
        if (value === null) {
            return "Unassigned";
        }
        else return value;
    }



    /**#######################   SUBMITTING DATA TO MRK    #########################**/

    function submitToMRK(manhole, manNum) {
        let mrkUser = document.getElementById("mRK_username").value;
        let mrkPass = document.getElementById("mRK_password").value;
        /**##$$ FOR DEVELOPMENT SHORTCUT$$##**/
        // mrkUser = "rwolfe";
        // mrkPass = "1Justice!";

        let dataVar = {
            // f: "json",
            username: mrkUser,
            password: mrkPass,
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
                // addMessage("Success for number: " + manNum);
                displaySuccess(manhole, manNum);

            })
            .fail(function (jqXHR, textStatus) {
                console.log("Submit request failed: " + textStatus);
                console.log(manNum);
                console.log(manhole);
                messageDiv.innerHTML = "Ut-oh, submitting failed. " + textStatus;
                displayFailed(manhole, manNum);
            })



    }
    /**#######################   DISPLAYING SUCCESS OR FAIL RESULTS    #########################**/
    var failNode = document.getElementById("failures");
    var sNode = document.getElementById("successes");
    var msgNode = document.getElementById("messages");

    function displayFailed(manhole, number) {
        let failLI = document.createElement("li");
        failLI.innerText = number + ": " + JSON.stringify(manhole);
        failNode.appendChild(failLI);
    };
    function displaySuccess(manhole, number) {
        let successLI = document.createElement("li");
        successLI.innerText = number + ": " + JSON.stringify(manhole);
        sNode.appendChild(successLI);
    };
    function addMessage(message) {
        let newMsgP = document.createElement("P");
        newMsgP.innerText = message;
        msgNode.appendChild(newMsgP);
    };
});//end document ready