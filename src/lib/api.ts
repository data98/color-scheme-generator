export type ColorSchemeMode = 
  | 'monochrome' 
  | 'monochrome-dark' 
  | 'monochrome-light' 
  | 'analogic' 
  | 'complement' 
  | 'analogic-complement' 
  | 'triad' 
  | 'quad';

export interface ColorResponse {
  hex: { value: string; clean: string };
  rgb: { value: string; r: number; g: number; b: number };
  hsl: { value: string; h: number; s: number; l: number };
  name: { value: string };
  contrast: { value: string };
}

export interface SchemeResponse {
  mode: string;
  count: number;
  colors: ColorResponse[];
  seed: ColorResponse;
}

const BASE_URL = 'https://www.thecolorapi.com';

export async function fetchColorScheme(
  hex: string, 
  mode: ColorSchemeMode = 'monochrome', 
  count: number = 5
): Promise<SchemeResponse> {
  const cleanHex = hex.replace('#', '');
  const response = await fetch(`${BASE_URL}/scheme?hex=${cleanHex}&mode=${mode}&count=${count}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch color scheme');
  }
  
  return response.json();
}

export function getRandomHex(): string {
  return Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}
