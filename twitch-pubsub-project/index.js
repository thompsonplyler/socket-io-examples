const tmi = require('tmi.js')
const fetch = require('node-fetch')
const moment = require('moment');

const express = require('express');
const app = express();
const cors = require('cors');
const io = require('socket.io-client')

const port = 3002;

// THIS IS A NON-WORKING VERSION OF THE TWITCH-PUBSUB BOT I WROTE FOR USERS TO INTERACT WITH A TWITCH STREAM.
// IT DOES NOT HAVE VALID API KEYS OR ENV REFERENCES.

// required to connect to Twitch
const options = {
    options: { debug: true },
    connection: {
        cluster: 'aws',
        reconnect: true
    },
    identity: {
        username: 'PubSubBot',
        password: 'nope'
    },
    channels: ['gamemasterthompson']
}

app.use(cors())

const objMessage = { userState: "", messageBody: "" };

// tmi client that connects to the channel
const client = new tmi.Client(options)
client.connect();
// verify connection
client.on('connected', (address, port) => {
    client.action('gamemasterthompson', 'Hello, PubSubBot is now connected.')
})
    // interpret incoming messages
    .on('message', (channel, userstate, message, self) => {

        console.log("This is the message:", JSON.stringify(userstate))
        objMessage.messageBody = message
        objMessage.userState = userstate

        // look for command
        if (message.charAt(0) === "!") {
            // look for timer command
            
            if (message.split(' ')[0] === "!today") {
                const firstArgument = message.split(' ')[1]
                const secondArgument = message.split(' ')[2]
                console.log(`!today command executed: Command: ${message.split(' ')[0]} Region: ${firstArgument} SummonerName: ${secondArgument}`)
                todayCommand(firstArgument, secondArgument, message, channel);
            }
            
            if (message.split(' ')[0]=== "!spendyourgold"){
                goldSpend()

            }
        }
        if (self) return;
        if (message.toLowerCase() === '!hello') {
            client.say(channel, `@${tags.username}, heya!`)
        }
    })
    .on('subscription', (channel, username, method, message, userstate) => {
        console.log(`
        
        
        You received a subscription! Here are the incoming data objects: 
        Username: ${username}
        
        Method: ${method}
        
        Message: ${message}
        
        Userstate: ${userstate}
        
        
        `)
    })
    .on('raided',(channel, username, viewers)=>{
        console.log(`
        
        
        You been raided! Here are the incoming data objects: 
        Username: ${username}
        
        Viewers: ${viewers}
        
        Channel: ${channel}
        
        
        
        `)
    })



const todayCommand = (region, argument, receivedMessage, channel) => {
    argument = encodeURIComponent(argument);
    console.log(`
    
    
    ${argument}
    
    
    `)
//https://fresh-under-one-sky-email-api.herokuapp.com/
    if (argument.length > 0) {
        client.say(channel, "...I have received your request and am processing it...")
        fetch(`http://fresh-under-one-sky-email-api.herokuapp.com/api/v1/today/?summoner_name=${argument}&region=${region}`, {
            method: 'POST'
        })
            .then(r => r.text())
            // .then(r=> console.log(r))
            .then(response => {
                response.replace(`"`,``).replace("[","").replace("]","")
                console.log(response)
                argument = decodeURIComponent(argument);
                todayResponseHandler(response, receivedMessage, argument, channel);

            }
            )
            .catch(error => {
                console.log('This is the error you received: ' + error)
                client.say(channel, "I've received your command but the server returned an error.")
        });

    } else {
        client.say(channel, `I've received the timer command, but your parameters made no sense. Syntax is: "!timer <region> <summonername>`);
    }
};

const todayResponseHandler = (data, receivedMessage, argument, channel) => {

    // results = {
    //     won:wonGames,
    //     lost:failGames, 
    //     total:totalGames,
    //     percent:percentage}
    let results = winCount(data)
    client.say(channel,`${argument}'s record today is ${results.won} - ${results.lost}, a ${results.percent}% win rate`)
    return
    if (data.grand_total_time == '00 hours 00 minutes and 00 seconds') {
        client.say(channel, `Today's Results for ${argument}: This summoner hasn't played any games today.`);
    } else {
        if (argument.toLowerCase() == "deusrektmachina") {
            argument = "gamema24Gmtoorah1"
        }
        client.say(channel,
            `${argument} has played for ${data.grand_total_time} today and won ${winCount(data.grand_total_results)}% of ${data.grand_total_results.length} games played.`
        );
    }
};

const winCount = (data) => {
    
    data = data.split(",")
    const wonGames = data.filter(game => game.replace(`"`,``).replace(`"`,``).replace("[","").replace("]","") == `Win`).length
    const failGames = data.filter(game => game.replace(`"`,``).replace(`"`,``).replace("[","").replace("]","") == `Fail`).length
    const totalGames = data.length
    
    let percentage = wonGames / totalGames
    if (percentage){
        percentage = Math.floor(percentage*100)
    }
    else{ percentage = 0}

    console.log(percentage)
    const results = {
        won:wonGames,
        lost:failGames, 
        total:totalGames,
        percent:percentage}

    return results
};


app.get("/subs", (req, res) => {
    res.send(JSON.stringify(objMessage));
    res.end();
})

app.listen(port, () => console.log(`Subscriber monitor is listening on port ${port}!`))

// connects PubSub server to local socket.io server
const socket = io('http://localhost:3000');

// function to respond to !spendyourgold
const goldSpend = () => {
    socket.emit('gold')
}