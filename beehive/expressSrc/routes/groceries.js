const { Router } = require('express');

const router = Router();

const groceryList = [

    {

        item: 'milk',
        quantity: 2,

    }, 
    
    {

        item: 'cereal',
        quantity: 2,

    },

    {

        item: 'pop-tarts',
        quantity: 1,

    },

];

router.use((req, res, next) => {

    console.log('Inside grocieries auth check middleware');
    console.log(req.user);
    if (req.user) {

        next();

    } else {

        res.send(401);

    }

});

router.get('/', (req, res) => {

    res.send(groceryList);

});

router.get('/:item', (req, res) => {
    console.log(req.cookies);
    const { item } = req.params;
    const groceryItem = groceryList.find((g) => g.item === item);
    res.send(groceryItem);

});

router.post('/', (req, res) => {

    console.log(req.body);
    groceryList.push(req.body);
    res.send(201);

});

router.get('/shopping/cart', (req, res) => {

    const { cart } = req.session;

    if (!cart) {

        res.send('You have no cart session');

    } else {

        res.send(cart);

    }

});

router.post('/shopping/cart/item', (req, res) => {

    const { item , quantity } = req.body;
    const cartItem = { item, quantity };
    const { cart } = req.session;
    if (cart) {

        req.session.cart.items.push(cartItem);

    } else {

        req.session.cart = {

            items: [cartItem]

        };

    }

    res.send(201);

});

module.exports = router;