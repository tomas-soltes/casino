//OBJECT DEFINITION
const User = {
    id: "",
    fname: "",
    lname: "",
    email: "",
    password: "",
    balance: "",
    numberOfSessions: "",
};

const EmailObject = {
    email: "",
};


let usedForm, usedLoginForm;
userArr = [];
emailArr = [];
const formLogIn = document.querySelector(".form-login");
const formLogInForgot = document.querySelector(".form-login-forgot");
const formSignUp = document.querySelector(".sign-up");
const formSpin = document.querySelector(".form-spin");
const formSignUpAfterSpin = document.querySelector(".sign-up-afterSpin");

getUserList();
getEmailList();


//FECTH REST DB AND CALL FUNCTION CREATE EMAIL LIST
function getEmailList() {
    fetch("https://usermails-f15b.restdb.io/rest/emails", {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": "5deea9e6bf46220df655d8ff",
                "cache-control": "no-cache"
            }
        })
        .then(e => e.json())
        .then(e => createEmailList(e));
}

function createEmailList(data) {
    data.forEach(data => {
        const EmailConst = Object.create(EmailObject);
        EmailConst.email = data.email;
        emailArr.push(EmailConst);
    });

    /*     data.forEach(data => {
            emailArr.push(data.email);
        }); */

    console.log(emailArr);

    //EVENT LISTENER FOR LOG IN FORM SUBMISSION
    formSpin.addEventListener("submit", e => {
        addEmail(emailArr);
        e.preventDefault();
    });

    function checkEmailUsed(emailArr) {
        let value = false;
        for (i = 0; i < emailArr.length; i++) {
            if (formSpin.elements.email.value == emailArr[i].email) {
                value = true;
            }
        }
        return value;
    }

    function addEmail() {
        //CHECK IF INSERTED EMAIL ALREADY EXISTS IN EMAIL ARRAY
        let emailUsed = checkEmailUsed(emailArr);

        //GET EMAIL AND STORE IT IN ARRAY
        if (!emailUsed) {
            const EmailConst = Object.create(EmailObject);
            EmailConst.email = formSpin.elements.email.value;
            emailArr.push(EmailConst);
            console.log(emailArr);
            postToEmailDB(EmailConst);
            spinWheel();
        } else {
            alert("This email address was already used");
        }
    }

    //POST NEW USER TO REST DB
    function postToEmailDB(data) {
        const postData = JSON.stringify(data);
        fetch("https://usermails-f15b.restdb.io/rest/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": "5deea9e6bf46220df655d8ff",
                "cache-control": "no-cache"
            },
            body: postData
        }).then(function (res) {
            res.json();
        });
    }
}

//FECTH REST DB AND CALL FUNCTION CREATE USER LIST
function getUserList() {
    fetch("https://userlist-1acd.restdb.io/rest/user-list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": "5ddd96bf4658275ac9dc1f88",
                "cache-control": "no-cache"
            }
        })
        .then(e => e.json())
        .then(e => createUserList(e));
}


