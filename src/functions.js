const fetch_post_json = async (link, data) => {
    const resp = await fetch(link, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return resp.json();
}

const fetch_get = async (link) => {
    return await fetch(link, {
        credentials: 'include',
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
}

export { fetch_post_json, fetch_get };