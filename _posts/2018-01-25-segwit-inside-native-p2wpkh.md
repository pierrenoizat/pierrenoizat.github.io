---
layout: post
title: Bitcoin, Segwit Inside, Part 1 - Native P2WPKH Addresses
date: 2018-01-25 00:40:51.000000000 +01:00
type: post
published: false
status: draft
categories:
- Bitcoin
- Economie
tags: []
meta:
  _edit_last: '1'
author:
  login: admin
  email: noizat@hotmail.com
  display_name: Boussac
  first_name: ''
  last_name: ''
---
Segwit, short for “seggregated witness”, is a foundational change in the way Bitcoin transactions  are built from inputs and outputs.

This article describes the way new segwit address types are designed and how developers can build transactions spending to and from these new addresses.

There are 4 new segwit address types, “native” or nested in a P2SH address: native P2WPKH, native P2WSH, P2SH-P2WPKH, P2SH-P2WSH.

Before we delve into the new address design, let’s first go over the two significant changes introduced by Segwit : adding input values in the transaction digest and segregating signatures from the transaction inputs.


**Transaction Inputs and Outputs**

Inputs of a spending transaction point to scripts in previous funding transactions where the coins are locked until the spending transaction is confirmed in the blockchain. 

Inputs describe the origin of the funds being transacted. Each input is made of a reference to a previous transaction output as well as all data required to unlock the coins.

In the case of coins locked in a standard P2PKH (“pay-to-public-key-hash”) address, such data, known as a transaction “scriptSig”, consist of a signature followed by the sighash type followed by the corresponding public key.

Outputs determine the destination of the funds being transacted.
Outputs of a transaction consist in an amount followed by a “scriptPubKey” i.e a Bitcoin script setting the conditions for the coins to be unlocked by a subsequent transaction.

Transaction inputs are signed by encrypting a transaction digest, called the “sighash”, with a private key. 
The input hash type of the sighash defines the parts of the transaction covered by the signature.
The default sighash type is SIGHASH_ALL, meaning the signature covers the entire set of inputs and ouputs but some use cases require different scopes defined by other sighash types.

Because signatures cannot exist before signing, for the computation of the sighash the input scriptSig is replaced by the input “scriptCode” . 
For a traditionnal P2PKH input, the scriptCode is simply the scriptPubKey of the previous output being spent:

`OP_DUP OP_HASH160 <pubkey_hash> OP_EQUALVERIFY OP_CHECKSIG`

In a non-segwit transaction, the input hash type is appended after the signature to qualify its scope.
In a segwit transaction, the input hash type is appended at the end of the sighash pre-image to prevent any tampering with it.

Once signed, non-segwit transactions are identified by a txid that is a double SHA256 hash of the entire signed transaction message. 


**New Transaction Digest**

A new transaction digest algorithm is defined which includes the amount of each input so that an off-line signing device can safely sign a transaction amount without the need to check the blockchain. 
With a non-segwit transaction, an off-line device would have no way to know the input value, potentially paying excessive network fees if the amount being spent were set too low.


**Segregating signatures**

The most significant change introduced by segwit though is the removal of the signature scripts from the inputs ; signature scripts are now “seggregated” in a new section of the segwit transaction called the witness.


Because ECDSA, the signature algorithm used in Bitcoin, uses a random nonce in the  computation of a signature, a rogue signer can produce multiple valid signatures for the same input.
As a result, the attacker can produce two equally valid versions of the same transaction, each with a distinct transaction ID if signatures are included in the inputs (txins):

`txid = SHA256(SHA256(nVersion|txins|txouts|nLockTime)`

This issue had been identified early on as the “ transaction malleability” problem and is now solved by segwit.
With segwit, the original transaction format does not include signatures (in the “txins” section of the transaction) so that the txid is no longer malleable.
After segwit, txid, the transaction ID, remains the primary identifier of the transaction in the Bitcoin blockchain.

The witness is appended to the end of the segwit transaction, just before the last element of the transaction which is its locktime.

The locktime can be used in a scriptPubKey to specify that the transaction can only be included in the blockchain after the time and date matching the locktime.


