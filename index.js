const Twitter = require('twitter');
const _ = require('lodash');
const github = require('./github');
const logger = require('./logger');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const reply = ({ tweetId, status }) =>
  client.post('statuses/update', {
    status,
    in_reply_to_status_id: tweetId
  });

const stream = client.stream('statuses/filter', { track: '@tweethub_au' });
stream.on('data', async (event) => {
  if (!_.isEmpty(event.retweeted_status)) return;
  if (event.retweeted) return;
  if (event.in_reply_to_status_id !== null) return;
  try {
    const msgs = event.text.split(' ');
    const username = msgs && msgs.length && msgs[1];
    const stats = await github.getStats(username);
    const status = `Hey @${event.user.screen_name} ${username} knows ${stats.languages.length} languages & got ${stats.stars} stars`;
    await reply({
      tweetId: event.id_str,
      status
    });
  } catch (ex) {
    logger.info('Exception', ex);
  }
});

stream.on('error', (err) => {
  logger.info('Stream error', err);
});