//CREATE ARRAY OF USERS FROM FETCHED DATA
function createUserList(data) {
    data.forEach(data => {
        const user = Object.create(User);
        user.fname = data.fname;
        user.lname = data.lname;
        user.email = data.email;
        user.password = data.password;
        user.balance = data.balance;
        user.id = data.id;
        userArr.push(user);
    });

    console.log(userArr);
    //EVENT LISTENER FOR SIGN UP FORM SUBMISSION
    formSignUp.addEventListener("submit", e => {
        usedForm = formSignUp;
        addUser(userArr, usedForm);
        e.preventDefault();
    });
    formSignUpAfterSpin.addEventListener("submit", e => {
        usedForm = formSignUpAfterSpin;
        addUser(userArr, usedForm);
        e.preventDefault();
    });
    //EVENT LISTENER FOR LOG IN FORM SUBMISSION
    formLogIn.addEventListener("submit", e => {
        usedLoginForm = formLogIn;
        verifyEmail(userArr, usedLoginForm);
        e.preventDefault();
    });
    formLogInForgot.addEventListener("submit", e => {
        usedLoginForm = formLogInForgot;
        verifyEmail(userArr, usedLoginForm);
        e.preventDefault();
    });

    //GET DATA FROM INPUTS TO USER OBJECT AND PUSH IT INTO ARRAY OF USERS
    function addUser(userArr, usedForm) {
        console.log(usedForm);
        console.log(usedForm.elements.email.value);
        //CHECK IF INSERTED EMAIL ALREADY EXISTS IN USER ARRAY
        let emailInUse = checkEmailInUse(userArr, usedForm);
        console.log(emailInUse);

        //GET INPUT VALUES AND STORE THEM IN USER OBJECT
        if (!emailInUse) {

            let newBalance;
            if (usedForm == formSignUp) {
                newBalance = 0;
                console.log(newBalance);

            } else {
                newBalance = win;
                console.log(newBalance);
            }

            const user = Object.create(User);
            user.fname = usedForm.elements.firstname.value;
            user.lname = usedForm.elements.lastname.value;
            user.email = usedForm.elements.email.value;
            user.balance = newBalance;
            console.log(user.balance);
            user.numberOfSessions = 0;
            user.id = generateUUiD();
            user.password = usedForm.elements.password.value;
            //GENERATE UNIQUE ID FOR EACH USER
            function generateUUiD() {
                return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                    (
                        c ^
                        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
                    ).toString(16)
                );
            }
            userArr.push(user);
            postToDB(user);
            redirect(userArr, usedForm);
        } else {
            alert("This email address is already taken");
        }

        //GET UNIQUE ID OF NEW SIGNED USER
        function redirect(userArr, usedForm) {
            let typedEmail = usedForm.elements.email.value;
            let idOfUser = getIdOfUser();

            function getIdOfUser() {
                for (i = 0; i < userArr.length; i++) {
                    if (typedEmail == userArr[i].email) {
                        let userID = userArr[i].id;
                        return userID;
                    }
                }
            }
            let sId = idOfUser;
            //CREATE SESSION CONTAINING ID OF SIGNED USER
            writeCookie("sessionId", sId, 1);
        }

        function checkEmailInUse(userArr, usedForm) {
            let value = false;
            for (i = 0; i < userArr.length; i++) {
                if (usedForm.elements.email.value == userArr[i].email) {
                    value = true;
                }
            }
            return value;
        }
    }

    //LOG IN

    //GET INSERTED EMAIL AND CHECK FOR IT EXISTENCE IN USER ARRAY
    function verifyEmail(userArr, usedLoginForm) {
        let inputMailform = usedLoginForm.email.value;
        let inputPasswordform = usedLoginForm.password.value;
        let indexOfUser = getIndexOfUser(userArr);

        function getIndexOfUser(userArr) {
            for (i = 0; i < userArr.length; i++) {
                if (inputMailform == userArr[i].email) {
                    let userID = userArr[i].id;
                    console.log(userID);
                    return userID;
                }
            }
        }

        if (indexOfUser == null) {
            forgotPassword();
        } else {
            verifyPassword(userArr, indexOfUser);
        }
        //FIND USER EMAIL AND COMPARE INPUT PASSWORD WITH STORED PASSWORD IN USER ARRAY
        function verifyPassword(userArr, indexOfUser) {
            let loggedUser = getUserPosition(userArr, indexOfUser);
            console.log(loggedUser);

            function getUserPosition(userArr, indexOfUser) {
                const found = userArr.find(e => e.id == indexOfUser);
                return found;
            }
            if (inputPasswordform == loggedUser.password) {
                //IF INSERTED EMAIL AND PASSWORD MATCH GET USER UNIQUE ID
                let sId = loggedUser.id;
                //CREATE SESSION CONTAINING ID OF LOGED IN USER
                writeCookie("sessionId", sId, 1);

                //REDIRECT TO DASHBOARD
                window.location.href = "index.html";
            } else {
                forgotPassword();
            }
        }

        function forgotPassword() {
            if (usedLoginForm == formLogInForgot) {
                document.querySelector(".wrongPassword").style.opacity = "1";
                document.querySelector(".wrongPassword").classList.add('bounceAnimation');
                setTimeout(function () {
                    document.querySelector(".wrongPassword").classList.remove('bounceAnimation');
                }, 800);
            } else {
                let usedEmail = document.getElementById("email-login").value;
                document.getElementById("forgotEmail").value = usedEmail;
                openLoginForgot();
            }
        }
    }

    //CREATE COOKIE SESSION
    function writeCookie(name, value, days) {
        var date, expires;
        if (days) {
            date = new Date();
            //SET COOKIE EXPIRATION FOR 1 DAY
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = name + "=" + value + ";expires=" + expires + "; path=/";
    }

    //POST NEW USER TO REST DB
    function postToDB(data) {
        const postData = JSON.stringify(data);
        fetch("https://userlist-1acd.restdb.io/rest/user-list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": "5ddd96bf4658275ac9dc1f88",
                "cache-control": "no-cache"
            },
            body: postData
        }).then(function (res) {
            res.json();
            //REDIRECT TO DASHBOARD
            window.location.href = "index.html";
        });
    }
}

