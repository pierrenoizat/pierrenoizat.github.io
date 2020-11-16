---
layout: post
title: Bitcoin, Segwit Inside - Part 4 - Adresses P2SH-P2WSH
date: 2018-05-08 00:40:51.000000000 +01:00
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
Ce 4e et dernier article de ma série sur les adresses Segwit traite des adresses **P2SH-P2WSH** ("Pay-to-Script-Hash - Pay-to-Witness-Script-Hash"). Il décrit comment générer une adresse P2SH-P2WSH et comment les développeurs peuvent construire une transaction débloquant les fonds verrouillés sur une telle adresse.

Comme les adresses [P2SH-P2WPKH](http://e-ducat.fr/2018-04-11-segwit-inside-p2sh-p2wpkh-fr/) et pour la même raison d'interopérabilité avec les wallets existants, les adresses P2SH-P2WSH peuvent recevoir des fonds en provenance d'un wallet non-segwit qui les voit comme n'importe quelle adresse P2SH standard ([BIP 16](https://github.com/bitcoin/bips/blob/master/bip-0016.mediawiki)).

Comme les adresses [natives P2WSH](http://e-ducat.fr/2018-03-31-segwit-inside-native-p2wsh-fr/), les adresses P2SH-P2WSH peuvent contenir un **script Bitcoin arbitrairement complexe ("witnessScript")**. Nous prendrons ici l'exemple simple d'un script multisignature 2-sur-3.

**"Scripthash"** est l'empreinte numérique sha256 (32 octets) du "witness script".

Pour une adresse P2SH-P2WSH, le **"redeemScript"** P2SH comporte toujours 34 octets: 0x0020{32-byte scripthash}.

Il commence par OP_0, suivi par la taille de scripthash (32, soit 0x20 codé en hexadécimal) puis scripthash.
 

Voici le code Ruby pour les développeurs, en commençant par la construction du Witness Script multisig 2-sur-3. Pour simplifier la génération des clés nous utilisons dans cet exemple un wallet déterministe. En réalité, les 3 paires de clés peuvent être évidemment générées indépendamment les unes des autres, chaque participant conservant sa clé privée sans la divulguer.

```ruby
include Bitcoin
include Bitcoin::Builder
include Bitcoin::Protocol
include Bitcoin::Util
include Bitcoin::Secp256k1
base_factor = 100000000
mnemonic = "beyond .. satoshi" # saisir votre propre phrase de passe ici
seed = BipMnemonic.to_seed(mnemonic: mnemonic)
@btc_wallet = Bip44::Wallet.from_seed(seed, "m/44'/0")

@btc_node = @btc_wallet.sub_wallet "m/0/1"
public_key_1 = Key.new(nil,@btc_node.public_key).pub_compressed
@btc_node = @btc_wallet.sub_wallet "m/0/2"
public_key_2 = Key.new(nil,@btc_node.public_key).pub_compressed
@btc_node = @btc_wallet.sub_wallet "m/0/3"
public_key_3 = Key.new(nil,@btc_node.public_key).pub_compressed

witness_string = \
"2 #{public_key_1} #{public_key_2} #{public_key_3} 3 OP_CHECKMULTISIG"

witness_script = Script.from_string(witness_string).to_payload

redeem_string = "0 #{sha256(witness_script.bth)}"
redeem_script = Script.from_string(redeem_string).to_payload
```

Calcul de l'adresse P2SH-P2WSH
```ruby

p2sh_p2wsh_address = hash160_to_p2sh_address(hash160(redeem_script.bth))

```

Exemple:
Clé publique (compressée) 1: 03591da02bf7c80dc5d0edee4bbbfad7e58320785e3e54d4dab117152361f7002c

Clé publique (compressée) 2: 027ea2bc65ce49dcd748e4e41a0c8881be388b9182ad5e47579a0de0119803827b

Clé publique (compressée) 3: 03c5fdaf887f76119a73a7f738d5d4a451ff07bbbc83422c529452d8a36ae59e39

Adresse SegWit P2SH-P2WSH: **356yCBhiW9tqg5iiPDhEZ8f8t3JfqkEihA**

Construction d'une transaction Segwit envoyant des fonds DEPUIS l'adresse P2SH-P2WSH:

```ruby
utxo_txid="c57007980fabfd7c44895d8fc2c28c6ead93483b7c2bfec682ce0a3eaa4008ce"
utxo_index = 0
amount = 0.00074465 * base_factor
fee = 0.0001 * base_factor
destination_address = "12qeTKzrK7wm1V8rCjYEysAdtD5D3PxfPV"

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

sig_hash = tx.signature_hash_for_witness_input(
0, redeem_script, amount, witness_script, Tx::SIGHASH_TYPE[:all]
)
@btc_node = @btc_wallet.sub_wallet "m/0/2"
sig_2 = Secp256k1.sign(sig_hash, @btc_node.private_key.htb)
sig_2 << [Tx::SIGHASH_TYPE[:all]].pack("C")
@btc_node = @btc_wallet.sub_wallet "m/0/3"
sig_3 = Secp256k1.sign(sig_hash, @btc_node.private_key.htb)
sig_3 << [Tx::SIGHASH_TYPE[:all]].pack("C")
tx.in[0].script_witness.stack << '' # init stack
tx.in[0].script_witness.stack << sig_2 << sig_3 << witness_script
tx.to_payload.bth # transaction signée
```

Exemple de transaction envoyant des fonds depuis une adresse P2SH-P2WSH:

[55c7c71c63b87478cd30d401e7ca5344a2e159dc8d6990df695c7e0cb2f82783](https://blockchair.com/bitcoin/transaction/55c7c71c63b87478cd30d401e7ca5344a2e159dc8d6990df695c7e0cb2f82783)
 

Liens utiles pour les développeurs:

GitHub: [p2sh_p2wsh.rb](https://gist.github.com/pierrenoizat/a418968f2af4eaacfbff71e7a99c47fd)

Guide pour les développeurs de wallet: [bitcoincore.org/en/segwit_wallet_dev](https://bitcoincore.org/en/segwit_wallet_dev/)

Avertissement: même si ce code a été testé, vous l’utilisez à vos risques et périls. Vous devez vous assurez de ce que vous faites avant de diffuser une transaction sur mainnet. Soyez particulièrement attentif aux valeurs des montants envoyés et au montant des commissions de réseau. Utilisez testnet dans un premier temps.

EDIT Novembre 2020: exemples de code simplifiés avec la librairie bitcoin-ruby
