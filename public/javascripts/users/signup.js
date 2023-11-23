        // Define validation functions for each fields
        function validateFirstName() {
            const firstName = document.getElementById("firstName").value;
            if (firstName === "") {
                document.getElementById("firstNameError").innerHTML = "first name is required.";
                return false
            } else {
                document.getElementById("firstNameError").innerHTML = "";
                return true
            }
        }

        function validateLastName() {
            const lastName = document.getElementById("lastName").value;
            if (lastName === "") {
                document.getElementById("lastNameError").innerHTML = "last name is required.";
                return false
            } else {
                document.getElementById("lastNameError").innerHTML = "";
                return true
            }
        }

        function validateEmail() {
            const email = document.getElementById("email").value;
            const emailPattern = /^[a-zA-Z]+[a-zA-Z0-9]*@[a-zA-Z]+\.[a-zA-Z]+$/;
            if (!email.match(emailPattern)) {
                document.getElementById("emailError").innerHTML = "Invalid email format.";
                return false
            } else {
                document.getElementById("emailError").innerHTML = "";
                return true
            }
        }

        function validatePhone() {
            const phone = document.getElementById("phone").value;
            const phonePattern = /^[0-9]/;
            if (!phone.match(phonePattern) || phone.length !== 10 ) {
                document.getElementById("phoneError").innerHTML = "Enter a valid mobile number";
                return false
            } else {
                document.getElementById("phoneError").innerHTML = "";
                return true
            }
        }

        function validatePassword() {
            const password = document.getElementById("password").value;
            if (password.length < 6) {
                document.getElementById("passwordError").innerHTML = "Password must be at least 6 characters long.";
                return false
            } else {
                document.getElementById("passwordError").innerHTML = "";
                return true
            }
        }

        function validateConfirmPassword() {
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            if (password !== confirmPassword) {
                document.getElementById("confirmPasswordError").innerHTML = "Passwords do not match.";
                return false
            } else {
                document.getElementById("confirmPasswordError").innerHTML = "";
                return true
            }
        }

        // check all fields are correct
        function validateForm(event) {
            const firstNameResult = validateFirstName();
            const lastNameResult = validateLastName();
            const emailResult = validateEmail();
            const phoneResult = validatePhone();
            const passwordResult = validatePassword();
            const confirmPassResult = validateConfirmPassword();

            if (!firstNameResult || !lastNameResult || !emailResult || !phoneResult || !passwordResult || !confirmPassResult ) {
                event.preventDefault();
                alert('Please fill in all required fields.');
            }
        }