$(()=>{
    var term = "nokia";
    var url = `https://newsapi.org/v2/everything?q=${term}&sortBy=relevancy&apiKey=***NEWSAPIKEY*****`
    
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
        let userID = $SUemail[0].value;
        let userPassword = $SUpassword[0].value;
        // console.log(userID)
        // console.log(userPassword)
        
        //sign the user up
        auth.createUserWithEmailAndPassword(userID, userPassword)
        .then(cred => {
            console.log(cred.user)
        })

    })
})