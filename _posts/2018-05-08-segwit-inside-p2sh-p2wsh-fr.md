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
  first_name: ''
  last_name: ''
---
Ce 4e et dernier article de ma série sur les adresses Segwit traite des adresses **P2SH-P2WSH**.

Comme les adresses [P2SH-P2WPKH](http://e-ducat.fr/2018-04-11-segwit-inside-p2sh-p2wpkh-fr/) et pour la même raison d'interopérabilité avec les wallets existants, les adresses P2SH-P2WSH peuvent recevoir des fonds en provenance d'un wallet non-segwit qui les voit comme n'importe quelle adresse P2SH standard ([BIP 16](https://github.com/bitcoin/bips/blob/master/bip-0016.mediawiki)).

Comme les adresses [natives P2WSH](http://e-ducat.fr/2018-03-31-segwit-inside-native-p2wsh-fr/), les adresses P2SH-P2WSH peuvent contenir un **script Bitcoin arbitrairement complexe ("witnessScript")**. Nous prendrons ici le même exemple d'un script multisignature 2-sur-2.

Cet article décrit comment générer une adresse P2SH-P2WSH et comment les développeurs peuvent construire une transaction débloquant les fonds verrouillés sur une telle adresse.

Pour une adresse P2SH-P2WSH, le "redeemScript" P2SH comporte toujours 34 octets: 0x0020{32-byte scripthash}.

Il commence par OP_0, suivi par la taille de scripthash (32, soit 0x20 codé en hexadécimal) puis scripthash. Scripthash est le condensat sha256 (32 octets) du "witness script":
0 <sha256(witness script)>

Comme pour toute adresse P2SH, le "scriptPubKey" est OP_HASH160 hash160(redeemScript) OP_EQUAL, l'adresse correspondante commence par le préfixe 3.

Voici le code Ruby pour les développeurs.

```ruby
require 'btcruby'

# Création du Witness Script: ici un script multisig 2-sur-2

@public_key = "02530c548d402670b13ad8887ff99c294e67fc18097d236d57880c69261b42def7"
@user_key = BTC::Key.new(public_key:BTC.from_hex(@public_key))
@escrow_key = BTC::Key.new(public_key:BTC.from_hex("024fffe85607b555cf7697e4be0d3d34dc1868baa57c235d926e447e926c08d287"))

witness_script = BTC::Script.new  << BTC::Script::OP_2 << @user_key.compressed_public_key << @escrow_key.compressed_public_key << BTC::Script::OP_2 
witness_script << BTC::Script::OP_CHECKMULTISIG
@witness_script = witness_script.data

redeem_script = BTC::Script.new   
redeem_script<< BTC::Script::OP_0
redeem_script<< BTC.sha256(@witness_script)

# Calcul de l'adresse P2SH-P2WSH
p2sh_p2wsh_address = BTC::ScriptHashAddress.new(redeem_script:redeem_script).to_s 
# exemple: 34c48TmtAUSpPZS5X1X8USNAUSWvZau6zn
```

Exemple:
Clé publique (compressée) "User": 02530c548d402670b13ad8887ff99c294e67fc18097d236d57880c69261b42def7

Clé publique (compressée) "Escrow": 024fffe85607b555cf7697e4be0d3d34dc1868baa57c235d926e447e926c08d287

Adresse SegWit P2SH-P2WSH: **34c48TmtAUSpPZS5X1X8USNAUSWvZau6zn**


```ruby
require 'bitcoin'
include Bitcoin::Builder
include Bitcoin::Protocol
include Bitcoin::Secp256k1

# Transaction envoyant des fonds DEPUIS une adresse P2SH-P2WSH

prev_out="4922998c3a2f741a64c85f2bce7367485ff25495dfd349e3ae60e5265ed6381d"
prev_out_index = 0
value = 100000
fee = 15000
@destination_address = "1Bwyn5f5EvUPazh3H2rns6ENjTUYnK9ben"
witness_script = Bitcoin::Script.new(@witness_script)
@redeem_script = redeem_script.data

spend_tx = build_tx do |t|
  t.lock_time 0
  t.input do |i|
    i.prev_out prev_out, prev_out_index, @redeem_script, value
    i.sequence "ffffffff".htb
  end
  t.output do |o|
    o.value value-fee
    o.script {|s| s.recipient @destination_address }
  end
end

tx = Tx.new(spend_tx.to_payload) # transaction non encore signée

tx.in[0].script_sig = Bitcoin::Script.new(Bitcoin::Script.pack_pushdata(@redeem_script)).to_payload

sig_hash = tx.signature_hash_for_witness_input(0, @redeem_script, value, witness_script.to_payload, Tx::SIGHASH_TYPE[:all])

user_private_key_hex = "b1afa5dc9d3e01f28b2952219b49e10defc8727337ebc19231e2ab3c83b3e556"
escrow_private_key_hex = "7b26055f4ca3f4271e526927362356c4cecab7b7037f18f296fd24351b8f86df"
user_sig = Bitcoin::Secp256k1.sign(sig_hash, user_private_key_hex.htb) + [Tx::SIGHASH_TYPE[:all]].pack("C")
escrow_sig = Bitcoin::Secp256k1.sign(sig_hash, escrow_private_key_hex.htb) + [Tx::SIGHASH_TYPE[:all]].pack("C")

tx.in[0].script_witness.stack << user_sig << escrow_sig
tx.in[0].script_witness.stack << witness_script.to_payload
tx.to_witness_payload.bth # transaction signée prête à diffuser
```

Exemple:

Transaction envoyant des fonds depuis une adresse P2SH-P2WSH: [718b84ed26a1178efc61b6b500d775df6392fb91816c2e7a48b9d018d66159c4](https://blockchain.info/tx/718b84ed26a1178efc61b6b500d775df6392fb91816c2e7a48b9d018d66159c4)

Liens utiles pour les développeurs:
[Ruby script sur Github pour adresses P2SH-P2WSH](https://gist.github.com/pierrenoizat/f082d62d49e49f81978b97ad5900789a)

[bitcoincore.org/en/segwit_wallet_dev](https://bitcoincore.org/en/segwit_wallet_dev/)
