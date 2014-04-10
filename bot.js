var config = {
	channels: ["#Artooxt"],
	server: "irc.freenode.net",
	botName: "Akash_xt_bot"
};

function cloneObject(source) {
	for (i in source) {
		if (typeof source[i] == 'source') {
			this[i] = new cloneObject(source[i]);
		}
		else{
			this[i] = source[i];
		}
	}
}



var irc = require("irc");

//Global variables that keep track of the expenses
var expenses = new Object();
expenses["akashagarwal"]=0;
var history="";

var bot = new irc.Client(config.server, config.botName, {channels: config.channels});

bot.addListener("join", function(channel, who) {
	bot.say(channel, who + "...dude...welcome to the Artoo expenses chat room!");
	expenses[who]=0;
});


function printCurrent()
{
	var temp=new cloneObject(expenses);
	var flag=0;
	while(flag==0)
	{
		flag=1;
		for (var x in temp)
		{
			if (temp[x]<0)
			{
				flag=0;
				var a = Math.abs(temp[x])
				for(var y in temp)
				{
					if (y!=x && temp[y] >= a )
					{
						temp[x] += a;
						temp[y] -= a;
						bot.say(config.channels[0], x + "->" + y + " : " + a);
						break;
					}
				}
				for(var y in temp)
				{
					var a = Math.abs(temp[x])
					if (y!=x && temp[x] < 0 )
					{
						if (temp[y] > 0)
						{
							if (a< temp[y])
							{
								temp[x] += a;
								temp[y] -= a;
								break;
								bot.say(config.channels[0], x + "->" + y + " : " + a);
							}
							else
							{
								bot.say(config.channels[0], x + "->" + y + " : " + temp[y]);
								temp[x] += temp[y];
								temp[y] -= temp[y];
							}
						}
					}
					else
						break;
				}
			}
		}
	}
}

function give(from,to,text,message)
{
	for (var x in expenses)
	{
		nickmatch=text.match(x);
		if (nickmatch!=null)
		{
			var begin=text.lastIndexOf(" ")+1;

			if (begin==0)
			{
				bot.say(config.channels[0],"Syntax Error");	
				break;
			}
			var amount=Number(text.substr(begin));
			if (isNaN(amount))
			{
				bot.say(config.channels[0],"Syntax Error");	
				break;
			}
			expenses[x]+=amount;
			expenses[from]-=amount;
			break;

		}
	}
	bot.say(config.channels[0],"Success");	
}

function take(from,to,text,message)
{
	for (var x in expenses)
	{
		nickmatch=text.match(x);
		if (nickmatch!=null)
		{
			var begin=text.lastIndexOf(" ")+1;

			if (begin==0)
			{
				bot.say(config.channels[0],"Syntax Error");	
				break;
			}
			var amount=Number(text.substr(begin));
			if (isNaN(amount))
			{
				bot.say(config.channels[0],"Syntax Error");	
				break;
			}
			expenses[x]-=amount;
			expenses[from]+=amount;
			break;

		}
	}
	bot.say(config.channels[0],"Success");	
}

bot.addListener("message", function(from, to, text, message) 
{	
	if (text.match("Lend"))
	{
		history+=text+"\n";
		give(from,to,text,message);
	}	
	else if (text.match("Borrow"))
	{
		history+=text+"\n";
		take(from,to,text,message);
	}
	else if (text.match("Repay"))
	{
		history+=text+"\n";
		give(from,to,text,message);
	}	

	else if(text.match("Show"))
	{
		history+=text+"\n";
		printCurrent();
	}
	else if(text.match("History"))
			bot.say(config.channels[0],history);	
});