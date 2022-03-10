//calling the function for showing information
ajaxCallBack("contact.json", function(result){
    showContactInfo(result);
});

//calling the checking form function
document.getElementById("send").addEventListener("click", formCheck);

//function for showing contacts
function showContactInfo(contact){
    let html = `<h4 class="mb-4">Conctact info</h4>`;

    for(let i = 0; i < contact.length; i++){
        html += `<h6 class="mb-4"><img src="${contact[i].image.src}" alt="${contact[i].image.alt}"> ${contact[i].text}</h6>`;
    }
    document.getElementById("contactInfo").innerHTML = html;
}

//function for checking form for sending message
function formCheck(){
    var mistakes = 0;

    //checking full name
    var nameSurname = document.getElementById("fullName");
    var reNameSurname=/^[A-ZČĆŽŠĐ][a-zčćžšđ]{2,14}(\s[A-ZČĆŽŠĐ][a-zčćžšđ]{2,19})+$/;

    if((!reNameSurname.test(nameSurname.value)) || (nameSurname.value.length == 0)){
        nameSurname.nextElementSibling.classList.add("show");
        mistakes++;
    }
    else{
        nameSurname.nextElementSibling.classList.remove("show");
    }
    
    //checking email
    var mail = document.getElementById("mail");
    var reMail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    if(!reMail.test(mail.value)){
        mail.nextElementSibling.classList.add("show");
        mistakes++;
    }
    else{
        mail.nextElementSibling.classList.remove("show");
    }

    //checking dropdown list
    let dd1 = document.getElementById("subject");

    if(dd1.options.selectedIndex == 0) {
        dd1.nextElementSibling.classList.add("show");
        mistakes++;
    }
    else {
        dd1.nextElementSibling.classList.remove("show");
    }

    // checking textarea - NE RADI
    let textarea = document.getElementById("exampleFormControlTextarea1");
    if(textarea.value == ""){
        textarea.nextElementSibling.classList.add("show");
        mistakes++;
    }
    else{
        textarea.nextElementSibling.classList.remove("show");
    }

    //provera broja gresaka
    if(mistakes == 0){
        document.getElementById("spanS").textContent = "Message successfully sent!";
    }
    else{
        document.getElementById("spanS").textContent = "Please fill in the blanks";
    }
}

