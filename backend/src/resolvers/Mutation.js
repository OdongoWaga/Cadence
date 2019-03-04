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

    }
};

module.exports = Mutations;
