'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    let primitive = ['   ',' _ ','  |',' _|','|_|','|_ ','| |'];
   // let header = [1,0,1,1,0,1,1,1,1,1];
   // let center = [6,2,3,3,4,5,5,2,4,4];
  //  let footer = [4,2,5,3,2,3,4,2,4,3];
    let pattern = [[1,6,4],[0,2,2],[1,3,5],[1,3,3],[0,4,2],[1,5,3],[1,5,4],[1,2,2],[1,4,4],[1,4,3]];

   let accountStrings = bankAccount.split('\n').map((x)=>{
       let triplet = [];
       let buff = "";
       x.split("").forEach((x,i,arr)=>{
           if(i%3===0 && i !== 0){
               triplet.push(buff);
               buff = "";
           }
           buff += x;
       });
       if(buff.length === 3)
           triplet.push(buff);
       return triplet;
    }).filter((x)=>x.length > 0);
   let rez = "";
   for(let i=0;i<accountStrings[0].length;i++) {
       let header = primitive.indexOf(accountStrings[0][i]);
       let center = primitive.indexOf(accountStrings[1][i]);
       let footer = primitive.indexOf(accountStrings[2][i]);

       rez += find(pattern,[header,center,footer]);
   }
   let patternItems = rez.split(0).filter((x)=>x.length > 0);

   if(patternItems.length === 0)
       return 0;
    return Number.parseInt(patternItems.join("0"));

}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function find(arr1,arr2) {
    let i = 0;
    for (let sub of arr1) {
        if (arraysEqual(sub, arr2)) { // found it
            return i;
        }
        i++;
    }
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    let arr = text.split(' ');
    let rez = [];
    let contentLength = 0;
    for(let i=0;i<arr.length;){
        if(contentLength + arr[i].length + rez.length <= columns){
            rez.push(arr[i]);
            contentLength += arr[i].length;
            i++;
        }
        else{
            yield rez.join(' ');
            contentLength = 0;
            rez= [];
        }
    }
    yield rez.join(' ');
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
};

let nums = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
let signes = ['♣','♦','♥','♠'];

function getPokerHandRank(hand) {
    let cards = [];
    for (let card of hand) {
        cards.push(parseRank(card));
    }
    let signSame = isSignSame(cards);
    let straight = isStraight(cards);
    let freq = countFrequent(cards);

    if (signSame && straight)
        return PokerRank.StraightFlush;
    if (freq[3] === 1)
        return PokerRank.FourOfKind;
    if (freq[2] === 1 && freq[1] === 1)
        return PokerRank.FullHouse;
    if (signSame)
        return PokerRank.Flush;
    if (straight)
        return PokerRank.Straight;
    if (freq[2] === 1)
        return PokerRank.ThreeOfKind;
    if(freq[1] === 2)
        return PokerRank.TwoPairs;
    if(freq[1] === 1)
        return PokerRank.OnePair;
    else
        return PokerRank.HighCard;
}

function parseRank(value){

    let num = value.slice(0,-1);
    let sign = value.slice(-1);
    let num_i = nums.indexOf(num);
    let sign_i = signes.indexOf(sign);
    return [num_i,sign_i];
}

function isSignSame(cards){
    for(let i=0;i<cards.length-1;i++){
        if(cards[i][1] !== cards[i+1][1])
            return false;
    }
    return true;
}

function isStraight(cards){
    let values = cards.map((x)=>x[0]).filter(x=>x !== 0);
    values.sort((x,y)=>x > y);
    for(let i=0;i<values.length-1;i++){
        if(values[i+1] != values[i]+1)
            return false;
    }
    if(values.length === 4){
        if(values[0] === 1 || values[values.length-1] === 12)
            return true;
        else
            return false;
    }
    return true;
}

function countFrequent(cards){
    let values = cards.map((x)=>x[0]);
    values.sort();
    let map = new Map();
    for(let i=0;i<values.length;i++){
        if(map.has(values[i]) === false)
            map.set(values[i],1);
        else
            map.set(values[i],map.get(values[i])+1);
    }
    let rez = new Array(5).fill(0);
    for (let it of map) {
        rez[it[1]-1]++;
    }
    return rez;
}




/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
   throw new Error('Not implemented');
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
