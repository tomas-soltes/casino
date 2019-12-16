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
const formUpdate = document.querySelector(".edit-details");

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
    user.id = data.id;
    user._id = data._id;
    userArr.push(user);
  });
  // console.log(userArr)
  writeUserDetails(userArr);
}

function updateDB(loggedUser) {
  let postData = JSON.stringify(loggedUser);
  console.log(loggedUser);
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
    .then(function (t) {
      location.reload();
    });
}

let loggedUser;

function writeUserDetails(userArr) {
  let sId = readCookie("sessionId");
  loggedUser = getUserPosition(userArr, sId);

  //Add Balance
  document.querySelector('.addMoney p').textContent = loggedUser.balance + "$";
  document.querySelector('.addMoney_box__money').textContent = loggedUser.balance + "$";
  document.querySelector('.loading').classList.add('hide');

  function getUserPosition(userArr, sId) {
    const found = userArr.find(e => e.id == sId);
    return found;
  }
  if (loggedUser == null) {
    let cname = "sessionId";
    deleteCookie(cname);
  }

  document.title = `${loggedUser.fname} ${loggedUser.lname}'s details`;
  document.querySelector("h1").innerHTML = `${loggedUser.fname}'s details`;
  formUpdate.fname.value = loggedUser.fname;
  formUpdate.lname.value = loggedUser.lname;
  formUpdate.email.value = loggedUser.email;
  formUpdate.password.value = loggedUser.password;
  document.getElementById('card_name').value = loggedUser.fname + " " + loggedUser.lname;

  formUpdate.addEventListener("submit", e => {
    updateUserArr(loggedUser, userArr);
    e.preventDefault();
  });

  function updateUserArr(loggedUser, userArr) {
    let emailInUse = checkEmailInUse(userArr, loggedUser);
    if (!emailInUse) {
      loggedUser.fname = formUpdate.fname.value;
      loggedUser.lname = formUpdate.lname.value;
      loggedUser.email = formUpdate.email.value;
      loggedUser.password = formUpdate.password.value;
      updateDB(loggedUser);
    } else {
      alert("This email adress is already taken");
    }
    console.log(emailInUse);

    function checkEmailInUse(userArr, loggedUser) {
      let value = false;
      for (i = 0; i < userArr.length; i++) {
        if (formUpdate.elements.email.value == loggedUser.email) {
          value = false;
        } else if (formUpdate.elements.email.value == userArr[i].email) {
          value = true;
        }
      }
      return value;
    }
  }

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

  logoutListener();
}

function logoutListener() {
  document.querySelector(".log-out").addEventListener("click", function () {
    let cname = "sessionId";
    deleteCookie(cname);
  });
}

function deleteCookie(cname) {
  window.document.cookie =
    cname + "=" + "; " + new Date(0).toUTCString() + "; path=/";
  console.log("cookie deleted");
  location.reload();
}

const navigationHeight = document.getElementById("nav").clientHeight;
document.querySelector(".addMoney_box").style.marginTop =
  navigationHeight + "px";

