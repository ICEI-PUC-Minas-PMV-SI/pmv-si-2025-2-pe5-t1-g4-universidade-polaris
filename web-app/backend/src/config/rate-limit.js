
const rate_limit_options = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	skip: (req) => {
		return req.path === '/api/health';
	},
	message: 'Too many requests from this IP, please try again later.',
	statusCode: 429,
};

const login_rate_limit_options = {
	windowMs: 15 * 60 * 1000,
	limit: 8,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	message: 'Too many login attempts, please try again after 15 minutes.',
	statusCode: 429,
};

const strict_rate_limit_options = {
	windowMs: 10 * 60 * 1000,
	limit: 2,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	message: 'Too many requests to this endpoint, please try again later.',
	statusCode: 429,
};

export { rate_limit_options, login_rate_limit_options, strict_rate_limit_options };