'use strict'

const hooks = require('../hooks')

describe('Settings menu', () => {
  hooks.createApp.bind(this)()

  before(() => {
    return hooks.beforeBlock.bind(this)()
  })

  after(() => {
    return hooks.afterBlock.bind(this)()
  })

  describe('setting to play sound', () => {
    const playSoundSelector = 'md-switch[aria-label="Play sound when receiving transactions?"]'

    before(() => {
      this.app.client.addCommand('clickPlaySound', () => {
        return this
          .openSettingsMenu()
          .click(playSoundSelector)
          .pause(1000)
      })

      this.app.client.addCommand('getPlaySoundState', () => {
        return this.getAttribute(playSoundSelector, 'aria-checked')
      })
    })

    context('when is clicked', () => {
      let wasEnabled

      before(() => {
        return this.app.client.getLocalStorage('storage-mainnet')
          .then(storage => {
            wasEnabled = storage.playFundsReceivedSound
            return this.app.client.clickPlaySound()
          })
      })

      it('toggles the button', () => {
        const isEnabled = this.app.client.getPlaySoundState()
        if (wasEnabled) {
          return (isEnabled).should.not.be
        } else {
          return (isEnabled).should.equal('true')
        }
      })

      it('stores the new state inmediatly', () => {
        return this.app.client.getLocalStorage('storage-mainnet')
          .then(storage => {
            if (wasEnabled) {
              return (storage).should.not.have.key('playFundsReceivedSound')
            } else {
              return (storage.playFundsReceivedSound).should.be.true
            }
          })
      })
    })
  })
})
