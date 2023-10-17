document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll(".custom-control-input");
    const selectedItemsInput = document.getElementById("selected-items");

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            const selectedItems = Array.from(checkboxes)
                .filter((checkbox) => checkbox.checked)
                .map((checkbox) => checkbox.value);

                if(selectedItems == ""){
                    alert("You should select any category to filter");
                } else {
                    selectedItemsInput.value = selectedItems.join(",");
                }
        });
    });
});