function Person(name, foods) {
    this.name= name;
    this.foods= foods;
}

Person.prototype.fetchFavFoods = () => 
new Promise((resolve, reject)=> {
    //Simulate an API
    setTimeout(()=> resolve(this.foods), 2000);
})

describe('mocking learning', ()=> {
    it('mocks a reg function', ()=> {
        const fetchDogs = jest.fn();
        fetchDogs('snickers');
        expect(fetchDogs).toHaveBeenCalled();
        expect(fetchDogs).toHaveBeenCalledWith('snickers');
        fetchDogs('hugo');
        expect(fetchDogs).toHaveBeenCalledTimes(2);
    })
})