import { exec } from 'child_process'

export function generateWireGuardKeys() {
  return new Promise((resolve, reject) => {
    exec('wg genkey', (err, stdout) => {
      if (err) return reject(err)
      const privateKey = stdout.trim()

      exec(`echo "${privateKey}" | wg pubkey`, (err2, stdout2) => {
        if (err2) return reject(err2)
        const publicKey = stdout2.trim()
        resolve({ privateKey, publicKey })
      })
    })
  })
}
