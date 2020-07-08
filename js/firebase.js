import {firebaseAPIkey, newsAPIkey, iexCloudAPIkey} from './apikeys.js'




// Your web app's Firebase configuration
var firebaseConfig = {
apiKey: firebaseAPIkey,
authDomain: "stock-market-playground.firebaseapp.com",
databaseURL: "https://stock-market-playground.firebaseio.com",
projectId: "stock-market-playground",
storageBucket: "stock-market-playground.appspot.com",
messagingSenderId: "541187275911",
appId: "1:541187275911:web:e9f65bf84216f95ed28c22",
measurementId: "G-PVE2WQ9NZJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
firebase.analytics();

$(()=>{

        const auth = firebase.auth()
    
    
        // listen for authentication status changes
        auth.onAuthStateChanged(user => {
            if (user) {
                console.log(`user logged in: ${user.email}`)
                // console.log(user)
            }
            else {
                console.log('user logged out')
            }
        })
        
        
        //  Register a new user
        var $SUemail = $('#registerUsername')
        var $SUpassword = $('#registerPassword')
        var $SUsubmit = $('#registerSubmit')
        
        $SUsubmit.click((e) => {
            e.preventDefault();
    
            //get user info
            let userID = $SUemail[0].value;
            let userPassword = $SUpassword[0].value;
            auth.createUserWithEmailAndPassword(userID, userPassword)
            .then(cred => {
                console.log(cred.user)
            })
    
        })


        //   Log the user Out
        $('#logout').click((e) =>{
            e.preventDefault();
            auth.signOut()
        })

        // Log the user In
        let signin = $('#signin')
        // console.log(signin)
        signin.click((e) =>{
            e.preventDefault();
            // alert("you clicked!")
            var id = $('#inputUsername')[0].value
            var password = $('#inputPassword')[0].value
            auth.signInWithEmailAndPassword(id, password)
            .then((cred)=>{
                window.location.href = "./dashboard.html"
            })
            
        })
})