$(()=>{
    var term = "nokia";
    var url = `https://newsapi.org/v2/everything?q=${term}&sortBy=relevancy&apiKey=*****NEWSAPI*****`
    
    $.get(url)
    .done(function (response) {
        // console.log(response.articles)
        for (let i = 0; i < response.articles.length; i++) {
            // console.log(response.articles[i].title)
        }
    })

    var $SUemail = $('#SUemail')
    var $SUpassword = $('#SUpassword')
    var $SUsubmit = $('#SUsubmit')
    $SUsubmit.click((e) => {
        e.preventDefault();

        //get user info
        let userID = $SUemail.value;
        let userPassword = $SUpassword.value;
        
        //sign the user up
        
    })
})