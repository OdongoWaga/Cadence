const {forwardTo} = require('prisma-binding');
const {hasPermission} = require('../utils');

const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, ctx, info) {
        //check if theres a current User
        if(!ctx.request.userId) {
            return null;
        }
        return ctx.db.query.user({
            where: {id:ctx.request.userId},
        },info);
    },
    async users(parents, args, ctx, info) {
        //1. Check if they are logged in 
        if(!ctx.request.userId) {
            throw new Error('You must be logged in');
        }
        //2. Check if the user has prerequisite permissions
        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])

        //If they do query all the users!

        return ctx.db.query.users({}, info);
    },
    async order(parent, args, ctx, info) {
        //1. Make Sure they are logged in

        if(! ctx.request.userId) {
            throw new Error('You are not logged in!');
        }
        //2. Query the current order
        const order= await ctx.db.query.order ({
            where: {id: args.id},
        }, info);
        //3.Check if they have the permissions to see this order
        const ownsOrder = order.user.id === ctx.request.userId
        const hasPermissionToSeeOrder =
        ctx.request.user.permissions.includes('ADMIN');
        if(!ownsOrder || !hasPermission ) {
            throw new Error('You are barred from seeing this');
        }
        //4. Return the order
        return order;
    }

};

module.exports = Query;
