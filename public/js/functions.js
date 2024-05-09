
function validateForm() {
    let breedDropdown = document.getElementById("breed").value;
    let breedNotListed = document.forms["findform"]["breedNotListed"].value;
    let radioType = document.getElementsByName("type");
    let radioGender = document.getElementsByName("gender");
    let type = false;
    let breednotlisted = true;
    let gender = false;
    for (let i = 0; i < radioType.length; i++) {
        if (radioType[i].checked) {
            type = true;
            break;
        }
    }
    if (breedDropdown === "Breed not listed" && breedNotListed.trim() === "") {
        breednotlisted = false;
    }
    for (let i = 0; i < radioGender.length; i++) {
        if (radioGender[i].checked) {
            gender = true;
            break;
        }
    }
    if (!type || !breednotlisted || !gender) {
        alert("Please fill out required fields");
        return false; 
    }
    return true; 
}
function validateForm2() {
    let breedpet = document.getElementById("breed").value;
    let aboutpet = document.getElementById("aboutpet").value;
    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let email = document.getElementById("email").value;
    let type = false;
    let gender = false;
    let radioType = document.getElementsByName("type");
    let radioGender = document.getElementsByName("gender");
    for (let i = 0; i < radioType.length; i++) {
        if (radioType[i].checked) {
            type = true;
            break;
        }
    }
    for (let i = 0; i < radioGender.length; i++) {
        if (radioGender[i].checked) {
            gender = true;
            break;
        }
    }
    if(breedpet === "" || aboutpet === "" || firstname === "" || lastname === "" || email === "" || !type || !gender) {
        alert("Required field left empty");
        return false;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert("Bad email format");
        return false;
    }
    return true;
}
document.getElementById('createAccountForm').onsubmit = async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;  // Get value without trimming
    const password = document.getElementById('password').value;

    const response = await fetch('/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (response.status === 409) {
        alert(result.message); // Use alert for clear visibility if username exists
    } else {
        document.getElementById('message').textContent = result.message;
    }
};
function privacyFun(){
    alert("Your information is protected by us. We do not share your information with any third party.");
} 