// FETCH OF ROULETTE AND BALL
fetch('img/wheel2.svg')
    .then(r => r.text())
    .then(text => {
        document.querySelector(".wheel_img").innerHTML = text;

    });

//SIGN UP FORM
function openLoginForgot() {
    console.log("wrong");
    document.querySelector(".signInForgot").style.visibility = "visible";
    document.querySelector(".signInForgot").style.opacity = "1";
    document.querySelector(".wrongPassword").style.opacity = "1";
}

function openLoginForm() {
    document.querySelector(".signInForgot").style.visibility = "visible";
    document.querySelector(".signInForgot").style.opacity = "1";
    document.querySelector(".wrongPassword").style.opacity = "0";
}

function closeSignInForgotForm() {
    document.querySelector(".signInForgot").style.visibility = "hidden";
    document.querySelector(".signInForgot").style.opacity = "0";
}

function closeSignUpForm() {
    document.querySelector(".signUp").style.visibility = "hidden";
    document.querySelector(".signUp").style.opacity = "0";
}

function openSignUpForm() {
    document.querySelector(".signUp").style.visibility = "visible";
    document.querySelector(".signUp").style.opacity = "1";
}

//SPINNING WHEEL
setTimeout(function () {
    openSpinningWheel();
}, 800);

/* document.getElementById("spinBtn").addEventListener("click", spinWheel); */
document.getElementById("closeSpinningWheel").addEventListener("click", closeSpinningWheel);
document.getElementById("openSpinningWheel").addEventListener("click", openSpinningWheel);
document.getElementById("signUpAfterSpin").addEventListener("click", signUpAfterSpin);

let win, winPrices;

function spinWheel() {
    randomIndex = [1, 2, 3, 4, 5, 6, 7, 8];
    winPrices = [100, 800, 300, 700, 500, 200, 400, 1000];
    rotateIndex = randomIndex[Math.floor(Math.random() * randomIndex.length - 1)];
    win = winPrices[rotateIndex];
    console.log(rotateIndex);

    let rotateDeg = rotateIndex * 45 + 360 + 22;
    document.getElementById("wheel_rotate").style.transform = "rotate(" + rotateDeg + "deg)";;

    document.querySelector(".wheel_img").addEventListener('transitionend', () => {
        setTimeout(function () {
            document.querySelector(".spinning_wheel__text--spin").classList.add('scaleDown');
            document.querySelector(".spinning_wheel__text--win").classList.add('scaleUp');
            document.querySelector(".won").textContent = "$" + win;
            document.querySelector(".email-spin-fill").value = document.querySelector(".email-spin").value;

            var mqTablet = window.matchMedia("(max-width: 769px)");
            if (mqTablet.matches) {
                document.querySelector(".wheel_img").style.display = "none";
            }
        }, 800);
    });
}

function closeSpinningWheel() {
    document.querySelector(".spinning_wheel").classList.add('goDown');
    document.querySelector(".spinning_wheel").classList.remove('goFromDown');
}

function openSpinningWheel() {
    document.querySelector(".spinning_wheel").classList.remove('goDown');
    document.querySelector(".spinning_wheel").classList.add('goFromDown');
}

function signUpAfterSpin() {
    closeSpinningWheel();
    /*     document.querySelector(".spinning_wheel").addEventListener('transitionend', () => {
            setTimeout(function() {
                openSignUpForm();
              }, 400);
          }); */

}


/*****************  Height check  ******************/
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`);

// We listen to the resize event
window.addEventListener("resize", () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
});


let jackpot = 114;
addJackpot();
function addJackpot() {
  jackpot = jackpot + 4;
    console.log(jackpot);
    document.querySelector('.progressive_jackpot').textContent = "$7,136," + jackpot;
    setTimeout(function () {
      addJackpot();
    }, 1000);
}

