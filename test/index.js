var assert = require('assert')
var mfwwallet = require('../index.js')
const Buffer = require('safe-buffer').Buffer
const fctUtils = require('factomjs-util')
const bip44 = require('factombip44')

describe('create wallet', function () {
  it('A wallet should be created', function () {
    var w = mfwwallet.newRandomWallet()
    assert.equal(w !== null, true)
  })
})

describe('mnemoics are correct', function () {
  it('Checking certain mnemoics', function () {
    var mn = 'yellow yellow yellow yellow yellow yellow yellow yellow yellow yellow yellow yellow'
    var w = mfwwallet.newWalletFromMnemonic(mn)

    assert.equal(w.getSeed(), 'yellow yellow yellow yellow yellow yellow yellow yellow yellow yellow yellow yellow')
    assert.equal(w.getFactoidAddress(1).HumanReadable, 'FA3heCmxKCk1tCCfiAMDmX8Ctg6XTQjRRaJrF5Jagc9rbo7wqQLV')
  })

  it('Checking random mnemoics', function () {
    var w = mfwwallet.newRandomWallet()
    assert.equal(bip44.validMnemonic(w.getSeed()), true)
  })
})

describe('Checking Transactions', function () {
  it('Signing a transaction', function () {
    var mn = 'yellow yellow yellow yellow yellow yellow yellow yellow yellow yellow yellow yellow'
    var w = mfwwallet.newWalletFromMnemonic(mn)

    var t = new fctUtils.Transaction()

    // Input
    // FA22de5NSG2FA2HmMaD4h8qSAZAJyztmmnwgLPghCQKoSekwYYct
    // FA3heCmxKCk1tCCfiAMDmX8Ctg6XTQjRRaJrF5Jagc9rbo7wqQLV

    // Output
    // Fs1SRRmtf2tGDJWgCbN72GfdNkKAoW1GjpmSbmkUFkYqrUxbztrn
    // FA2bEwF9UB2WCYhqPXxKknHyxoju4g6Uwoa7jw3cHCfQuPNz75yo
    // 521c0cd8593ad315fcd13e34f7a647af85d9db5c939b396fe844e4440aeddf14

    t.addInput('FA22de5NSG2FA2HmMaD4h8qSAZAJyztmmnwgLPghCQKoSekwYYct', 5)
    t.addInput('FA3heCmxKCk1tCCfiAMDmX8Ctg6XTQjRRaJrF5Jagc9rbo7wqQLV', 5)

    t.addOutput('FA2bEwF9UB2WCYhqPXxKknHyxoju4g6Uwoa7jw3cHCfQuPNz75yo', 10)
    t.updateTime(1503275254039)
    w.sign(t)

    assert.equal(fctUtils.bufferToHex(t.MarshalBinary()), '0x02015e023001170201000508115f96ebb5e35a9c806de9cffe4c99455a0c5a1c448a1d2eb6d46abb7ea8e605e4571e13d3af400ad41a7e70134387d0f9b0bd5afc646213c0144043235bd3610a521c0cd8593ad315fcd13e34f7a647af85d9db5c939b396fe844e4440aeddf14014429b79161e22e9392caf03a9790c7c99d49c5f5377559db5316ad948fa4260a5c73e0cd42493a18cc8c171f229c3281985203ceffd99fa6be2763509b5982bbe318ec9c22ff4625036a57a89df4efe710554f98c647fea5ba5cccc00df2350501ee85769c8c487ad4d094f1be284b28d82e828e6697e5f22a7dd92223978a9cf9e93f8d691fe6ffca195e19b7ca68da1cdf9ff5db00146c540286ff67f2930b93f19dad49aa96480dcb6541884fb574514f22c46329ae7801d0764ce5d8f1e90b')
    assert.equal(t.Signatures.length, 2)
  })
})
