import { default as jwt,  JwtHeader } from 'jsonwebtoken'
import { promisify } from 'util'
import { Auth0User } from '.'

import pubKeys from './pubKeys';

const getPublicKey = (header: JwtHeader, cb: Function): string => {
  const key = pubKeys.find(({kid}) => header.kid)
  return key ? cb(null, key) : cb(new Error())
} 
 
const decodeToken = async (token:string ): Promise<Auth0User> => {
  const verify = promisify(jwt.verify)
  const { payload } = await verify(token, getPublicKey) as { payload: Auth0User }
  return payload
}

export default decodeToken
