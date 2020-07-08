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
    // $.get("https://cloud.iexapis.com/stable/stock/aapl/quote/latestPrice?token=pk_8588e97d52f846bc9fdd0e06cedd2d59")
    // .done(function(response){
    //     console.log(response)
    // })
let updatePrice = (stockSymbol)  =>{
    $("#stockPrice").html(`${
        setInterval(() => {
            fetch(`https://cloud.iexapis.com/stable/stock/${stockSymbol}/quote/?token=${APIurls[2]}`)
            .then(response => response.json())
            .then(json => {
                console.log(json.latestPrice)
                console.log(json.companyName)
                return `Latest Stock Price: ${json.latestPrice}`;
            })
            }, 5000)

    }`) 
    
}



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
             console.log(json)
            $("#companyDataContainer").append(
            `<h3>${json[0].companyName}</h3>
            <span id="stockPrice">Latest Stock Price: ${json[1].latestPrice}</span>
            <br><br>    
            <h6>Company Description</h6>
            <p>${json[0].description}</p>
            `
        )
        updatePrice(json[1].symbol)
      }) 
    // $.get(`https://cloud.iexapis.com/stable/stock/${stockSymbol}/company/?token=${APIurls[2]}`)
    // .done(function(response){
    //     console.log(response)
    //     $("#companyDataContainer").append(
    //         `<h3>${response.companyName}</h3>
    //         <h6>Company Description</h6>
    //         <p>${response.description}</p>
    //         `
    //     )
    // })
  })


})