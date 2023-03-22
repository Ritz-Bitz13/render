"use strict";

//IIFE - Immediately Invoke Function Expression
//AKA - Anonymous Self - Executing Function
(function()
{
    function Start()
    {
        console.log("App Started!");

        LoadHeader();

        LoadLink("home");

        LoadFooter();

    }
    window.addEventListener("load", Start)



    function ActiveLinkCallback() : Function
    {
        switch(router.ActiveLink){
            case "home" : return DisplayHomePage;
            case "about" : return DisplayAboutPage;
            case "services" : return DisplayServicesPage;
            case "contact" : return DisplayContactsPage;
            case "contact-link" : return DisplayContactListPage;
            case "edit" : return DisplayEditPage;
            case "login" : return DisplayLoginPage;
            case "products" : return DisplayProductsPage;
            case "register" : return DisplayRegisterPage;
            case "404" : return Display404Page;
            default:
                console.error("Error: Callback does not exist: " + router.ActiveLink);
                return new Function();
        }
    }

    function CapitalizeFirstChar(str : string) : string
    {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function LoadLink(link : string, data : string = "") : void
    {
        router.ActiveLink = link;
        AuthGuard();
        router.LinkData = data;

        history.pushState({}, "", router.ActiveLink);
        document.title = CapitalizeFirstChar(router.ActiveLink);

        $("ul>li>a").each(function(){
            $(this).removeClass("active");
        });
        $(`li>a:contains(${document.title})`).addClass("active");
        LoadContent()
    }


    function AddNavigationEvents()
    {
        let navLinks = $("ul>li>a");
        navLinks.off("click");
        navLinks.off("mouseover");

        navLinks.on("click", function(){
            LoadLink($(this).attr("data") as string);
        });
        navLinks.on("mouseover", function(){
            $(this).css("cursor", "pointer");
        });
    }

    function addLinkEvents(link : string) : void {

        let linkQuery = $(`a.link[data=${link}]`);

        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");

        linkQuery.css("text-decoration", "underline");
        linkQuery.css("color", "blue");

        linkQuery.on("click", function() {
            LoadLink(`${link}`);
        });
        linkQuery.on("mouseover", function() {
            $(this).css("cursor", "pointer");
            $(this).css("font-weight", "bold");
        });
        linkQuery.on("mouseout", function() {
            $(this).css("font-weight", "normal");
        });

    }

    function LoadHeader() : void
    {

        $.get("/views/components/header.html", function(Data){
            $("header").html(Data);
            $("header").html(Data);
            AddNavigationEvents();

            CheckLogin()
        });
    }


    function LoadContent() : void
    {
        let page : string = router.ActiveLink;
        let callback = ActiveLinkCallback();

        $.get(`/views/content/${page}.html`, function(Data){
            $("main").html(Data);
            CheckLogin();
            callback();
        });
    }

    function LoadFooter() : void
    {
        $.get("/views/components/footer.html", function(Data){
            $("footer").html(Data);
        });
    }


    function Display404Page() : void {
        console.log("Display 404 page called");
    }


    function AjaxRequest(method : string, url : string, callback : Function) : void
    {
        //AJAX CODE
        //STEP 1
        let xhr = new XMLHttpRequest();
        //STEP 2 - add listener and ready state change
        xhr.addEventListener("readystatechange", () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                if(typeof callback === "function") {
                    callback(xhr.responseText);
                }else{
                    console.error("Error: Please provide a valid function for call back");
                }
            }
        })
        //STEP 3 - open connection
        xhr.open(method, url);
        //STEP 4 send request
        xhr.send();
    }



    function DisplayHomePage() : void {
        console.log("Display Home Called");


        $("main").append(`<p id="MainParagraph" class="mt-3">This is the Main Paragraph!!</p>`);

       // $("body").append(`<article><p id="ArticleParagraph"  class ="mt-3">This is my article paragraph</p></article>`);
    }

    function DisplayProductsPage() : void {
        console.log("Display Products Called");
    }

    function DisplayServicesPage() : void{
        console.log("Display Services Page Called");
    }

    function ContactFormValidation() : void {
        ValidateField("#fullName",
            /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/,
            "Please Enter a valid First Name and Last Name. (Ex. Stephen Strange)");
        ValidateField("#contactNumber",
            /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/,
            "Please Enter a valid Contact Number (Ex. 905-555-5555");
        ValidateField("#emailAddress",
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/,
            "Please Enter a valid Email Address. (Ex. ThisExample@dcmail.ca)");
    }

    function ValidateField(input_field_id : string, regular_expression : RegExp, error_Message : string) : void
    {
        let messageArea = $("#messageArea");

        $(input_field_id).on("blur", function() {
            let InputFieldText = $(this).val() as string;
            if(!regular_expression.test(InputFieldText)){
                // fail validation
                $(this).trigger("focus");  // Go back to the full name text box
                $(this).trigger("select"); // This will Highlight the text input
                messageArea.addClass("alert alert-danger");
                messageArea.text(error_Message);
                messageArea.show();
            }else {
                // pass validation
                messageArea.removeAttr("class");
                messageArea.hide();
            }
        })

    }

    function DisplayContactsPage() : void{
        console.log("Display Contacts Called");

        $("a[data ='contact-list']").off("click");
        $("a[data ='contact-list']").on("click", function () {
            LoadLink("contact-list");
        });


        ContactFormValidation();

        let sendButton = document.getElementById("sendButton") as HTMLElement;
        let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;

        sendButton.addEventListener("click", function (event)
        {
            if(subscribeCheckbox.checked)
            {
                let fullName = document.forms[0].fullName.value;
                let contactNumber = document.forms[0].contactNumber.value;
                let emailAddress = document.forms[0].emailAddress.value;

                AddContact(fullName, contactNumber, emailAddress);
            }
        })
    }


    function DisplayAboutPage()  : void{
        console.log("Display About us page Called");
    }

    function DisplayContactListPage() : void {
        console.log("Display Contact List page Called");

        if(localStorage.length > 0){
            let contactList = document.getElementById("contactList") as HTMLElement;
            let data = "";                          // add deserialized data from local storage

            let keys = Object.keys(localStorage);   // return a string array of Keys

            let index = 1;
            for(const key of keys){
                let contactData = localStorage.getItem(key) as string;
                let contact = new core.Contact();
                contact.deserialize(contactData);
                data += `    <tr><th scope="row" class="text-center">${index}</th>
                            <td>${contact.FullName}</td>
                            <td>${contact.ContactNumber}</td>
                            <td>${contact.EmailAddress}</td>                        
                            <td class="text-center">
                            <!--  Edit Button -->
                            <button value="${key}" class="btn btn-primary btn-sm edit">
                                        <i class="fa-solid fa-user-pen fa.sm"></i> Edit</button>
                            </td>
                            <!--  Delete Button -->
                            <td class="text-center">
                            <button value="${key}" class="btn btn-danger btn-sm danger delete">
                                        <i class="fa-solid fa-trash-can"></i> Delete</button>
                            </td>
                            </tr>`;
                index++;
            }
            contactList.innerHTML = data;

            $("#addButton").on("click", () =>{
                LoadLink("edit", "add");
            });

            $("button.delete").on("click", function()
            {
                if (confirm("Are you sure you want to delete this contact?"))
                {
                    localStorage.removeItem($(this).val() as string);
                }
                LoadLink("contact-list");
            });

            $("button.edit").on("click", function(){
                LoadLink("edit", $(this).val() as string);
            });

        }
    }

    function DisplayEditPage() : void {
        console.log("Display Edit page Called");

        ContactFormValidation();

        let page = location.hash.substring(1);
        switch(page){
            case "add":
                $("main>h1").text("Add Contact");
                $("#editButton").html(`<i class="fa-solid fa-plus fa-sm"> </i> Add`)

                $("#editButton").on("click", (event) => {
                    event.preventDefault();

                    let fullName = document.forms[0].fullName.value;
                    let contactNumber = document.forms[0].contactNumber.value;
                    let emailAddress = document.forms[0].emailAddress.value;

                    AddContact(fullName, contactNumber, emailAddress);
                    LoadLink("contact-list");
                });

                $("#cancelButton").on("click", () => {
                    LoadLink("contact-list");
                });
                break;
            default:{
                //edit
                let contact = new core.Contact();
                contact.deserialize(localStorage.getItem(page) as string);
                //inserting the information from local storage to the textboxes
                $("#fullName").val(contact.FullName);
                $("#contactNumber").val(contact.ContactNumber);
                $("#emailAddress").val(contact.EmailAddress);

                $("#editButton").on("click", (event) => {
                    event.preventDefault();
                    // save the new information
                    contact.FullName = $("#fullName").val() as string;
                    contact.ContactNumber = $("#contactNumber").val() as string;
                    contact.EmailAddress = $("#emailAddress").val() as string;

                    localStorage.setItem(page, contact.serialize() as string);

                    LoadLink("contact-list");
                });

                $("#cancelButton").on("click", () => {
                    LoadLink("contact-list");
                });

            }
        }
    }

    //EXTRA FUNCTIONS (USED MORE THAN ONCE)
    function AddContact(fullName : string, contactNumber : string, emailAddress : string) : void
    {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize())
        {
            let key = contact.FullName.substring(0,1) + Date.now();
            localStorage.setItem(key, contact.serialize() as string);
        }
    }

    function DisplayLoginPage() : void {
        console.log("Display Login page Called");

        let messageArea2 = $("#messageArea2");
        messageArea2.hide();

        addLinkEvents("register");

        $("#loginButton").on("click", function ()
        {
            let success = false; // set default to false
            let newUser = new core.User();

            $.get("data/user.json", function(data){
                for(const u of data.user){

                    let userNameLogin = document.forms[0].userNameLogin.value;
                    let passwordLogin = document.forms[0].passwordLogin.value;

                    if (userNameLogin === u.Username && passwordLogin === u.Password) {
                        success = true;
                        newUser.fromJSON(u);
                        break;
                    }
                }
                if(success){
                    sessionStorage.setItem("user", newUser.serialize() as string);
                    messageArea2.removeAttr("class").hide();
                    LoadLink("contact-list");
                }else{
                    // fail authentication
                    $("#userNameLogin").trigger("focus").trigger("select");
                    messageArea2.addClass("alert alert-danger").text("Error - " +
                        "Failed to login with username & password entered.")
                    messageArea2.show();
                }
            });

        });

        $("#cancelButton").on("click", function () {
            document.forms[0].reset();
            LoadLink("home");
        });
    }

    /**
     *
     */
    function AuthGuard() : void {
        let protected_routes : string[] = ["contact-list"];

        if (protected_routes.indexOf(router.ActiveLink) > -1){
            if(!sessionStorage.getItem("user")){
                router.ActiveLink = "login";
            }
        }
    }


    function CheckLogin() : void {
        if(sessionStorage.getItem("user")){
            $("#login").html(`<a class="nav-link" id="logout" href="/">
                                                    <i class="fa-solid fa-right-to-bracket"></i> Log Out</a>`);
        }
        $("#logout").on("click", function() {
           sessionStorage.clear();
            LoadLink("home");
        });

    }

    function DisplayRegisterPage() : void {
        console.log("Display Register page Called");
    }

})();