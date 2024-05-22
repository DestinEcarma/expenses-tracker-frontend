const OK = 200;
const CREATED = 201;

const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const CONFLICT = 409;

const INTERNAL_SERVER_ERROR = 500;

export type StatusCode = number;

export const StatusCodes = {
	OK,
	CREATED,
	CONFLICT,
	BAD_REQUEST,
	UNAUTHORIZED,
	INTERNAL_SERVER_ERROR,
};
