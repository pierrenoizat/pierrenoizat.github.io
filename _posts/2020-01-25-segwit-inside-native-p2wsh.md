---
layout: post
title: Bitcoin, Segwit Inside - Part 2 - Native P2WSH Addresses
date: 2018-01-25 00:40:51.000000000 +01:00
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

There are 4 new segwit address types, “native” or nested in a P2SH address: native P2WPKH, native P2WSH, P2SH-P2WPKH, P2SH-P2WSH.

This article describes the way native P2WSH address are designed and how developers can build transactions spending to and from these new segwit addresses.

**Native P2WSH Address**

Native P2WSH (stands for Pay-To-Witness-Script-Hash) addresses are Bech32-encoded according to BIP143 and BIP173.
The Bitcoin script ( witnessScript ) embedded in a native P2WSH can be arbitrarily complex, ranging from, say, a simple 2-of-3 multisig condition to a more elaborate smart contract containing a number of public keys and time locks.

Public keys used in the witnessScript MUST be compressed.

The P2WSH scriptPubKey is always 34 bytes. 
It starts with a OP_0, followed by a canonical push of the keyhash (i.e. 0x0020{32-byte keyhash}).
The keyhash is the SHA256 digest of the witness script.

Here is a code snippet in ruby to illustrate for developers:

```ruby
require 'btcruby'
require 'bitcoin'
require 'bech32'
require './segwit_addr'
require 'active_support'
require 'active_support/core_ext'
require 'ffi'

# Creation of Witness Script: here a 2-of-2 multisig as an example

@user_key = BTC::Key.new(public_key:BTC.from_hex("02530c548d402670b13ad8887ff99c294e67fc18097d236d57880c69261b42def7"))
@escrow_key = BTC::Key.new(public_key:BTC.from_hex("024fffe85607b555cf7697e4be0d3d34dc1868baa57c235d926e447e926c08d287"))

witness_script = BTC::Script.new  << BTC::Script::OP_2 << @user_key.compressed_public_key << @escrow_key.compressed_public_key << BTC::Script::OP_2 
witness_script << BTC::Script::OP_CHECKMULTISIG
```
Calculation of Native P2WSH Address:

```ruby
script_pub_key = BTC::Script.new << BTC::Script::OP_0
script_pub_key<< BTC.sha256(witness_script.data) # witness program

native_p2wsh_address = SegwitAddr.new
native_p2wsh_address.hrp = 'bc' # hrp = human-readable part
native_p2wsh_address.scriptpubkey = script_pub_key.to_hex # 
puts "\n Destination (Native P2WSH) Address: #{native_p2wsh_address.addr} \n\n"
```

Example:

SegWit Native P2WSH Address: **bc1qhe8n322l05p35lu2p6g9vgerh93xlsatghmat9mxuctgpzcudqssd2xcyt**

Transaction funding Native P2WSH Address:

```ruby
# (origin) private key in wif compressed format:"
@wif = "KxUkvjMRkesgTmRY8mdXQdrTfB7LvmGeSMXp4WyBLCp8gUgHQUFC" # address = 16xgoSrGkG3z6eddGr3m4iqoBDTFWuV6J4
@user_key = BTC::Key.new(wif:@wif)
prev_out = "8088b36e51d8dfad24af9d8b4dcf8624eff9d2c678caf74c7f2c93819918c4a9"
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
puts "Hex transaction:"
puts tx.to_hex
```

Transaction spending from Native P2WSH Address:

```ruby
include Bitcoin::Builder
include Bitcoin::Protocol
include Bitcoin::Secp256k1

prev_out = "cb2f672c5f5ca91c67fb610972b18b5a2514725ff48586b06569b325c6921044"
prev_out_index = 0
value = 85000
script_pubkey = script_pub_key.to_hex.htb
fee = 15000
@destination_address = "1Bwyn5f5EvUPazh3H2rns6ENjTUYnK9ben"
user_key = Bitcoin.open_key("25940addfaec25439d348186e30976d8f1aaeb3da976cad59cb7fb2cf7f7b2d9") # <- privkey in hex
escrow_key = Bitcoin.open_key("4b5d5ef7b85148cff94fcacbc6019fc41313be6a88a267a9a84b890872d6975c")

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

tx = Bitcoin::Protocol::Tx.new(spend_tx.to_payload) # initial (unsigned) transaction
sig_hash0 = tx.signature_hash_for_witness_input(0, script_pubkey, value, witness_script.to_payload, Tx::SIGHASH_TYPE[:all])
sig0 = Bitcoin::Secp256k1.sign(sig_hash0, user_key.private_key.to_hex.htb) + [Bitcoin::Protocol::Tx::SIGHASH_TYPE[:all]].pack("C")
sig1 = Bitcoin::Secp256k1.sign(sig_hash0, escrow_key.private_key.to_hex.htb) + [Bitcoin::Protocol::Tx::SIGHASH_TYPE[:all]].pack("C")
tx.in[0].script_witness.stack << '' # won't work without this line, don't ask me why
tx.in[0].script_witness.stack << sig0
tx.in[0].script_witness.stack << sig1
tx.in[0].script_witness.stack << witness_script.to_payload
tx.to_witness_payload.bth
```
Example of transaction spending from a P2WSH address:
[42b2c123ed8b96b26d5442d181cb6dd8c5403340e46d16e6ec6784a1d50f82f5](https://blockchain.info/tx/42b2c123ed8b96b26d5442d181cb6dd8c5403340e46d16e6ec6784a1d50f82f5)

**P2SH-P2WPKH Address**

A P2SH-P2WPKH address should be used when only one compressed public key is used to receive payment ( like a standard P2PKH address ).

Because the P2SH-P2WPKH address looks like a regular P2SH address, it can be used to create a segwit utxo from a wallet that is not segwit-ready.

Like native segwit addresses, segwit outputs nested in P2SH addresses like P2SH-P2WPKH addresses use the same public key format as P2PKH and require the public key be compressed.

The P2SH redeemScript is always 22 bytes. It starts with a OP_0, followed by a canonical push of the keyhash (i.e. 0x0014{20-byte keyhash}):
0 <hash160(compressed public key)>

Example:
Public Key: 02f118cc409775419a931c57664d0c19c405e856ac0ee2f0e2a4137d8250531128
SegWit P2SH-P2WPKH Address: 3Mwz6cg8Fz81B7ukexK8u8EVAW2yymgWNd


**P2SH-P2WSH Address**

tdjetyj jhtydj



Further information can be found here:

[bitcoinscri.pt](http://bitcoinscri.pt)

[bitcoincore.org/en/segwit_wallet_dev](https://bitcoincore.org/en/segwit_wallet_dev/)
