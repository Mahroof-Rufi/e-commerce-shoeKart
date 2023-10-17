

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

const passField = document.getElementById('password');
passField.addEventListener('input', validatePassword);

const confirmPass = document.getElementById('confirmPassword');
confirmPass.addEventListener('input', validateConfirmPassword);