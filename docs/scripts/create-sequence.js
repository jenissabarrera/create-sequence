        //consolidate value of each selected campaign list into an object

        function add() {
            let campaignIds = $.map($('.campaignLists'), (campaignList) => {
                console.log(campaignList);
                return campaignList.options[campaignList.selectedIndex].value;
            });

            //eliminate campaignIds object property and let the values remain
            for (var val in campaignIds) {}

            //create body object in acceptable format for API
            let body = {

                name: (document.getElementById("sequenceName").value),
                version: 0,
                status: "on",
                campaigns: [{
                    id: campaignIds[val]
                }]
            }

            //submit data 
            outboundApi.postOutboundSequences(body)
                .then((data) => {
                    console.log("Success!");
                })
                .catch((err) => {
                    console.log('There was a failure calling postOutboundSequences');
                    console.error(err);
                });

        }

        //add dropdown list to campain list table initially and everytime add button is clicked
        function addList() {

            //create select lists dynamically
            let selectList = document.createElement("Select");
            selectList.setAttribute("class", "campaignLists")
            divCampaign.appendChild(selectList);

            //create add button dynamically
            let addButton = document.createElement("Button");
            addButton.setAttribute("onclick", "addList()");
            addButton.innerHTML = "+";
            addButton.setAttribute("class", "btn-add");
            divCampaign.appendChild(addButton);

            //create delete button dynamically
            let delButton = document.createElement("Button");
            delButton.setAttribute("class", "btn-remove");
            delButton.innerHTML = "-";
            delButton.setAttribute("onclick", "deleteList()");
            divCampaign.appendChild(delButton);




            //call function to add dynamic data to select/ drop down list
            populateDropdown(campaignLists);
        }

        //delete specific select/drop down list every time remove button is clicked
        function deleteList() {
            if (divCampaign.childNodes.length > 3) {
                let counter = 0;
                while (counter < 3) {

                    divCampaign.removeChild(divCampaign.lastChild);
                    counter++;

                }
            }

        }

        //add dynamic selection to select/dropdown list in the interface
        function populateDropdown(campaignLists) {

            //Add contact lists to the UI
            campaignLists.entities.forEach((campaignLists) => {
                $('.campaignLists').last()
                    .append($('<option></option>')
                        .attr('value', campaignLists.id)
                        .text(campaignLists.name));
            });

        }

        // This client ID expects the redirect URL to be http://localhost:8080/
        const clientId = '83d37bf5-e050-47bf-9937-0314b259c9c4';
        const redirectUri = window.location.href;

        // Set purecloud objects
        const platformClient = require('platformClient');
        const client = platformClient.ApiClient.instance;
        const outboundApi = new platformClient.OutboundApi();

        // Set PureCloud settings
        client.setEnvironment('mypurecloud.com');
        client.setPersistSettings(true, 'test_app');

        // Variable that will be used for storing objects (campaign list) from purecloud
        let campaignLists = null;

        //Accessing purecloud objects
        $(document).ready(() => {
            client.loginImplicitGrant(clientId, redirectUri)
                .then(() => {
                    console.log('Logged in');

                    // Get lists of outbound campaigns
                    return outboundApi.getOutboundCampaigns({
                        pageSize: 100
                    });
                })
                .then((_campaignLists) => {

                    //initialize _campaignList object from API to campaignLists variable
                    campaignLists = _campaignLists;

                    //call function addList that populates dropdown menu
                    addList();
                })
                .catch((err) => console.error(err));

        })