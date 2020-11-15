---
layout: post
title: Bitcoin, Segwit Inside - Part 2 - Adresses P2WSH natives
date: 2018-03-31 00:40:51.000000000 +01:00
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
Après l'article décrivant les adresses [natives P2WPKH](http://e-ducat.fr/2018-01-31-segwit-inside-native-p2wpkh-fr/), celui-ci s'intéresse aux adresses natives P2WSH en expliquant comment les développeurs peuvent simplement créer ces adresses, y envoyer des fonds puis les dépenser. 

Contrairement à une adresse P2WPKH qui correspond à une clé publique et une signature, **une adresse P2WSH peut contenir un script arbitrairement complexe** (**"witness script"**) avec de multiples signatures et de multiples conditions. Dans cet article, nous prenons l'exemple d'un script **multisignature "2-of-2"**.

**Adresse P2WSH native**

P2WSH est l'acronyme pour Pay-To-Witness-Script-Hash: ces adresses Segwit sont codées en Bech32.

Le scriptPubKey P2WSH consiste toujours en 34 octets. Il commence par un OP_0, suivi du keyhash précédé de sa taille (32 octets) , c’est-à-dire 0x0020 {keyhash}. Le keyhash est l'empreinte SHA256 du "witness script".

Le premier octet (OP_0) est appelé le “version byte” (pour le moment, seule la version 0 est acceptée par le réseau) et les 33 octets suivants le **“witness program”**.

Pour rappel, le "scriptPubKey" est le script qui est placé dans l'output d'une transaction por fixer la ou les conditions qui devront être satisfaites pour dépenser l'utxo (unspent transaction output).

Dans une adresse P2SH (Pay-To-Script-Hash), le "redeemScript" fixe les conditions et doit apparaitre en tant que dernier item du scritpSig pour dépenser l'utxo. Le scriptPubKey l'encapsule dans le script suivant:

OP_HASH160 Hash160(redeemScript) OP_EQUAL

Dans une adresse P2WSH, le "witness script" doit apparaitre en dernier dans la pile "witness" permettant de dépenser l'utxo.
Le "witness program" est SHA256(witness_script) pour P2WSH.
Dans les adresses Segwit natives, scriptPubKey est OP_0 witness_program.

Pour construire une transaction standard alimentant une adresse native P2WSH, les développeurs peuvent se reporter à l'exemple dans mon article sur les adresses [natives P2WPKH](http://e-ducat.fr/2018-01-31-segwit-inside-native-p2wpkh-fr/): l'adresse de destination peut aussi être indiféremment une adresse P2WSH.

Voici un exemple en language ruby d'une transaction Segwit envoyant des fonds DEPUIS une adresse native P2WSH. 

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
@btc_node = @btc_wallet.sub_wallet "m/0/2"
user_public_key = Key.new(nil,@btc_node.public_key).pub_compressed
@btc_node = @btc_wallet.sub_wallet "m/0/3"
escrow_public_key = Key.new(nil,@btc_node.public_key).pub_compressed

# Creation du Witness Script:  2-of-2 multisig dans cet example

witness_string = "2 #{user_public_key} #{escrow_public_key} 2 OP_CHECKMULTISIG"

witness_script = Script.from_string(witness_string).to_payload
```
Calcul de l'adresse native P2WSH:

```ruby
script_pubkey = Script.to_witness_p2sh_script(sha256(witness_script.bth))

native_p2wsh_address = SegwitAddr.new
native_p2wsh_address.hrp = 'bc' # hrp = human-readable part
native_p2wsh_address.script_pubkey = script_pubkey.bth
puts "\n Native P2WSH Address: #{native_p2wsh_address.addr} \n\n"
```

Exemple:

Adresse SegWit native P2WSH: **bc1qxfet744v05jfc3ks7gf4pguyjjfqcfvtsjvxkwa7emgvv4990arq3rwz2v**


Transaction envoyant des fonds DEPUIS une adresse P2WSH native:

```ruby
utxo_txid="cc432fa044a0ceeb48905be54bcd813ab5ac2e4b41c4a50493fedc8053831c0b"
utxo_index = 1
amount = 0.00074434 * base_factor
fee = 0.0001 * base_factor
sent_amount = amount - fee
destination_address = "12qeTKzrK7wm1V8rCjYEysAdtD5D3PxfPV"
script_pubkey = Script.to_witness_p2sh_script(sha256(witness_script.bth))

spend_tx = build_tx do |t|
 t.lock_time 0
 t.input do |i|
  i.prev_out utxo_txid, utxo_index, script_pubkey, amount
  i.sequence "ffffffff".htb
 end  
 t.output do |o|
  o.value sent_amount
  o.script {|s| s.recipient destination_address }
 end
end

tx = Tx.new(spend_tx.to_payload) # tx non encore signée
sig_hash = tx.signature_hash_for_witness_input(
0, script_pubkey, amount, witness_script, Tx::SIGHASH_TYPE[:all]
)
@btc_node = @btc_wallet.sub_wallet "m/0/2"
user_sig = Bitcoin::Secp256k1.sign(sig_hash, @btc_node.private_key.htb)
user_sig << [Tx::SIGHASH_TYPE[:all]].pack("C")
@btc_node = @btc_wallet.sub_wallet "m/0/3"
escrow_sig = Bitcoin::Secp256k1.sign(sig_hash, @btc_node.private_key.htb)
escrow_sig << [Tx::SIGHASH_TYPE[:all]].pack("C")
tx.in[0].script_witness.stack << '' # init stack
tx.in[0].script_witness.stack << user_sig << escrow_sig << witness_script
puts tx.to_witness_payload.bth # transaction signée, au format hex
```
Exemples de transactions envoyant des fonds depuis une adresse P2WSH:

[42b2c123ed8b96b26d5442d181cb6dd8c5403340e46d16e6ec6784a1d50f82f5](https://blockchain.info/tx/42b2c123ed8b96b26d5442d181cb6dd8c5403340e46d16e6ec6784a1d50f82f5)

[e097a3bad35d7e27adc9e770ea178bfb44e4a83d86421d3a69fb671844d878e9](https://blockchain.info/tx/e097a3bad35d7e27adc9e770ea178bfb44e4a83d86421d3a69fb671844d878e9)

Avertissement: même si ce code a été testé, vous l’utilisez à vos risques et périls. Vous devez vous assurez de ce que vous faites avant de diffuser une transaction sur mainnet. Soyez particulièrement attentif aux valeurs des montants envoyés et au montant des commissions de réseau. Utilisez testnet dans un premier temps.

Mon prochain article (part 3/4) traitera des adresses P2SH-P2WPKH.

Lien GitHub: [native_p2wsh.rb](https://gist.github.com/pierrenoizat/6880a12a599fa03a2099e3b38e8664e0)

EDIT Novembre 2020: exemples de code simplifiés avec la librairie bitcoin-ruby
