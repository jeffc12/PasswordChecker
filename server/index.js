const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//NPM INSTALLS
const twitterName = require('twitter-name');
const Crawler = require("js-crawler");
const commonWord = require('dumb-passwords');
const latestTweets = require('latest-tweets');

/*******************************
EXPRESS START
*******************************/
const app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*******************************
REDIS STORE + SESSION
*******************************/
const RedisStore = require('connect-redis')(session);
const redisClient = require('redis').createClient(process.env.REDIS_URL) || require('redis').createClient();

app.use(session({
  store: new RedisStore({
    client: redisClient,
    host: 'localhost',
    port: 6379,
    ttl: 260
  }),
  secret: 'shhh',
  resave: false,
  saveUninitialized: false
}));

/*******************************
END SESSION
*******************************/
app.get('/reset', (req,res) => {
  req.session.destroy();
  res.redirect('/');
});

/*******************************
REACT ROUTER ROUTES
*******************************/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/../react-client/dist/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '/../react-client/dist/index.html'));
})

app.get('/sign-in', (req, res) => {
  res.sendFile(path.join(__dirname, '/../react-client/dist/index.html'));
})

/*******************************
CHECK TWITTER HANDLE FOR LOGIN
*******************************/
app.post('/checkHandle', (req,res) => {
  let validHandle = false;
  let reLink = 'hi';

  const checkHandle = new Promise((resolve,reject) => {

    twitterName(req.body.handle, function (err, isAvailable) {
        validHandle = isAvailable;
        resolve();
      });
  });

  checkHandle.then(data => {
    if (validHandle === true) {
      reLink = 'true';
    } else if (validHandle === false) {

      latestTweets(req.body.handle, function (err, tweets) {
        req.session.tweets = tweets;
        req.session.save();
      })
      reLink = '/dashboard';
    }

  })
  .then(() => {
    req.session.userName = req.body.handle;
    req.session.history = '';
    req.session.save();
  })
  .then(() => {
    res.send({redirect: reLink});
  })
});

/*******************************
RETURN USER NAME
*******************************/
app.get('/returnUser', (req,res) => {
  res.send(req.session.userName);
})


/**************************
SAVE PASSWORD
***************************/
app.post('/savePassword', (req,res) => {
 req.session.history =  req.session.history + req.body.saveWord;
 req.session.save();
})

app.post('/passwordCheck', (req,res) => {

  let word = req.body.word;

  let hist = '';
  let accepted = {
    wordLength: false,
    commonKeyword: false,
    uniqueChar: false,
    specialChar: false,
    historyKeyword:true,
    socialKeyword:false,
    strengthCount: 1,
  }
  /**************************
  PROMISE ASYNC TO TEST PASSWORD
  ***************************/
  const passwordCheck = new Promise((resolve,reject) => {
    // check character length
    if (req.body.word.length >=8) {
      accepted.wordLength = true;
      accepted.strengthCount++;
    }
    resolve();
  });

  passwordCheck.then(data => {
    // check for common keywords
    accepted.commonKeyword = !commonWord.check(word)

    if (accepted.commonKeyword) {
      accepted.strengthCount++;
    }
  })
  .then(() => {
    // check for uppercase/lowercase/digit
    let count = 0;

    count = characterCheck(word);
    if (count > 2) {
      accepted.uniqueChar = true;
      accepted.strengthCount++;
    }
  })
  .then(() => {
    //check for special characters
    accepted.specialChar = specialCharCheck(word);

    if (accepted.specialChar) {
      accepted.strengthCount++;
    }
  })
  .then(() => {
    // check for past history relationship
    if (req.session.history.includes(word)) {
      accepted.historyKeyword = false;
    }
  })
  .then(() => {
    // check for past twitter relationship
    let allTweets = req.session.tweets

    accepted.socialKeyword = twitterCheck(allTweets,word);
    if (accepted.socialKeyword) {
      accepted.strengthCount++;
    }
  })
  .then(() =>{
    res.send(JSON.stringify(accepted));
  });
})


/*******************************
HELPER FUNCTIONS FOR PASSWORD GATING
*******************************/

//check keyword match
const commonKeywordCheck = (str) => {
 return commonWord.check(str);
}
//check if character match
const characterCheck = (str) => {
  let count = 0;
  let stringOrg = str;

  if (str.toUpperCase() != str) {
    count++;
  };

  if (str.toLowerCase() != str) {
    count++;
  };

  for(let i = 0; i < 10; i++) {
    if (str.includes(i.toString())) {
      count++;
      return count;
    }
  }
  return count;
}
//check for twitter relationship match
const twitterCheck = (tweets,str) => {

  if (str.length > 6) {
    str = str.slice(2, 6);
  }
  for (let i in tweets) {
    let bodyContent = tweets[i].content;
    if (typeof bodyContent === 'string' && bodyContent.indexOf(str) >= 0){
      return false;
    }
  }
  return true;
}

//check for any special characters
const specialCharCheck = (str) => {
  var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
    if (pattern.test(str)) {
        return true;
    }
    return false;
}

/*******************************
Start Server on port 3000
*******************************/

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Listening on port', port);
});
