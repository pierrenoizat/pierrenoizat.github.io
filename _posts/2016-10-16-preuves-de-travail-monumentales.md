---
layout: post
comments: true
title: Preuves de travail monumentales
date: 2016-10-16 00:40:51.000000000 +01:00
type: post
published: true
status: publish
categories:
- Technologie
- Bitcoin
- Altcoins
tags: []
author:
  login: admin
  display_name: Boussac
  first_name: 'Pierre'
  last_name: 'Noizat'
---

Le passage récent d'Andreas Antonopoulos à Paris me donne l'occasion de rappeler sa présentation très claire (à San Francisco) sur le concept d'immutabilité et de preuve-de travail ("proof-of work"):
<iframe width="560" height="315" src="https://www.youtube.com/embed/rsLrJp6cLf4?rel=0" frameborder="0" allowfullscreen></iframe>
_Andreas Antonopoulos, auteur et conférencier sur Bitcoin_


La présentation contient plusieurs observations fondamentales que je vais reprendre en les complétant avec mes mots.

**Scellé ne veut pas dire protégé:**
Une enveloppe scellée (l'équivalent de "tamper-evident" en anglais) ne doit pas être confondue avec un coffre-fort ("tamper-proof" ou "tamper-resistant"). 

Une chaîne de signature est "tamper-evident": toute modification d'un message ou d'un bloc dans la chaîne de messages ou de bloc signés se traduit par une bifurcation avec deux chaînes concurrentes.

Une chaîne de preuves de travail est non seulement "**tamper-evident**" mais aussi "**tamper-proof**" comme un coffre-fort: une modification est non seulement visible mais difficile.

Cette **difficulté peut s'ajuster en fonction du contexte**, tout comme la résistance offerte par un coffre-fort, qui conditionne son coût, sera choisie en fonction du contenu et de l'environnement du coffre.


Une signature numérique est une forme spéciale de "zero-knowledge-proof" (preuve de connaissance sans divulgation) où Le signataire prouve simplement qu'il connait la clé privée, sans la dévoiler, qui a permis de calculer la signature.
Il n'y a pas nécessité de divulgation car la signature peut être vérifiée avec certitude en utilisant seulement la clé publique correspondante.

Une preuve de travail est un nouveau type de signature (**signature collective par un groupe informel**) car elle n'est pas une preuve de connaissance: elle prouve simplement qu'une certaine **quantité d'énergie** a été dépensée pour la calculer.

L'énergie est la seule donnée extrinsèque au système qui a une **valeur universelle** et peut être reliée à un calcul.
En effet, la théorie de l'information permet de relier une quantité d'énergie à la quantité de "bits" qui doivent être positionnés sur 0 par une fonction de hachage.
En d'autres termes, la difficulté (le nombre de zéros consécutifs que comporte la preuve de travail ) se traduit par un coût en énergie.

Même si le coût de l'énergie peut baisser fortement à proximité d'une centrale ou suite à une avancée technologique, il y a toujours un **coût d'opportunité** à l'utiliser pour le minage plutôt que pour un calcul utile.
Si le calcul est utile, le coût d'opportunité baisse et la sécurité liée à la preuve de travail baisse d'autant.


Comparativement, la réécriture d'une chaîne de signatures ne coûte pratiquement rien en ressources de calcul.
Une "blockchain" privée peut donc être "tamper-evident" mais n'est pas "tamper-proof".


Dans le cas d'un protocole "proof-of-stake", il suffit de disposer d'un accès, même temporaire, à une majorité relative des coins pour réécrire l'historique des transactions. En théorie, il faudrait disposer de 51% des coins, mais en pratique une faible minorité des possesseurs de coins s'intéresse au minage: les investisseurs préfèrent la liquidité au verrouillage des coins requis par les protocoles PoS pour le minage.


Accès aux coins signifie seulement connaissance des clés privées correspondantes et non propriété des coins. 
Il suffit d'un contrat de prêt entre des propriétaires de coins et un mineur hostile dans lequel le mineur rembourse en rémunérant les propriétaires avec les bénéfices de son attaque.


Avec un tel contrat, aucune transaction n'étant vue sur le marché, le cours des coins PoS n'est pas affecté dans un premier temps.
Les bénéfices peuvent se trouver sur une autre chaîne, par exemple une chaîne proof-of-work concurrente de la chaîne proof-of-stake pour une application de paiement ou de certification.


Il serait alors clairement moins coûteux d'attaquer la chaîne PoS que la chaîne PoW.
Nous pouvons d'ailleurs constater expérimentalement que, depuis l'invention publiée par Satoshi Nakamoto il y a 7 ans, aucune chaîne PoS n'a pu approcher, même de loin, la valorisation de Bitcoin.


J'ajoute que la périodicité des blocs, contrôlée par la difficulté avec comme cible la production d'un bloc toutes les dix minutes en moyenne, fait du réseau Bitcoin un **serveur de temps distribué pratiquement infalsifiable**. Cette propriété fait défaut aux réseaux PoS qui doivent considérer le temps écoulé comme une donnée externe au même titre que le cours du dollar ou la température de l'air à Paris.

![Une preuve de travail monumentale]({{ site.baseurl }}/assets/Elia-Locardi-Our-Lady-Of-Paris-Notre-Dame-1440-WM-DM-60q.jpg)
_ND de Paris, une preuve de travail monumentale, photographiée par Elia Locardi_


Le réseau Bitcoin héberge une preuve de travail monumentale dont la fonction de salle des coffres numérique justifie le coût de construction. Avant elle, beaucoup d'institutions politiques ou religieuses ont utilisé des preuves de travail physiques, parfois inutiles, souvent majestueuses, comme les pyramides des Pharaons ou les cathédrales, pour témoigner de leur capacité phénoménale à mobiliser les énergies des sujets et des croyants.