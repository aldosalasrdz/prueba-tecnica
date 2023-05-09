(async () => {
	const express = require("express");
	const port = 3000;
	const app = express();

	app.use(express.json());

	const { Sequelize, DataTypes } = require("sequelize");

	const sequelize = new Sequelize("prueba", "root", "example", {
		host: "localhost",
		dialect: "mysql",
	});

	// Modelo de Usuario
	const User = sequelize.define("Usuario", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		apellidos: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		usuario: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		contraseña: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});

	await sequelize.sync({ force: true });

	app.get("/api/usuarios/", async (req, res) => {
		const users = await User.findAll();
		res.json(users);
	});

	app.get("/api/usuarios/:id", async (req, res) => {
		const { id } = req.params;
		const user = await User.findByPk(id);
		if (user) {
			res.json(user);
		} else {
			res.status(404).json({
				message: "Usuario no encontrado",
			});
		}
	});

	app.post("/api/usuarios/", async (req, res) => {
		const { nombre, apellidos, usuario, contraseña } = req.body;

		const user = await User.create({
			nombre,
			apellidos,
			usuario,
			contraseña,
		});
		res.status(201).json({
			message: "Usuario creado exitosamente",
			user,
		});
	});

	app.put("/api/usuarios/:id", async (req, res) => {
		const { nombre, apellidos, usuario, contraseña } = req.body;
		const { id } = req.params;
		const user = await User.update(
			{
				nombre,
				apellidos,
				usuario,
				contraseña,
			},
			{
				where: {
					id,
				},
			},
		);
		res.json({
			message: "Usuario editado exitosamente",
			user,
		});
	});

	app.delete("/api/usuarios/:id", async (req, res) => {
		const { id } = req.params;
		const user = await User.destroy({
			where: {
				id,
			},
		});

		if (user) {
			res.json(user);
		} else {
			res.status(404).json({
				message: "Usuario no encontrado",
			});
		}

		res.json({
			id,
		});
	});

	app.listen(port, () => {
		console.log("Funciona");
	});
})();
