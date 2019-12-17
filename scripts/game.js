let bets = [];
let credit = 1000;
let onTable = 0;
let wPayouts = {
    odd: 2,
    even: 2,
    first12: 3,
    second12: 3,
    third12: 3,
    c1to18: 2,
    c19to36: 2,
    black: 2,
    red: 2,
    firstCol: 3,
    secondCol: 3,
    thirdCol: 3
}
let totalWin;

function init() {
    //SETS UP ALL THE EVENT LISTENERS ON BETS
    deckSetup();

    document.querySelector(".button-spin").addEventListener("click", play);

    // FETCH OF ROULETTE AND BALL
    fetch('svg/roulette-machine.svg')
        .then(r => r.text())
        .then(text => {
            document.querySelector(".wheel-container").innerHTML = text;

        });
    fetch('svg/ball.svg')
        .then(r => r.text())
        .then(text => {
            document.querySelector(".ball-container").innerHTML = text;

        });
}


function creditUpdate(operation, amount) {

    if (operation == "plus") {
        credit += amount;
        totalWin += amount;


    }
    if (operation == "minus") {
        credit -= amount;
        onTable += amount;
    }
    document.querySelector(".balance-amount").textContent = credit + " €";
    document.querySelector(".balance-table-amount").textContent = onTable + " €";

}

function numberProperties(number) {

    let redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    // ZERO IS FALSE ON ALL CONDITIONS
    if (number.number !== 0) {
        console.log("evaluating");
        // c1to18 & c19to36
        if (number.number < 19) {
            number.special.c1to18 = true;
        } else {
            number.special.c19to36 = true;
            console.log(number);
        }

        // first,second,third12
        if (number.number < 13) {
            number.special.first12 = true;
        } else if (number.number < 25) {
            number.special.second12 = true;
        } else {
            number.special.third12 = true;
        }

        // red or black
        for (i = 0; i < redNumbers.length; i++) {
            if (number.number == redNumbers[i]) {
                number.special.red = true;
                break;
            }

        }
        if (number.special.red !== true) {
            number.special.black = true;
        }

        // odd or even
        if (number.number % 2 == 1) {
            number.special.odd = true;
        } else {
            number.special.even = false;
        }

        // first,second,third Column
        for (i = 0; i < 12; i++) {
            let firstColNumber = 1 + i * 3
            let secondColNumber = 2 + i * 3
            let thirdColNumber = 3 + i * 3
            if (number.number == firstColNumber) {
                number.special.firstColNumber = true;
            } else if (number.number == secondColNumber) {
                number.special.secondColNumber = true;
            } else if (number.number == thirdColNumber) {
                number.special.thirdColNumber = true;

            }
        }
    }
    return number;
}

function play() {
    const wNumber = {
        number: "",
        amount: "",
        special: {
            odd: false,
            even: false,
            c1to18: false,
            c19to36: false,
            firstCol: false,
            secondCol: false,
            thirdCol: false,
            black: false,
            red: false,
            first12: false,
            second12: false,
            third12: false,
        }
    }
    totalWin = 0;
    let youWin = document.querySelector(".you-win");
    wNumber.number = Math.floor(Math.random() * 36);
    machineInit(wNumber.number);

    setTimeout(function () {
        document.querySelector(".win-number-title").textContent = "WINNING NUMBER";
        document.querySelector(".win-number-number").textContent = wNumber.number;
        findWin(wNumber, bets);

        youWin.classList.add("you-win-active");
        if (totalWin > 0){
            youWin.querySelector("p").textContent = totalWin + " €";
        }else {
            youWin.querySelector("h1").textContent ="You lose";
            youWin.querySelector("p").textContent = " ";
        }
     
    }, 12000);

    setTimeout(function () {
        youWin.classList.remove("you-win-active")
        clearTable();
    }, 17000);




}

