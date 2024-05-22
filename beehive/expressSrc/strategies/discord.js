const passport = require('passport');
const { Strategy } = require('passport-discord');
const DiscordUser = require('../database/schemas/DiscordUser');

passport.serializeUser((user, done) => {
    
    console.log('Serializing User...');
    console.log(user);
    done(null, user.id);

});

passport.deserializeUser(async(id, done) => {

    console.log('Deserializing User...');
    console.log(id);
    try {
        const user = await DiscordUser.findById(id);
        if (!user) throw new Error('User not found');
        console.log(user);
        done(null, user);
    } catch(err) {
        console.log(err);
        done(err, null);
    }
});

async function discordVerifyFunc(accessToken, refreshToken, profile, done) {
    
        const { id: discordId } = profile;
        console.log(accessToken, refreshToken);
        console.log(profile);
        try {

            const discordUser = await DiscordUser.findOne({ discordId: profile.id});

            if (discordUser) {
                console.log('Found user: ${discordUser}');
                return done(null, discordUser);

            } else {

                const newUser = await DiscordUser.create({ discordId });
            console.log('Created User: ${newUser}')
            return done(null, newUser);
        }

        } catch (err) {
            console.log(err);
            return done(err, null);
        }
}

passport.use(new Strategy({
    clientID:'1158904899241779291',
    clientSecret: 'Y7dudNdlHPShVqv7VkaAkN7gwoPCcleA',
    callbackURL: 'http://localhost:3001/api/v1/auth/discord/redirect',
    scope: ['identify'], 
    }, 
        discordVerifyFunc
    )
);

module.export = { discordVerifyFunc };