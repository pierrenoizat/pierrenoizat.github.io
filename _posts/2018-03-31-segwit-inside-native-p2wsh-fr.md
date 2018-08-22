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

Contrairement à une adresse P2WPKH qui correspond à une clé publique et une signature, **une adresse P2WSH peut contenir un script arbitrairement complexe** (**"witness script"**) avec de multiples signatures et de multiples conditions. Dans cet article, nous prenons l'exemple d'un witness script **multisignature "2-of-2"**.

**Adresse P2WSH native**

P2WSH est l'acronyme pour Pay-To-Witness-Script-Hash: ces adresses sont codées en Bech32.

Le scriptPubKey P2WSH consiste toujours en 34 octets. Il commence par un OP_0, suivi du keyhash précédé de sa taille (32 octets) , c’est-à-dire 0x0020 {keyhash}. Le keyhash est l'empreinte SHA256 du "witness script".

Le premier octet (OP_0) est appelé le “version byte” et les 33 octets suivants le **“witness program”**.

Voici un exemple d’implémentation en ruby​pour les développeurs:

```ruby
require 'btcruby'
require 'bitcoin'
require 'bech32'
require './segwit_addr'
require 'active_support'
require 'active_support/core_ext'
require 'ffi'

@user_key = BTC::Key.new(public_key:BTC.from_hex("02530c548d402670b13ad8887ff99c294e67fc18097d236d57880c69261b42def7"))
@escrow_key = BTC::Key.new(public_key:BTC.from_hex("024fffe85607b555cf7697e4be0d3d34dc1868baa57c235d926e447e926c08d287"))
# script multisignature "2-of-2":
witness_script = BTC::Script.new  << BTC::Script::OP_2 << @user_key.compressed_public_key << @escrow_key.compressed_public_key << BTC::Script::OP_2 
witness_script << BTC::Script::OP_CHECKMULTISIG
```
Calcul de l'adresse native P2WSH:

```ruby
script_pub_key = BTC::Script.new << BTC::Script::OP_0
script_pub_key<< BTC.sha256(witness_script.data) # witness program

native_p2wsh_address = SegwitAddr.new
native_p2wsh_address.hrp = 'bc' # hrp = human-readable part
native_p2wsh_address.scriptpubkey = script_pub_key.to_hex # 
puts "\n Native P2WSH Address: #{native_p2wsh_address.addr} \n\n"
```

Exemple:

Adresse SegWit native P2WSH: **bc1qhe8n322l05p35lu2p6g9vgerh93xlsatghmat9mxuctgpzcudqssd2xcyt**

Transaction envoyant des fonds VERS une adresse P2WSH native:

```ruby
# clé privée de notre utxo (adresse 16xgoSrGkG3z6eddGr3m4iqoBDTFWuV6J4)"
@wif = "KxUkvjMRkes.....MXp4WyBLCp8gUgHQUFC"
@user_key = BTC::Key.new(wif:@wif)
prev_out="8088b36e51d8dfad24af9d8b4dcf8624eff9d2c678caf74c7f2c93819918c4a9"
prev_out_index = 1
value = 100000
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
tx.to_hex # signed transaction in hex
```

Exemple de transaction envoyant des fonds vers une adresse P2WSH:
[cb2f672c5f5ca91c67fb610972b18b5a2514725ff48586b06569b325c6921044](https://blockchain.info/tx/cb2f672c5f5ca91c67fb610972b18b5a2514725ff48586b06569b325c6921044)

Transaction envoyant des fonds DEPUIS une adresse P2WSH native:

```ruby
include Bitcoin::Builder
include Bitcoin::Protocol
include Bitcoin::Secp256k1

prev_out="cb2f672c5f5ca91c67fb610972b18b5a2514725ff48586b06569b325c6921044"
prev_out_index = 0
value = 85000
script_pubkey = script_pub_key.to_hex.htb
fee = 15000
@destination_address = "1Bwyn5f5EvUPazh3H2rns6ENjTUYnK9ben"
user_key = Bitcoin.open_key("2594...f7b2d9") # clé privée au format hex
escrow_key = Bitcoin.open_key("4b5d5df7...72d6975c")

@witness_script = witness_script.data
witness_script = Bitcoin::Script.new(@witness_script)
spend_tx = build_tx do |t|
  t.lock_time 0
  t.input do |i|
    i.prev_out prev_out, prev_out_index, script_pubkey, value
    i.sequence "ffffffff".htb
  end
  t.output do |o|
    o.value value-fee
    o.script {|s| s.recipient @destination_address }
  end
end

tx = Tx.new(spend_tx.to_payload) # tx pas encore signée
sig_hash0 = tx.signature_hash_for_witness_input(0, script_pubkey, value, witness_script.to_payload, Tx::SIGHASH_TYPE[:all])
sig0 = Bitcoin::Secp256k1.sign(sig_hash0, user_key.private_key.to_hex.htb) + [Tx::SIGHASH_TYPE[:all]].pack("C")
sig1 = Bitcoin::Secp256k1.sign(sig_hash0, escrow_key.private_key.to_hex.htb) + [Tx::SIGHASH_TYPE[:all]].pack("C")
tx.in[0].script_witness.stack << ''
tx.in[0].script_witness.stack << sig0 << sig1 << witness_script.to_payload
tx.to_witness_payload.bth # transaction signée au format hex
```
Exemple de transaction envoyant des fonds depuis une adresse P2WSH:
[42b2c123ed8b96b26d5442d181cb6dd8c5403340e46d16e6ec6784a1d50f82f5](https://blockchain.info/tx/42b2c123ed8b96b26d5442d181cb6dd8c5403340e46d16e6ec6784a1d50f82f5)

Avertissement: même si ce code a été testé, vous l’utilisez à vos risques et périls. Vous devez vous assurez de ce que vous faites avant de diffuser une transaction sur mainnet. Soyez particulièrement attentif aux valeurs des montants envoyés et au montant des commissions de réseau. Utilisez testnet dans un premier temps.

Mon prochain article (part 3/4) traitera des adresses P2SH-P2WPKH.

Lien github: [native_p2wsh.rb](https://gist.github.com/pierrenoizat/6880a12a599fa03a2099e3b38e8664e0)
