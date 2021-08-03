---
title: "Updates To Foodtruck Bot"
date: 2017-08-13T12:19:42-07:00
published: true
archived: true
categories: ["resources", "golang", "botdevelopment"]
tags: ["slack", "seattlefoodtruck", "bot", "golang"]
---

I made few enhancements over the weekend to seattle food truck bot. If you haven't read my previous post on seattle food truck bot I suggest you head over to this [link](https://goo.gl/pzZWpP)

* Monday - Friday update a channel in slack with food trucks available for a specific number of locations

    T-Mobile has multiple locations (Factoria, Bothell etc.) where we get food trucks for lunch. By automatically updating trucks for these locations we no longer need someone asking the bot to show trucks at these locations daily, Mon-Friday

    ### How this is Implemented
    Pretty simple, I found a golang package that implements cron spec parser and a job runner. For more information [see](http://godoc.org/github.com/robfig/cron)

    Created a function that takes collection of locations as input and return a formatted message that can be posted to Slack channel. Using the Cron scheduler functionality in the cron package mentioned above, scheduled execution of this function at 8AM Mon-Fri and post message to slack channel configured. See sample code below

    ```golang
    if len(locations) > 0 && channel != "" {
		fmt.Println("Creating a new instance of Cron Scheduler")
		c = cron.New()
		c.AddFunc("0 0 08 * * mon-fri", func() {
			fmt.Println("Executing func in Cron")
			message, err := showTrucksForLocations(locations)
			if err != nil {
				fmt.Println("Failed to get trucks for locations")
			} else {
				log.Println("Message : ", message)
				responseHandler(channel, message)
			}
		})
		//Start the Cron
		fmt.Println("Starting Cron")
		c.Start()
	}
    ```
	Screenshot below shows slack message posted to "#food" channel by the BOT for T-Mobile Factoria and Bothell locations.
	![](/images/bot10.png?raw=true)

* Format time as AM/PM
    
    Previously when the bot shows trucks at a specified location it use to display time in 24hr format. This is now changed to show time as AM/PM. See example in screenshot below
    
    ![](/images/bot8.png?raw=true)

## Deployment 
If you are deploying this bot in a docker container, when you run the container LOCATION_IDS and CHANNEL environment variables need to be set as shown in example below

```
docker run -d -e SLACK_TOKEN=<replace with token> -e LOCATION_IDS=<replace with comma delimited location ids you are interested> -e CHANNEL=<replace with slack channel> rprakashg/foodtruck-slack-bot
```

If you are deploying this bot in heroku as I have done for our team, you can simply configure CHANNEL and LOCATION_IDS in heroku for the app under Config Variables in Settings tab as shown in screenshot below

![](/images/bot9.png?raw=true)

Cheers,

Ram