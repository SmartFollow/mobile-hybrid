Commandes pour l'installation en local du projet : 

 - npm install
 - bower install

Modifier le fichier www/js/constant.js
  
  .constant('API_NAME', {
  	link: 'http://api.eip.mmo-trick.org',
  	secret: 'IT1tAxoBLlzOJeE5gOoNqq2LOZws1EV5rfc7tZW2',
  	id: '2'
  });
  
  En changeant "Link" par le lien de votre API smartfollow (local ou non)
  et le "Secret" par celui du client.
  
  - lancer l'application avec la commande : ionic serve

Si vous modifiez le scss dans le dossier scss/ lancez la commande "gulp default" pour recompiler le css.

Pour déployer sur IOS et Android : 

 - npm install -g cordova
 - cordova add platform android or ios
 - ionic cordova build android or ios
 - ionic cordova run android or ios

