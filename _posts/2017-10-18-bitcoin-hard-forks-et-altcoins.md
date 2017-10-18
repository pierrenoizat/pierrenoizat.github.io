---
layout: post
comments: true
title: NO2X: Bitcoin Hard Forks et Altcoins
date: 2017-10-17 00:00:01.000000000 +01:00
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


Les hard forks de Bitcoin se multiplient dans le sillage de Bitcoin Cash (BCH). 
Les promoteurs de ces forks y voient sans doute un moyen commode de lancer un altcoin à peu de frais.
Le hard fork créée temporairement une crise identitaire en nous demandant de distinguer le "vrai" Bitcoin du "faux".

Comme Bitcoin Cash en son temps (août dernier), Bitcoin S2X lève la contrainte de taille maximale d'un bloc.
Le S de S2X signifie simplement l'activation de Segwit, désormais acquise, alors que BCH n'intègre pas Segwit.
Le 2X de S2X signifie que la taille maximale d'un block post-Segwit est doublée, passant de 4 Mo à 8 Mo.

Les partisans de S2X, regroupés dans le cartel des signataires du fumeux New York Agreement, revendiquent l'héritage de Satoshi en prétendant que l'inventeur de Bitcoin aurait soutenu leur initiative, ce qui est évidemment invérifiable en l'absence concupiscente de l'intéressé.

Pour ma part, j'observe que la chaîne Bitcoin peut être "forkée" par certains mineurs en supprimant une règle du protocole mais que les développeurs, eux, ne peuvent pas être coupés en deux.
Hormis, Jeff Garzik, aucun développeur de Bitcoin Core ne s'est embarqué sur le projet de client BTC1 qui sous-tend le fork S2X.
La chaîne S2X ne peut donc perdurer que si les mineurs s'y rallient majoritairement et arrivent à convaincre les développeurs de les suivre.
A défaut, Bitcoin Core continuera sa progression et les utilisateurs de S2X se retrouveront avec un wallet obsolète au bout de quelques mois, incapables de réparer les bugs et vulnérabilités que S2X aura créés.

Le principe même d'un accord organisé par un investisseur tentaculaire (DCG) qui a réuni des représentants de ses participations derrière des portes closes est totalement à l'opposé d'un objectif de décentralisation: le succès de S2X signalerait la capacité d'une autorité centrale, en l'occurence DCG, à piloter les évolutions du protocole.

L'absence de "replay protection" dans le client BTC1 pourrait conduire à une situation où les 2 chaînes deviendraient inutilisables, surtout si elles portent le même nom (Bitcoin). 

Alice utiliserait son wallet BTC1 pour payer Bob 1 Bitcoin afin de lui acheter sa voiture d'occasion. Le lendemain, Bob rejouerait la transaction d'Alice sur le réseau Bitcoin Core et récupèrerait 1 Bitcoin supplémentaire. Alice aurait alors payé 2 Bitcoins en croyant payer seulement 1.

Le seul moyen de "splitter" les coins post hard fork S2X serait de fabriquer (programmatiquement) et diffuser sur le réseau S2X une transaction de taille supérieure à 2 Mo afin qu'elle ne soit pas rejouable sur le réseau Bitcoin Core. 

Sachant qu'une transaction standard ( 2 inputs sans scripts complexes, 2 outputs) occupe environ 400 octets signatures comprises, une transaction de 2 Mo devrait comporter 5000 fois plus d'entrées /sorties...

Paymium termine en ce moment un chantier important: la capacité pour notre plateforme de change de gérer de multiples cybermonnaies, en particulier les altcoins issus de hard fork, sans créer de vulnérabilités et en gardant une base comptable saine. Cette feuille de route prudente demande un peu de patience mais reste le meilleure garant pour la pérennité de notre exchange.











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