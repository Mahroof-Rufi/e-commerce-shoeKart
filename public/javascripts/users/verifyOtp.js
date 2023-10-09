const inputs = document.querySelectorAll("input"),
  button = document.getElementById("verifyButton");

// iterate over all inputs
inputs.forEach((input, index1) => {
  input.addEventListener("keyup", (e) => {
    // This code gets the current input element and stores it in the currentInput variable
    // This code gets the next sibling element of the current input element and stores it in the nextInput variable
    // This code gets the previous sibling element of the current input element and stores it in the prevInput variable
    const currentInput = input,
      nextInput = input.nextElementSibling,
      prevInput = input.previousElementSibling;

    // if the value has more than one character then clear it
    if (currentInput.value.length > 1) {
      currentInput.value = "";
      return;
    }
    // if the next input is disabled and the current value is not empty
    //  enable the next input and focus on it
    if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
      nextInput.removeAttribute("disabled");
      nextInput.focus();
    }

    // if the backspace key is pressed
    if (e.key === "Backspace") {
      // iterate over all inputs again
      inputs.forEach((input, index2) => {
        // if the index1 of the current input is less than or equal to the index2 of the input in the outer loop
        // and the previous element exists, set the disabled attribute on the input and focus on the previous element
        if (index1 <= index2 && prevInput) {
          input.setAttribute("disabled", true);
          input.value = "";
          prevInput.focus();
        }
      });
    }
    //if the fourth input( which index number is 3) is not empty and has not disable attribute then
    //add active class if not then remove the active class.
    if (!inputs[5].disabled && inputs[5].value !== "") {
      button.classList.add("active");
      return;
    }
    button.classList.remove("active");
  });
});

//focus the first input which index is 0 on window load
window.addEventListener("load", () => inputs[0].focus());


const timerDisplay = document.getElementById("timer");
const resendBt = document.getElementById("resendButton");
      function startTimer(duration, display) {
        let timer = duration, minutes, seconds;
        const intervalId = setInterval(function () {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          display.textContent = minutes + ":" + seconds;

          if (--timer < 0) {
            clearInterval(intervalId); // Stop the timer when it reaches 0
            display.textContent = "00:00";
            resendBt.classList.add("active");
            // Optionally, you can add code here to handle what happens when the timer reaches 0.
          }else{
          resendBt.classList.remove("active");
          }
        }, 1000);
      }

      // Call startTimer when the page loads to start the timer
      window.addEventListener("load", function () {
        const twoMinutes = 2 * 60; // 2 minutes in seconds
        startTimer(twoMinutes, timerDisplay);
      });


    // Add an event listener to the "Resend OTP" button
    const resendOTPButton = document.getElementById("resendButton");
    resendOTPButton.addEventListener("click", function() {
    // Get the user's email from the hidden field
    const userEmail = document.getElementById("usermail").value;

    // Prepare the data to send in the POST request
    const postData = {
    email: userEmail // Include the email in the POST data
    };

    fetch('/resend_otp', {
      method: 'POST', // Use the POST method
      headers: {
      'Content-Type': 'application/json', // Specify the content type as JSON
    },
      body: JSON.stringify(postData), // Convert the data to JSON and send it as the request body
    })
    .then(response => response.text())
    .then(data => {
      // Handle the response from the server (if needed)
      console.log(data);
      console.log("OTP resent successfully!");
      const twoMinutes = 2 * 60; // 2 minutes in seconds
        startTimer(twoMinutes, timerDisplay);
    })
    .catch(error => {
      // Handle any errors that occurred during the request
      console.error('Error:', error);
    });
});





