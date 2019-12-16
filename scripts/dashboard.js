const User = {
  _id: "",
  id: "",
  fname: "",
  lname: "",
  email: "",
  password: "",
  balance: "",
  numberOfSessions: "",
};
userArr = [];
const form = document.querySelector(".sign-up");

checkCookieExistence();

function checkCookieExistence() {
  let sessionIdCookie = document.cookie.match(
    /^(.*;)?\s*sessionId\s*=\s*[^;]+(.*)?$/
  );
  console.log(sessionIdCookie);
  if (sessionIdCookie == null) {
    window.location.href = "sign-up.html";
  } else {
    console.log("cookie session successfull");
    getUserList();
  }
}

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

function createUserList(data) {
  data.forEach(data => {
    const user = Object.create(User);
    user.fname = data.fname;
    user.lname = data.lname;
    user.email = data.email;
    user.password = data.password;
    user.balance = data.balance;
    user.numberOfSessions = data.numberOfSessions;
    user.id = data.id;
    user._id = data._id;
    userArr.push(user);
  });
  console.log(userArr);
  writeUserInfo(userArr);
}

//POST NEW USER TO REST DB
function updateDB(loggedUser) {
  let postData = JSON.stringify(loggedUser);
  let fetchLink =
    "https://userlist-1acd.restdb.io/rest/user-list/" + loggedUser._id;

  fetch(fetchLink, {
      method: "put",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-apikey": "5ddd96bf4658275ac9dc1f88",
        "cache-control": "no-cache"
      },
      body: postData
    })
    .then(d => d.json())
}

let loggedUser;

function writeUserInfo(userArr) {
  let sId = readCookie("sessionId");

  loggedUser = getUserPosition(userArr, sId);
  loggedUser.numberOfSessions++;
  showOnboarding(loggedUser.numberOfSessions);
  updateDB(loggedUser);

  //Add Balance
  document.querySelector('.addMoney p').textContent = loggedUser.balance + "$";
  document.querySelector('.loading').classList.add('hide');
  document.getElementById('card_name').value = loggedUser.fname + " " + loggedUser.lname;

  function getUserPosition(userArr, sId) {
    const found = userArr.find(e => e.id == sId);
    return found;
  }

  if (loggedUser == null) {
    let cname = "sessionId";
    deleteCookie(cname);
  }

  /*     document.title = `${loggedUser.fname} ${loggedUser.lname}'s dashboard`;
    document.querySelector("h1").innerHTML = `Hello ${loggedUser.fname}`; */

  function readCookie(name) {
    let i,
      c,
      ca,
      nameEQ = name + "=";
    ca = document.cookie.split(";");
    for (i = 0; i < ca.length; i++) {
      c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return "";
  }
}



function deleteCookie(cname) {
  window.document.cookie =
    cname + "=" + "; " + new Date(0).toUTCString() + "; path=/";
  console.log("cookie deleted");
  location.reload();
}


//Onboarding flow

function showOnboarding(sessions) {
  if (sessions == 1) {
    document.querySelector("body").classList.add('onboarding');
  }
}

document.querySelectorAll(".onboarding_flow__box--steps li").forEach(button => {
  button.addEventListener("click", e => {
    removeAll();
    document.querySelector("body").classList.add('onboarding--' + e.target.id);
  });
});

function removeAll() {
  let children = document.querySelectorAll('.onboarding_flow__box--steps li');
  children.forEach(child => {
    document.querySelector("body").classList.remove('onboarding--' + child.id);
  });
}

document.getElementById('nextButton').addEventListener("click", goNextStep);

function goNextStep() {
  let myAccountActive = document.querySelector("body").classList.contains('onboarding--myAccount');
  let myBalanceActive = document.querySelector("body").classList.contains('onboarding--myBalance');
  let playNowActive = document.querySelector("body").classList.contains('onboarding--playNow');
  removeAll();

  switch (true) {
    case myAccountActive:
      document.querySelector("body").classList.add('onboarding--myBalance');
      break;
    case myBalanceActive:
      document.querySelector("body").classList.add('onboarding--playNow');
      break;
    case playNowActive:
      document.querySelector("body").classList.remove('onboarding');
      break;
  }
}



//Add Money Modal

function addMoney() {
  document.querySelector('.addMoneyModal').style.visibility = "visible";
  document.querySelector('.addMoneyModal').style.opacity = "1";
  document.querySelector('.addMoneyModal').style.zIndex = "20";
}

function closeAddMoneyModal() {
  document.querySelector('.addMoneyModal').style.visibility = "hidden";
  document.querySelector('.addMoneyModal').style.opacity = "0";
  document.querySelector('.addMoneyModal').style.zIndex = "-10";
}

function goToStep2() {
  document.querySelector('.addMoneyModal__box').classList.add('step2');
}

function goBackToStep1() {
  document.querySelector('.addMoneyModal__box').classList.remove('step2');
}

function goToStep3() {
  document.querySelector('.addMoneyModal__box').classList.add('step3');
}

function goBackToStep2() {
  document.querySelector('.addMoneyModal__box').classList.remove('step3');
}

function openGame(){
  document.querySelector('.game-container').style.visibility = "visible";
  document.querySelector('.game-container').style.opacity = "1";
}

function closeGame(){
  document.querySelector('.game-container').style.visibility = "hidden";
  document.querySelector('.game-container').style.opacity = "0";
}


function addSlash() {
  if (exp.value.length == 2) {
    exp.value = exp.value + "/";
  }
}

let addMoney_form, addMoney_button;

document.querySelectorAll('.addMoneyModal__box__cards--card').forEach(input => {
  input.addEventListener('click', function (event) {
    newBalance = Number(event.target.getAttribute('value'));
    addMoney_form = document.querySelector('.step_box_1');
    addMoney_button = document.querySelector('.step_box_button_1');
    setTimeout(function () {
      changeSubmitButton(addMoney_form, addMoney_button);
    }, 10);
  });
});

document.querySelectorAll(".step_box_2 input").forEach(input => {
  input.addEventListener("keyup", e => {
    addMoney_form = document.querySelector('.step_box_2');
    addMoney_button = document.querySelector('.step_box_button_2');
    changeSubmitButton(addMoney_form, addMoney_button);
  });
});

document.querySelector('.formCheck__checkbox input').addEventListener('click', function () {
  addMoney_form = document.querySelector('.step_box_3');
  addMoney_button = document.querySelector('.step_box_button_3');
  changeSubmitButton(addMoney_form, addMoney_button);
});

function changeSubmitButton(form, button) {
  isValidEmail = form.checkValidity();
  console.log(isValidEmail);
  if (isValidEmail) {
    console.log("valid");
    button.disabled = false;
  } else {
    button.disabled = true;
  }
}

function finishBalance() {
  document.querySelector('.addMoneyModal__box').classList.add('step4');
  loggedUser.balance = loggedUser.balance + newBalance;
  console.log(loggedUser.balance);
  updateDB(loggedUser);
  setTimeout(function () {
    location.reload();
  }, 300);
 /*  location.reload(); */
}