import { API_URL } from "./config.js";

const SETTINGS_API_URL = `${API_URL}/settings`;

// GET
export async function getStarted() {
  try {
    const response = await fetch(`${SETTINGS_API_URL}/started`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération du démarrage de la course: ${response.status}`);
    }
    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la récupération du démarrage de la course: ${error}`);
    return [];
  }
}
