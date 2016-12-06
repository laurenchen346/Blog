import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { posts } from '../../api/posts.js';
import template from './postsList.html';

class TodosListCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.subscribe('posts');

    this.hideCompleted = false;

    this.helpers({
      posts() {
        const selector = {};

        if (this.getReactively('hideCompleted')) {
          selector.checked = {
            $ne: true
          };
        }

        return posts.find(selector, {
          sort: {
            createdAt: -1
          }
        });
      },
      incompleteCount() {
        return posts.find({
          checked: {
            $ne: true
          }
        }).count();
      },
      currentUser() {
        return Meteor.user();
      }
    })
  }

  addpost(newpost) {
    Meteor.call('posts.insert', newpost);

    // Clear form
    this.newpost = '';
  }

  setChecked(post) {
    Meteor.call('posts.setChecked', post._id, !post.checked);
  }

  removepost(post) {
    Meteor.call('posts.remove', post._id);
  }

  setPrivate(post) {
    Meteor.call('posts.setPrivate', post._id, !post.private);
  }
}

export default angular.module('postsList', [
  angularMeteor
])
  .component('postsList', {
    templateUrl: 'imports/components/postsList/postsList.html',
    controller: ['$scope', TodosListCtrl]
  });
