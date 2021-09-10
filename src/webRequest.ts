export async function request({
	url,
	useProxy,
	authToken,
	method = 'GET',
	payload
}: {
	url: string;
	authToken?: string;
	method?: 'GET' | 'POST';
	payload?: string;
	useProxy: boolean;
}): Promise<Response> {
	let options: RequestInit = {
		method,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	};
	if (authToken) {
		options.headers['Authorization'] = `Bearer ${authToken}`;
	}
	if (payload) {
		options.body = payload;
	}

	let response: Response;
	if (useProxy) {
		// fetch through proxy to prevent cors issues, when in browser
		response = await fetch(`/proxy.json?url=${encodeURIComponent(url)}`, options);
	} else {
		// on server we can fetch directly
		response = await fetch(url, options);
	}
	return response;
}
