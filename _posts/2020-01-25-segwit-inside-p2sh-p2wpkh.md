---
layout: post
title: Bitcoin, Segwit Inside - Part 3 - P2SH-P2WPKH Addresses
date: 2018-04-02 00:40:51.000000000 +01:00
type: post
published: false
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

This article describes the way P2SH-P2WPKH addresses are designed and how developers can build transactions spending from these new segwit addresses.

A P2SH-P2WPKH address should be used when only one compressed public key is used to receive payment ( like a standard P2PKH address ).

Because the P2SH-P2WPKH address looks like a regular P2SH address, it can be used to create a segwit utxo from a wallet that is not segwit-ready.

Like native segwit addresses, segwit outputs nested in P2SH addresses like P2SH-P2WPKH addresses use the same public key format as P2PKH and require the public key be compressed.

The P2SH redeemScript is always 22 bytes. It starts with a OP_0, followed by a canonical push of the keyhash (i.e. 0x0014{20-byte keyhash}):
0 <hash160(compressed public key)>

Here is a code snippet in ruby to illustrate for developers.

Calculation of a P2SH-P2WPKH Address:

```ruby
require 'btcruby'
require 'bitcoin'
require 'bech32'
require './segwit_addr'
require 'active_support'
require 'active_support/core_ext'
require 'ffi'
# Calcul de l'adresse P2SH-P2WPKH
user_key = BTC::Key.new(public_key:BTC.from_hex("02530c548d402670b13ad8887ff99c294e67fc18097d236d57880c69261b42def7")) 
p2pkh_address = BTC::PublicKeyAddress.new(public_key: user_key.compressed_public_key)
redeem_script = BTC::Script.new << BTC::Script::OP_0 << p2pkh_address.hash
p2sh_p2wpkh_address = BTC::ScriptHashAddress.new(redeem_script:redeem_script).to_s
```

Example:

Public key: 02530c548d402670b13ad8887ff99c294e67fc18097d236d57880c69261b42def7

SegWit P2SH-P2WPKH Address: **3CXGygWxXMbv6Po53AZzqjqnqEJngQ9Ygf**


**Transaction spending from a P2SH-P2WPKH address:**

```ruby
include Bitcoin::Builder
include Bitcoin::Protocol
include Bitcoin::Secp256k1

prev_out="4ec4f658d86549544ac0b7b4f62ff4225f458c97243c7abf17e67584e27d0d08"
prev_out_index = 0
value = 100000

fee = 15000
@destination_address = "1Bwyn5f5EvUPazh3H2rns6ENjTUYnK9ben"
@user_key = Bitcoin.open_key("25940addfaec25439d348186e30976d8f1aaeb3da976cad59cb7fb2cf7f7b2d9") # clé privée au format hex
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

tx = Tx.new(spend_tx.to_payload) # yet unsigned tx

tx.in[0].script_sig = Bitcoin::Script.new(Bitcoin::Script.pack_pushdata(@redeem_script)).to_payload

sig_hash = tx.signature_hash_for_witness_input(0, @redeem_script, value)
sig = Bitcoin.sign_data(@user_key, sig_hash)
tx.in[0].script_witness.stack << sig
tx.in[0].script_witness.stack << @user_key.public_key.to_bn.to_s(2)
tx.to_witness_payload.bth
```

Example:

Transaction spending from a P2SH-P2WPKH address: [75a18c29b34ae9a46f7daf020c8bf7b2f46418fa0ea7e8cd221ecbc857f56872](https://blockchain.info/tx/75a18c29b34ae9a46f7daf020c8bf7b2f46418fa0ea7e8cd221ecbc857f56872)

