---
title: "Golang Slack Bot"
date: 2017-08-06T15:20:16-07:00
published: true
archived: true
categories: ["resources", "golang", "botdevelopment"]
tags: ["slack", "seattlefoodtruck", "bot", "golang"]
---

# Overview
These days bot development is getting so popular especially with platforms like slack and teams that most companies are now using to collaborate with teams within the company as well as external contractors and folks in external communities. I've been wanting to take a look at bot development for some time but never really just had a good use case until this last week. If you know me I'm a big foodie and I love the food trucks in Seattle. We get food trucks at T-Mobile locations in both Bellevue and Bothell, today what happens is begining of week we have a person that goes into http://www.seattlefoodtruck.com and prints out the food truck schedule for the whole week and pins it to a board in kitchen. If you want to know what's on today you either have to go to the seattlefoodtruck site or go look at the print out in kitchen and scroll through pages. What better use case for a bot eh?. That's exactly what I did this weekend.

I decided to build the seattlefoodtruck bot using golang. With some research I found [this](https://github.com/nlopes/slack) golang package which supports most if not all of the api.slack.com REST calls, as well as the Real-Time Messaging protocol over websocket, pretty freakin cool :)

Poking around the [SeattleFoodTruck](http://www.seattlefoodtruck.com) site in chrome developer tools I learned that there is a nice API that exposes all of the information such as neighborhoods, locations and trucks that are booked at those locations. Me be like my job is now easy :)

# What does the seattlefoodtruck bot do?
You can ask the bot to show neighborhoods by typing command as shown below
![](/images/bot1.png?raw=true)

If everything went well bot will respond with list of neighborhoods where you can find trucks as shown below. 

![](/images/bot2.png?raw=true)

Once you find the neighborhood that you are close to from the list, you can then ask the bot to show locations at that neighborhood by typing command as shown below.
![](/images/bot3.png?raw=true)

If everything went well bot will respond with list of locations where you can find trucks as shown below. We will need the location ID to display food trucks at that specific location. 
![](/images/bot4.png?raw=true)

At this point you can ask the bot to show trucks at that location by typing command as shown below.

![](/images/bot5.png?raw=true)

If everything went well bot will show you food trucks booked at that location, date and time range when the food truck is available as well as display food categories and an image of the food truck as shown in screen capture below. Need to do some proper date time formatting but figured this will do for now :)
![](/images/bot6.png?raw=true)

Obviously once you identify the location closest to you, you can just simply run the command that shows trucks at a location. Typing help will show all the commands supported as shown in screen capture below

![](/images/bot7.png?raw=true)

You can find the source code for the bot in this github [repository](https://github.com/rprakashg/foodtruck-slack-bot). If you want to use this bot in your organizations channels, there is a Dockerfile included in the repository, simply docker build and run in your container platform and set SLACK_TOKEN environment variable. You will also need to configure the bot in Slack.

This was a lot of fun recommend you guys to look at bot development you can automate lot of manual steps, as well as connect people with cloud services in an easy to use manner using platforms that are commonly used.

*Update 08/07/2017:* You can run the bot in heroku as well, today I'm running this for our team in Heroku. Travis file included in the repo can be leveraged to deploy to Heroku on checkin. Just need to update the API key. For more info see [Heroku Deployment](https://docs.travis-ci.com/user/deployment/heroku/)

Cheers,
Ram

