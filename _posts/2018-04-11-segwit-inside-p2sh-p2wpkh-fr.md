---
layout: post
title: Bitcoin, Segwit Inside - Part 3 - Adresses P2SH-P2WPKH
date: 2018-04-11 00:40:51.000000000 +01:00
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
Les adresses Segwit P2SH-P2WPKH ont été conçues pour permettre la création d'utxo ("unspent transaction output") segwit à partir d'un wallet standard ne supportant pas encore Segwit.

C'est donc à l'origine une façon d'amorcer le déploiement de Segwit en rendant interopérables des wallets supportant Segwit et des wallets ne le supportant pas encore.

Le principe est simple: le script P2WPKH est simplement emballé dans une adresse P2SH en tant que redeemScript comme le serait n'importe quel script bitcoin.

Rappelons que les adresses P2SH existent depuis 2012 ([BIP 16](https://github.com/bitcoin/bips/blob/master/bip-0016.mediawiki)) et sont donc supportées par tous les wallets Bitcoin.

A mesure que les wallets Bitcoin intègrent Segwit les uns après les autres, les adresses P2SH-P2WPKH devraient être progressivement remplacées par les [adresses natives P2WPKH](http://e-ducat.fr/2018-01-31-segwit-inside-native-p2wpkh-fr/).

Cet article décrit comment générer une adresse P2SH-P2WPKH et comment les développeurs peuvent construire une transaction dépensant les fonds verrouillés sur une telle adresse.

Les adresses P2SH-P2WPKH doivent être utilisées (comme les adresses standard P2PKH) lorsqu'une seule clé publique (compressée) est utilisée pour recevoir le paiement.

Pour une adresse P2SH-P2WPKH, le "redeemScript" P2SH comporte toujours 22 octets: 0x0014{20-byte keyhash}.

Il commence par OP_0, suivi par la taille de keyhash (20, soit 0x14 codé en hexadécimal) puis keyhash. Keyhash est le condensat hash160 (20 octets) de la clé publique compressée:
0 <hash160(compressed public key)>


Voici le code Ruby pour les développeurs, calculant dans un premier temps l'adresse P2SH-P2WPKH:

```ruby
include Bitcoin
include Bitcoin::Builder
include Bitcoin::Protocol
include Bitcoin::Util
include Bitcoin::Secp256k1

compressed_public_key = \
"02530c548d402670b13ad8887ff99c294e67fc18097d236d57880c69261b42def7"
redeem_script = \
Script.from_string("0 #{hash160(compressed_public_key)}").to_payload
p2sh_p2wpkh_address = hash160_to_p2sh_address(hash160(redeem_script.bth))
```

Exemple:

Clé publique: 02530c548d402670b13ad8887ff99c294e67fc18097d236d57880c69261b42def7

Adresse SegWit P2SH-P2WPKH: **3CXGygWxXMbv6Po53AZzqjqnqEJngQ9Ygf**


```ruby
# Transaction Segwit envoyant des fonds depuis une adresse P2SH-P2WPKH

utxo_txid="4ec4f658d86549544ac0b7b4f62ff4225f458c97243c7abf17e67584e27d0d08"
utxo_index = 0
amount = 100000
fee = 15000
destination_address = "1Bwyn5f5EvUPazh3H2rns6ENjTUYnK9ben"

spend_tx = build_tx do |t|
  t.lock_time 0
  t.input do |i|
    i.prev_out utxo_txid, utxo_index, redeem_script, amount
    i.sequence "ffffffff".htb
  end
  t.output do |o|
    o.value amount-fee
    o.script {|s| s.recipient destination_address }
  end
end

tx = Tx.new(spend_tx.to_payload) # transaction non encore signée

tx.in[0].script_sig = \
Script.new(Script.pack_pushdata(redeem_script)).to_payload

sig_hash = tx.signature_hash_for_witness_input(0, redeem_script, amount)

private_key_hex = "25940ad...b2d9"
sig = Secp256k1.sign(sig_hash, private_key_hex.htb)
tx.in[0].script_witness.stack << sig + [Tx::SIGHASH_TYPE[:all]].pack("C")
tx.in[0].script_witness.stack << compressed_public_key.htb
tx.to_payload.bth # transaction signée
```

Exemple:

Transaction envoyant des fonds depuis une adresse P2SH-P2WPKH: [75a18c29b34ae9a46f7daf020c8bf7b2f46418fa0ea7e8cd221ecbc857f56872](https://blockchain.info/tx/75a18c29b34ae9a46f7daf020c8bf7b2f46418fa0ea7e8cd221ecbc857f56872)

Liens utiles pour les développeurs:

GitHub: [p2sh_p2wpkh.rb](https://gist.github.com/pierrenoizat/f082d62d49e49f81978b97ad5900789a)

[bitcoincore.org/en/segwit_wallet_dev](https://bitcoincore.org/en/segwit_wallet_dev/)

Pour expérimenter les adresses P2SH-P2WPKH: [bitcoinscri.pt](http://bitcoinscri.pt/pages/segwit_p2sh_p2wpkh_address)

Avertissement: même si ce code a été testé, vous l’utilisez à vos risques et périls. Vous devez vous assurez de ce que vous faites avant de diffuser une transaction sur mainnet. Soyez particulièrement attentif aux valeurs des montants envoyés et au montant des commissions de réseau. Utilisez testnet dans un premier temps.

Mon prochain article (part 4/4) traitera des adresses P2SH-P2WSH.

EDIT Novembre 2020: exemples de code simplifiés avec la librairie bitcoin-ruby
