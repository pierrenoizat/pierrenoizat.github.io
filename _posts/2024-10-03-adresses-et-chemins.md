---
layout: post
title: Adresses et chemins
date: 2024-09-29 00:40:51.000000000 +01:00
type: post
published: true
status: draft
categories:
- Bitcoin
- altcoins
tags: [wallets, chemins de dérivation, déterministe, seed]
meta:
  _edit_last: '1'
author:
  login: admin
  email: noizat@hotmail.com
  display_name: Boussac
  first_name: 'Pierre'
  last_name: 'Noizat'
---

La [chasse au trésor](https://bitcoin.fr/chasse-au-tresor/) lancée le 15 août 2024 vise à trouver 24 mots donnant accès aux fonds disponibles sur l'adresse [bc1q8zfy6wvvtskzkg4s343x42pyf363nmejspgc02](https://blockchair.com/bitcoin/address/bc1q8zfy6wvvtskzkg4s343x42pyf363nmejspgc02).

21 parmi les 24 mots donnant accès au trésor sont dans [ce livre](https://www.fnac.com/a20625698/Pierre-Noizat-L-energie-face-cachee-de-la-monnaie):

<div><a href="https://bitcoinbook.shop/products/lenergie-face-cachee-de-la-monnaie?Format=Paperback"><img src="{{ site.baseurl }}/assets/Image_BitcoinFr_Chasse_au_tresor.png" width='500'></a></div>

_Image: bitcoin.fr_

Mais comment passe t on d'une phrase de passe mnémonique de 24 mots à une adresse Bitcoin ?
Plus précisément, comment trouve t on la clé privée d'une adresse à partir d'une phrase mnémonique ?

Tout d'abord, une empreinte numérique (hash) de la phrase mnémonique est calculée: c'est ce qu'on appelle la "seed" qui servira de base au calcul des adresses d'un wallet dit déterministe.
Il faut garder à l'esprit qu'un wallet Bitcoin n'est rien d'autre qu'un répertoire d'adresses et que ces adresses peuvent être générées d'au moins deux façons: soit au hasard et on a affaire alors à un wallet "aléatoire" (exemple: Bitcoin Core), soit à partir d'un secret unique (seed) et c'est alors un wallet déterministe (exemples: Electrum, Ledger, Trezor).

Dans un wallet déterministe, les adresses constituent les feuilles d'un arbre qui part de la seed.
Autrement dit, si vous partez de la racine-seed et cherchez à retrouver une adresse-feuille, il vous faut connaître les branches à parcourir. A défaut vous vous perdrez car il y a une quasi infinité d'adresses qui peuvent être générées à partir d'une seule seed.
L'arborescence des adresses est potentiellement sans limite.
Le chemin qui relie une adresse à la seed est appelé chemin de dérivation.

C'est pourquoi les wallets déterministes  doivent être transparents sur la façon dont ils dérivent les adresses afin de faciliter la récupération des fonds à partir de la phrase mnémonique.

Il y a plusieurs BIPs (Bitcoin Improvement Proposals, l'équivalent des RFC pour Internet) qui font des recommandations pour le calcul des chemins de dérivation: BIP 39, 43, 44, 49 et 84.

Ce qu'il faut retenir c'est que la phrase mnémonique ne doit contenir que des mots pris dans une liste de mots normalisée ([BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt)).

Il existe aussi une syntaxe normalisée pour décrire les chemins de dérivation afin de faciliter la compatibilté entre les wallets et leur restauration à partir d'un secret sur un nouveau support en cas de perte d'un support:

**m / purpose' / coin_type' / account' / change / index**

**m** désigne la clé privée étendue master dérivée de la seed. C'est la racine à laquelle sont rattachées toutes les adresses-feuilles de l'arborescence.

**purpose** caractérise le wallet, notamment, pour les wallets déterministes Bitcoin, le type d'adresses générées:

BIP 44 : m/44'/0'/0' ( 1addresses legacy du type P2PKH )

BIP 49 : m/49'/0'/0' ( 3addresses segwit du type P2WPKH enveloppée dans une adresse P2SH )

BIP 84 : m/84'/0'/0' ( bc1addresses segwit natives, comme l'adresse qui fait l'objet de la chasse au trésor)

Autres exemples, MyEtherWallet utilise m’/44’/137’/0’/0 pour RSK Mainnet et m/44’/61’/0’/0 pour Ethereum Classic, alors qu'un hardware wallet comme Ledger prend une séquence arbitraire specifique pour Ethereum Classic: m/44’/60’/160720’/0.


**/** indique un changement de niveau dans l'arborescence.

**'** (ou h ) indique une adresse "durcie" (commençant à partir de l'index 2147483648 ).Par exemple, 3' signifie index 2147483648 + 3 = 2147483651
On peut dériver jusqu'à 4 294 967 296 d'adresses à partir d'une seule clé étendue.
La première moitié (index de 0 à 2147483647 )pour des adresses normales (calculables avec une clé publique étendue) et la seconde (index de 2147483648 à 4294967295) pour des adresses durcies (calculables seulement à partir d'une clé privée étendue).
Les adresses d'un wallet déterministe sont généralement normales. On peut ainsi générer ces adresses à partir d'une clé publique étendue sur une machine dédiée à recevoir des paiements sans exposer de clés privées sur cette machine.

**coin_type** indique quel coin est supporté par le wallet. Par exemple:

m/44'/0' = Bitcoin

m/44'/1' = Bitcoin (Testnet)

m/44'/2' = Litecoin

m/44'/3' = Dogecoin


**account** permet de créer différents coffres à partir de la même seed, coffres séparés dont les fonds ne seront pas mélangés.
Cela peut être utile pour respecter une ségrégation des fonds qui serait exigée par un superviseur ou un client.

**change** indique si l'adresse en question est destinée à recevoir des fonds venant d'un payeur (0 = "Receiving") ou bien à récupérer la monnaie en retour d'une transaction (1 = "Change")

**index** caractérise l'adresse (feuille) dans l'arborescence. Ce niveau permet de calculer la clé privée de l'adresse mais ne permet pas de générer une clé étendue (c'est à dire permettant de développer davantage l'arborescence). Il s'agit donc bien d'une feuille de l'arborescence (noeud final) et non d'un noeud intermédiaire.

Pour revenir à notre chasse au trésor, une fois la phrase mnémonique trouvée, il s'agira de calculer la clé privée de la première adresse (Segwit native) du wallet Bitcoin dérivé de la phrase en question.

Pour ce faire, on peut utiliser un wallet qui utilise les chemins de dérivations suivants

**chemin de dérivation du wallet déterministe: "m/84'/0'/0'"**

**chemin de dérivation de l’adresse recherchée dans ce wallet: "m/0/0"**

A défaut, voici le script Ruby qui permettrait de récupérer les fonds:

```ruby
require 'bitcoin'
require 'bip44'
include Bitcoin
include Bitcoin::Builder
include Bitcoin::Protocol
include Bitcoin::Util
include Bitcoin::Secp256k1
include Bech32

mnemonic = "search secret seed" # remplacer par la phrase mnémonique de 24 mots recherchée

seed = BipMnemonic.to_seed(mnemonic: mnemonic)

@btc_wallet = Bip44::Wallet.from_seed(seed, "m/84'/0'/0'") # wallet d'adresses Segwit native
@btc_node = @btc_wallet.sub_wallet "m/0/0" # chemin de dérivation de la première adresse du wallet
@btc_node.private_key # pour récupérer les fonds

public_key = Key.new(nil,@btc_node.public_key).pub_compressed
script_pubkey = Script.from_string("0 "+"#{hash160(public_key)}").to_payload
native_p2wpkh_address = SegwitAddr.new
native_p2wpkh_address.hrp = 'bc' # hrp = human-readable part
native_p2wpkh_address.script_pubkey = script_pubkey.bth
native_p2wpkh_address.addr # adresse Segwit P2WPKH native => "bc1q8zfy6wvvtskzkg4s343x42pyf363nmejspgc02"
```


Pour approfondir encore la question, voici des ressources utiles pour le calcul des chemins de dérivation: 

[walletsrecovery.org](https://walletsrecovery.org/)

[learnmeabitcoin.com/technical/keys/hd-wallets/derivation-paths](https://learnmeabitcoin.com/technical/keys/hd-wallets/derivation-paths/)

Ressource utile pour calcul (vérification) des adresses segwit P2WPKH native:
 
[e-ducat.fr/2018-01-31-segwit-inside-native-p2wpkh-fr](https://e-ducat.fr/2018-01-31-segwit-inside-native-p2wpkh-fr/)

Bon courage pour cette chasse au trésor !

PS: Note pour les experts 

Le tweet d'origine qui annonçait cette chasse au trésor précisait aussi "no checksum" car une phrase mnémonique standard comporte une "checksum".
En effet, un wallet déterministe standard commence par générer un secret généralement appelé "entropy" (allusion à la notion thermodynamique d'entropie) auquel il ajoute ensuite une "checksum". La phrase mnémonique est ensuite dérivée de l'"entropy" avec sa "checksum". La "checksum" est une information supplémentaire qui permet de vérifier que la phrase mnémonique a été correctement retranscrite.
Bien évidemment, comme le secret de départ est ici la phrase mnémonique et non le secret "entropy", il ne peut y avoir de checksum.
Greg Walker de learnmeabitcoin.com propose le code ruby suivant pour générer une phrase mnémonique au standard BIP39 avec checksum:

```ruby
require 'securerandom'
require 'digest'
require 'openssl'


bytes = SecureRandom.random_bytes(16) # 16 bytes = 128 bits
entropy = bytes.unpack("B*").join
puts "entropy: #{entropy}"

size = entropy.length / 32 # number of bits to take from hash of entropy (1 bit checksum for every 32 bits entropy)
sha256 = Digest::SHA256.digest([entropy].pack("B*")) # hash of entropy (in raw binary)
checksum = sha256.unpack("B*").join[0..size-1] # get desired number of bits
puts "checksum: #{checksum}"

full = entropy + checksum # combine
puts "combined: #{full}"

pieces = full.scan(/.{11}/) # Split in to strings of 11 bits

wordlist = File.readlines("wordlist.txt") # Get the wordlist as an array

puts "words:" # Convert groups of bits to array of words
sentence = []
pieces.each do |piece|
  i = piece.to_i(2)   # convert string of 11 bits to an integer
  word = wordlist[i]  # get the corresponding word from wordlist
  sentence << word.chomp # add to sentence (removing newline from end of word)
  puts "#{piece} #{i.to_s.rjust(4)} #{word}"
end

mnemonic = sentence.join(" ")
puts "mnemonic: #{mnemonic}"


passphrase = "" # can leave this blank
puts "passphrase: #{passphrase}"

password = mnemonic
salt = "mnemonic#{passphrase}" # "mnemonic" is always used in the salt with optional passphrase appended to it
iterations = 2048
keylength = 64
digest = OpenSSL::Digest::SHA512.new

result = OpenSSL::PKCS5.pbkdf2_hmac(password, salt, iterations, keylength, digest) # password, salt, iter, keylen, digest
seed = result.unpack("H*")[0] # convert to hexadecimal string
puts "seed: #{seed}"
```
