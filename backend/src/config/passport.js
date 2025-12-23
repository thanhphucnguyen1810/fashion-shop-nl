import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import User from '~/models/user.model.js'
import { env } from './environment'

// ================= GOOGLE LOGIN ==================
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value
        const avatarUrl = profile.photos?.[0]?.value
        let user = await User.findOne({ email })

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            avatar: {
              url: avatarUrl,
              public_id: 'google_avatar'
            },
            password: Math.random().toString(36).slice(-8)
          })
        }

        return done(null, user)
      } catch (err) {
        return done(err, null)
      }
    }
  )
)


// ================= FACEBOOK LOGIN ==================
passport.use(
  new FacebookStrategy(
    {
      clientID: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
      callbackURL: env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'emails', 'name', 'displayName', 'photos']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `facebook_${profile.id}@no-email.com`
        const avatarUrl = profile.photos?.[0]?.value
        let user = await User.findOne({ email })

        if (!user) {
          user = await User.create({
            name: profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`,
            email,
            avatar: {
              url: avatarUrl,
              public_id: 'facebook_avatar'
            },
            password: Math.random().toString(36).slice(-8)
          })
        }
        return done(null, user)
      } catch (err) {
        return done(err, null)
      }
    }
  )
)

export default passport
