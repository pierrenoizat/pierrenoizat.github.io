---
layout: post
title: Bitcoin, Segwit Inside, Part 1 - Adresses P2WPKH natives
date: 2018-01-31 00:40:51.000000000 +01:00
type: post
published: true
status: draft
categories:
- Bitcoin
- Technologie
tags: [segwit]
meta:
  _edit_last: '1'
author:
  login: admin
  email: noizat@hotmail.com
  display_name: Boussac
  first_name: 'Pierre'
  last_name: 'Noizat'
---
Segwit, abréviation de «Segregated Witness» ou “signatures séparées” en français, est un changement fondamental dans la manière dont les transactions Bitcoin sont construites à partir d’entrées (inputs) et de sorties (outputs).

![P2PKH Sighash]({{ site.baseurl }}/assets/tx_inputs_outputs.png)

_Entrées (inputs) et sorties (outputs) d'une transaction: le cadre vert englobe le message signé avec la signature 1 (SIGHASH ALL)_

Cet article décrit les nouvelles adresses Bitcoin Segwit et explique comment les développeurs peuvent générer des transactions vers et depuis ces nouvelles adresses.

Il y a 4 nouveaux types d'adresse Bitcoin Segwit, "native" ou contenue dans une adresse P2SH: P2WPKH natif, P2WSH natif, P2SH-P2WPKH, P2SH-P2WSH.

Avant de nous pencher sur ces nouvelles adresses, nous allons d'abord passer en revue les deux changements significatifs introduits par Segwit: inclure les valeurs d'entrée dans le hash de la transaction et séparer les signatures (“witness” en langage cryptographique) des entrées de transaction.



**Entrées et sorties d'une transaction**

Les entrées d’une transaction X pointent vers des scripts dans des transactions précédentes où les coins sont bloqués jusqu'à ce que la transaction X soit confirmée dans la blockchain.

Les entrées décrivent l'origine des fonds dépensés dans la transaction. Chaque entrée est constituée d'une référence à une sortie de transaction précédente (“unspent transaction output”, utxo en abrégé) ainsi que de toutes les données requises pour déverrouiller les coins.

Dans le cas de coins bloqués sur une adresse P2PKH ("pay-to-public-key-hash") standard, ces données, appelées "scriptSig", consistent en une signature suivie de son type de “sighash” suivi de la clé publique permettant de vérifier la signature et correspondant à l’adresse en question.

![P2PKH Sighash]({{ site.baseurl }}/assets/P2PKH_SigHash.png)

_Message à signer pour un transfert d'une adresse P2PKH vers une adresse P2SH (Source: Medium, Jaqen Hash’ghar)_

Le “sighash” est l’empreinte du message de transaction à signer.
Plusieurs types de “sighash” (ALL, NONE, SINGLE, etc..) permettent de spécifier le périmètre du message couvert par la signature. 

La valeur par défaut (ALL) signifie que la signature couvre toutes les entrées et toutes les sorties de la transaction. Les autres types de sighash sont utilisés dans des cas d’usage particuliers comme le crowdfunding

Les sorties déterminent la destination des fonds dépensés par la transaction. 

Les sorties d'une transaction consistent en un montant (exprimés en satoshis) suivi d'un "scriptPubKey", c'est-à-dire un script Bitcoin définissant les conditions pour que le montant en question soit débloqué par une transaction ultérieure.

Les entrées de transaction sont signées en chiffrant le “sighash" avec une clé privée.
Parce que les signatures ne peuvent pas exister avant de signer, pour le calcul de sighash, le scriptSig est remplacé par le "scriptCode". 
Pour une entrée P2PKH traditionnelle, le scriptCode est simplement le scriptPubKey de l'utxo (sortie de la transaction précédente) qui la finance:

`OP_DUP OP_HASH160 <pubkey_hash> OP_EQUALVERIFY OP_CHECKSIG`

Dans une transaction non-Segwit, le type de sighash est ajouté après la signature pour spécifier son périmètre. Dans une transaction Segwit, le type de sighash est ajouté à la fin de la pré-image du sighash pour éviter toute altération.

