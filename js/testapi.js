import APIurls from "./config.js"
$(()=>{
    
    var companies = [] 
  
    
    // $.get("https://cloud.iexapis.com/stable/stock/aapl/batch?types=quote,news,chart&range=1m&last=10&token=pk_8588e97d52f846bc9fdd0e06cedd2d59")
    // .done(function(response){
    //     console.log(response)
    // })
    // $.get("https://cloud.iexapis.com/stable/stock/aapl/quote/?token=pk_8588e97d52f846bc9fdd0e06cedd2d59")
    // .done(function(response){
    //     console.log(response)
    // })
    // $.get("https://cloud.iexapis.com/stable/stock/aapl/quote/latestPrice?token=pk_8588e97d52f846bc9fdd0e06cedd2d59")
    // .done(function(response){
    //     console.log(response)
    // })
 


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
    $.get(`https://cloud.iexapis.com/stable/stock/${stockSymbol}/batch?types=quote,news,chart&range=1m&last=10&token=${APIurls[2]}`)
    .done(function(response){
        console.log(response)
    })
  })


})