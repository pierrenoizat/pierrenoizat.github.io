---
layout: post
title: Atomic swaps, un protocole étape par étape
date: 2019-02-26 00:40:51.000000000 +01:00
type: post
published: true
status: final
categories:
- Bitcoin
- Technologie
tags: [trustless]
meta:
  _edit_last: '1'
author:
  login: admin
  email: noizat@hotmail.com
  display_name: Boussac
  first_name: 'Pierre'
  last_name: 'Noizat'
---

Alice possède x bitcoins et Bob y litecoins.
En supposant que ces montants soient à peu près égaux en valeur, ils souhaiteraient faire un échange sans risque, afin qu'après un certain temps, soit Alice a reçu y litecoins et Bob x bitcoins, soit l'échange a été annulé et leurs positions sont inchangées.

Le protocole ci-dessous permet cet échange “atomique”, dans lequel ni Alice ni Bob n'ont besoin de se faire confiance, ni besoin d'aucun intermédiaire.

Dans notre exemple, Alice achète des litecoins à Bob avec des bitcoins.
Le qualificatif “atomique”, d’étymologie grecque, signifie simplement “insécable” (dans sa version latine), c’est à dire que les deux branches de la transaction, l’achat et la vente, ne peuvent être découpées: soit elles se produisent toutes les deux (le swap est effectué), soit aucune des deux ne se produit. Si le swap est stoppé par l’un ou l’autre des participants, chacun récupère sa mise.

Dans la pratique, Alice et Bob ont toujours besoin d’une plateforme pour que leurs offres d’achat / vente (bid/ask) soient visibles et pour les faire correspondre lors d’un échange. 
La plateforme peut être un réseau décentralisé tel que le réseau Lightning ou une application centralisée accessible via un site web. Dans ce dernier cas, le site gère un carnet d’ordres pour apparier les acheteurs avec les vendeurs  sans prendre le contrôle de leurs coins.

