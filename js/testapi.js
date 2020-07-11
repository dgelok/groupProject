import {APIurls} from "./apikeys.js"
// import {userEmail} from "./backFireBase.js"

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
        this.currentNetWorth = [currentNetWorth];
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
       console.log(this.cash);
       
       
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
        // for(let comp of this.holdings){
            
        //     let response = await fetch(`https://cloud.iexapis.com/stable/stock/${comp.symbol}/quote/?token=${APIurls[2]}`)
        //     let json = await response.json();
        //     let currentPrice = json.latestPrice;
        //     $('#totalPortfolioValue').html(`
        //         $${(totalPortfolioValue += (currentPrice * comp.totalShares)).toFixed(2)}
        //     `)
        //     $("#tbody").append(`
        //     <tr>
            
        //     <td>${comp.name} (${comp.symbol})</td>
        //     <td>${comp.totalShares}</td>
        //     <td>$${Number(currentPrice).toFixed(2)}</td>
        //     <td>$${(Number(currentPrice) * comp.totalShares).toFixed(2)}</td>
        //   </tr>
        //     `)
 
        // }
       
       
    }

 
}
  
  

//CREATING NEW MOCK USER DATA
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
    let userCash = Number(parsedUserObj.cash)
    let user = parsedUserObj.userName
    let userCurrentNetWorth = parsedUserObj.currentNetWorth
    let userCurrentHoldings = parsedUserObj.holdings
    let currentUser = new User(user,userCash,userCurrentNetWorth,userCurrentHoldings)
    console.log(currentUser);
    return currentUser;
}

let currentUser = createNewUser(localStorage.currentUser);


// currentUser.createNewHolding("Microsoft","MSFT", 6)
// //currentUser.saveUser()
currentUser.getData()

console.log(currentUser);


 $("#refreshButton").click(function(e){
    currentUser.getData();
 })
//currentUser.buyStock("Microsoft","MSFT", 5, currentUser.getStockLatestPrice)
//  //currentUser.saveUser()
//  currentUser.getData()
currentUser.getStockLatestPrice("MSFT")

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

// $('#exampleModalCenter2').on('shown.bs.modal', function (e) {
    
//         let stockData = awacurrentUser.getStockData(e.target.id);
//         console.log(stockData);
//         $("#exampleModalCenterTitle2").html(`Purchase shares of ${stockData.companyName} at $${stockData.latestPrice} a share`)
  
//   })

// $("#buySharesFinalButton").click(function(e){
//     console.log(e);
//         // let stockData = await currentUser.getStockData(e.target.id);
//         // console.log(stockData);
       
//         $("#exampleModalCenterTitle").html(`Purchase shares of  a share`)
  
// })













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
            



        

        // Calls setINterval function to update Latest Stock Price
        setInterval(() => {
            fetch(`https://cloud.iexapis.com/stable/stock/${json[1].symbol}/quote/?token=${APIurls[2]}`)
            .then(response => response.json())
            .then(json => {
                console.log(json.latestPrice)
                console.log(json.companyName)
                $("#stockPrice").html(`Latest Stock Price: ${json.latestPrice}`) ;
            })
            }, 500000)

   
//   })

 

//   function getCurrentStockPrice(symbol){
//     fetch(`https://cloud.iexapis.com/stable/stock/${symbol}/quote/?token=${APIurls[2]}`)
//     .then(response => response.json())
//     .then(json => {
//         console.log(json.latestPrice)
//         return json.latestPrice;
        
        
//     })
//   }







// let currentUser = createNewUser("Bill");
// currentUser.createNewHolding("Apple","AAPL", 7)
// currentUser.createNewHolding("Microsoft","MSFT", 4)
// currentUser.createNewHolding("Tesla","TSLA", 60)
// currentUser.getData()

// console.log(currentUser);


})
