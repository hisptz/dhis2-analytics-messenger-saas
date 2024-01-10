import Parse from "parse/node";
import logger from "../services/logging";
import { config } from "dotenv";

config();
/*
 *
 * This is assumed these env variables are passed from the respective service
 * */
Parse.initialize(
	process.env.AUTH_APP_ID ?? "DAM-AUTH",
	"",
	process.env.AUTH_MASTER_KEY ?? "MasterKey",
);
Parse.serverURL = process.env.AUTH_SERVER_URL ?? "http://localhost:3000/api";

export async function initializeAdmin() {
	logger.info(`Initializing default users & roles`);
	//Check if role admin does not exist
	const roleQuery = new Parse.Query(Parse.Role).equalTo("name", "admin");
	const adminRole = await roleQuery.first({
		useMasterKey: true,
	});

	if (adminRole) {
		logger.info(`Admin role exists...`);
		//Check if admin user exists
	} else {
		logger.info(`Initializing admin role...`);
		const acl = new Parse.ACL();
		acl.setPublicReadAccess(true);
		const role = new Parse.Role("admin", acl);
		await role.save(null, {
			useMasterKey: true,
		});
		logger.info(`Done. `);
	}

	const userQuery = new Parse.Query(Parse.User).equalTo("username", "admin");
	const adminUser = await userQuery.first({
		useMasterKey: true,
	});
	if (adminUser) {
		logger.info(`Admin user exists...`);
		return;
	}

	//Initialize an admin role and a default admin user;
	const role = await new Parse.Query(Parse.Role)
		.equalTo("name", "admin")
		.first({ useMasterKey: true });
	logger.info(`Initializing admin user...`);
	const user = new Parse.User();
	user.setUsername("admin");
	user.set("fullName", "Admin");
	user.setEmail(process.env.AUTH_ADMIN_EMAIL);
	user.setPassword(process.env.AUTH_INITIAL_PASSWORD);
	await user.save(null, {
		useMasterKey: true,
	});
	logger.info(`Done. `);
	logger.info(`Adding admin role to admin user...`);
	role.getUsers().add(user);
	await role.save(null, {
		useMasterKey: true,
	});
	logger.info(`Done. `);
	logger.info(`Default initialization complete`);
}

export default Parse;
