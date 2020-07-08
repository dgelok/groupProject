import {firebaseAPIkey, newsAPIkey, iexCloudAPIkey} from './apikeys.js'
    // console.log(firebaseAPIkey)



$(()=>{
    
    
    // News API search

    var $searchSubmit = $('#searchSubmit')
    $searchSubmit.click(function() {
        var $searchContent = $('#searchContent')[0].value
        var url = `https://newsapi.org/v2/everything?q=${$searchContent}&sortBy=relevancy&apiKey=${newsAPIkey}`
        $.get(url)
        .done(function (response) {
            // console.log(response.articles)
            for (let i = 0; i < response.articles.length; i++) {
                console.log(response.articles[i].title)
            }
        })
    })
    
    

    // Firebase SignUP
    var $SUemail = $('#SUemail')
    var $SUpassword = $('#SUpassword')
    var $SUsubmit = $('#SUsubmit')
    const auth = firebase.auth()
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