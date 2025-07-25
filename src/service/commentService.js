import { API_URL } from "./config.js";

const COMMENTS_API_URL = `${API_URL}/comments`;

// POST
export async function sendComment(name, comment) {
  try {
    const response = await fetch(`${COMMENTS_API_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        comment: comment,
      }),
    });
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des categories: ${response.status}`);
    }
    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la récupération des categories: ${error}`);
    return [];
  }
}
