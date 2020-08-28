// 程式碼寫在這裡!
let yourDeck = [];
let dealerDeck = [];
let yourPoint = 0;
let dealerPoint = 0;
let winner = 0; // 0:未定 1:玩家贏 2:莊家贏 3：平手

$(document).ready(function () {
    $(title).arctext({ radius: 400 })
    initCards();
    initButton();
})

function initButton() {
    $("#action-new-game").click(event => newGame());

    // 拿牌
    $("#action-hit").click(event => {
        event.preventDefault();
        yourDeck.push(deal());
        renderGameTable();
    });

    // 停牌
    $("#action-stand").click(event => {
        event.preventDefault();
        dealerDeck.push(deal());
        dealerRound();

    });

}

function initCards() {
    var img = $("<img>");
    $(img).attr({ 'src': './image/poker-0.svg' });
    $(".card > div").append(img);

}

// 建立牌組
function buildDeck() {
    let deck = [];

    for (suit = 1; suit <= 4; suit++) {
        for (number = 1; number <= 13; number++) {
            let c = new Card(suit, number);
            deck.push(c)
        }
    }
    return deck;
}


// 開始新遊戲
function newGame() {
    // 初始化
    resetGame();


    // 已洗完的牌
    deck = shuffle(buildDeck());

    yourDeck.push(deal());
    dealerDeck.push(deal());
    yourDeck.push(deal());

    // 開始遊戲
    inGame = true;

    renderGameTable();
    // console.log("NewGame!");
}


//發牌
function deal() {
    // shift 移除第一個元素 
    return deck.shift();

}

// 洗牌 
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// 牌桌畫面
function renderGameTable() {
    yourDeck.forEach((card, i) => {
        $(`#yourCard${i + 1} > img`).attr({ 'src': `./image/poker-${card.cardSuit()}-${card.cardNumber()}.svg` });
        console.log(`poker-${card.cardSuit()}-${card.cardNumber()}`);
    })
    dealerDeck.forEach((card, i) => {
        $(`#dealerCard${i + 1} > img`).attr({ 'src': `./image/poker-${card.cardSuit()}-${card.cardNumber()}.svg` });
        console.log(`poker-${card.cardSuit()}-${card.cardNumber()}`);
    })

    // 算點數
    yourPoint = calcPoint(yourDeck);
    dealerPoint = calcPoint(dealerDeck);

    if (yourPoint >= 21 || dealerPoint >= 21) {
        inGame = false;
    }
    switch (true) {
        //  如果玩家21點 玩家贏
        case yourPoint == 21:
            winner = 1;
            break;
        //  如果點數爆了
        case yourPoint > 21:
            winner = 2;
            break;
        case dealerPoint > 21:
            winner = 1;
            break;
        // 平手
        case dealerPoint == yourPoint:
            winner = 3;
            break;
        // 過五關
        case yourDeck.length == 5 && yourPoint <= 21:
            winner = 1;
            break;
        case dealerDeck.length == 5 && dealerPoint <= 21:
            winner = 2;
            break;
        default:
            winner = 0;
            break;
    }

    switch (winner) {
        case 1:
            $('.your-cards').addClass('win');
            break;
        case 2:
            $('.dealer-cards').addClass('win');
            break;
        case 3:
            break;
        default:
            break;

    }

    $(".dealer-cards h2").html(`Banker -- ${dealerPoint} point`);
    $(".your-cards h2").html(`Player -- ${yourPoint} point`);

    // 設定按鈕
    $('#action-hit').attr('disabled', !inGame)
    $('#action-stand').attr('disabled', !inGame)

}

//計算點數
function calcPoint(deck) {
    let point = 0;
    deck.forEach(card => {
        point += card.cardPoint();
    })

    if (point > 21) {
        deck.forEach(card => {
            if (card.cardNumber() === 'A') {
                point -= 10; // A 從 11 變 1
            }
        })
    }

    return point;
}


// 重置遊戲
function resetGame() {
    deck = [];
    yourDeck = [];
    dealerDeck = [];
    yourPoint = 0;
    dealerPoint = 0;
    winner = 0;

    var cover = $(".card img");
    cover.attr({ 'src': './image/poker-0.svg' });

    $('.dealer-cards').removeClass('win');
    $('.your-cards').removeClass('win');
}

function dealerRound() {
    // 1. 發牌
    // 2. 如果點數>= 玩家，結束，莊家贏
    // 3. 點數<玩家，繼續玩，重複1
    // 4. 爆了，結束，玩家贏
    while (true) {
        dealerPoint = calcPoint(dealerDeck);
        if (dealerPoint <= yourPoint) {
            dealerDeck.push(deal());
        }
        else {
            break;
        }
    }
    // 比點數
    switch (true) {
        case dealerPoint > yourPoint && dealerPoint <= 21:
            winner = 2;
            $('.dealer-cards').addClass('win');
            break;

        default:
            winner = 0;
            break;
    }
    inGame = false;

    renderGameTable();
}

class Card {
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }
    //牌面
    cardNumber() {
        switch (this.number) {
            case 1:
                return 'A';
            case 11:
                return 'J';
            case 12:
                return 'Q';
            case 13:
                return 'K';
            default:
                return this.number;
        }
    }

    // 點數
    cardPoint() {
        switch (this.number) {
            case 1:
                return 11;
            case 11:
            case 12:
            case 13:
                return 10;

            default:
                return this.number;
        }
    }

    // 花色
    cardSuit() {
        switch (this.suit) {
            case 1:
                return "1";
            case 2:
                return "2";
            case 3:
                return "3";
            case 4:
                return "4";
        }
    }
}
