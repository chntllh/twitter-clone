import { model, Schema } from 'mongoose';

const tweetHashtagSchema = new Schema({
  tweetId: {
    type: Schema.Types.ObjectId,
    ref: 'Tweet',
    required: true,
  },
  hashtagId: {
    type: Schema.Types.ObjectId,
    ref: 'Hashtag',
    required: true,
  },
});

const TweetHashtag = model('TweetHashtag', tweetHashtagSchema);

export default TweetHashtag;
