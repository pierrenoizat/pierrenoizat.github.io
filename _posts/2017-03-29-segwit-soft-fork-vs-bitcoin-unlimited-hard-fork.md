---
layout: post
comments: true
title: SegWit Soft Fork vs Bitcoin Unlimited Hard Fork
date: 2017-03-29 00:00:01.000000000 +01:00
type: post
published: true
status: publish
categories:
- Technologie
- Bitcoin
tags: []
author:
  login: admin
  display_name: Boussac
  first_name: 'Pierre'
  last_name: 'Noizat'
---

Le remplissage moyen d’un bloc Bitcoin atteint depuis fin 2016 presque 100%. Il est en progression linéaire depuis 2012 et c’est un autre signe du succès de Bitcoin.

De fait, ceci peut retarder de plusieurs heures la confirmation de certaines transactions, celles dont les commissions de réseau sont jugées trop basses par les mineurs.

Pour une confirmation en 10 minutes, on estime aujourd’hui que le wallet du payeur doit prévoir une commission de réseau de 200 satoshis/octets (environ 0,002 €/octet).

Une transaction standard dépensant plusieurs entrées-sources (inputs) et créditant plusieurs sorties-destinations (outputs) est un message signé pouvant occuper 250 octets et jusqu’à 1 000 octets ou plus (en fonction du nombre d’entrées/sorties et de la complexité des entrées): la commission recommandée se situe donc entre 0,50 € et 2 €.

