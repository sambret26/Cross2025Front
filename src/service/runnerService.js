import { API_URL } from "./config.js";

const RUNNERS_API_URL = `${API_URL}/runners`;

// GET
export async function getRunners() {
  try {
    const response = await fetch(`${RUNNERS_API_URL}/`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération du nombre d'equipes: ${response.status}`);
    }
    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la récupération du nombre d'equipes: ${error}`);
    return [];
  }
}
