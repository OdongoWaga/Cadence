const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const Mutations = {

    async createItem(parent, args, ctx, info) {
        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            },
        }, info);
        console.log(item);
        return item;
    },

    updateItem(parent, args, ctx, info) {
        // take a copy of the updates
        const updates ={...args};

        //remove the ID from updates
        delete updates.id;
        //run the update method
        return ctx.db.mutation.updateItem({
            data:updates,
            where: {
                id:args.id,
            },
        })
    },
    async deleteItem(parents, args, ctx, info) {
         const where= {id: args.id};
         //1.find the item
         const item= await ctx.db.query.item({ where}, `{id title}`);
         //2.Check if they are the owner of have the necessary permissions
         //to be done
         //3. Delete It
         return ctx.db.mutation.deleteItem({where}, info);

    },
    async signup(parent, args, ctx, info) {
        //lowercase email
        args.email=args.email.toLowerCase();
        //hash the password
        const password= await bcrypt.hash(args.password, 10);
        //instantiate on the database
        const user= await ctx.db.mutation.createUser(
            {
                data: {
                    ...args,
                    password,
                    permissions: {set: ['USER']},

                },
            }, info
        );
       //create the JWT for the user 
       const token = jwt.sign({ userId:user.id}, process.env.APP_SECRET);
       //We set the jwt as a cookie on the response
       ctx.response.cookie('token', token, {
           httpOnly: true,
           //maximum age in milliseconds
           maxAge: 1000*60*60*24*365
       });
       //finally return the user to the browser

       return user;
    },
    async signin(parent, {email, password}, ctx, info) {
        // 1.Check if user email exists
        const user =await ctx.db.query.user({ where: {email}});
        if(!user) {
            throw new Error(`No such user found for email ${email}`);
        }
        //2. Check if password provided is correct
        const valid = await bcrypt.compare(password, user.password);

        if(!valid) {
            throw new Error('Invalid Password!');
        }
        //3. generate the JWT
        const token = jwt.sign({ userId:user.id}, process.env.APP_SECRET);
        //4.Set cookie with the token
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000*60*60*24*365,
        });
        //5. Return the user
        return user;
    }
};

module.exports = Mutations;
