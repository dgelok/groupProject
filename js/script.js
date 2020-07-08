$(()=>{
    var term = "nokia";
    var url = `https://newsapi.org/v2/everything?q=${term}&sortBy=relevancy&apiKey=820d9373d7ea4f3e9d015527ab07b473`
    
    $.get(url)
    .done(function (response) {
        // console.log(response.articles)
        for (let i = 0; i < response.articles.length; i++) {
            // console.log(response.articles[i].title)
        }

        
    })
})