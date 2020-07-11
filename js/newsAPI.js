import {firebaseAPIkey, newsAPIkey, iexCloudAPIkey} from './apikeys.js'
// console.log(firebaseAPIkey)
// console.log(newsAPIkey)
// console.log(firebaseAPIkey)

$(()=>{
    
    var $searchSubmit = $('#nameList')
    $searchSubmit.click(function(e) {
        console.log(e.target.innerHTML)
        var $searchContent = e.target.innerHTML
        var url = `https://newsapi.org/v2/everything?q=${$searchContent}&sortBy=relevancy&apiKey=${newsAPIkey}`
        $.get(url)
        .done(function (response) {
            // console.log(response.articles)
            for (let i = 0; i < 3; i++) {
                console.log(response.articles[i].title)
            }
        })
    })


})