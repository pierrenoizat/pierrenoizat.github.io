---
layout: post
title: Les paris perdus de FTX
date: 2022-11-20 00:40:51.000000000 +01:00
type: post
published: true
status: draft
categories:
- Bitcoin
- altcoins
tags: [preuve de travail, énergie, preuve d'enjeu, FTX]
meta:
  _edit_last: '1'
author:
  login: admin
  email: noizat@hotmail.com
  display_name: Boussac
  first_name: 'Pierre'
  last_name: 'Noizat'
---


Si vous vous demandez ce qui lie l’affaire FTX et la COP27 , c’est bien l’énergie dont le fonctionnement permet d’éclairer ce qui se passe.

<div><img src="{{ site.baseurl }}/assets/bankman.JPG" width='500'></div>

_Bankman-Fried, ancien trader de Wall Street, au temps où il était encore la star des medias qui retrouvaient avec lui le visage familier de la finance traditionnelle._


FTX a placé les avoirs en BTC de ses clients dans des altcoins PoS, c’est à dire émis sans contre-partie énergétique. 

Avant d'expliquer ce que ça signifie, revenons un instant sur le fonctionnement d'une plateforme d’échange. Un client X dépose des BTC sur une platforme afin de les vendre à un autre client Y de la plateforme . Les BTC sont déposés contre la promesse que leur propriétaire (X au moment du dépot puis Y après l’échange avec X) peut les retirer à tout moment.
 
C’est ce qu’on appelle la promesse de liquidité: à sa première demande, la plateforme s’engage à lui restituer la somme qu’elle affiche sur le tableau de bord de son compte. Le client peut donc liquider sa position sur cette plateforme en reprenant la somme correspondant au solde de son compte.

On peut dire qu’un BTC déposé sur la plateforme FTX est immédiatement converti en un FTX-BTC, une sorte de stablecoin libellé en BTC: la plateforme promet un remboursement 1 pour 1 en BTC. Théoriquement et juridiquement, le FTX-BTC peut être liquidé pour un BTC à tout moment. Le FTX-BTC existe non pas dans une blockchain publique mais dans une base de données centralisée classique, un peu comme une blockchain avec un seul node (en langage réseau, node est le mot anglais pour point de présence, point-relais du réseau ou point de validation).

Si la plateforme place illégalement les BTC de ses clients chez des tiers douteux et perd ensuite ces BTC, les avoirs des clients en FTX-BTC n’ont plus de valeur (la plateforme sera incapable de restituer des BTC à ses clients) mais, tant que les faits ne sont pas connus, le marché pense qu’ils correspondent à des BTC. 
On peut dire que, pour le marché, les manoeuvres de FTX ont gonflé artificiellement la masse monétaire des BTC en créant des BTC-papier qui ont perdu leur contre-partie en BTC.

Dans le cas de FTX, ils avaient dans ce qui leurs servait de livres de comptes une somme d'environ 1,4 Milliards de dollars en valeur des 80 000 BTC déposés par leurs clients. Sachant que 328 500 BTC seront minés en 2022, le trou représente environ 25% des nouveaux BTC émis cette année: tant que la fraude n’était pas connue, cette dilution a donc gonflé le prix des altcoins que ces BTC ont permis d’acheter.

Pour assurer la promesse de liquidité, **une plateforme d'échange doit donc fonctionner en mode "full reserve"** (réserves intégrales par opposition aux réserves fractionnaires de FTX et des banques traditionnelles), c’est à dire précisément ne pas affaiblir la promesse de restitution à première demande contre la promesse de rendement d’un tiers. 

Il va de soi que [Paymium](https://paymium.com) fonctionne en mode full réserve et que les auditeurs qui examinent ses comptes chaque année ne les certifieraient pas autrement. Son conservatisme explique à la fois sa résilience et l'écart entre sa croissance lente mais constante comparée aux trajectoires météoriques de certains de ses concurrents peu scrupuleux.

En plaçant les BTC dans des altcoins PoS sans le dire clairement aux clients concernés, **la plateforme FTX a affaibli sa promesse de liquidité en acceptant une promesse de rendement** faite à son profit par un tiers.

C’est bien là que les ennuis de FTX trouvent leur origine et voici pourquoi. 

Quand un Bitcoin est émis il porte une preuve mathématique (la preuve de travail) de l’énergie que le mineur a dû utiliser pour le créer.
La valeur du Bitcoin est donc un mix du coût d’émission et de la valeur d’usage.

Comme pour tout système monétaire, la valeur d’usage correspond à l’énergie que le système Bitcoin permet d’économiser ou de libérer. Tout échange monétaire économise de l’énergie par rapport à un troc (évite d’avoir à transporter un bien sur le lieu de la transaction) et libère l’énergie d’un échange qui n’aurait pas pu avoir lieu avec le troc (résout le problème de la coincidence des besoins).

**Dans le cas d’un altcoin PoS, il n’y a pas de contre-partie énergétique et il ne reste que la valeur d’usage**. Cette valeur est en général plus faible pour un altcoin qui est moins utilisé et dispose d’un écosystème moins développé que Bitcoin (seul l'écosystème ETH peut se comparer en taille à celui de BTC).
Finalement, une plateforme qui vend des BTC pour acheter des altcoins fait le pari que la valeur d’usage futur de l’altcoin en question va dépasser la valeur du mix énergie + usage de Bitcoin. Un peu hasardeux non ?