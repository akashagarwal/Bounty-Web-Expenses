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

var expenses = new Object();
expenses["akashagarwal"]=0;

var bot = new irc.Client(config.server, config.botName, {
			channels: config.channels
			});

bot.addListener("join", function(channel, who) {
			// Welcome them in!
			bot.say(channel, who + "...dude...welcome to the Artoo expenses chat room!");
			expenses[who]=0;
			});


bot.addListener("message", function(from, to, text, message) {
			
			match=text.match("Give");
			if (match!=null)
			{
				for (var x in expenses)
				{
			//		bot.say(config.channels[0],x);	
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
										//			break;
												}
											}
										}
										else
											break;
									}
								
								}
	
							}
						}
						break;

					}
				}
			}
		});


