// Author: supinic
// Date: 2018-12-20
// Very smol emote spam bot
(function () {
	const config = {
		server: "irc.chat.twitch.tv",
		port: 6667,

		spamDelay: 250, // Fine-tune this delay if problems occur
		joinChannels: ["#forsen"], // Only these channels will be joined
		trigger: "<message>", // Only this message will work as a trigger
		authorizedUsers: [], // These people can actually use the "bot"
		clients: [
			{
				name: "account1",
				oauth: "oauth-goes-here",
				master: true,
				message: "1"
			},
			{
				name: "account2",
				oauth: "oauth-goes-here",
				master: false,
				message: "2"
			},
			{
				name: "account3",
				oauth: "oauth-goes-here",
				master: false,
				message: "3"
			}
		]
	};

	let clients = [];
	const IRC = require("coffea");

	for (const {name, oauth, master, message} of config.clients) {
		const client = new IRC({
			host: config.server,
			port: config.port,
			ssl: false,
			nick: name,
			username: name,
			pass: oauth
		});

		// Joins specified channels on MOTD
		client.on("motd", () => {
			client.join(config.joinChannels);
			client.capReq(":twitch.tv/tags twitch.tv/commands twitch.tv/membership");
			console.log("Bot (name " + name + ") is ready!");
		});

		// When the message event is emitted, send the corresponding message to that channel
		client.on("fireCustomMessage", function (...args) {
			client.send(args[1], message);
		});

		// Only have one bot listen to for triggers - in order to avoid desynchronization
		if (master) {
			client.on("message", (evt) => {
				const user = evt.user.getNick().toLowerCase();
				const channel = evt.channel.getName().toLowerCase();
				const message = evt.message;

				// Not an authorized user - return
				if (config.authorizedUsers.indexOf(user) === -1) {
					return;
				}
				// Not the correct start phrase - return
				else if (message !== config.trigger) {
					return;
				}

				// Everything is good - send out messages with an (short) increasing delay
				let delay = config.spamDelay;
				for (const sendClient of clients) {
					setTimeout(() => sendClient.emit("fireCustomMessage", channel), delay);
					delay += config.spamDelay;
				}
			});
		}

		clients.push(client);
	}
})();
