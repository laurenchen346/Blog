import angular from 'angular';
import angularMeteor from 'angular-meteor';
import postsList from '../imports/components/postsList/postsList';
import '../imports/api/posts.js';
import '../imports/startup/accounts-config.js';

angular.module('simple-posts', [
  angularMeteor,
  postsList.name,
  'accounts.ui'
]);

