import { API_URL } from "./config.js";

const CATEGORIES_API_URL = `${API_URL}/categories`;

// GET
export async function getCategories() {
    try {
        const response = await fetch(`${CATEGORIES_API_URL}/`);
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des categories: ${response.status}`);
        }
        return await response.json() 
    } catch (error) {
        console.error(`Erreur lors de la récupération des categories: ${error}`);
        return [];
    }
}

export async function getRewards() {
    try {
        const response = await fetch(`${CATEGORIES_API_URL}/rewards`);
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des récompensés: ${response.status}`);
        }
        return await response.json()
    } catch (error) {
        console.error(`Erreur lors de la récupération des récompensés: ${error}`);
        return [];
    }
}