Une fois signée, une transaction non-Segwit est identifiée par son txid qui est un double hachage SHA256 de l'intégralité du message de transaction signé.


**Nouvelle empreinte de transaction**

Un nouvel algorithme de calcul de l’empreinte de transaction est défini qui inclut la valeur (en satoshis) de chaque entrée de sorte qu'un dispositif de signature hors ligne (par exemple un ledger) puisse signer en toute sécurité la transaction sans avoir besoin de vérifier la chaîne de blocs. 

Avec une transaction non-Segwit, un périphérique hors ligne n'aurait aucun moyen de connaître la valeur d’entrée et pourrait donc payer des commissions de réseau excessives si le montant dépensé était fixé trop bas.


**Séparer les signatures de la transaction**

Le changement le plus significatif introduit par Segwit est la suppression des scripts de signature dans les entrées; les scripts de signature sont maintenant "séparés" dans une nouvelle section de la transaction Segwit appelée le “witness”. Dans une transaction Segwit, le "script_sig" d'un input est désormais vide, remplacé par un "script_witness".

Parce que ECDSA, l'algorithme de signature utilisé dans Bitcoin, utilise un nonce aléatoire dans le calcul d'une signature, un signataire non autorisé peut produire plusieurs signatures valides pour la même entrée. 

Par conséquent, l'attaquant peut produire deux versions valides de la même transaction, chacune avec un ID de transaction distinct si les signatures sont incluses dans les entrées (txins):

`txid = SHA256(SHA256(nVersion|txins|txouts|nLockTime)`

Ce problème a été identifié dès le début comme le problème de la «malléabilité des transactions» et est maintenant résolu par Segwit. 

Avec Segwit, le format de transaction original n'inclut pas les signatures (dans la section "txins" de la transaction) de sorte que le txid n'est plus malléable. 

Après Segwit, txid, l'identifiant de transaction, reste l'identifiant primaire de la transaction dans la chaîne de blocs Bitcoin.

![Witness ID]({{ site.baseurl }}/assets/witnesstx.png)

_Les inputs d'une transaction Segwit ne contiennent pas de signatures: elles se retrouvent dans le witness_

Le “witness” est ajouté à la fin de la transaction Segwit, juste avant le dernier élément de la transaction qui est son locktime.

Le locktime peut être utilisé dans un scriptPubKey pour spécifier que la transaction ne peut être incluse dans la blockchain qu'après l'heure et la date correspondant au locktime.

Le "Witness ID" (wtxid) est un double hachage SHA256 du message de transaction avec son "witness". Le wtxid de chaque transaction du bloc est rangé dans un arbre binaire dont la racine est incluse dans la transaction de minage (coinbase transaction) du bloc.

Ainsi les signatures d'une transaction, si elles ont été conservées dans un wallet, peuvent être vérifiées avec le bloc contenant la transaction. 


**Adresse P2WPKH native**

Contrairement aux adresses Segwit imbriquées dans une adresse P2SH classique (P2SH-P2WPKH ou P2SH-P2WSH), on ne peut pas envoyer des fonds à une adresse Segwit native depuis un “wallet” non compatible Segwit.
Autrement dit, **le “wallet” doit être mis à niveau pour prendre en charge les adresses Segwit natives**. 

C'est l'une des principales raisons pour lesquelles l’adoption de segwit a été relativement lente et prend de l'ampleur à mesure que de plus en plus de portefeuilles Bitcoin (applications ou portefeuilles hébergés) implémentent Segwit.

Les adresses natives P2WPKH (Pay-To-Witness-Public-Key-Hash) sont codées en Bech32 selon BIP143 et BIP173: elles commencent par une partie lisible "bc" pour Bitcoin mainnet, et "tb" pour testnet, suivi du séparateur "1", puis les données qui peuvent contenir jusqu'à 87 caractères, les six derniers caractères formant un code de correction d’erreur (checksum) et ne contenant aucune information.

L'acronyme Bech32 provient du code de correction d’erreur BCH combiné avec un encodage en base 32. BCH signifie Bose-Chaudhuri-Hocquenghem: ces codes correcteurs d'erreurs ont été inventés en 1959 par le mathématicien français A. Hocquenghem.

