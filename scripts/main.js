/*****************  MENU  ******************/
let menu, hamburger;

function toggleMenu() {
  document.querySelector(".nav").classList.toggle("open");
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
  init();
}

function closeGame(){
  document.querySelector('.game-container').style.visibility = "hidden";
  document.querySelector('.game-container').style.opacity = "0";
  location.reload();
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
    document.querySelector('.thankYouBox__text').textContent="You've added " + newBalance + "$";
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
  console.log("toto je" + loggedUser.balance);
  updateDB(loggedUser);
  setTimeout(function () {
    location.reload();
  }, 800);
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

function moneyGold(){
    document.getElementById('moneyIcon').src = "img/icons/money-gold.png";
}

function accountGold(){
    document.getElementById('accountIcon').src = "img/icons/account-gold.png";
}

function moneyWhite(){
    document.getElementById('moneyIcon').src = "img/icons/money.png";
}

function accountWhite(){
    document.getElementById('accountIcon').src = "img/icons/account.png";
}