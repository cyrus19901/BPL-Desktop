module.exports = (app) => {
  app.client.addCommand('getLocalStorage', (key) => {
    return this.localStorage('GET', key)
      .then(data => JSON.parse(data.value))
  })

  app.client.addCommand('setLocalStorage', (key, value) => {
    return this.localStorage('POST', { key: key, value: JSON.stringify(value) })
  })

  app.client.addCommand('openSettingsMenu', (network) => {
    return this.click('[aria-label="Settings"] button')
      .pause(500)
  })

  app.client.addCommand('createNetwork', (network) => {
    // Manage Networks
    // New
    // Name + Seed Server
    // return this.click('[aria-label="Switch Network"] button')
    //   .pause(500)
    //   .click("//button[contains(text(), '"+network+"')]")
    //   .pause(500)
  })
}
