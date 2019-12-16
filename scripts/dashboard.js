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

window.addEventListener("click", goNextStep);
window.addEventListener('touchmove', goNextStep, {passive: false});

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



