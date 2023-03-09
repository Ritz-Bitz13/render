"use strict";
var core;
(function (core) {
    class User {
        m_displayName;
        m_emailAddress;
        m_username;
        m_password;
        constructor(displayName = "", emailAddress = "", username = "", password = "") {
            this.m_displayName = displayName;
            this.m_emailAddress = emailAddress;
            this.m_username = username;
            this.m_password = password;
        }
        set DisplayName(displayName) {
            this.m_displayName = displayName;
        }
        get DisplayName() {
            return this.m_displayName;
        }
        set EmailAddress(emailAddress) {
            this.m_emailAddress = emailAddress;
        }
        get EmailAddress() {
            return this.m_emailAddress;
        }
        set Username(userName) {
            this.m_username = userName;
        }
        get Username() {
            return this.m_username;
        }
        set Password(password) {
            this.m_password = password;
        }
        get Password() {
            return this.m_password;
        }
        toString() {
            return ` Display Name: : ${this.DisplayName}\n Email Address: ${this.EmailAddress}\n Username: ${this.Username}`;
        }
        toJSON() {
            return {
                "DisplayName": this.m_displayName,
                "EmailAddress": this.m_emailAddress,
                "Username": this.m_username
            };
        }
        fromJSON(data) {
            this.m_displayName = data.DisplayName;
            this.m_emailAddress = data.EmailAddress;
            this.m_emailAddress = data.Username;
            this.m_password = data.Password;
        }
        serialize() {
            if (this.DisplayName !== "" && this.EmailAddress !== "" && this.Username !== "" && this.Password !== "") {
                return `${this.DisplayName}, ${this.EmailAddress}, ${this.Username}, ${this.Password}`;
            }
            console.error("One or more of the attributes are empty or missing");
            return null;
        }
        deserialize(data) {
            let propertyArray = data.split(",");
            this.DisplayName = propertyArray[0];
            this.EmailAddress = propertyArray[1];
            this.Username = propertyArray[2];
            this.Password = propertyArray[3];
        }
    }
    core.User = User;
})(core || (core = {}));
//# sourceMappingURL=user.js.map