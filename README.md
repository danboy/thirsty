beer
====

Buy someone a beer for their hard work.

You can only buy one beer a day.

THe only way to get a user account is if someone buys you a beer.

  curl -H "Content-Type: application/json" -H "Accept: application/json"  -X POST -d '{"drink":{"from":"Jane Doe", "to":"John Doe", "type": "beer"}}' http://localhost:3000/users/