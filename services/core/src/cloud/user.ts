Parse.Cloud.beforeSave(Parse.User, async (request) => {
	const { object, original } = request;
	if (original) {
		return;
	}
	const newACL = new Parse.ACL();
	newACL.setRoleReadAccess("admin", true);
	newACL.setRoleWriteAccess("admin", true);
	object.setACL(newACL);
});