**Native P2WPKH Address**

Unlike nested segwit addresses (P2SH-P2WPKH or P2SH-P2WSH), one cannot send from a legacy wallet to a native segwit address. Wallets need to upgrade for support of native segwit addresses. This is one of the main reason segwit addoption has been slow and is now gaining momentum as more and more Bitcoin wallets (wallet applications or hosted wallets) implement segwit.

Native P2WPKH (stands for Pay-To-Witness-Public-Key-Hash) addresses are Bech32-encoded according to BIP143 and BIP173: they start with a human-readable part "bc" for Bitcoin mainnet, and "tb" for testnet, followed by “1” as a separator then the data that can be up to 87 characters long with the last six characters of the data part forming a checksum and containing no information.

The acronym Bech32 stems from BCH code checksum and base 32 encoding. BCH stands for Bose–Chaudhuri–Hocquenghem: these error-correcting codes were invented in 1959 by French mathematician A. Hocquenghem. 

Native P2WPKH addresses use the same public key format as P2PKH, with a very important exception: the public key used in P2WPKH MUST be compressed, i.e. 33 bytes in size, and starting with a 0x02 or 0x03.

The P2WPKH scriptPubKey is always 22 bytes. 
It starts with a OP_0, followed by a canonical push of the keyhash (i.e. 0x0014{20-byte keyhash}).
The keyhash is RIPEMD160(SHA256) of the compressed public key.

Here is a code snippet in ruby to illustrate for developers:

```ruby
require 'btcruby'
require 'bitcoin'
require 'bech32'
require 'segwit_addr'
require 'active_support'
require 'active_support/core_ext'
BTC::Network.default= BTC::Network.mainnet
puts "\n Enter public key in hex format:"
public_key = STDIN.gets.chomp # public_key MUST be compressed
```
Calculation of Native P2WPKH Address:

```ruby
p2pkh_address = BTC::PublicKeyAddress.new(public_key: public_key.htb)
script_pub_key = BTC::Script.new << BTC::Script::OP_0 << p2pkh_address.hash

native_p2wpkh_address = SegwitAddr.new
native_p2wpkh_address.hrp = 'bc' # hrp = human-readable part
native_p2wpkh_address.scriptpubkey = script_pub_key.to_hex
puts "\n Native P2WPKH Address: #{native_p2wpkh_address.addr} \n\n"
```

Example:

Public Key: 02530c548d402670b13ad8887ff99c294e67fc18097d236d57880c69261b42def7

SegWit Native P2WPKH Address: **bc1qg9stkxrszkdqsuj92lm4c7akvk36zvhqw7p6ck**

Transaction spending from Native P2WPKH Address:

```ruby
include Bitcoin::Builder

puts "\n Enter private key in hex format:"
hex_priv_key = STDIN.gets.chomp
destination_address = "1FiwwBm4KApZX1mHqxtxKniuL419o5icCC"
# previous txid:
prev_out="6e3a1a465405e242d30379a314fcb3f105df756f4c4ba4831a79a45af1a4f2cd"
prev_out_index = 0 # index of unspent output (utxo) in above tx
value = 2425000 # value of utxo in satoshis
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

Disclaimer: use above code at your own risk. You must know what you are doing before broadcasting any transaction on mainnet. Be particularly careful when setting value and fee in order not to lose funds.

Special thanks to Pieter Wuille who first proposed Segwit.

Thanks to Oleg Andreev ([btcruby](https://github.com/oleganza/btcruby)), Julian Langschaedel ([bitcoin-ruby](https://github.com/lian/bitcoin-ruby)) and Shigeyuki Azuchi ([Bech32](https://github.com/azuchi/bech32rb/tree/master/lib)) for publishing the great open source libraries used in the above code snippets.

My next post (part 2 of 4) will deal with Native P2WSH Addresses, 3 with P2SH-P2WPKH and 4 finally with P2SH-P2WSH.

Further information can be found here:

[bitcoinscri.pt](http://bitcoinscri.pt)

[bitcoincore.org/en/segwit_wallet_dev](https://bitcoincore.org/en/segwit_wallet_dev/)