Notre protocole est basé ici sur un [smart contract](https://en.wikipedia.org/wiki/Smart_contract) simple du type HTLC ([Hash Time Locked Contract](https://en.bitcoin.it/wiki/Hash_Time_Locked_Contracts)).

Parce que Bitcoin et Litecoin utilisent le même langage pour les smart contracts, [Bitcoin Script](https://en.bitcoin.it/wiki/Script), le même script peut être utilisé par Alice et Bob, l’un déployé sur la blockchain Bitcoin, l’autre, identique, sur la blockchain Litecoin.

**Phase 0: Alice et Bob sont appariés**

Alice génère un secret S et crée une adresse HTLC Bitcoin avec H(S), l’empreinte numérique de S,  et une clé publique, initiant une offre d’achat (“bid”) si sa clé publique porte un montant de x bitcoins.
Symétriquement, Bob crée une offre de vente avec sa clé publique portant un montant y en litecoins.
Alice ou Bob lancent une recherche dans le carnet d’ordres pour une correspondance et leur bid/ask sont appariés.


![Atomic Swap: Transactions]({{ site.baseurl }}/assets/atomic_swap_transactions.jpg)

_Atomic Swap: Schema des transactions_


**Phase 1: Alice s’engage**

Alice signe une transaction TX1 déposant x bitcoins sur l’adresse HTLC qu’elle a créée dans la phase 0.
TX1 possède une unique sortie (txout), contenant le “scriptPubkey” suivant:

```
IF 
// Ordinary claim for B 
HASH160 <H(S)> EQUALVERIFY 
2 <pubkeyA> <pubkeyB> 
ELSE 
// Refund for A 
2 <pubkeyA> <pubkeyB> 
ENDIF 
2 CHECKMULTISIG
```

Le **“scriptPubkey” est un smart contract dans le langage Bitcoin**, c’est à dire une programme qui définit les conditions pour pouvoir transférer vers un autre adresse les fonds déposés sur l’adresse HTLC.

Alice ne diffuse pas encore TX1 car, à ce stade, ses fonds pourraient être perdus si Bob ne coopère pas.

Alice crée donc une transaction de remboursement TX2, qui renvoie les bitcoins sur une adresse qu’elle contrôle, avec un “locktime “ de 48 heures. Le [locktime](https://en.bitcoin.it/wiki/Timelock ) est un paramètre de la transaction qui permet d’en empêcher la diffusion avant une certaine date/heure. Nous l’expliquons plus en détail à la fin de cet article.

TX2 utilise TX1 [0] comme entrée (txin) et présente le scriptSig suivant:

```
<sigB2> <sigA2> FALSE
```
qui passe par la branche ELSE du script. 
Le “scriptSig” permet de prouver que les conditions fixées dans le smart contract sont réunies pour déverrouiller les fonds.

Alice transmet TX2 à Bob et lui demande de la signer et de la renvoyer. Une fois qu'Alice aura reçu la signature sigB2 de Bob, Alice publiera TX1, sachant qu'elle pourrait récupérer ses bitcoins après 48 heures en cas de problème via la transaction TX2, à condition qu'elle ne révèle pas S. 

Une fois que TX1 est confirmée sur le réseau Bitcoin, Alice est engagée dans le swap.


**Phase 2: Bob s’engage**


Bob a reçu TX2 dans la phase 1 et connaît donc H(S). Bob a également signé la transaction de remboursement d’Alice, mais celle-ci ne sera active qu’après 48 heures. À moins qu'il ne décide d'interrompre l'échange, Bob obtiendra x bitcoins dans les 24 heures. Bob a également vu que Alice est engagée car la transaction TX1 a été publiée.

Bob crée la transaction Litecoin TX3 déposant y litecoins sur l’adresse HTLC. TX3 est symétrique de TX1 et possède un seul txout contenant le même scriptPubkey que dans la phase 1.

Bob crée également TX4, qui lui permettrait de se rembourser en litecoins si le swap était stoppé. TX4 est verrouillé pendant 24 heures, utilise TX3 [0] comme entrée (txin) et présente le scriptSig suivant:

```
<sigB4> <sigA4> FALSE
```

TX4 est symétrique de TX2.

Bob signe la transaction TX4 et la transmet avec sa signature sigB4 à Alice, lui demandant de la contresigner. Lorsque Bob reçoit la signature d’Alice sigA4 en retour, il peut publier en toute sécurité TX3, sachant qu'il pourrait stopper le swap et récupérer ses litecoins après 24 heures avec TX4. 

Bob est maintenant engagé au même titre qu’Alice.


**Phase 3: Alice déclenche l’exécution du swap en révélant S**

La phase 3 commence donc avec Alice: elle envoie à Bob sa signature sigA6  sur une transaction TX6 qui le paye en lui transférant la sortie de TX1 avec x bitcoins.
Elle sait que Bob ne peut pas encore compléter le scriptSig permettant de valider TX6 car elle est la seule à connaître S à ce stade.

Après avoir vérifié la signature d'Alice, Bob envoie à Alice sa signature sigB5 sur une transaction TX5 qui la paye en lui transférant la sortie de TX3 avec y litecoins.

Alice a maintenant 24 heures pour collecter les litecoins, en utilisant le scriptSig suivant:

```
<sigA5><sigB5> <S> TRUE
```

qui déclenche l’exécution de la branche IF du smart contract.

En publiant la transaction TX5 avec ce scriptSig sur la blockchain Litecoin, Alice révèle S.

Si elle le fait dans les 24 heures, Bob peut alors obtenir ses bitcoins avant l’expiration du délai de 48 heures avec le scriptSig suivant, validant TX6:

```
<sigA6><sigB6> <S> TRUE
```

**Le swap est exécuté avec succès dès lors que les transactions TX6 et TX5 sont confirmées** dans les blockchains Bitcoin et Litecoin respectivement.

Si Alice disparait ou ne diffuse pas TX5 dans les 24 heures, **Bob peut obtenir son remboursement en diffusant la transaction TX4** sur la blockchain Litecoin.
Bob ne doit pas attendre l’expiration du délai de 48 heures (locktime de TX2) car Alice pourrait alors publier à la fois TX2 et TX5. 
Pour assurer la sécurité de Bob dans ce protocole, le **locktime de TX2 doit être supérieur au locktime de TX4** par un écart de plusieurs heures.
La publication de TX5 avant TX4 priverait Bob de son remboursement TX4 car ces 2 transactions sont financées par la même sortie de la transaction TX3. La publication de TX4 serait donc vue comme une tentative de double-dépense par le réseau Litecoin.



Si Bob disparait ou ne fournit pas sigB6 dans les 48 heures, **Alice peut obtenir son remboursement en publiant la transaction TX2** sur la blockchain Bitcoin.
**Comme elle n’a pas publié TX5, Bob ne connait pas S** et ne peut donc pas publier TX6 sur le réseau Bitcoin.
La publication de TX6 avant TX2 priverait Alice de son remboursement TX2 car ces 2 transactions sont financées par la même sortie de la transaction TX1. La publication de TX2 serait alors vue comme une tentative de double-dépense par le réseau Bitcoin.


**Qu'est-ce que “locktime” signifie exactement?**

Nous pouvons utiliser le mécanisme du “locktime” pour verrouiller une transaction jusqu'à un bloc spécifique ou jusqu'à une certaine date/heure future.

Locktime <500000000 : la valeur du locktime est interprétée comme un numéro de bloc. Les fonds sont déverrouillés à la hauteur du bloc en question.

Locktime> = 500000000 : la valeur du locktime est interprétée comme une date/heure. Les fonds sont déverrouillés à une heure précise (hrorodatage Unix).

Dans ce cas, (Locktime >= 500000000 ), il faut bien comprendre le piège suivant:
la transaction peut être propagée sur le réseau si et seulement si l’heure médiane des 11 derniers blocs (heure inscrite dans l’en-tête du bloc) se situe après l’heure du locktime.
Par conséquent, si le locktime est fixé par exemple dans 48 heures, la transaction ne pourra être propagée sur le réseau avant 49 heures.

Autre piège, pour que le locktime soit appliqué, nous devons fixer le numéro de séquence de l'une des entrées de la transaction à une valeur inférieure au maximum par défaut (0xffffffff).
Si vous ne souhaitez pas que votre transaction soit verrouillée avant un bloc ou une heure spécifique, fixez le champ locktime à 0x00000000 (ou tout autre paramètre inférieur à la hauteur du bloc ou à l'heure unix actuelle).
Toute tentative de diffusion d'une transaction avant son heure de verrouillage déclenchera le message d'erreur réseau «64: non final».

Comme le paramètre “locktime” (plus précisément nLockTime dans le code de Bitcoin Core) s’applique à toute la transaction, une instruction, CHECKLOCKTIMEVERIFY ou CLTV en abrégé, a été ajoutée en 2015 au langage Bitcoin Script, permettant d’appliquer une contrainte de temps sur une seule sortie d’une transaction, sans affecter les autres sorties.

![Locktime]({{ site.baseurl }}/assets/locktime.jpg)

Par exemple, si une transaction T1 envoie des fonds vers une adresse comportant l’instruction CLTV t, une transaction T2 transférant les fonds de cette adresse ne pourra être validée par le réseau que si son locktime se situe après t. 
Les autres sorties de la transaction T1 peuvent être dépensées sans cette contrainte.


Pour en savoir (encore) plus:

[https://en.bitcoin.it/wiki/Atomic_swap](https://en.bitcoin.it/wiki/Atomic_swap)

[https://bitcointalk.org](https://bitcointalk.org/index.php?topic=193281.msg2224949#msg2224949)

[http://atomic.bitcoinscri.pt/pages/about](http://atomic.bitcoinscri.pt/pages/about)


