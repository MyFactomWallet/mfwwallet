// const Buffer = require('safe-buffer').Buffer
const fctUtils = require('factomjs-util')
const bip44 = require('factombip44')

const MAX_ADDRESSES = 10

/**
 * A wallet contains up to MAX addresses
 */
function Wallet () {
  this.hdWallet = null
  this.numberOfFctAddresses = 0
  this.addresses = []
  this.mnemonic = ''
}

/**
 * Wallet with random Mnemonic
 * @return {Wallet}
 */
function newRandomWallet () {
  var w = new Wallet()
  var mnemonic = bip44.randomMnemonic()
  w.hdWallet = new bip44.FactomBIP44(mnemonic)
  w.mnemonic = mnemonic
  w.init()

  return w
}

/**
 * Wallet from mnemonic
 * @param  {string} mnemonic 12 words
 * @return {Wallet}
 */
function newWalletFromMnemonic (mnemonic) {
  var w = new Wallet()
  w.hdWallet = new bip44.FactomBIP44(mnemonic)
  w.mnemonic = mnemonic
  w.init()

  return w
}

/**
 * Returns the seed
 * @return {string} Seed
 */
Wallet.prototype.getSeed = function () {
  return this.mnemonic
}

/**
 * Builds the map of public addresses for signing
 */
Wallet.prototype.init = function () {
  for (var i = 0; i < MAX_ADDRESSES; i++) {
    this.addresses[this.getFactoidAddress(i).HumanReadable] = i
  }
}

/**
 * Returns the address at given index
 * @param  {int} index     Choose the address to return
 * @return {fctUtils.Address}       Address
 */
Wallet.prototype.getFactoidAddress = function (index) {
  if (index + 1 > this.numberOfFctAddresses) {
    this.numberOfFctAddresses = index + 1
  }

  return getAddress(this.hdWallet.generateFactoidPrivateKey(0, 0, index))
}

/**
 * Signs a fctUtils.Transaction if this wallet has the private keys
 * @param  {fctUtils.Transaction } transaction
 */
Wallet.prototype.sign = function (transaction) {
  for (var i = 0; i < transaction.Inputs.length; i++) {
    var index = -1
    index = this.addresses[transaction.Inputs[i].HumanReadable]
    if (index !== -1) {
      transaction.sign(this.hdWallet.generateFactoidPrivateKey(0, 0, index))
    }
  }
}

function getAddress (priv) {
  var pub = fctUtils.privateKeyToPublicKey(priv)
  var add = fctUtils.publicFactoidKeyToHumanAddress(pub)

  return new fctUtils.Address(add, 0, true)
}

module.exports = {
  newRandomWallet,
  newWalletFromMnemonic,
  Wallet
}