function machineInit(wNumber) {
    let ballRotateDeg;
    let wheelN = [0, 32, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    // DOM ELEMENTS
    let overlay = document.querySelector(".dark-overlay");
    let machineContainer = document.querySelector(".machine-container");
    let movingContainer = document.querySelector(".moving-container")
    let wheelContainer = document.querySelector(".wheel-container");
    let ballContainer = document.querySelector(".ball-container");


    // SET DEGREE OF ROTATION
    let NumberIndex = wheelN.indexOf(wNumber);
    console.log(NumberIndex);

    ballRotateDeg = 1440 + NumberIndex * 10;
    let root = document.documentElement;
    root.style.setProperty('--ballSpin', ballRotateDeg + "deg");
    // ANIMATE

    overlay.classList.add("dark-overlay-active")
    machineContainer.classList.add("machine-reveal");

    setTimeout(function () {
        var machineSound = new Audio('sound/roulette-sound.mp3');
        machineSound.play();
        movingContainer.classList.add("machine-animation");
        ballContainer.classList.add("ball-animation");
    }, 2000)
    setTimeout(function () {
        machineContainer.classList.remove("machine-reveal");
        movingContainer.classList.remove("machine-animation");
        ballContainer.classList.remove("ball-animation");
        overlay.classList.remove("dark-overlay-active")
    }, 12000)


}

function findWin(wNumber, bets) {
    // get properties for w Number
    wNumber = numberProperties(wNumber);
    // compare w/ bet numbers
    for (i = 0; i < bets.length; i++) {
        if (bets[i].type == "number") {
            if (wNumber.number == bets[i].number) {
                amount = bets[i].amount * 35;
                creditUpdate("plus", amount)
            }
        }
        if (bets[i].type == "special") {
            let specialType = bets[i].specialType
            if (wNumber.special[specialType] == true) {
                amount = bets[i].amount * wPayouts[specialType];
                creditUpdate("plus", amount)
            }
        }
    }


}

function clearTable() {
    bets.length = 0;

    // CLEAR NUMBERS
    let deckNumbers = document.querySelectorAll('#Numbers-group [data-name="number-field"]');
    deckNumbers.forEach(deckNumber => {
        let deckChips = deckNumber.querySelector('g [data-name="chip"]');
        deckChips.style.display = "none";
    });

    // CLEAR SPECIALS
    let specialBets = document.querySelectorAll('[id*="chip"]')
    specialBets.forEach(specialBet => {
        specialBet.style.display = "none";
    });


    // ON TABLE CLEAR
    onTable = 0;
    document.querySelector(".balance-table-amount").textContent = onTable;

}

function deckSetup() {

    // FETCH ALL THE SVGS REGARDING DECK
    let deckContainer = document.querySelector(".deck-container");
    fetch('svg/roulette.svg')
        .then(r => r.text())
        .then(text => {
            deckContainer.innerHTML = text;
            deckEventListeners();
        });

    fetch('svg/chips-deck.svg')
        .then(r => r.text())
        .then(text => {
            document.querySelector(".chip-container").innerHTML = text;

            // CHIPS AMOUNT SELECTION
            let selectChips = document.querySelector(".chip-container").querySelectorAll('[id*="Select"]');
            selectChips[3].classList.add("chip-selected"); // SELECT DEFAULT CHIP 10

            // BET AMOUNT SELECTION
            selectChips.forEach(singleChip => {
                singleChip.addEventListener("click", function () {
                    selectChips.forEach(el => {
                        el.classList.remove("chip-selected");
                    });
                    singleChip.classList.add("chip-selected");
                });
            })

        });

    function deckEventListeners() {
        // LISTENERS ARE SET DIFFERENTLY BECAUSE EACH OF THEM PASS DIFFERENT ATTRIBUTES INTO THE FUNCTION
        // DOING IT AGAIN I WOULD PROBABLY MAKE SOMETHING SMARTER WITH ONLY 1 PROCESS OF ADDING E. LISTENERS AND TRIGGERING BET FUNCTION
        // LISTEN FOR BETS ON NUMBERS
        let i = 0;
        let numberContainer = deckContainer.querySelector("#Numbers-group");
        numberContainer.querySelector("#number-field").setAttribute("data-name", "number-field"); // ILLUSTRATOR NAMING FIX
        numberContainer.querySelector("#chip").setAttribute("data-name", "chip"); // ILLUSTRATOR NAMING FIX
        let deckNumbers = deckContainer.querySelectorAll('#Numbers-group [data-name="number-field"]');
        deckNumbers.forEach(deckNumber => {
            let deckChips = deckNumber.querySelector('g [data-name="chip"]');
            deckChips.classList.add("chip");
            deckChips.id = "chip-" + i;
            deckChips.style.display = "none";
            deckNumber.id = i;
            i++;
            deckNumber.addEventListener("click", e => {
                deckBet(e, "number");
            });
        });

        // LISTEN ON BETS FOR SPECIAL CASES
        let specialContainer = deckContainer.querySelector("#Specials-group");
        let specialBetsCollection = specialContainer.children;
        let specialBets = Array.from(specialBetsCollection);
        specialBets.forEach(specialBet => {
            specialBet.classList.add("chip");
            let specialChip = specialBet.querySelector('[id*="chip"]');
            specialChip.style.display = "none";
            specialBet.addEventListener("click", e => {
                deckBet(e, "special");

            });
        });

    }

    function deckBet(number, type) {
        var ChipSound = new Audio('sound/chip-sound.mp3');
        ChipSound.play();
        let selectedChipObj = {};
        selectedChipObj = findChip();
        let selectedChip = selectedChipObj.number;


        // UI UPDATE
        deckContainer.querySelector('#chip-' + number.target.parentElement.id).childNodes[3].childNodes[1].setAttribute("style", "fill:" + selectedChipObj.color);
        deckContainer.querySelector('#chip-' + number.target.parentElement.id + " text").innerHTML = selectedChip;
        deckContainer.querySelector('#chip-' + number.target.parentElement.id).style.display = "block";

        if (type == "number") {
            var deckInt = parseInt(number.target.parentElement.id);
            // CHECK IF THAT NUMBER WAS ALREADY PUSHED INTO ARRAY
            for (let i = 0; i < bets.length; i++) {
                if (bets[i].number == deckInt) {
                    if ((bets[i].amount + selectedChip) < 100) {
                        bets[i].amount += selectedChip;
                        creditUpdate("minus", selectedChip);

                    } else {
                        // BET LIMIT MODAL

                    }
                    let chip = deckContainer.querySelector('#chip-' + bets[i].number + " text");
                    chip.innerHTML = bets[i].amount;
                    //.textContent = bets[i].amount;
                    return
                }
            }
            // NEW BET ON SPECIFIC NUMBER
            const bet = Object.create(Bet);
            bet.type = "number";
            bet.number = deckInt;
            bet.amount = selectedChip;
            bets.push(bet);
            creditUpdate("minus", selectedChip);

        }

        if (type == "special") {
            let specialType = number.target.parentElement.id;
            for (let i = 0; i < bets.length; i++) {
                if (bets[i].specialType == specialType) {
                    if ((bets[i].amount + selectedChip) < 100) {
                        bets[i].amount += selectedChip;
                        creditUpdate("minus", selectedChip);

                    } else {
                        console.log("neda sa viac")
                    }
                    let chip = deckContainer.querySelector('#chip-' + specialType + " text");
                    chip.innerHTML = bets[i].amount;
                    return
                }
            }
            const bet = Object.create(Bet);
            bet.type = "special";
            bet.specialType = specialType;
            bet.amount = selectedChip;
            bets.push(bet);
            creditUpdate("minus", selectedChip);
        }

    }

}

function findChip() {
    // GET WHICH CHIP IS SELECTED AND SEND IT ALONG WITH COLORS
    let selectedAmountObj = {};

    let selectChips = document.querySelector(".chip-container").querySelectorAll('[id*="Select"]');
    selectChips.forEach(singleChip => {
        if (singleChip.classList.contains("chip-selected")) {
            let selectedAmount = singleChip.querySelector("text").textContent;
            selectedAmountObj.color = singleChip.querySelector(" circle").style.fill;
            selectedAmountObj.number = parseInt(selectedAmount, 10);

        }
    });
    console.log(selectedAmountObj);
    return selectedAmountObj;
}

init();


const Bet = {

    number: "",
    amount: ""
}
