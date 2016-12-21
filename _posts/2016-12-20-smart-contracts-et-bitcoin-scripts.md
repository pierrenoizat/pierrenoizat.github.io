---
layout: post
comments: true
title: Smart contracts et scripts Bitcoin
date: 2016-12-20 01:40:51.000000000 +01:00
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

Alice est une compagnie d’assurance et propose une assurance annulation pour les clients des compagnie aériennes.
Alice s’est obligée à écrire des conditions générales qui couvrent tous les cas de fraude ou d’obligations imposées par le régulateur.

Bob qui vient d’acheter un aller-retour Paris-Tokyo aimerait bien recevoir une indemnité si son vol est annulé mais hésite à souscrire une assurance.
Il n’a pas envie de lire les 4 pages des conditions générales qui évitent à l’assureur de payer dans certains cas.

Alice et Bob s’attendent donc à devoir encore payer des avocats ou des huissiers en cas de problème et intègrent ces anticipations négatives dans leur appréciation du prix de l’assurance.

Bob ne souscrit pas et Alice finit par ne plus proposer de contrat. **Le principe d’une assurance automatisée est un marché non servi à ce jour par les assureurs**.

![Assurance annulation de vol]({{ site.baseurl }}/assets/flight_canceled.png)

Alice s’intéresse alors aux “**smart contracts**”.

Le terme de [smart contract](https://en.wikipedia.org/wiki/Smart_contract), proposé par Nick Szabo dès 1994, désigne tout protocole informatique qui facilite l’exécution d’un contrat.

Un “smart contract" idéal rend le contrat complètement auto-exécutable et réduit les coûts de gestion du contrat.

En particulier, le “smart contract” vise à **automatiser les clauses du contrat qui déclenchent un paiement**.

Les coûts de gestion d’un contrat sont en effet essentiellement liés aux frais de recouvrement lorsque le payeur (Alice) refuse de reconnaitre les conditions externes qui déclenchent normalement un paiement.

Les applications au-delà de l’assurance pourraient concerner les instruments financiers comme les actions, les obligations et les produits dérivés, avec le triple objectif de minimiser le risque de contre-partie, les délais de paiements et les coûts d’accès aux informations.

Dans le cas d’Alice et Bob, Alice va pouvoir proposer grâce aux “smart contracts” une assurance facile à souscrire en ligne (transaction de souscription, payable en Bitcoin) et facile à gérer (transaction d’indemnisation, payable en Bitcoin, déclenchée par un ou plusieurs oracles).

Le paiement de l’indemnité en Euro est exclu car les paiements en Euros sont réversibles par nature: l’assureur peut toujours appeler sa banque pour annuler un virement.
**Le caractère automatique du paiement disparaitrait ainsi que la promesse faite au client, condition essentielle de sa souscription**.

Dès lors, deux questions épineuses se posent principalement:

1) Qui sont les oracles qui vont autoriser les paiements d’indemnités en cas d’annulation d’un vol?

2) Comment relier le paiement d’une prime à la disponibilité d’une indemnité en cash électronique, en toute transparence, tout en évitant d’immobiliser la totalité des fonds potentiellement dus aux souscripteurs ?

**Oracles et “wisdom of the crowd”**

L’adoption des “smart contracts” va donner naissance à un nouveau type d’intermédiaires, les oracles, avec une différence fondamentale par rapport aux tiers de confiance traditionnels: la transparence de leur réputation.

Cette transparence est rendue nécessaire par l’absence de barrière à l’entrée.
Les commissions de transaction qui constitueront le socle du modèle d’affaires d’un oracle dépendront fortement de sa réputation.
Les oracles doivent être incités à se comporter honnêtement à la fois vis à vis d’Alice et de Bob: Alice et Bob vont donc les choisir en fonction de leur réputation pour donner un avis honnête sur l’annulation ou le bon déroulement d’un vol.

Plutôt que de s’adresser à deux ou trois oracles triés sur le volet, Alice et Bob peuvent aussi “crowdsourcer” les avis.
Dans ce cas, l’oracle est un marché de prédictions où la question posée est “est ce qu’Alice doit indemniser Bob pour le vol AF12345 ?”.
Le marché de prédictions devra être une application décentralisée car l’activité de pari en ligne, incluse dans le périmètre fonctionnel d’un marché de prédictions, est monopolisée par l’Etat.
A ce jour le projet Augur, marché de prédictions décentralisé, n’a pas encore livré les résultats attendus.


Dans la plupart des cas simples comme une assurance annulation, deux ou trois oracles connectés à des sources de données “open data” sur le transport aérien suffiront.
Chaque oracle disposera d’une clé publique qui servira au calcul d’une adresse multisignature portant le montant de l’indemnité.

