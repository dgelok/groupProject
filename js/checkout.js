
import {APIurls, firebaseAPIkey} from "./apikeys.js"
// import {userEmail} from "./backFireBase.js"


firebase.initializeApp({
        apiKey: firebaseAPIkey,
        authDomain: "stock-market-playground.firebaseapp.com",
        projectId: "stock-market-playground"
    });

const db = firebase.firestore();
// console.log(db)



$(()=>{
    

    var companies = []


function createCompanyData(compArr){
   
    for(let company of compArr[0]){
        companies.push({
            symbol : company["ACT Symbol"],
            name : company["Company Name"]
        })
    }
    for(let company of compArr[1]){
        companies.push({
            symbol : company["Symbol"],
            name : company["Company Name"]
        })
    }

  }

  Promise.all([fetch(APIurls[0]),fetch(APIurls[1])])
  .then(results => {
    return Promise.all(results.map(response => response.json()))
      
    })
  .then(json => {
      createCompanyData(json)    
  }) 


  $('#searchField').keyup(function () {
    $("#nameList").html("");
    $("#companyDataContainer").html("");
    let input = document.getElementById('searchField');
    let patt = new RegExp(`^${input.value.toUpperCase()}`);
    
    let ul = document.getElementById("nameList");
    let count = 0;
    for (let company of companies) {

      if (patt.test(company.name.toUpperCase()) && input.value.length > 0 && count<=10) {
         $("#nameList").append(`<li id="${company.symbol}">${company.name} (${company.symbol})</li>`)
        console.log(company)
        count++;
      } 
    }
  });



// HOLDING CLASS TO CREATE INSTANCES WHEN STOCK IS PURCHASED
class Holding {
    
    constructor(name, symbol, totalShares){
        this.name = name;
        this.symbol = symbol;
        this.totalShares = totalShares;
        }
}


// USER CLASS FOR CREATING NEW USERS
class User{
    constructor(userName, cash,currentNetWorth, holdings = []){
        this.userName = userName;
        this.cash = cash;
        this.currentNetWorth = currentNetWorth;
        this.holdings = holdings;
        this.currentStockAwaitingPurchase = {};
    }
    addStockToPurchaseList(name, symbol){
        this.currentStockAwaitingPurchase = {
            name : name,
            symbol : symbol,
        }
    }
    saveUser(){
        localStorage.setItem(`${this.userName}`, JSON.stringify(this))
        db.collection("users").doc(`${this.userName}`).set({
            info: JSON.stringify(this)
        }).then(console.log("saved to database"))
    }
    createNewHolding(name, symbol, numShares){
        let found = false;
        for(let comp of this.holdings){
            if(symbol == comp.symbol){
                comp.totalShares += numShares
                console.log(comp.totalShares);
                found = true;
            }
        }
        if(found == false){
            let newHolding = new Holding(name,symbol,numShares)
            console.log(newHolding.totalShares);
            this.holdings.push(newHolding)
        }
       
    }
    async buyStock(name, symbol, numShares, latestPrice){
        let stockPrice = await latestPrice(symbol)
        console.log(typeof this.cash,typeof numShares, typeof stockPrice)
        if(this.cash >= numShares * stockPrice){
            console.log("Cash is enough to buy");
            console.log(this.cash);
            this.createNewHolding(name, symbol, numShares)
            
            this.cash = this.cash - (numShares * stockPrice)
            console.log(this.cash);
        }
        this.saveUser();
        
    }
    async getStockData(stockSymbol){
        let response = await fetch(`https://cloud.iexapis.com/stable/stock/${stockSymbol}/quote/?token=${APIurls[2]}`)
        let json = await response.json();
        return json;
    }
    async getStockLatestPrice(stockSymbol){
        let response = await fetch(`https://cloud.iexapis.com/stable/stock/${stockSymbol}/quote/?token=${APIurls[2]}`)
            let json = await response.json();
            console.log(json)
            let currentPrice = json.latestPrice;
            console.log(currentPrice);
            return currentPrice;
    }
    async getNetWorth(){
        let currentTotal = 0;
        for(let comp of this.holdings){
            
            let currentShareTotal = currentPrice * comp.totalShares
            console.log(`Total current value for ${comp.name} with 
            ${comp.totalShares} is ${currentShareTotal}
            `)
            currentTotal += currentShareTotal
        }
        this.currentNetWorth.push(currentTotal + this.cash)
        console.log(this.currentNetWorth)
    }
  
    async getData(){
        //this.clearChart()
        $("#tbody").html("")
        $("#tbody").append(`
        <tr id="cashTableData">
        <td>Cash</td>
        <td></td>
        <td></td>
        <td>$${this.cash.toFixed(2)}</td>
        </tr>
        `)
        let totalPortfolioValue = this.cash;
    //    console.log(this.cash);
        currentUser.saveUser()
       
       
       Promise.all(this.holdings.map( comp => {
           return fetch(`https://cloud.iexapis.com/stable/stock/${comp.symbol}/quote/?token=${APIurls[2]}`).then(resp => resp.json())
       })).then(results => {
        //    console.log(results);
        results.forEach((comp, index)=>{
            
            let currentCompInHoldings = this.holdings[index];
            console.log(typeof comp.latestPrice, typeof currentCompInHoldings.totalShares);
                $('#totalPortfolioValue').html(`
                $${(totalPortfolioValue += (comp.latestPrice * currentCompInHoldings.totalShares)).toFixed(2)}
            `)
            $("#tbody").append(`
            <tr>
            
            <td>${currentCompInHoldings.name} (${currentCompInHoldings.symbol})</td>
            <td>${Number(currentCompInHoldings.totalShares)}</td>
            <td>$${Number(comp.latestPrice).toFixed(2)}</td>
            <td>$${(Number(comp.latestPrice) * Number(currentCompInHoldings.totalShares)).toFixed(2)}</td>
          </tr>
            `)
           
        } )
       })
    }
}


//CREATING NEW MOCK USER DATA
function createNewUser(userName){
    
    if(localStorage.getItem(userName) == null){
        let newUser = new User(userName,10000,10000)
        localStorage.setItem(`${newUser.userName}`, JSON.stringify(newUser))
        db.collection("users").doc(`${newUser.userName}`).set({
            info: JSON.stringify(newUser)
        })
        console.log(`No user found. Created new one: ${JSON.stringify(newUser)}`)
        return newUser;
    }else{
        return getUser(userName);
    }
}


function getUser(userName){
    console.log(`Found info in local storage: ${localStorage.getItem(userName)}`)
    let parsedUserObj = JSON.parse(localStorage.getItem(userName))
    // console.log(parsedUserObj);
    let userCash = Number(parsedUserObj.cash)
    let user = parsedUserObj.userName
    let userCurrentNetWorth = parsedUserObj.currentNetWorth
    let userCurrentHoldings = parsedUserObj.holdings
    let currentUser = new User(user,userCash,userCurrentNetWorth,userCurrentHoldings)
    // console.log(currentUser);
    db.collection("users").doc(userName).get()
    .then(function (doc) {
        parsedUserObj = doc.data().info
        console.log(`Got something from DB! ${parsedUserObj}`)
    })
    return currentUser;
}

let currentUser = createNewUser(localStorage.currentUser);


// currentUser.createNewHolding("Microsoft","MSFT", 6)
// //currentUser.saveUser()
currentUser.getData()

// console.log(currentUser);


 $("#refreshButton").click(function(e){
    currentUser.getData();
 })
//currentUser.buyStock("Microsoft","MSFT", 5, currentUser.getStockLatestPrice)
//  //currentUser.saveUser()
//  currentUser.getData()
// currentUser.getStockLatestPrice("MSFT")

$("#nameList").click(function(e){
    console.log(e.target.id);
    (async () => {
    let stockData = await currentUser.getStockData(e.target.id);
    console.log(stockData);
    let currentShares = 0;
    $("#companyNameAndSymbolCheckoutTable").html(`${stockData.companyName}(${stockData.symbol})`)
    $("#currentSharePrice").html(`${stockData.latestPrice}`)
    for(let comp of currentUser.holdings){
        if(comp.symbol == stockData.symbol){
            currentShares = comp.totalShares;
        }
    }
    $("#userCurrentSharesCheckoutTable").html(`${currentShares}`)
    $("#exampleModalCenterTitle2").html(`Purchase shares of ${stockData.companyName} <br> for $${stockData.latestPrice} a share`)
        currentUser.addStockToPurchaseList(stockData.companyName,stockData.symbol)
    })()
    

})

$("#checkoutBuyButton").click(function(e){
    let stockName = currentUser.currentStockAwaitingPurchase.name;
    let stockSymbol = currentUser.currentStockAwaitingPurchase.symbol;
    
    let sharesToBuy = Number($("#numSharesToPurchaseField").val());
    $("#buyConfirmationMessage").html(`You purchased ${sharesToBuy} shares of ${stockName}!`)
    console.log(sharesToBuy);
   currentUser.buyStock(stockName, stockSymbol, sharesToBuy, currentUser.getStockLatestPrice)
})


})