Cependant si vous pouvez attendre quelques heures, une commission bien inférieure sera suffisante: le 18 mars, j’ai envoyé un micro-paiement dans une transaction de 1500 octets ( [a1e8de90cc04fcd4a96da47ffd9566e68cf8872472c77a161c6c20590fc927c6](https://live.blockcypher.com/btc/tx/a1e8de90cc04fcd4a96da47ffd9566e68cf8872472c77a161c6c20590fc927c6/ ) )
minée par BTC.com pour moins de 10 sat/byte en moins de 10 heures.

Les affirmations alarmistes d’une minorité concernant une congestion soit-disant fatale du réseau sont donc largement exagérées, comme toutes les affirmations alarmistes répandues depuis 2010 et toujours démenties dans les faits par la résilience de Bitcoin.

En fait, on peut prédire que, quelque soit la taille des blocs Bitcoins, ils seront pleins.
C’est même le signe d’une utilisation optimale des capacités du réseau.

Augmenter la taille des blocs n’est pas une stratégie de passage à l’échelle (scaling), ni même une tactique.
Si un réseau de paiement mondial doit pouvoir traiter plusieurs dizaines de milliers de transactions par secondes, il faudrait que le réseau Bitcoin fasse circuler environ 5 Moctets/s de données et que la blockchain Bitcoin intègre des blocs d'au moins **3 Gigaoctets**.

Le réseau Bitcoin n’est simplement pas fait pour ça: il représente **la première couche d’un empilement de protocoles complémentaires qui, combinés, formeront l’internet des transactions**.

Aujourd’hui le web fonctionne déjà et depuis longtemps grâce à un assemblage de protocoles complémentaires comme TCP/IP, HTTP, WebSocket ou DNS.

Les protocoles construits sur le protocole Bitcoin ( dits “Layer 2”) tels que  [Lightning](https://lightning.network) ou [Tumblebit](https://github.com/BUSEC/TumbleBit) permettront de diffuser des transactions “off-chain”, potentiellement jusqu’à des millions de transactions par secondes.

En effet, ces protocoles créent des **canaux de paiements** où seules les transactions d’ouverture et de fermeture du canal nécessitent d’être minées. 
Entre ces deux transactions, des milliers de transactions peuvent s’échanger en toute sécurité et sans tiers de confiance entre Alice et Bob.

Le réseau Lightning ne se contente pas d’offrir une solution de scalabilité au réseau Bitcoin: il améliore aussi la confidentialité des transactions en fonctionnant sur le principe du réseau [TOR](https://www.torproject.org) pour acheminer la transaction en mode chiffré de Alice à Bob.

Tumblebit présente des caractéristiques similaires à Lightning: mon prochain article lui sera consacré.

En attendant, les “alarmistes” sont parvenus à faire croire que l’intitiative “Bitcoin Unlimited” (BTU en abrégé), consistant à supprimer la limite de 1 Mo par bloc, serait une solution viable.

Voici pourquoi je n’y crois pas, explication destinée aux possesseurs de bitcoins et aux clients de Paymium qui s’inquiètent des rumeurs de “hard fork”.

En résumé, un “**hard fork**” est une modification du protocole qui  **enlève** une règle du protocole, ici la règle qui limite la taille d’un bloc à 1 Mo.

Après le hard fork, les nouveaux blocs de 2 Mo sont valides pour les clients mis à jour mais les  anciens noeuds (non mis à jour) rejettent ces blocs trop gros selon eux.

Les mineurs qui refusent la suppression d'une règle considèront les nouveaux blocs comme invalides et continueront donc à miner la chaîne d'avant même si la nouvelle chaîne arrivait à réunir davantage de puissance de calcul.
Le hard fork crée donc de facto un altcoin qui va vivre sur une chaîne indépendante commençant au niveau du bloc où le hard fork s'est produit.

![Hard Fork]({{ site.baseurl }}/assets/hardfork.png)

_Hard Fork_


A l’inverse, un “**soft fork” rajoute une ou plusieurs règles au protocole**.
Un exemple absurde mais instructif serait un soft fork qui diminuerait la taille des blocs à 500 ko.
Dans ce cas, un mineur non mis à jour produira des blocs de 1 Mo qui seront refusés par les noeuds mis à jour.
Par contre, les blocs produits par des mineurs mis à jour seront acceptés par tout le monde.
Ainsi, lors d'un soft fork, les mineurs qui ne sont pas à jour verront leurs blocs devenir orphelins si et seulement si la nouvelle règle a réuni une majorité simple (51% ou plus) de la puissance de calcul.

![soft Fork]({{ site.baseurl }}/assets/softfork.png)

_Soft Fork_

[SegWit](https://bitcoincore.org/en/2016/01/26/segwit-benefits/) qui exige, entre autres, un numéro de version pour les scripts,est un autre exemple de soft fork, beaucoup plus pertinent.

De nouveaux [opcodes](http://bitcoinscri.pt) voire de nouveaux systèmes de scripts peuvent être introduits en incrémentant le numéro de version des scripts.
Ces nouveaux scripts seront correctement interprétés par les noeuds SegWit pour dépenser une adresse P2SH SegWit (P2SH-P2WSH) et ces noeuds accepteront aussi une transaction dépensant une adresse P2SH à l’ancienne.

Bien entendu, il faudra mettre à jour son wallet pour envoyer et recevoir des transactions SegWit.
SegWit est déjà intégré dans [Bitcoin Core](https://bitcoin.org/fr/telecharger) depuis la version 0.13.1 mais l’activation de cette fonctionnalité interviendra seulement lorsque 95% des mineurs auront signalé leur accord.

Notez que les transactions SegWit ne seront pas correctement traitées par le réseau avant l’activation et que, d’ici là, il ne faut donc pas anticiper en envoyant des fonds vers une adresse P2SH SegWit au risque de les geler jusqu’à l’activation.

En résumé et **pour rassurer ceux qui auraient été alarmés par la perspective d’un hard fork “BTU”**, le trading BTC/EUR et les mouvements en Euros ne seraient pas affectés mais voici ce qui se passerait chez [Paymium](https://paymium.com) en cas de hard fork concernant les retraits de BTC:


1. suspension temporaire des retraits BTC pour environ une journée afin d’évaluer les conséquences du hard fork: il est possible que les mineurs abandonnent assez rapidement (au bout de quelques heures) le minage BTU. Dans ce cas, les retraits BTC reprendraient aussitôt.
2. affichage du solde BTU, égal au solde BTC d’avant le hard fork: tout se passe comme si chaque client avait désormais deux fois plus de coins mais la valeur du BTC pre-fork serait répartie sur les deux coins.
3. séparation des coins par Paymium
4. reprise du traitement des demandes de retraits BTC
5. traitement des demandes de retraits BTU.

La **séparation des coins** s’impose car une transaction post-fork qui dépense des BTC reçus pre-fork est en général valide sur les deux chaines.

Sans cette précaution, nous serions exposés à une **“replay attack”**: si vous payez par exemple un marchand 1 BTC pour un bien de 800 € en supposant que c’est le taux BTC/EUR post-fork et que le BTU vaut 200 € au même moment, le marchand pourrait diffuser votre transaction BTC sur le réseau BTU et récupérer ainsi un supplément de 200 €. 

Il convient donc de déplacer les coins (BTC et BTU) en utilisant des transactions différentes.
Pour cela, comme suggéré par Thomas Voegtlin, développeur du wallet [Electrum](http://docs.electrum.org/en/latest/hardfork.html), nous pourrons lancer 2 instances de Electrum simultanément, l’une depuis un répertoire BTC, l’autre depuis un répertoire BTU.

Nous pourrons créer ensuite une transaction RBF (replace by fee) renvoyant les coins vers Paymium et la diffuser sur chacun des 2 réseaux (BTC et BTU).

Lorsque la transaction sera visible sur chacun des 2 réseaux, nous pourrons augmenter la commission de réseau sur notre wallet Electrum BTC et diffuser cette nouvelle version de notre transaction, qui portera une transaction id différente à cause du montant de commission différent, sur le réseau BTC.

Il  faut diffuser cette nouvelle transaction avant que la première ne soit confirmée sur le réseau BTC.
Le réseau BTU ne propagera pas cette transaction car les noeuds BTU n’implémentent pas RBF.

Après confirmation par les 2 réseaux, nous pourrons alors vérifier que cette transaction nous renvoyant les fonds porte **une tx id différente dans les blockchains BTC et BTU**, c’est à dire que la séparation des coins est effective.

![Répartition des relais du réseau Bitcoin]({{ site.baseurl }}/assets/bitcoin_unlimited_nodes.png)
_Nombre de Nodes Bitcoin Core (en bleu) vs Nodes Bitcoin Unlimited (en vert)_

Soulignons encore une fois que la probabilité d’un hard fork reste très faible car les noeuds Bitcoin Unlimited ne représentent aujourd’hui (29 mars 2017) que 10% environ des noeuds du réseau Bitcoin Core sans signe indiscutable d’un changement en faveur de Bitcoin Unlimited.

Pour en savoir plus sur les risques et avantages de soft fork vs hard fork, lire l'[article de Peter Todd](https://petertodd.org/2016/soft-forks-are-safer-than-hard-forks) (en anglais) sur la question.
