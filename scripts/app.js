"use strict";
(function () {
    function Start() {
        console.log("App Started!");
        LoadHeader();
        LoadContent();
        LoadFooter();
    }
    window.addEventListener("load", Start);
    function ActiveLinkCallback() {
        switch (router.ActiveLink) {
            case "home": return DisplayHomePage;
            case "about": return DisplayAboutPage;
            case "services": return DisplayServicesPage;
            case "contact": return DisplayContactsPage;
            case "contact-link": return DisplayContactListPage;
            case "edit": return DisplayEditPage;
            case "login": return DisplayLoginPage;
            case "products": return DisplayProductsPage;
            case "register": return DisplayRegisterPage;
            case "404": return Display404Page;
            default:
                console.error("Error: Callback does not exist: " + router.ActiveLink);
                return new Function();
        }
    }
    function CapitalizeFirstChar(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function LoadHeader() {
        $.get("/views/components/header.html", function (Data) {
            $("header").html(Data);
            document.title = CapitalizeFirstChar(router.ActiveLink);
            $(`li>a:contains(${document.title})`).addClass("active");
            CheckLogin();
        });
    }
    function LoadContent() {
        let page = router.ActiveLink;
        let callback = ActiveLinkCallback();
        $.get(`/views/content/${page}.html`, function (Data) {
            $("main").html(Data);
            callback();
        });
    }
    function LoadFooter() {
        $.get("/views/components/footer.html", function (Data) {
            $("footer").html(Data);
        });
    }
    function Display404Page() {
        console.log("Display 404 page called");
    }
    function AjaxRequest(method, url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (typeof callback === "function") {
                    callback(xhr.responseText);
                }
                else {
                    console.error("Error: Please provide a valid function for call back");
                }
            }
        });
        xhr.open(method, url);
        xhr.send();
    }
    function DisplayHomePage() {
        console.log("Display Home Called");
        $("main").append(`<p id="MainParagraph" class="mt-3">This is the Main Paragraph!!</p>`);
        $("body").append(`<article class="container"><p id="ArticleParagraph" 
                            class ="mt-3">This is my article paragraph</p></article>`);
    }
    function DisplayProductsPage() {
        console.log("Display Products Called");
    }
    function DisplayServicesPage() {
        console.log("Display Services Page Called");
    }
    function ContactFormValidation() {
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/, "Please Enter a valid First Name and Last Name. (Ex. Stephen Strange)");
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please Enter a valid Contact Number (Ex. 905-555-5555");
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please Enter a valid Email Address. (Ex. ThisExample@dcmail.ca)");
    }
    function ValidateField(input_field_id, regular_expression, error_Message) {
        let messageArea = $("#messageArea");
        $(input_field_id).on("blur", function () {
            let InputFieldText = $(this).val();
            if (!regular_expression.test(InputFieldText)) {
                $(this).trigger("focus");
                $(this).trigger("select");
                messageArea.addClass("alert alert-danger");
                messageArea.text(error_Message);
                messageArea.show();
            }
            else {
                messageArea.removeAttr("class");
                messageArea.hide();
            }
        });
    }
    function DisplayContactsPage() {
        console.log("Display Contacts Called");
        ContactFormValidation();
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        sendButton.addEventListener("click", function (event) {
            if (subscribeCheckbox.checked) {
                let fullName = document.forms[0].fullName.value;
                let contactNumber = document.forms[0].contactNumber.value;
                let emailAddress = document.forms[0].emailAddress.value;
                AddContact(fullName, contactNumber, emailAddress);
            }
        });
    }
    function DisplayAboutPage() {
        console.log("Display About us page Called");
    }
    function DisplayContactListPage() {
        console.log("Display Contact List page Called");
        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = "";
            let keys = Object.keys(localStorage);
            let index = 1;
            for (const key of keys) {
                let contactData = localStorage.getItem(key);
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
            $("#addButton").on("click", () => {
                location.href = "/edit#add";
            });
            $("button.delete").on("click", function () {
                if (confirm("Are you sure you want to delete this contact?")) {
                    localStorage.removeItem($(this).val());
                }
                location.href = "/contact-list";
            });
            $("button.edit").on("click", function () {
                location.href = "/edit#" + $(this).val();
            });
        }
    }
    function DisplayEditPage() {
        console.log("Display Edit page Called");
        ContactFormValidation();
        let page = location.hash.substring(1);
        switch (page) {
            case "add":
                $("main>h1").text("Add Contact");
                $("#editButton").html(`<i class="fa-solid fa-plus fa-sm"> </i> Add`);
                $("#editButton").on("click", (event) => {
                    event.preventDefault();
                    let fullName = document.forms[0].fullName.value;
                    let contactNumber = document.forms[0].contactNumber.value;
                    let emailAddress = document.forms[0].emailAddress.value;
                    AddContact(fullName, contactNumber, emailAddress);
                    location.href = "/contact-list";
                });
                $("#cancelButton").on("click", () => {
                    location.href = "/contact-list";
                });
                break;
            default: {
                let contact = new core.Contact();
                contact.deserialize(localStorage.getItem(page));
                $("#fullName").val(contact.FullName);
                $("#contactNumber").val(contact.ContactNumber);
                $("#emailAddress").val(contact.EmailAddress);
                $("#editButton").on("click", (event) => {
                    event.preventDefault();
                    contact.FullName = $("#fullName").val();
                    contact.ContactNumber = $("#contactNumber").val();
                    contact.EmailAddress = $("#emailAddress").val();
                    localStorage.setItem(page, contact.serialize());
                    location.href = "/contact-list";
                });
                $("#cancelButton").on("click", () => {
                    location.href = "/contact-list";
                });
            }
        }
    }
    function AddContact(fullName, contactNumber, emailAddress) {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = contact.FullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }
    function DisplayLoginPage() {
        console.log("Display Login page Called");
        let messageArea2 = $("#messageArea2");
        messageArea2.hide();
        $("#loginButton").on("click", function () {
            let success = false;
            let newUser = new core.User();
            $.get("data/user.json", function (data) {
                for (const u of data.user) {
                    let userNameLogin = document.forms[0].userNameLogin.value;
                    let passwordLogin = document.forms[0].passwordLogin.value;
                    if (userNameLogin === u.Username && passwordLogin === u.Password) {
                        success = true;
                        newUser.fromJSON(u);
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea2.removeAttr("class").hide();
                    location.href = "/contact-list";
                }
                else {
                    $("#userNameLogin").trigger("focus").trigger("select");
                    messageArea2.addClass("alert alert-danger").text("Error - " +
                        "Failed to login with username & password entered.");
                    messageArea2.show();
                }
            });
        });
        $("#cancelButton").on("click", function () {
            document.forms[0].reset();
            location.href = "/home";
        });
    }
    function CheckLogin() {
        if (sessionStorage.getItem("user")) {
            $("#login").html(`<a class="nav-link" id="logout" href="/">
                                                    <i class="fa-solid fa-right-to-bracket"></i> Log Out</a>`);
        }
        $("#logout").on("click", function () {
            sessionStorage.clear();
            location.href = "/home";
        });
    }
    function DisplayRegisterPage() {
        console.log("Display Register page Called");
    }
})();
//# sourceMappingURL=app.js.map