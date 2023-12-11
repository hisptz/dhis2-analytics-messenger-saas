Parse.Cloud.define("requestEmailVerification", async (request) => {
	const { username } = request.params ?? {};
	const userQuery = new Parse.Query(Parse.User);
	userQuery.equalTo("username", username);
	const user: Parse.User | undefined = await userQuery.first({
		useMasterKey: true,
	});

	if (!user) {
		throw new Parse.Error(
			Parse.Error.OBJECT_NOT_FOUND,
			`User with the username '${username ?? ""}' does not exist`,
		);
	}
	const email = user.getEmail();

	if (!email) {
		throw new Parse.Error(
			Parse.Error.EMAIL_MISSING,
			"The specified user does not have an email address",
		);
	}

	return await Parse.User.requestEmailVerification(email, {
		useMasterKey: true,
	});
});
