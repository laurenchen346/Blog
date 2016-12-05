import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const posts = new Mongo.Collection('posts');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish posts that are public or belong to the current user
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

    // Make sure the user is logged in before inserting a post
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
      // If the post is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    posts.remove(postId);
  },
  'posts.setChecked' (postId, setChecked) {
    check(postId, String);
    check(setChecked, Boolean);

    const post = posts.findOne(postId);
    if (post.private && post.owner !== Meteor.userId()) {
      // If the post is private, make sure only the owner can check it off
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

    // Make sure only the post owner can make a post private
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