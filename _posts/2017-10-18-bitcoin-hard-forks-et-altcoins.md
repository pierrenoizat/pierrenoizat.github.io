---
layout: post
comments: true
title: NO2X, Bitcoin Hard Forks et Altcoins
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
Le hard fork crée temporairement une crise identitaire en nous demandant de distinguer le "vrai" Bitcoin du "faux".

Comme Bitcoin Cash en son temps (août dernier), Bitcoin S2X lève la contrainte de taille maximale d'un bloc.
Le S de S2X signifie simplement l'activation de Segwit, désormais acquise, alors que BCH n'intègre pas Segwit.
Le 2X de S2X signifie que la taille maximale d'un block post-Segwit est doublée, passant de 4 Mo à 8 Mo.

Les partisans de S2X, regroupés dans le cartel des signataires du fumeux New York Agreement, revendiquent l'héritage de Satoshi en prétendant que l'inventeur de Bitcoin aurait soutenu leur initiative, ce qui est évidemment invérifiable en l'absence concupiscente de l'intéressé.

Pour ma part, j'observe que la chaîne Bitcoin peut être "forkée" par certains mineurs en supprimant une règle du protocole mais que les développeurs, eux, ne peuvent pas être coupés en deux.

Hormis, Jeff Garzik, aucun développeur de Bitcoin Core ne s'est embarqué sur le projet de client BTC1 qui sous-tend le fork S2X.
La chaîne S2X ne peut donc perdurer que si les mineurs s'y rallient majoritairement et arrivent à convaincre les développeurs de les suivre.
A défaut, Bitcoin Core continuera sa progression et les utilisateurs de S2X se retrouveront avec un wallet obsolète au bout de quelques mois, incapables de réparer les bugs et vulnérabilités que S2X aura créés.

Le principe même d'un accord organisé par un investisseur tentaculaire (Digital Currency Group) qui a réuni des représentants de ses participations derrière des portes closes est totalement à l'opposé d'un objectif de décentralisation: le succès de S2X signalerait la capacité d'une autorité centrale, en l'occurence DCG, à piloter les évolutions du protocole.

![S2X meme]({{ site.baseurl }}/assets/s2x_meme.jpg)

_DCG et quelques autres sociétés veulent piloter les évolutions du protocole Bitcoin_

L'absence de "replay protection" dans le client BTC1 pourrait conduire à une situation où les 2 chaînes deviendraient inutilisables, surtout si elles portent le même nom (Bitcoin). 

Alice utiliserait son wallet BTC1 pour payer Bob 1 Bitcoin afin de lui acheter sa voiture d'occasion. Le lendemain, Bob rejouerait la transaction d'Alice sur le réseau Bitcoin Core et récupèrerait 1 Bitcoin supplémentaire. Alice aurait alors payé 2 Bitcoins en croyant payer seulement 1.

Le seul moyen de "splitter" les coins post hard fork S2X serait de fabriquer (programmatiquement) et diffuser sur le réseau S2X une transaction de taille supérieure à 2 Mo afin qu'elle ne soit pas rejouable sur le réseau Bitcoin Core. 

Sachant qu'une transaction standard ( 2 inputs sans scripts complexes, 2 outputs) occupe environ 400 octets signatures comprises, une transaction de 2 Mo devrait comporter 5000 fois plus d'entrées /sorties...

Paymium termine en ce moment un chantier important: la capacité pour notre plateforme de change de gérer de multiples cybermonnaies, en particulier les altcoins issus de hard fork, sans créer de vulnérabilités et en gardant une base comptable saine. Cette feuille de route prudente demande un peu de patience mais reste le meilleure garant pour la pérennité de notre exchange.