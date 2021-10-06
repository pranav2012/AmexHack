const router = require("express").Router();
const bcrypt = require("bcryptjs");
require("dotenv").config();

//Models
const userModel = require("../models/userModel");

// Services
const userService = require("../service/userServices");
const utilService = require("../service/utilService");


// Signup route for User in MONGOdb
router.post("/signup", async (req, res) => {
	try {
		var { name, email, password } = req.body;

		// UUID --> Every Bank will generate this UUID for every user-

		var check = await utilService.findByEmail(email, userModel);

		if (check == null || Object.keys(check).length) {
			res.send({ success: false, message: "User already exists" });
		} else {
			const hashedPassword = await utilService.hashUtil(password);

			if (hashedPassword == false) {
				res.send({ success: false, message: "Error in /user/signup" });
			} else {
				var modelData = {
					name: name,
					password: hashedPassword,
					email: email,
					createdAt: new Date(),
				};

				modelData.password = hashedPassword;

				var resp = await userService.createUser(modelData);

				if (resp.success == true) {
					res.send({ success: true, message: "Account created successfully" });
				} else {
					res.send({ success: false, message: resp.message });
				}
			}
		}
	} catch (err) {
		console.log(err, "\nError in signup\n");
		res.send({ success: false, message: err });
	}
});

// router.post("/userdetails", async (req, res) => {
// 	try {
// 		let resp = await utilService.findByEmail(req.body.id);

// 		if (resp == null || resp == {}) {
// 			res.send({ success: false, message: "No Such User" });
// 		} else {
// 			res.send({ success: true, message: resp });
// 		}
// 	} catch (err) {
// 		res.send({ success: false, message });
// 	}
// });


// Signup route for User in MONGOdb
router.post("/login", async (req, res) => {
	try {
		var { email, password } = req.body;

		var check = await utilService.findByEmail(email, userModel);
		// console.log(check);

		if (check == null || check == undefined || Object.keys(check).length == 0) {
			res.send({
				success: false,
				message: "No account found with that email Id",
			});
		} else {
			var resp = await utilService.findByCredentials(
				email,
				password,
				userModel
			);
			// console.log(resp);

			const validPassword = await bcrypt.compare(
				req.body.password,
				resp.password
			);

			if (!validPassword) {
				res.send({ success: false, message: "Invalid Credentials" });
			} else {
				if (Object.keys(resp).length > 0) {
					res.send({ success: true, message: "You are Logged in" });
				} else {
					res.send({ success: false, message: "Invalid Credentials" });
				}
			}
		}
	} catch (err) {
		console.log(err, "\nError in login\n");
		res.send({ success: false, message: err.message });
	}
});

module.exports = exports = {
	router,
};
