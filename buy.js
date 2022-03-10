//calling the function for checking the form when customer is buying a product
document.getElementById("finish").addEventListener("click", formCheckForBuying);


//function for checking form for buying product
function formCheckForBuying(){
    mistakes = 0;

    //checking email
    var mail = document.getElementById("email");
    var reMail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    if(!reMail.test(mail.value)){
        mail.nextElementSibling.classList.add("show");
        mistakes++;
    }
    else{
        mail.nextElementSibling.classList.remove("show");
    }

    //checking the address
    var address = document.getElementById("address");
    var reAddress = /^[A-ZČĆŽŠĐ][a-zčćžšđ]{2,14}(\s[A-ZČĆŽŠĐ][a-zčćžšđ]{3,19})\s[1-9a-z]{1,4}$/;
    if((!reAddress.test(address.value)) || (address.value.length == 0)){
        address.nextElementSibling.classList.add("show");
        mistakes++;
    }
    else{
        address.nextElementSibling.classList.remove("show");
    }

    //checking the phone number
    var phone = document.getElementById("phoneNumber");
    var rePhone = /^[+][0-9]{2,3}[0-9]{8,11}$/;
    if((!rePhone.test(phone.value)) || (phone.value.length == 0)){
        phone.nextElementSibling.classList.add("show");
        mistakes++;
    }
    else{
        phone.nextElementSibling.classList.remove("show");
    }

    //provera broja gresaka
    if(mistakes == 0){
        document.getElementById("spanS").textContent = "You have successfully completed your purchase! Thank you! We will contact you soon.";
        document.getElementById("goBack").innerHTML = `Go back to our <a href="shop.html">shop</a>`;
        removeAllProducts();
    }
    else{
        document.getElementById("spanS").textContent = "Please provide us with all the required information";
    }
}

function removeAllProducts(){
    localStorage.removeItem("cartProducts");
    
    numberOfProducts();
}