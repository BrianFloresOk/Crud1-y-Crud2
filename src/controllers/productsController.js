const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeProducts = (data) => fs.writeFileSync(productsFilePath, JSON.stringify(data), "utf-8");


const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let productId = +req.params.id
		let product = products.find(product => product.id === productId)
		res.render('detail', {
			product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form',{})
	},
	
	// Create -  Method to store
	store: (req, res) => {
		let lastID = 0;
		products.forEach(product => {
			if(product.id > lastID)
			lastID = product.id
		});

		let newProduct = {
			id: lastID + 1,
			name: req.body.name,
			price: +req.body.name,
			discount: +req.body.discount,
			category: req.body.category,
			description: req.body.description,
			image: req.file ? req.file.filename : "default-image.png",
		}
		products.push(newProduct)
		writeProducts(products)

		res.send(`El producto ${req.body.name} a sido creado exitosamente`)
	},

	// Update - Form to edit
	edit: (req, res) => {
		let productId = +req.params.id;
		let product = products.find(product => product.id === productId)
		res.render('product-edit-form', {
			product
		})
	},
	// Update - Method to update
	update: (req, res) => {
		let productId = +req.params.id;
		products.forEach(product => {
			if(product.id === productId){
				product.name = req.body.name
				product.price = +req.body.price
				product.discount = +req.body.discount
				product.category = req.body.category
				product.description = req.body.description
			}
		})
		writeProducts(products)
		res.send(`Producto ${req.body.name} exitosamente`)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let productId = +req.params.id;
		products.forEach(product => {
			if(product.id === productId){
				let productToDeleteIndex = products.indexOf(product);
				products.splice(productToDeleteIndex, 1)
			}
		})

		writeProducts(products)
		res.redirect('/products')
	}
};

module.exports = controller;