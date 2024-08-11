const FetchRequest = async (url: string, method: string, params?: Object, headers?: HeadersInit) => {
    switch (method) {
        case 'GET':
            return GetRequest(url, method, params, headers);
        case 'POST':
            return PostRequest(url, method, params, headers);
        default:
            break;
    }
}

const GetRequest = async (queryUrl: string, method: string, params?: Record<string, any>, headers?: HeadersInit) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${queryUrl}?${queryString}` : queryUrl;
    return fetch(url, {
        method,
        headers: {
            'Accept': 'application/json',
            ...headers
        }
    }).then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            throw new Error('请求失败');
        }
    }).then((data) => data).catch(error => {
        console.log(error);
    });
}

const PostRequest = async (url: string, method: string, params?: Record<string, any>, headers?: HeadersInit) => {
    return fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
            ...headers
        },
        body: JSON.stringify(params)
    }).then(res => {
        if (res.status === 200) {
            return res.json();
        }
    }).then((data) => data).catch(error => {
        console.log(error);
    });
}

export default FetchRequest;