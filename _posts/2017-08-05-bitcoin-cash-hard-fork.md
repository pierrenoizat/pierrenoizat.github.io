---
layout: post
comments: true
title: Bitcoin Cash Hard Fork
date: 2017-08-05 00:00:01.000000000 +01:00
type: post
published: true
status: publish
categories:
- Technologie
- Bitcoin
tags: [fork]
author:
  login: admin
  display_name: Boussac
  first_name: 'Pierre'
  last_name: 'Noizat'
---

Le hard fork Bitcoin Cash (BCC), effectif depuis le minage du premier bloc BCC le 1er aout (bloc 478559) par ViaBTC contenant près de 2 Mo de transactions, est une expérience inédite et passionnante non seulement pour les Bitcoiners mais aussi pour les investisseurs dans les tokens et autres altcoins.

La taille des blocs et, plus généralement, la scalabilité et la décentralisation du réseau ont déjà fait l'objet de débats passionnés dès les premiers échanges publics, en novembre 2008, entre James A. Donald et Satoshi Nakamoto. 


Le lancement de BCC représente le point culminant de l'opposition entre "big blockers" et partisans de Segwit. 

Les "big blockers" revendiquent l'héritage de Satoshi, notamment l'utilisation confusante de Bitcoin Cash pour désigner un altcoin, au motif que, ayant inventé le protocole SPV, Satoshi aurait été convaincu d'une scalabilité "on-chain". Rien ne permet de l'affirmer. SPV (Simple Payment Verification), protocole de paiement destiné aux appareils dépourvus de la capacité de stocker la blockchain Bitcoin, comme les smartphones, n'est pas une solution de scalabilité.


Rappelons que [Segwit](http://e-ducat.fr/2017-03-29-segwit-soft-fork-vs-bitcoin-unlimited-hard-fork/) favorise une scalabilité off-chain via un réseau dit de niveau 2 (layer 2) comme le Lightning Network.

Bitcoin Cash (BCC), proposé initialement par ViaBTC (pool de minage), bitcoin.com (site contrôlé par Roger Ver) et Bitmain (mineur et fabricant d'ASIC de minage), lève en effet deux contraintes fondamentales du protocole Bitcoin:

1) **la taille d'un bloc peut dépasser 1 Mo** pour aller jusqu'à 8 Mo

2) **la difficulté est diminuée de 20%** si moins de 6 blocs sont trouvés dans les 12 dernières heures écoulées.

Par ailleurs, les signatures des transactions BCC sont suivies d'un nouveau "hash type": 

SIGHASH_FORKID

Comme l'empreinte d'une transaction (txid), qui sert à l'identifier dans la blockchain, englobe le "hash type", une transaction BCC n'est donc pas rejouable sur le réseau Bitcoin et inversement.

Cette **protection anti-rejeu** est renforcée par l'implémentation de [BIP143](https://github.com/bitcoin/bips/blob/master/bip-0143.mediawiki), une proposition de modification de l'algorithme de calcul des empreintes de transaction.

A l'heure où j'écris ces lignes, le minage des bitcoins est 3 fois plus profitable que celui des BCC: il est donc probable que ViaBTC et Bitmain restent isolés dans cette aventure.

![Cours du Bitcoin Cash]({{ site.baseurl }}/assets/Cours_BCC_170805.png)

_Cours du Bitcoin Cash_

Le cours actuel du BCC (240 € environ) est en baisse constante depuis le 3 aout, soutenu artificiellement par les manipulations de Roger Ver et par les mineurs Bitcoin qui souhaitent que 6 blocs soient trouvés par tranche de 12 heures pour retarder l'ajustement à la baisse de la difficulté du réseau BCC.

De fait, grâce à leurs efforts, la chaine de blocs BCC est actuellement en retard de 550 blocs par rapport à la chaîne Bitcoin.

La distribution initiale de l'altcoin BCC, pré-miné à hauteur de 16,5 Million sur un maximum de 21 Million, est destinée aux possesseurs de bitcoins à raison de 1 BCC pour chaque bitcoin détenu à la date du 1er aout.

En effet, BCC résultant d'un hard fork, partage le même historique que la chaîne Bitcoin jusqu'au 1er aout et diverge seulement à partir du bloc 478559.

Si vous souhaitez récupérer vos BCC, il vous suffira donc d'importer dans un wallet BCC vos clés privées Bitcoin ayant reçu des transactions avant le fork, c'est à dire confirmée dans les blocs 1 à 478558.

Attention au choix du wallet BCC car aucun n'est encore suffisamment testé pour être recommandé.
Après le 1er aout, il est prudent de déplacer vos bitcoins vers de nouvelles adresses avant d'importer vos clés privées dans un wallet BCC.

Si vous détenez vos bitcoins via un tiers de confiance comme [Paymium](https://www.paymium.com), vous n'avez rien de particulier à faire: Paymium vous créera d'ici quelques semaines un compte BCC où vous retrouverez votre solde BCC, que vous pourrez retirer vers un wallet BCC externe.

Pour Paymium aucune date n'est encore fixée pour la disponibilité des BCC car des développements étaient en cours avant l'annonce de BCC, mais ce sera l'objet d'un prochain article: à suivre donc.

