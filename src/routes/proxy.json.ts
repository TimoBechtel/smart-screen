import type { Request } from '@sveltejs/kit';

/**
 * this proxy is used to circumvent cors issues
 */
export async function get({ headers, query }: Request) {
	const url = query.get('url');
	if (!url) {
		return {
			status: 400
		};
	}
	let options = {};
	if (headers.authorization) {
		options = {
			method: 'GET',
			headers: headers
		};
	}

	let data;
	try {
		const res = await fetch(url, options);
		data = await res.json();
	} catch (e) {
		console.log(e);
	}

	if (data) {
		return {
			body: {
				data
			},
			status: 200
		};
	}
	return {
		status: 502
	};
}
