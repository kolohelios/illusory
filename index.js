const WebSocket = require('ws');
const Events = require('@storybook/core-events');

console.log(Events);

const ws = new WebSocket('ws://localhost:7007');

ws.on('message', data => {
		const message = JSON.parse(Object.values(data).join(''));
		// console.log({ type: message.type, length: data.length, payload: data });
		if (message.type === 'setStories') {
			const listOfStories = Object.keys(message.args[0].stories);
			listOfStories.forEach((storyId, i) => {
				setTimeout(() => {
					ws.send(JSON.stringify({ type: Events.SET_CURRENT_STORY, args: [ { storyId, viewMode: 'story' } ] }));
				}, i * 5000);
			});
		}

		if (message.type === Events.STORY_RENDERED) {
			const { storyId } = message.args[0];
			// const path = device.takeScreenshot(storyId);
			// console.log(path);
		}
	});

	ws.on('open', () => {
		console.log('open');
		ws.send(JSON.stringify({ type: Events.CHANNEL_CREATED, args: [ { host: 'localhost', port: 7007 } ] }));
		ws.send(JSON.stringify({ type: Events.GET_STORIES, args: [ null ] }));
	});

ws.on('unexpected-response', console.log);