**Immobilisation des indemnités**

Si la promesse d’Alice à Bob de payer sans discussion l’indemnité dès que au moins 2 des 3 oracles impliqués dans l’adresse multisignature ont signés la transaction, il faut que ladite adresse multisignature porte le montant de l’indemnité.

Alice devrait donc immobiliser la totalité du montant de l’indemnité multiplié par le nombre d'assuré.
Le coût financier non négligeable d’une telle immobilisation de capital serait un obstacle majeur au passage à l’échelle et annihilerait les économies réalisées sur les autres coûts de gestion du contrat.

Une solution ingénieuse à ce problème réside dans une proposition de soft fork Bitcoin intitulée [Merkelized Abstract Syntax Tree](https://github.com/bitcoin/bips/blob/master/bip-0114.mediawiki) (MAST).

MAST combine la technique des arbres binaires d’empreintes numériques (Merkle trees en anglais) avec l’utilisation de script complexes de type “pay to script hash” (P2SH), intégrés dans le protocole Bitcoin (soft fork proposé par Gavin Andresen dans la proposition [BIP 16](https://github.com/bitcoin/bips/blob/master/bip-0016.mediawiki) en janvier 2012 et déployé depuis la version 0.9.2 de Bitcoin Core).

Au lieu de coder dans un seul script toutes les conditions possibles permettant de débloquer les fonds comme c’est le cas avec un script P2SH aujourd’hui, MAST permettra d’énoncer chaque condition dans un script distinct, tous les scripts étant ensuite réunis dans un arbre binaire.

L’adresse P2SH sera calculée sur la base de la racine de l’arbre binaire.

Pour débloquer les fonds, il suffira de posséder un des scripts et la ou les clés correspondant à ce script. 
Les valideurs demanderont à l’utilisateur le script en question avec les signatures requises ainsi que la branche reliant le script à la racine de l’arbre binaire.

![Arbre binaire]({{ site.baseurl }}/assets/mast_tree.png)
_Data i est le ième script inclut dans l’adresse P2SH via la racine h7_

Par exemple, la preuve cryptographique requise pour dépenser les fonds sous les conditions du script 3 sera composée simplement de: Data 3, h4, h5 et h6.

Si des fonds sont envoyés sur l’adresse P2SH MAST de cette transaction, ils peuvent être “dépensés” (en réalité, déplacés vers l’adresse d’un autre destinataire) par n’importe quel des 4 scripts:

seul le premier qui sera valablement présenté au réseau sera confirmé dans la blockchain, les suivants seront rejetés car considérés comme des tentatives de double-dépense.

On peut dire que MAST réalise un OU exclusif entre un très grand nombre de conditions distinctes.

Alice peut donc déposer le montant de l’indemnité sur une telle adresse en mutualisant le risque pour 4 asssurés différents au lieu d’immobiliser 4 fois le montant de l’indemnité.

MAST permet le passage à l’échelle car l’arbre binaire peut comporter jusqu’à 32 niveaux, c’est à dire des centaines de milliers de clients rattachés à une même adresse P2SH pour l’indemnisation.

Théoriquement, un arbre binaire à 32 niveaux permet même de regrouper plus de 4 milliards de clients mais, en pratique, la taille de la preuve cryptographique requise pour payer une indemnité va déterminer la commission de minage de la transaction:

il faut compter aujourd’hui 50 satoshi par octet pour une confirmation dans les heures qui suivent.

Pour un arbre MAST de taille maximale (32 niveaux), la preuve comporte au plus 64 empreintes numériques de 32 octets chacune, soit 2048 octets (bien en-dessous de la limite de taille fixée à 10 000 octets par transaction), et une commission de réseau **inférieure à un euro**.

J’ai développé et mis en ligne le site de démo [bitcoinscri.pt](http://bitcoinscri.pt) pour expliquer le mécanisme des scripts Bitcoin.

J’y rajouterai davantage d’exemples de scripts, notamment [SegWit](https://bitcoincore.org/en/2016/01/26/segwit-benefits/) (proposé dans [BIP 143](https://github.com/bitcoin/bips/blob/master/bip-0143.mediawiki)) et MAST à mesure que ces améliorations seront activées sur le réseau.

En attendant, vous pouvez “customiser” avec vos propres paramètres (clés et dates) les scripts déjà disponibles sur [bitcoinscri.pt](http://bitcoinscri.pt), envoyer des fonds vers les adresses P2SH que vous aurez ainsi créées et dépenser les fonds sécurisés sur ces adresses.