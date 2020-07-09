import APIurls from "./config.js"
$(()=>{
    
    var companies = [] 
    
  
    
    // $.get("https://cloud.iexapis.com/stable/stock/aapl/batch?types=quote,news,chart&range=1m&last=10&token=pk_8588e97d52f846bc9fdd0e06cedd2d59")
    // .done(function(response){
    //     console.log(response)
    // })
    $.get("https://cloud.iexapis.com/stable/stock/aapl/quote/?token=pk_8588e97d52f846bc9fdd0e06cedd2d59")
    .done(function(response){
        console.log(response)
    })
    $.get("https://cloud.iexapis.com/stable/stock/aapl/company/?token=pk_8588e97d52f846bc9fdd0e06cedd2d59")
    .done(function(response){
        console.log(response)
    })

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


  $("#nameList").click(function(e){
      console.log(e.target.id)
      let stockSymbol = e.target.id
      Promise.all([fetch(`https://cloud.iexapis.com/stable/stock/${stockSymbol}/company/?token=${APIurls[2]}`),
      fetch(`https://cloud.iexapis.com/stable/stock/${stockSymbol}/quote/?token=${APIurls[2]}`)])
      .then(results => {
        return Promise.all(results.map(response => response.json()))
          
        })
      .then(json => {
          console.log(json[0])
          console.log(json[1])
             console.log(json[0].companyName)
             console.log(json)
             console.log(json[1].latestPrice)
            $("#companyDataContainer").append(
            `<h3>${json[0].companyName}</h3>
            <span id="stockPrice">Latest Stock Price: ${json[1].latestPrice}</span>
            <br><br>    
            <h6>Company Description</h6>
            <p>${json[0].description}</p>
            `
        )

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
      }) 
   
  })

//   function getCurrentStockPrice(symbol){
//     fetch(`https://cloud.iexapis.com/stable/stock/${symbol}/quote/?token=${APIurls[2]}`)
//     .then(response => response.json())
//     .then(json => {
//         console.log(json.latestPrice)
//         return json.latestPrice;
        
        
//     })
//   }





// FILLING MOCK PORTFOLIO CHART WITH DATA

var holdings = []
class holding {
    
    constructor(name, symbol, totalShares){
        this.name = name;
        this.symbol = symbol;
        this.totalShares = totalShares;
        holdings.push(this)
        
    }
    
}

let apple = new holding("Apple Inc","AAPL",3)
let msft = new holding("Microsoft","MSFT",4)
let tsla = new holding("Tesla","tsla",4)
let fb = new holding("Facebook","FB",5)

class user{
    constructor(cash, holdings){
        this.cash = cash
        this.holdings = holdings
    }
}

async function getData(){
    let i = 1;
    for(let comp of holdings){
        let response = await fetch(`https://cloud.iexapis.com/stable/stock/${comp.symbol}/quote/?token=${APIurls[2]}`)
        let json = await response.json();
        let currentPrice = json.latestPrice;
        $("#tbody").append(`
        <tr>
        <th scope="row">${i}</th>
        <td>${comp.name}</td>
        <td>${comp.totalShares}</td>
        <td>${currentPrice}</td>
        <td>${Number(currentPrice) * comp.totalShares}</td>
      </tr>
        `)
        console.log(json);
        i++;
    }
   
}

getData();   

            
        
       

// console.log(apple.totalHoldingValue)
})