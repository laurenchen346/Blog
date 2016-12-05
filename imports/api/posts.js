import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const posts = new Mongo.Collection('posts');

if (Meteor.isServer) {
  Meteor.publish('posts', function postsPublication() {
    return posts.find({
      $or: [{
        private: {
          $ne: true
        }
      }, {
        owner: this.userId
      }, ],
    });
  });
}

Meteor.methods({
  'posts.insert' (text) {
    check(text, String);
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    posts.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'posts.remove' (postId) {
    check(postId, String);

    const post = posts.findOne(postId);
    if (post.private && post.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    posts.remove(postId);
  },
  'posts.setChecked' (postId, setChecked) {
    check(postId, String);
    check(setChecked, Boolean);

    const post = posts.findOne(postId);
    if (post.private && post.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    posts.update(postId, {
      $set: {
        checked: setChecked
      }
    });
  },
  'posts.setPrivate' (postId, setToPrivate) {
    check(postId, String);
    check(setToPrivate, Boolean);

    const post = posts.findOne(postId);

    if (post.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    posts.update(postId, {
      $set: {
        private: setToPrivate
      }
    });
  },
});