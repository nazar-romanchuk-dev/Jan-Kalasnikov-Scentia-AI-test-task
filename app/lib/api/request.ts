interface RequestOptions {
  method: string;
  headers: {
    'Content-Type': string;
    Authorization: string;
  };
  body?: string;
}

export async function request(
  endpoint = '',
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | string = 'GET',
  body: any = null,
  token = ''
) {
  const url = `${process.env.NEXT_PUBLIC_SCENTIA_API}/${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const options: RequestOptions = {
    method,
    headers,
  };

  if (body && method !== 'GET' && method !== 'HEAD') {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const responseText = await response.text();

    try {
      return JSON.parse(responseText);
    } catch (e) {
      return responseText;
    }
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
