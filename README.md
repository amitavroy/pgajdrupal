pgajdrupal
==========

Phonegap AngularJS mobile app with Drupal as REST server.

The current module depends on a custom Drupal module which I have developed to handle the REST request made from Angular to the server.

The nodes are loading with teaser and full view. Currently only priting the body copy for the same.

Node create is working even on Android app. Next step is to work with the Phonegap API so that everything will come first from the local database and there will be a call at fixed intervals which will update the local database with the new items and rest will be fetched only when the user is online. 

During offline mode... data stored locally can be viewed.