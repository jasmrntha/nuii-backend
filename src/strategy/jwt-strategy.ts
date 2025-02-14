/* eslint-disable import/no-default-export */
/* eslint-disable unicorn/prefer-export-from */
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT } from '../config/jwt.config';
import { Accounts } from '../repositories';

const jwtStrategy = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT.JWT_SECRET,
  },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (payload, done) => {
    const email = payload.email;
    const user = await Accounts.findAccountByEmail(email);

    if (user) {
      return done(null, user);
    }

    return done(null, false);
  },
);

passport.use(jwtStrategy);

export default passport;
