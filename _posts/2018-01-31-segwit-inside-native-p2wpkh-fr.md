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
  first_name: ''
  last_name: ''
---
Segwit, abréviation de «Segregated Witness» ou “signatures séparées” en français, est un changement fondamental dans la manière dont les transactions Bitcoin sont construites à partir d’entrées (inputs) et de sorties (outputs).

![P2PKH Sighash]({{ site.baseurl }}/assets/tx_inputs_outputs.png)

_Entrées (inputs) et sorties (outputs) d'une transaction: le cadre vert englobe le message signé avec la signature 1 (SIGHASH ALL)_

Cet article décrit les nouvelles adresses Bitcoin Segwit et explique comment les développeurs peuvent générer des transactions vers et depuis ces nouvelles adresses.

Il y a 4 nouveaux types d'adresse Bitcoin Segwit, "native" ou contenue dans une adresse P2SH: P2WPKH natif, P2WSH natif, P2SH-P2WPKH, P2SH-P2WSH.

Avant de nous pencher sur ces nouvelles adresses, nous allons d'abord passer en revue les deux changements significatifs introduits par Segwit: inclure les valeurs d'entrée dans le hash de la transaction et séparer les signatures (“witness” en langage cryptographique) des entrées de transaction.



**Entrées et sorties d'une transaction**

Les entrées d’une transaction pointent vers des scripts dans des transactions précédentes où les coins sont bloqués jusqu'à ce que la transaction soit confirmée dans la blockchain.

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

Le changement le plus significatif introduit par Segwit est la suppression des scripts de signature dans les entrées; les scripts de signature sont maintenant "séparés" dans une nouvelle section de la transaction Segwit appelée le “witness”.

Parce que ECDSA, l'algorithme de signature utilisé dans Bitcoin, utilise un nonce aléatoire dans le calcul d'une signature, un signataire non autorisé peut produire plusieurs signatures valides pour la même entrée. 

Par conséquent, l'attaquant peut produire deux versions valides de la même transaction, chacune avec un ID de transaction distinct si les signatures sont incluses dans les entrées (txins):

`txid = SHA256(SHA256(nVersion|txins|txouts|nLockTime)`

Ce problème a été identifié dès le début comme le problème de la «malléabilité des transactions» et est maintenant résolu par segwit. 

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

Le premier octet (OP_0) est appelé le "version byte" et les 21 octets suivants le "witness program".

Voici un exemple d’implémentation en ruby ​​pour les développeurs:

```ruby
require 'btcruby'
require 'bitcoin'
require 'bech32'
require 'segwit_addr'
BTC::Network.default= BTC::Network.mainnet
public_key="02530c548d402670b13ad8887ff99c294e67fc18097d236d57880c69261b42def7" # Clé publique compressée, au format hex.
```
**Calcul de l'adresse P2WPKH native:**

```ruby
p2pkh_address = BTC::PublicKeyAddress.new(public_key: public_key.htb)
script_pub_key = BTC::Script.new << BTC::Script::OP_0 << p2pkh_address.hash

native_p2wpkh_address = SegwitAddr.new
native_p2wpkh_address.hrp = 'bc' # hrp = human-readable part
native_p2wpkh_address.scriptpubkey = script_pub_key.to_hex
puts "\n Adresse P2WPKH native: #{native_p2wpkh_address.addr} \n\n"
```

Exemple:

Clé publique: 02530c548d402670b13ad8887ff99c294e67fc18097d236d57880c69261b42def7

Adresse Segwit P2WPKH native: **bc1qg9stkxrszkdqsuj92lm4c7akvk36zvhqw7p6ck**

**Transaction envoyant des fonds vers une adresse P2WPKH native:**

