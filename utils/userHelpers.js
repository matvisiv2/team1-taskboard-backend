const adminTypes = [
	process.env.USER_TYPE_ADMIN || '1',
	process.env.USER_TYPE_SUPERADMIN || '2',
];

const isAdmin = (user) => {
	if (!user) return false;
	return adminTypes.includes(String(user.userType));
};

module.exports = { adminTypes, isAdmin };
