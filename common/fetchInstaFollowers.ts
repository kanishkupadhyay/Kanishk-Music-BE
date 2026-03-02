import fetch from "node-fetch";

export const fetchInstaFollowers = async (username: string): Promise<string | null> => {
  try {
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });


    const html = await res.text();

    // Instagram HTML me followers JSON hota hai
    // const match = html.match(/"edge_followed_by":{"count":(\d+)}/);
    // if (!match || !match[1]) {
    //   console.warn("Followers not found, HTML structure may have changed");
    //   return null;
    // }

    // const followersCount = parseInt(match[1], 10);
    // console.log(`${username} has ${followersCount} followers`);
    return html.toString();

  } catch (err) {
    console.error(`Error fetching followers from HTML for ${username}:`, err);
    return null;
  }
};