```ruby
@wif = "L2ULKxeRK...TEwcoX3hF" # private key in wif compressed format
@user_key = BTC::Key.new(wif:@wif)

prev_out="0dbf14f92a2929032b8628031c755e8320fd08bb350f416eaa9c134e2acf98fe"
prev_out_index = 0

value = 2440000 # previous tx output value in satoshis
fee = 15000

tx = BTC::Transaction.new(version: 2)
tx.lock_time = 0
tx.add_input(BTC::TransactionInput.new( previous_id: prev_out,
                                        previous_index: prev_out_index,
                                        sequence: 0))
tx.add_output(BTC::TransactionOutput.new(value: value-fee, script: script_pub_key))
hashtype = BTC::SIGHASH_ALL

sighash = tx.signature_hash(input_index: 0,
   output_script: BTC::PublicKeyAddress.parse(@user_key.address.to_s).script,
   hash_type: hashtype)

tx.inputs[0].signature_script = BTC::Script.new
tx.inputs[0].signature_script << (@user_key.ecdsa_signature(sighash) + BTC::WireFormat.encode_uint8(hashtype))
tx.inputs[0].signature_script << @user_key.public_key
puts "Hex transaction:"
puts tx.to_hex
```
Exemple: [6e3a1a465405e242d30379a314fcb3f105df756f4c4ba4831a79a45af1a4f2cd](https://blockchain.info/tx/6e3a1a465405e242d30379a314fcb3f105df756f4c4ba4831a79a45af1a4f2cd)

**Transaction envoyant des fonds depuis une adresse P2WPKH native:**

```ruby
include Bitcoin::Builder

hex_priv_key = # clé privée au format hex
# adresse Bitcoin standard ("legacy") de destination:
destination_address = "1FiwwBm4KApZX1mHqxtxKniuL419o5icCC"
# previous txid:
prev_out="6e3a1a465405e242d30379a314fcb3f105df756f4c4ba4831a79a45af1a4f2cd"
prev_out_index = 0 # index de l'unspent output (utxo) dans tx ci-dessus
value = 2425000 # valeur de l'utxo en satoshis
key = Bitcoin::Key.new(hex_priv_key)
script_pubkey = script_pub_key.data
fee = 15000

spend_tx = build_tx do |t|
 t.lock_time 0
 t.input do |i|
  i.prev_out prev_out, prev_out_index, script_pubkey, value
  i.sequence "ffffffff".htb
  i.signature_key key
 end  
 t.output do |o|
  o.value value-fee
  o.script {|s| s.recipient destination_address }
 end
end

signed_tx = spend_tx.to_payload.unpack('H*')[0] # signed raw tx (in hex)
```
Exemple: [1b2daeacde58eb6edff643cefdd5bef1a8b9025c0fc52f5fa6e79051139453ee](https://blockchain.info/tx/1b2daeacde58eb6edff643cefdd5bef1a8b9025c0fc52f5fa6e79051139453ee)

Taille de la transaction: 195 octets

Transaction non-segwit comparable: 268a21f8dea0ef5466c02e96174968273d6f9baeb7566ba7f018a2907bd510b7
Taille: 192 octets

Avertissement: même si ce code a été testé, vous l'utilisez à vos risques et périls. Vous devez vous assurez de ce que vous faites avant de diffuser une transaction sur mainnet. Soyez particulièrement attentif aux valeurs des montants envoyés et au montant des commissions de réseau.

Remerciements à 
Pieter Wuille, inventeur de Segwit.

Oleg Andreev ([btcruby](https://github.com/oleganza/btcruby)), 

Julian Langschaedel ([bitcoin-ruby](https://github.com/lian/bitcoin-ruby)) 

and Shigeyuki Azuchi ([Bech32](https://github.com/azuchi/bech32rb/tree/master/lib)) pour avoir développé et publié les remarquables bibliothèques open source citées dans le code ci-dessus.

Mon prochain article (part 2/4) traitera des adresses P2WSH natives, part 3  de P2SH-P2WPKH et finalement part 4 de P2SH-P2WSH.

Lien utile pour approfondir:
[bitcoincore.org/en/segwit_wallet_dev](https://bitcoincore.org/en/segwit_wallet_dev/)
