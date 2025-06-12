import bcrypt from 'bcrypt'


export async function hashPasswd(passwd) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(passwd, salt)
  return { hash, salt }
}

export async function verifyPasswd(passwd, hash, salt) {
  const newHash = await bcrypt.hash(passwd, salt)
  return newHash === hash
}