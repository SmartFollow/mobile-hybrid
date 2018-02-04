# SmartFollow - Smartphone and tablet client

[![Creative Commons Attribution - NonCommercial - NoDerivatives 4.0 International license](https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

This software is distributed under the Creative Commons Attribution - Non Commercial - No Derivatives 4.0 International license

## Installation

1. Commandes pour l'installation en local du projet : 

 * npm install
 * bower install

2. Modifier le fichier www/js/constant.js :
  
  ```
  .constant('API_NAME', {
  	link: 'your API link',
  	secret: 'your client secret',
  	id: '2'
  });
  ```
  * Remplacer "link" par le lien de votre API smartfollow et le "secret" par celui du client.
  * Lancer l'application avec la commande : `ionic serve`

3. Si vous modifiez le scss dans le dossier scss/ lancez la commande "gulp default" pour recompiler le css.

4. Pour déployer sur IOS et Android : 

 * npm install -g cordova
 * cordova platform add android / ios
 * ionic cordova resources android (pour l'icon de l'application)
 * ionic cordova build android / ios
 * ionic cordova run android / ios

