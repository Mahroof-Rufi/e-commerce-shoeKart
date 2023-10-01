        // Define validation functions for each fields
        function validateFirstName() {
            const firstName = document.getElementById("firstName").value;
            if (firstName === "") {
                document.getElementById("firstNameError").innerHTML = "first name is required.";
            } else {
                document.getElementById("firstNameError").innerHTML = "";
            }
        }

        function validateLastName() {
            const lastName = document.getElementById("lastName").value;
            if (lastName === "") {
                document.getElementById("lastNameError").innerHTML = "last name is required.";
            } else {
                document.getElementById("lastNameError").innerHTML = "";
            }
        }

        function validateEmail() {
            const email = document.getElementById("email").value;
            const emailPattern = /^[a-zA-Z]+[a-zA-Z0-9]*@[a-zA-Z]+\.[a-zA-Z]+$/;
            if (!email.match(emailPattern)) {
                document.getElementById("emailError").innerHTML = "Invalid email format.";
            } else {
                document.getElementById("emailError").innerHTML = "";
            }
        }

        function validatePhone() {
            const phone = document.getElementById("phone").value;
            const phonePattern = /^[0-9]{10,}$/;
            if (!phone.match(phonePattern)) {
                document.getElementById("phoneError").innerHTML = "Phone must contain at least 10 digits and only numbers.";
            } else {
                document.getElementById("phoneError").innerHTML = "";
            }
        }

        function validatePassword() {
            const password = document.getElementById("password").value;
            if (password.length < 6) {
                document.getElementById("passwordError").innerHTML = "Password must be at least 6 characters long.";
            } else {
                document.getElementById("passwordError").innerHTML = "";
            }
        }

        function validateConfirmPassword() {
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            if (password !== confirmPassword) {
                document.getElementById("confirmPasswordError").innerHTML = "Passwords do not match.";
            } else {
                document.getElementById("confirmPasswordError").innerHTML = "";
            }
        }

        // check all fields are correct
        function validateForm() {
            validateFirstName();
            validateLastName();
            validateEmail();
            validatePhone();
            validatePassword();
            validateConfirmPassword();

            // Check if any validation error messages exist
            const errorElements = document.querySelectorAll(".error");
            for (const errorElement of errorElements) {
                if (errorElement.innerHTML !== "") {
                    return false; // Prevent form submission
                }
            }

            return true; // Form is valid and can be submitted
        }