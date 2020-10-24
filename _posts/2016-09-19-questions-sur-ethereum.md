---
layout: post
comments: true
title: Questions sur Ethereum
date: 2016-09-19 00:40:51.000000000 +01:00
type: post
published: true
status: publish
categories:
- Altcoins
tags: []
meta:
  dsq_thread_id: '501039186'
  _edit_last: '1'
author:
  login: admin
  display_name: Boussac
  first_name: 'Pierre'
  last_name: 'Noizat'
---

Cet article marque la migration de e-ducat.fr de Wordpress à Jekyll, une autre technologie libre pour les blogs: j'espère que ce nouveau style vous plaira. Il me reste encore à importer les commentaires des articles passés sur la version wordpress. Ce sera fait prochainement.

En tout cas Jekyll devrait vous permettre de charger les pages plus rapidement.

Le sujet du jour, au lendemain de la conférence Ethereum de Shanghai, porte sur les nombreuses questions autour des "améliorations" apportées, selon les "marketeurs" qui gravitent autour de ce projet, par le protocole Ethereum.
 
![Ethereum Founder Vitalik Buterin]({{ site.baseurl }}/assets/vitalik-buterin-disrupt-london-2015.jpg)

_Vitalik Buterin, Co-fondateur de l'Ethereum Foundation_

Je me demande si un(e) participant(e) en a profité pour ramener de Shanghai des réponses aux questions suivantes:

1) **Minage**: 

Le protocole [Ethereum](https://www.ethereum.org) prévoit de basculer (à une date pas très clairement déterminée) du minage Proof of Work actuel (Frontier) à un minage **Proof of Stake** (Casper: algorithme non finalisé à date le 6 septembre 2016). 

Or le principe d'un algorithme "Proof of Stake" (PoS en abrégé, "preuve d'enjeu" en français) fait l'objet de questions qui n'ont pas encore obtenu de réponses satisfaisantes.

Selon le principe de PoS, si les possesseurs de coins peuvent valider les blocks au prorata de la quantité de coins qu'ils possèdent, comment assurer qu'ils le font effectivement ?

En pratique, les motivations pour investir dans un coin ne coïncident pas exactement avec les motivations pour participer à la validation des blocs, une activité qui requiert un minimum de ressources et de compétences informatiques.

Comme dans une élection où les électeurs peuvent s'abstenir, la plupart des possesseurs de coins risquent de ne pas valider les transactions. Une petite **minorité des possesseurs de coins participent à la validation des blocs tandis que la plupart des autres sont des investisseurs passifs**.

Il y a donc un risque de prise de contrôle du réseau avec une faible quantité de coins, donc pour un coût très modeste comparé au coût d'une attaque similaire sur un réseau proof of work.
Dans le contexte d'une concurrence croissante entre les réseaux, comment les réseaux PoS, à commencer par Ethereum, pourront-t-ils résister à ce type d'attaque de la minorité ?

2) **Money Supply**:

Il y a actuellement près de 84 M d'Ethers (ETH) en circulation (sans compter les ETC..) et le protocole prévoit d'en émettre 15M de plus chaque année, ce qui définit une **quantité illimitée (infinie) d'Ethers**.

Quelles hypothèses faut il faire pour se convaincre que la valeur des ETH va se maintenir dans le temps ?

3) **Langage de script "Turing-complete"**:

Le langage de script Ethereum est présenté comme "Turing-complete", c'est à dire qu'il permet d'écrire des programmes avec des boucles, une possibilité qui a été soigneusement écartée par le langage de script Bitcoin pour des raisons de sécurité.
En effet, si des boucles sont possibles, le réseau peut faire l'objet d'une attaque dite "en déni de service" (Denial of Service ou DoS en anglais), avec des scripts qui demanderaient aux noeuds du réseau d'exécuter des boucles sans fin, monopolisant les capacités de calcul du réseau.

Pour prévenir ce risque, le mécanisme prévu par le protocole Ethereum comporte des commissions de transactions proportionnelles au nombre de cycles de calcul exigés par le script de la transaction.

Cependant, la commission est perçue seulement par le **premier valideur qui inclut la transaction dans un bloc** mais ceux qui construisent les blocs suivants doivent la valider aussi. Ils ont donc une incitation a ne pas vérifier un script complexe. Comment ce risque pourrait t il être évité ?

Par ailleurs, le langage de script Ethereum peut conduire à des transactions très complexes: la fameuse DAO comportait près de 700 lignes de code (sans compter les lignes de commentaires).

Comment peut on envoyer des millions de dollars sur un tel script quand on sait qu'il faut s'attendre à 10 bugs pour 1000 lignes de code ? Dans le cas de la DAO, un bug a été exploité par un hacker..

4) **Décentralisation**: 

Sur **84 Millions d'Ethers** actuellement en circulation, **60 Millions ont été pré-minés par l'l'Ethereum Foundation** et vendus (pour environ 20 M USD) au profit de ladite fondation.

Les dirigeants de cette fondation possèdent encore la majorité relative des Ethers disponibles. 

Dans l'algorithme de minage Proof-of-Stake prévu par Ethereum, le réseau est contrôlé par les possesseurs des coins.

Or l'Ethereum Foundation peut être rachetée ou ses principaux membres recrutés par une société comme Microsoft ou IBM qui prendrait donc de facto le contrôle de la blockchain Ethereum.

Dès lors,comment une application (identité, certification, traçabilité, etc) développée sur Ethereum pourrait perdurer sous le contrôle d'une société qui propose déjà sa propre application propriétaire ?

Ces questions légitimes n'émanent pas d'un "hater" mais, quoique fondamentales pour un projet de cette nature, sont commodément ignorées par les conférenciers, banquiers et journalistes qui font parfois une promotion zèlée d'Ethereum.
Pour ma part, je continue à suivre le projet [Rootstock](http://www.rsk.co/#1) qui, plus sagement, expérimente les mêmes concepts qu'Ethereum sur une sidechain du réseau Bitcoin.