Les adresses P2WPKH natives utilisent le même format de clé publique que P2PKH, avec une exception importante: la clé publique utilisée dans P2WPKH DOIT être compressée, c'est-à-dire de 33 octets, et commencer par 0x02 ou 0x03.

Le scriptPubKey P2WPKH consiste toujours en 22 octets. Il commence par un OP_0, suivi du keyhash précédé de sa taille (20 octets) , c’est-à-dire 0x0014 {keyhash}. Le keyhash est RIPEMD160(SHA256) de la clé publique compressée.

Le premier octet (OP_0) est appelé le "version byte" (seule la version 0 est reconnue pour le moment par le réseau) et les 21 octets suivants le "witness program".

Pour les développeurs, voici quelques exemples de transactions construites avec ruby, language libre reconnu pour sa concision et sa lisibilité:

**Calcul de l'adresse P2WPKH native:**

```ruby
include Bitcoin
include Bitcoin::Builder
include Bitcoin::Protocol
include Bitcoin::Util
include Bitcoin::Secp256k1
include Bech32
base_factor = 100000000
mnemonic = "beyond .. satoshi" # saisir votre propre phrase de passe ici
seed = BipMnemonic.to_seed(mnemonic: mnemonic)
@btc_wallet = Bip44::Wallet.from_seed(seed, "m/44'/0")
@btc_node = @btc_wallet.sub_wallet "m/0/0"
public_key = Key.new(nil,@btc_node.public_key).pub_compressed
script_pubkey = Script.from_string("0 "+"#{hash160(public_key)}").to_payload

native_p2wpkh_address = SegwitAddr.new
native_p2wpkh_address.hrp = 'bc' # hrp = human-readable part
native_p2wpkh_address.script_pubkey = script_pubkey.bth
puts native_p2wpkh_address.addr # adresse Segwit P2WPKH native
```

Exemple:

Clé publique: 02530c548d402670b13ad8887ff99c294e67fc18097d236d57880c69261b42def7

Adresse Segwit P2WPKH native: **bc1qg9stkxrszkdqsuj92lm4c7akvk36zvhqw7p6ck**


**Transaction Segwit DEPUIS une adresse P2WPKH native:**

```ruby
# la destination peut être standard (legacy) ou native Segwit
destination_address = "12qeTKzrK7wm1V8rCjYEysAdtD5D3PxfPV"
# destination_address = "bc1q2xdndlad2njdd6vsnvqhhyu9l4dan2sm4dhrml"

utxo_txid="03e60e4671588c2dc94415ab21a95960e19ebe9316c5ee25a706ccba25535e36"
utxo_index = 0
amount = 0.00075135 * base_factor # conversion du montant en satoshis
fee = 0.0001 * base_factor
# sent_amount = 0.0005 * base_factor
# change = amount - sent_amount - fee
sent_amount = amount - fee

tx = build_tx do |t|
 t.lock_time 0
 t.input do |i|
  i.prev_out utxo_txid, utxo_index, script_pubkey, amount
  i.sequence "ffffffff".htb
 end  
 t.output do |o|
  o.value sent_amount
  o.script {|s| s.recipient destination_address }
 end
 # t.output do |o|
 #  o.value change
 #  o.script { |s| s.recipient change_address }
 # end
end

tx.to_payload.bth # transaction non encore signée
sig_hash = tx.signature_hash_for_witness_input(0, script_pubkey, amount)
sig = Secp256k1.sign(sig_hash, @btc_node.private_key.htb)
tx.in[0].script_witness.stack << sig + [Tx::SIGHASH_TYPE[:all]].pack("C")
tx.in[0].script_witness.stack << public_key.htb
puts tx.to_payload.unpack('H*')[0] # transaction signée (au format hex)
```
Exemples:

