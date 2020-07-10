import {APIurls} from "./apikeys.js"
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

    console.log(companies);
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
    
  
    
    for (let company of companies) {
      
      
      if (patt.test(company.name.toUpperCase()) && input.value.length > 0) {
         $("#nameList").append(`<li id="${company.symbol}">Company Name: ${company.name}<br> Symbol: ${company.symbol}</li>`)
        console.log(company)
      } 
    }
  });

 // FILLING MOCK PORTFOLIO CHART WITH DATA


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
        this.currentNetWorth = [currentNetWorth];
        this.holdings = holdings;
    }
    saveUser(){
        localStorage.setItem(`${this.userName}`, JSON.stringify(this))
    }
    createNewHolding(name, symbol, numShares){
        let newHolding = new Holding(name,symbol,numShares)
       this.holdings.push(newHolding)
    }
    async getNetWorth(){
        let currentTotal = 0;
        for(let comp of this.holdings){
            let response = await fetch(`https://cloud.iexapis.com/stable/stock/${comp.symbol}/quote/?token=${APIurls[2]}`)
            let json = await response.json();
            let currentPrice = json.latestPrice;
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
       let totalPortfolioValue = this.cash;
       console.log(this.cash);
        $("#cashTableData").html(`
        <td>Cash</td>
        <td></td>
        <td></td>
        <td>$${this.cash}</td>
        `)
       
        for(let comp of this.holdings){
            let response = await fetch(`https://cloud.iexapis.com/stable/stock/${comp.symbol}/quote/?token=${APIurls[2]}`)
            let json = await response.json();
            let currentPrice = json.latestPrice;
            $('#totalPortfolioValue').html(`
                Portfolio: $${(totalPortfolioValue += (currentPrice * comp.totalShares)).toFixed(2)}
            `)
            $("#tbody").append(`
            <tr>
            
            <td>${comp.name} (${comp.symbol})</td>
            <td>${comp.totalShares}</td>
            <td>$${Number(currentPrice).toFixed(2)}</td>
            <td>$${(Number(currentPrice) * comp.totalShares).toFixed(2)}</td>
          </tr>
            `)
            console.log(json);
           
        }
       
       
    }

}

// CREATING NEW MOCK USER DATA
function createNewUser(userName){
    let newUser = new User(userName,10000,10000)
    if(localStorage.getItem(userName) == null){
        localStorage.setItem(`${newUser.userName}`, JSON.stringify(newUser))
        return newUser;
        
    }else{
        return getUser(userName);
      
    }
    
}

function getUser(userName){
    console.log(localStorage.getItem(userName))
    let parsedUserObj = JSON.parse(localStorage.getItem(userName))
    console.log(parsedUserObj);
    let userCash = parsedUserObj.cash
    let user = parsedUserObj.userName
    let userCurrentNetWorth = parsedUserObj.currentNetWorth
    let userCurrentHoldings = parsedUserObj.holdings
    let currentUser = new User(user,userCash,userCurrentNetWorth,userCurrentHoldings)
    console.log(currentUser);
    return currentUser;
}
let currentUser = createNewUser("Dan");
//let currentUser = createNewUser("John");
//currentUser.createNewHolding("Apple","AAPL", 3)
//currentUser.createNewHolding("Microsoft","MSFT", 6)
//currentUser.createNewHolding("Tesla","TSLA", 10)
currentUser.getData()
//currentUser.createNewHolding("Microsoft","MSFT", 6)
//currentUser.saveUser()
$("#currentUserCont").html(`${currentUser.userName}`)
console.log(currentUser.userName);

 
//   $("#nameList").click(function(e){
//       console.log(e.target.id)
//       let stockSymbol = e.target.id
//       Promise.all([fetch(`https://cloud.iexapis.com/stable/stock/${stockSymbol}/company/?token=${APIurls[2]}`),
//       fetch(`https://cloud.iexapis.com/stable/stock/${stockSymbol}/quote/?token=${APIurls[2]}`)])
//       .then(results => {
//         return Promise.all(results.map(response => response.json()))
          
//         })
//       .then(json => {
//           console.log(json[0])
//           console.log(json[1])
//              console.log(json[0].companyName)
//              console.log(json)
//              console.log(json[1].latestPrice)
//             $("#companyDataContainer").append(
//             `<button id="buyButton">Buy Stock</button>
//             <h3>${json[0].companyName}</h3>
//             <span id="stockPrice">Latest Stock Price: ${json[1].latestPrice}</span>
//             <br><br>    
//             <h6>Company Description</h6>
//             <p>${json[0].description}</p>
            
//             `)
//             $("#buyButton").click(function(){
            
//                 $("#companyDataContainer").html(`
//                 Comapny: ${json[0].companyName} Price Per Share: ${json[1].latestPrice}
//                 How many shares would you like to purchase
//                   <input type="text" id="numSharesTextField"><button id="buyShares">Buy Shares</button> 
//                 `)
//                 $("#buyShares").click(function(){
//                     let numPurchasedShares = Number($("#numSharesTextField").val());
//                     currentUser.createNewHolding(json[0].companyName,stockSymbol, numPurchasedShares)
//                     currentUser.saveUser();
//                     //currentUser.getData();
                    
//                 })

//             })
            



        

//         // Calls setINterval function to update Latest Stock Price
//         setInterval(() => {
//             fetch(`https://cloud.iexapis.com/stable/stock/${json[1].symbol}/quote/?token=${APIurls[2]}`)
//             .then(response => response.json())
//             .then(json => {
//                 console.log(json.latestPrice)
//                 console.log(json.companyName)
//                 $("#stockPrice").html(`Latest Stock Price: ${json.latestPrice}`) ;
//             })
//             }, 500000)
//       }) 
   
//   })

 

//   function getCurrentStockPrice(symbol){
//     fetch(`https://cloud.iexapis.com/stable/stock/${symbol}/quote/?token=${APIurls[2]}`)
//     .then(response => response.json())
//     .then(json => {
//         console.log(json.latestPrice)
//         return json.latestPrice;
        
        
//     })
//   }







})