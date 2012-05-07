module.exports = (robot) ->
  getAmbiguousUserText = (users) ->
    "That could be #{users.length} people: #{(user.name for user in users).join(", ")}"
  
  robot.respond /buy ?([\w .-_]+) a (["'\w: -_]+)[.!]*$/i, (msg) ->
    who  = msg.match[1].trim()
    drink = msg.match[2].trim()
    users = robot.usersForFuzzyName(who)
    if users.length is 1
      user = users[0]
      order = JSON.stringify {"drink": { "to": "#{user.name}", "from": "#{msg.message.user.name}","email": "#{user.email_address}", "type": "#{drink}"}}
      msg.http("http://beer.pinmonkey.com/users/")
        .headers(Accept: 'application/json', 'Content-Type': 'application/json')
          .post(order) (err, res, body) ->
            response = JSON.parse body
            if !response.error
              msg.reply "good idea, #{who} deseves a #{drink}."
            else
              msg.reply "Looks like you've been cut off.. try again tomorrow"
    else if users.length > 1
      msg.send getAmbiguousUserText users
    else
      msg.send "#{who}? Never heard of 'em"