[346aa91e0854b34c63dfb655ac9b1fdcb9ac34de179f05760bf7dc49b6d0ba7a](https://blockchair.com/bitcoin/transaction/346aa91e0854b34c63dfb655ac9b1fdcb9ac34de179f05760bf7dc49b6d0ba7a)

[9b0fccfc75f0dfbb36d424f786a6d40e3bac0b537dd912f1ae3bdc2cbb0f4e61](https://blockchair.com/bitcoin/transaction/9b0fccfc75f0dfbb36d424f786a6d40e3bac0b537dd912f1ae3bdc2cbb0f4e61)

[1b2daeacde58eb6edff643cefdd5bef1a8b9025c0fc52f5fa6e79051139453ee](https://blockchair.com/bitcoin/transaction/1b2daeacde58eb6edff643cefdd5bef1a8b9025c0fc52f5fa6e79051139453ee)

Taille de la transaction: 195 octets

Transaction non-segwit comparable: 268a21f8dea0ef5466c02e96174968273d6f9baeb7566ba7f018a2907bd510b7
Taille: 192 octets


**Transaction standard VERS une adresse Segwit native:**

```ruby
public_key = Key.new(nil,@btc_node.public_key).pub
# adresse standard d'origine (non compressée):
puts Key.new(nil,@btc_node.public_key).addr  
script_pubkey = Script.to_hash160_script(hash160(public_key))
utxo_txid="b2e85846105077e0eadaa570ba5962872f6bf22ef43ab50c58571f8cb39a3ce1"
utxo_index =1
amount = 0.00073192 * base_factor
fee = 0.0001 * base_factor
sent_amount = amount - fee
destination_address = "bc1q2xdndlad2njdd6vsnvqhhyu9l4dan2sm4dhrml"

tx = build_tx do |t|
 t.input do |i|
  i.prev_out utxo_txid
  i.prev_out_index utxo_index
 end  
 t.output do |o|
  o.value sent_amount
  o.script {|s| s.recipient destination_address }
 end
end

tx.to_payload.bth # transaction non encore signée
sig_hash = tx.signature_hash_for_input(0, script_pubkey)
sig = Secp256k1.sign(sig_hash, @btc_node.private_key.htb) 
tx.in[0].script_sig = Script.to_signature_pubkey_script(sig, public_key.htb)
puts tx.to_payload.unpack('H*')[0] # transaction signée (au format hex)
```
Exemples:

[6e3a1a465405e242d30379a314fcb3f105df756f4c4ba4831a79a45af1a4f2cd](https://blockchair.com/bitcoin/transaction/6e3a1a465405e242d30379a314fcb3f105df756f4c4ba4831a79a45af1a4f2cd)
 

[4b8bef4eda11479f3113eb1a88658bf1e368c8acd0b336c41c26c633f1585b9a](https://blockchair.com/bitcoin/transaction/4b8bef4eda11479f3113eb1a88658bf1e368c8acd0b336c41c26c633f1585b9a)
 


Avertissement: même si ce code a été testé, vous l'utilisez à vos risques et périls. Vous devez vous assurez de ce que vous faites avant de diffuser une transaction sur mainnet. Soyez particulièrement attentif aux montants envoyés à l'adresse de destination, à l'adresse de change (rendu de monnaie, le cas échéant) et au montant des commissions de réseau.

Remerciements à 
Pieter Wuille, inventeur de Segwit. 

Julian Langschaedel ([bitcoin-ruby](https://github.com/lian/bitcoin-ruby)) 

et Shigeyuki Azuchi ([Bech32](https://github.com/azuchi/bech32rb/tree/master/lib)) pour avoir développé et publié les bibliothèques open source utilisées dans le code ci-dessus.

Mon prochain article (part 2/4) traitera des adresses P2WSH natives, part 3  de P2SH-P2WPKH et finalement part 4 de P2SH-P2WSH.

Liens utiles pour les développeurs:

GitHub: [native_p2wpkh.rb](https://gist.github.com/pierrenoizat/16ba9e5b7455c6fe9358840ce38e0021)

[bitcoincore.org/en/segwit_wallet_dev](https://bitcoincore.org/en/segwit_wallet_dev/)

Pour expérimenter les adresses segwit: [bitcoinscri.pt](http://bitcoinscri.pt/pages/segwit_native_p2wpkh_address)

EDIT Novembre 2020: exemples de code simplifiés avec la librairie bitcoin-ruby
